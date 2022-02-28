#ifndef SETTINGS_H
#define SETTINGS_H

// ******* Cargo Settings ******* //

bool requiresTemp = false;
bool requiresHumdity = false;
float tempRequirement[2] = {0.0, 0.0};
float humidityRequirement[2] = {0.0, 0.0};

// ******* Credentials ******* //

#define WIFI_SSID ""
#define WIFI_PASSWORD ""

#define API_KEY ""
#define DATABASE_URL ""

#define ntpServer "time.google.com"
#define gmtOffset_sec  8
#define daylightOffset_sec 3600

#endif