#ifndef CARTON_H
#define CARTON_H


// ******* Includes *******//

#include <MPU6050.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include "time.h"

// ******* Constants ******* //

#define CONTROL_FREQ     20
#define LIGHT_THRESHOLD   0 // Change this after testing

// ******* Pins *******//

#define SCK_PIN       0 // Change this after circuit design
#define IMU_SDA       0 // Change this after circuit design
#define LDR_PIN       0 // Change this after circuit design
#define SHOCK_PIN     0 // Change this after circuit design
#define LED_PIN       0 // Change this after circuit design

#define DWM_MISO      0 // Change this after circuit design
#define DWM_MOSI      0 // Change this after circuit design
#define DWM_CS        0 // Change this after circuit design

#define NRF_MISO      0 // Change this after circuit design
#define NRF_MOSI      0 // Change this after circuit design
#define NRF_CS        0 // Change this after circuit design

#define NFC_SS        0 // Change this after circuit design
#define NFC_RST       0 // Change this after circuit design

// ******* Component Objects ******* //

MPU6050 mpu;

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ******* Finite State Machine (FSM) ******* //

typedef enum {
  STATE_INIT,
  STATE_DELIVERY,
} State;

// ******* Structs ******* //

struct Issue {
  String cargoID;
  struct tm timeinfo;
  String sensor;
  float data;
};

// ******* Sensors *******//

// Shock sensor
bool shocked();

// Photoresistor
bool opened();

// IMU
void IMUInit();
bool tippedOver();

// ******* Firebase ******* //

void firebaseInit();
void postIssueToFirebase(Issue issue);

// ******* Utils ******* //

void WiFiInit();
void timeInit();

#endif