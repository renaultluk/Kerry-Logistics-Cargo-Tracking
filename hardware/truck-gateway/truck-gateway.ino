#include "truck-gateway.h"

State initFunc() {

}

float prevTime = micros();
State deliveryFunc() {
  Serial.println("Entering Delivery State!");
  while (true) {
    float dt = (micros() - prevTime)/1.0e6;
    if (dt > 1.0/CONTROL_FREQ) {
      if (tempOutOfBounds()) {

      }
      if (humidityOutOfBounds()) {

      }
    }
  }
}

void setup() {
  Serial.begin(115200);
  BMEInit();
  WiFiInit();
  timeInit();
}

void loop() {
  State mainState = STATE_INIT;
  while (true) {
    switch (mainState) {
      case STATE_INIT:
        mainState = initFunc();
        break;
      case STATE_DELIVERY:
        mainState = deliveryFunc();
        break;
      default:
        Serial.println("Unknown state!");
    }
  }
}