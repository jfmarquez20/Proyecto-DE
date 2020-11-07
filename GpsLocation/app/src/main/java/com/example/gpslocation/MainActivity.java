package com.example.gpslocation;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;


import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ActivityInfo;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
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
import java.io.InputStream;
import java.lang.reflect.Method;
import java.io.OutputStream;
import java.util.Set;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {

    //Instanciacion
    EditText etPort, etIp;
    Button btnEnviar;
    Button btnDetener;
    Button btnPair;
    TextView tvLocation;
    TextView textX, textY, textZ, status, msg_box;
    SensorManager sensorManager;
    Sensor gyroscopeSensor;
    RadioButton rbtnTcp, rbtnUdp;
    String data =" ";
    boolean go = true;
    private Handler mHandler = new Handler();

    private BluetoothAdapter BluetoothAdap = null;
    private Set Devices;

    // based on android.bluetooth.BluetoothAdapter
    private BluetoothAdapter mAdapter;
    private BluetoothDevice remoteDevice;
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothDevice mBluetoothDevice;
    private BluetoothSocket mBluetoothSocket;
    private UUID uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    int bytess;

    static final int STATE_LISTENING = 1;
    static final int STATE_CONNECTING=2;
    static final int STATE_CONNECTED=3;
    static final int STATE_CONNECTION_FAILED=4;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //Carga del layout al activity (front)
        setContentView(R.layout.activity_main);

        //Asignación de las variables
        etIp = findViewById(R.id.editTextTextPersonName);

        btnEnviar = findViewById(R.id.button2);
        tvLocation = findViewById(R.id.tvUbicacion);
        btnDetener = findViewById(R.id.btndetener);
        status=findViewById(R.id.status);
        btnPair=findViewById(R.id.connect);

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
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        gyroscopeSensor = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
        textX = findViewById(R.id.textX);
        textY = findViewById(R.id.textY);
        textZ = findViewById(R.id.textZ);

        //Enviar mensaje
        btnEnviar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                go = true;
                send.run();
            }

        });
        btnDetener.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                go = false;
                mHandler.removeCallbacks(send);
            }

        });
        btnPair.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                connect.start();
                status.setText("Conectando");
            }
        });

        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        try{
            if(mBluetoothAdapter == null){
                Log.d("bluetooth:", "device does not support bluetooth");
            }
            if(!mBluetoothAdapter.isEnabled()){
                Intent enableBt = new Intent(
                        BluetoothAdapter.ACTION_REQUEST_ENABLE);
                enableBt.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(enableBt);
            }
        }catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void onResume() {
        super.onResume();
        sensorManager.registerListener(gyroListener, gyroscopeSensor, SensorManager.SENSOR_DELAY_NORMAL);
    }

    public void onStop() {
        super.onStop();
        sensorManager.unregisterListener(gyroListener);
    }


    public SensorEventListener gyroListener = new SensorEventListener() {
        public void onAccuracyChanged(Sensor sensor, int acc) {
        }

        public void onSensorChanged(SensorEvent event) {
            float x = event.values[0];
            float y = event.values[1];
            float z = event.values[2];

            textX.setText("X : " + (int) x + " rad/s");
            textY.setText("Y : " + (int) y + " rad/s");
            textZ.setText("Z : " + (int) z + " rad/s");

        }
    };

    private class MyLocationListener implements LocationListener {
        @RequiresApi(api = Build.VERSION_CODES.O)
        @SuppressLint("SetTextI18n")
        @Override
        public void onLocationChanged(Location location) {
            if (location != null) {
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
                String rads = (textX.getText().toString()+"/"+textY.getText().toString()+"/"+textZ.getText().toString());
                if (minutes <= 9 && sec <= 9) {
                    tvLocation.setText(location.getLatitude() + "," + location.getLongitude() + "," + year + "-" + month + "-" + day + " " + hours + ":0" + minutes + ":0" + sec + "," + etIp.getText().toString()+","+data);
                } else if (minutes <= 9) {
                    tvLocation.setText(location.getLatitude() + "," + location.getLongitude() + "," + year + "-" + month + "-" + day + " " + hours + ":0" + minutes + ":" + sec + "," + etIp.getText().toString()+","+data);
                } else if (sec <= 9) {
                    tvLocation.setText(location.getLatitude() + "," + location.getLongitude() + "," + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":0" + sec + "," + etIp.getText().toString()+","+data);
                } else {
                    tvLocation.setText(location.getLatitude() + "," + location.getLongitude() + "," + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + sec + "," + etIp.getText().toString()+","+data);
                }
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

    final Thread getData = new Thread() {
        @Override
        public void run() {
            while (go) {
                try {
                    InputStream socketInputStream = mBluetoothSocket.getInputStream();
                    byte[] buffer = new byte[1024];

                    bytess = socketInputStream.read(buffer);
                    data = new String(buffer, 0, bytess);

                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                try {
                    //set time in mili
                    Thread.sleep(2000);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    };

    final Thread connect = new Thread() {
        @Override
        public void run() {
            mBluetoothDevice = mBluetoothAdapter.getRemoteDevice("B8:27:EB:17:F4:98");
            try {
                mBluetoothSocket = mBluetoothDevice.createRfcommSocketToServiceRecord(uuid);
                mBluetoothSocket.connect();

                Message message=Message.obtain();
                message.what=STATE_CONNECTED;
                handler.sendMessage(message);
                getData.start();

            } catch (IOException e) {
                e.printStackTrace();
                Message message=Message.obtain();
                message.what=STATE_CONNECTION_FAILED;
                handler.sendMessage(message);
            }
        }
    };

    Handler handler=new Handler(new Handler.Callback() {
        @Override
        public boolean handleMessage(Message msg) {
            switch (msg.what){
                case STATE_CONNECTING:
                    status.setText("Connecting");
                    break;
                case STATE_CONNECTED:
                    status.setText("Connected");
                    break;
                case STATE_CONNECTION_FAILED:
                    status.setText("Connection Failed");
                    break;
            }
            return true;
        }
    });

}

