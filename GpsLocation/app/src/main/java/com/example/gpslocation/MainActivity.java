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

public class MainActivity extends AppCompatActivity{

    //Instanciacion
    EditText etPort, etIp;
    Button btnEnviar;
    TextView tvLocation;
    RadioButton rbtnTcp, rbtnUdp;

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
        rbtnTcp = findViewById(R.id.radioButton4);
        rbtnUdp = findViewById(R.id.radioButton5);

        //Permisos para enviar SMS y utilizar GPS
        while(ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            if(ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_DENIED){
                PendingIntent pendingIntent = PendingIntent.getActivity(MainActivity.this,1000,getIntent(),PendingIntent.FLAG_CANCEL_CURRENT);
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

                String message = tvLocation.getText().toString();
                /*if(rbtnTcp.isChecked()){
                    DoBackgroundTask b1 = new DoBackgroundTask();
                    b1.execute(message);
                } else {
                    DoBackgroundTask2 b1 = new DoBackgroundTask2();
                    b1.execute(message);
                }*/
                DoBackgroundTask2 b2 = new DoBackgroundTask2();
                b2.execute(message);
                DoBackgroundTask b1 = new DoBackgroundTask();
                b1.execute(message);
                Toast.makeText(getApplicationContext(),"Mensaje enviado con éxito!",Toast.LENGTH_LONG).show();
            }
        });

    }

    private class MyLocationListener implements LocationListener {
        @RequiresApi(api = Build.VERSION_CODES.O)
        @SuppressLint("SetTextI18n")
        @Override
        public void onLocationChanged(Location location) {
            LocalDateTime locaDate = LocalDateTime.now();
            int hours  = locaDate.getHour();
            int minutes = locaDate.getMinute();
            int month = locaDate.getMonthValue();
            int year = locaDate.getYear();
            int day = locaDate.getDayOfMonth();
            int sec = locaDate.getSecond();
            if(minutes <= 9 && sec <= 9){
                tvLocation.setText("Latitud: " + location.getLatitude() + " / Longitud: " + location.getLongitude() + "\n" + "Fecha: " + day  + "/"+ month + "/" + year + " " + hours + ":0" + minutes + ":0" + sec );
            } else if (minutes <= 9){
                tvLocation.setText("Latitud: " + location.getLatitude() + " / Longitud: " + location.getLongitude() + "\n" + "Fecha: " + day  + "/"+ month + "/" + year + " " + hours + ":0" + minutes + ":" + sec );
                } else if (sec <= 9) {
                    tvLocation.setText("Latitud: " + location.getLatitude() + " / Longitud: " + location.getLongitude() + "\n" + "Fecha: " + day  + "/"+ month + "/" + year + " " + hours + ":" + minutes + ":0" + sec );
                    } else {
                        tvLocation.setText("Latitud: " + location.getLatitude() + " / Longitud: " + location.getLongitude() + "\n" + "Fecha: " + day  + "/"+ month + "/" + year + " " + hours + ":" + minutes + ":" + sec );
            }
        }

    }


    class DoBackgroundTask extends AsyncTask<String, Void, Void>{
        Socket s;
        PrintWriter writer;

        @Override
        protected Void doInBackground(String... voids) {
            //Tcp
            String message = voids[0];
            try {
                //int port = Integer.parseInt(etPort.getText().toString());
                String ip = etIp.getText().toString();
                s = new Socket(ip,15002);
                writer = new PrintWriter(s.getOutputStream());
                writer.write(message);
                writer.flush();
                writer.close();
                s.close();
            } catch (UnknownHostException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }

    }


    class DoBackgroundTask2 extends AsyncTask<String, Void, Void>{
        Socket s;
        PrintWriter writer;

        @Override
        protected Void doInBackground(String... voids) {
            //Aquí UDP
            try {
                //int port = Integer.parseInt(etPort.getText().toString());
                String ip = etIp.getText().toString();
                String messageStr = voids[0];
                InetAddress local = InetAddress.getByName(ip);
                int msg_length = messageStr.length();
                byte[] messageu = messageStr.getBytes();


                DatagramSocket su = new DatagramSocket();
                //

                DatagramPacket p = new DatagramPacket(messageu, msg_length, local, 50000);
                su.send(p);//properly able to send data. i receive data to server
            } catch (SocketException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }

    }

    public class CallAPI extends AsyncTask<String, String, String> {

        public CallAPI(){
            //set context variables if required
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected String doInBackground(String... params) {
            String urlString = params[0]; // URL to call
            String data = params[1]; //data to post
            OutputStream out = null;

            try {
                URL url = new URL(urlString);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                out = new BufferedOutputStream(urlConnection.getOutputStream());

                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"));
                writer.write(data);
                writer.flush();
                writer.close();
                out.close();

                urlConnection.connect();
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
            return null;
        }
    }




}

