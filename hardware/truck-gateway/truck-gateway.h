#ifndef TRUCK_GATEWAY_H
#define TRUCH_GATEWAY_H


// ******* Includes ******* //

#include <SoftwareSerial.h>
#include <TinyGPS.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

// ******* Constants ******* //

#define CONTROL_FREQ    20

// ******* Pins ******* //

#define SCK_PIN    0  // Change after circuit design
#define BME_SDA    0  // Change after circuit design
#define GPS_RX     0  // Change after circuit design
#define GPS_TX     0  // Change after circuit design

#define NRF_MISO   0  // Change after circuit design
#define NRF_MOSI   0  // Chgange after circuit design
#define NRF_CS     0  // Change after circuit design

// ******* Component Objects ******* //

SoftwareSerial gpsSerial(GPS_RX,GPS_TX);
TinyGPS gps;

Adafruit_BME280 bme;

// ******* Finite State Machine ******* //

typedef enum {
  STATE_INIT,
  STATE_DELIVERY
} State;

// ******* Sensors ******* //

void BMEInit();
bool tempOutOfBounds();
bool humidityOutOfBounds();

#endif