#ifndef SETTINGS_H
#define SETTINGS_H

// ******* Cargo Settings ******* //

bool requiresTemp = false;
bool requiresHumdity = false;
float tempRequirement[2] = {0.0, 0.0};
float humidityRequirement[2] = {0.0, 0.0};

// ******* Credentials ******* //

const char* SSID = "";
const char* PASSWORD = "";

#endif