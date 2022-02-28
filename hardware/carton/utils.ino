#include "carton.h"
#include "settings.h"

void WiFiInit() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
}

void timeInit() {
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}