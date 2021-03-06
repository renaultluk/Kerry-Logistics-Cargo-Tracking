#include "carton.h"
#include "settings.h"

State initFunc() {

}

float prevTime = micros();
State deliveryFunc() {
  Serial.println("Entered Delivery State!");

  while (true) {
    float dt = (micros() - prevTime)/1.0e6;
    if (dt > 1.0/CONTROL_FREQ) {
      if (shocked()) {

      }
      if (opened()) {

      }
    }

    prevTime = micros();
  }
}

void setup() {
  Serial.begin(115200);
  IMUInit();
  WiFiInit();
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