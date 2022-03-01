#include "truck-gateway.h"
#include "settings.h"

bool signupOk = false;

void firebaseInit() {
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("ok");
    signupOk = true;
  }
  else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void postIssueToFirebase(Issue issue) {
  FirebaseJson json;
  json.add("cargo-id", issue.cargoID);
  String timeStr = String(issue.timeinfo.tm_year + 1900) + "/" + String(issue.timeinfo.tm_mon + 1) + "/" + issue.timeinfo.tm_mday + " " 
    + issue.timeinfo.tm_hour + ":" + issue.timeinfo.tm_min + ":" + issue.timeinfo.tm_sec;
  json.add("time", timeStr);
  json.add("sensor", issue.sensor);
  json.add("data", issue.data);
  Serial.printf("Set json... %s/n", Firebase.RTDB.setJSON(&fbdo, "/issues", &json) ? "ok" : fbdo.errorReason().c_str());
}