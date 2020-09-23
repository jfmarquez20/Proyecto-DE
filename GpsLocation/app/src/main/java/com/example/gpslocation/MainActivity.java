package com.example.gpslocation;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Handler;
import android.text.TextUtils;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.PopupMenu;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.Socket;
import java.net.SocketException;
import java.net.URL;
import java.net.UnknownHostException;
import java.time.LocalDateTime;

public class MainActivity extends AppCompatActivity {

    //Instanciacion
    EditText etPort, etIp;
    Button btnEnviar;
    Button btnDetener;
    TextView tvLocation;
    RadioButton rbtnTcp, rbtnUdp;
    private Handler mHandler = new Handler();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //Carga del layout al activity (front)
        setContentView(R.layout.activity_main);

        //Asignación de las variables
        etIp = findViewById(R.id.editTextTextPersonName);
        etPort = findViewById(R.id.editTextTextPersonName2);
        btnEnviar = findViewById(R.id.button2);
        tvLocation = findViewById(R.id.tvUbicacion);
        btnDetener = findViewById(R.id.btndetener);
        //Permisos para enviar SMS y utilizar GPS
        while (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_DENIED) {
                PendingIntent pendingIntent = PendingIntent.getActivity(MainActivity.this, 1000, getIntent(), PendingIntent.FLAG_CANCEL_CURRENT);
                AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
                alarmManager.set(AlarmManager.RTC, System.currentTimeMillis() + 1000, pendingIntent);
                System.exit(0);
            }
        }

        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        LocationListener locationListener = new MyLocationListener();
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);

        //Enviar mensaje
        btnEnviar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                send.run();
            }

        });
        btnDetener.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mHandler.removeCallbacks(send);
            }

        });
    }

    private class MyLocationListener implements LocationListener {
        @RequiresApi(api = Build.VERSION_CODES.O)
        @SuppressLint("SetTextI18n")
        @Override
        public void onLocationChanged(Location location) {
            LocalDateTime locaDate = LocalDateTime.now();
            String day;
            String month;
            int hours = locaDate.getHour();
            int minutes = locaDate.getMinute();
            int month1 = locaDate.getMonthValue();
            if (month1 <=9){
                 month= '0' + String.valueOf(month1);
            }else{ month= String.valueOf(month1);}
            int year = locaDate.getYear();
            int day1 = locaDate.getDayOfMonth();
            if (day1 <=9){
                day= '0' + String.valueOf(day1);
            }else{ day = String.valueOf(day1);}
            int sec = locaDate.getSecond();
            if (minutes <= 9 && sec <= 9) {
                tvLocation.setText(location.getLatitude() + "," + location.getLongitude() + "," + year + "-" + month + "-" + day + " " + hours + ":0" + minutes + ":0" + sec);
            } else if (minutes <= 9) {
                tvLocation.setText(location.getLatitude() + "," + location.getLongitude() + "," + year + "-" + month + "-" + day + " " + hours + ":0" + minutes + ":" + sec);
            } else if (sec <= 9) {
                tvLocation.setText(location.getLatitude() + "," + location.getLongitude() + "," + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":0" + sec);
            } else {
                tvLocation.setText(location.getLatitude() + "," + location.getLongitude() + "," + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + sec);
            }
        }

    }

    private Runnable send = new Runnable(){
        @Override
        public void run() {
            String message = tvLocation.getText().toString();
            DoBackgroundTask2 b1 = new DoBackgroundTask2();
            b1.execute(message);
            Toast.makeText(getApplicationContext(), "Mensaje enviado con éxito!", Toast.LENGTH_LONG).show();
            mHandler.postDelayed(this, 4000); //Se programan constantes ejecuciones del Runnable
        }
    };

    class DoBackgroundTask2 extends AsyncTask<String, Void, Void> {

        @Override
        protected Void doInBackground(String... voids) {
                         //Aquí UDP
            try {
                int port = 50000;
                String messageStr = voids[0];
                InetAddress local1 = InetAddress.getByName("52.1.45.45");
                InetAddress local2 = InetAddress.getByName("3.220.3.16");
                InetAddress local3 = InetAddress.getByName("100.26.67.37");
                InetAddress local4 = InetAddress.getByName("3.83.181.122");
                int msg_length = messageStr.length();
                byte[] messageu = messageStr.getBytes();


                DatagramSocket su = new DatagramSocket();
                //

                DatagramPacket p1 = new DatagramPacket(messageu, msg_length, local1, port);
                su.send(p1);     //Envío de datos se realiza aquí
                DatagramPacket p2 = new DatagramPacket(messageu, msg_length, local2, port);
                su.send(p2);     //Envío de datos se realiza aquí
                DatagramPacket p3 = new DatagramPacket(messageu, msg_length, local3, port);
                su.send(p3);     //Envío de datos se realiza aquí
                DatagramPacket p4 = new DatagramPacket(messageu, msg_length, local4, port);
                su.send(p4);     //Envío de datos se realiza aquí

            } catch (SocketException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

            return null;
        }

    }

}

