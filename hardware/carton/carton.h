#ifndef CARTON_H
#define CARTON_H


// ******* Includes *******//

#include <MPU6050.h>

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

// ******* Finite State Machine (FSM) ******* //

typedef enum {
  STATE_INIT,
  STATE_DELIVERY,
} State;

// ******* Sensors *******//

// Shock sensor
bool shocked();

// Photoresistor
bool opened();

// IMU
void IMUInit();
bool tippedOver();

#endif