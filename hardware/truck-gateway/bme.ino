#include "truck-gateway.h"
#include "settings.h"

void BMEInit() {
  if (!bme.begin(0x76)) {
		Serial.println("Could not find a valid BME280 sensor, check wiring!");
		while (1);
	}
}

bool tempOutOfBounds() {
  float currTemp = bme.readTemperature();
  return (requiresTemp ? (currTemp < tempRequirement[0] || currTemp > tempRequirement[1]) : false);
}

bool humidityOutOfBounds() {
  float currHumidity = bme.readHumidity();
  return (requiresHumidity ? (currHumidity < humidityRequirement[0] || currHumidity > humidityRequirement[1]) : false);
}