const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const dashboardFCMToken = "fcmToken";

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.handleAlerts = functions.database.ref('batches/{batchID}/cargo/{cargoID}').onWrite(async (change, context) => {
    if (!change.before.exists()) {
        return null;
    }

    if (!change.after.exists()) {
        return null;
    }

    const newEntry = change.after.val();
    const batchID = context.params.batchID;
    const cargoID = context.params.cargoID;

    admin.database().ref(`batches/${batchID}`).once('value', (snapshot) => {
        const batchObj = snapshot.val();

        if (batchObj.requiresTemp) {
            const temperature = newEntry.BME280.Temperature;
            temperature = temperature.slice(-3);

            if ((temperature < batchObj.tempLowerBound) || (temperature > batchObj.tempUpperBound)) {
                var driverFCMToken = "";
                var driverID = "";
                const date = Date();
                var alertObj = {
                    time: date,
                    cargoID: cargoID,
                    batchID: batchID,
                    truckID: batchObj.truckID,
                    type: "temperature",
                    resolved: false,
                };
                const truckID = batchObj.truckID;
                admin.database().ref(`trucks/${truckID}`).once('value', (snapshot) => {
                    const truckObj = snapshot.val();
                    driverID = truckObj.driverID;
                }).then(() => {
                    admin.database().ref(`drivers/${driverID}`).once('value', (snapshot) => {
                        const driverObj = snapshot.val();
                        driverFCMToken = driverObj.FCMtoken;
                    })
                }).then(() => {
                    payload = {
                        notification: {
                            title: "Temperature Alert",
                            body: `The temperature is ${temperature}°C`,
                        },
                        data: alertObj
                    }
                }).then(() => {
                    admin.messaging().sendToDevice(dashboardFCMToken, payload);
                }).then(() => {
                    admin.messaging().sendToDevice(driverFCMToken, payload);
                }).then(() => {
                    return admin.database().ref('alerts').push(alertObj);
                }).catch((error) => {
                    console.log(error);
                });
            }
        }

        if (batchObj.requiresHumidity) {
            const humidity = newEntry.BME280.Humidity;
            humidity = humidity.slice(-2);

            if ((humidity < batchObj.humidityLowerBound) || (humidity > batchObj.humidityUpperBound)) {
                var driverFCMToken = "";
                var driverID = "";
                const truckID = batchObj.truckID;
                admin.database().ref(`trucks/${truckID}`).once('value', (snapshot) => {
                    const truckObj = snapshot.val();
                    driverID = truckObj.driverID;
                }).then(() => {
                    admin.database().ref(`drivers/${driverID}`).once('value', (snapshot) => {
                        const driverObj = snapshot.val();
                        driverFCMToken = driverObj.FCMtoken;
                    })
                }).then(() => {
                    payload = {
                        notification: {
                            title: "Humidity Alert",
                            body: `The humidity is ${temperature}°C`,
                        },
                    }
                }).then(() => {
                    admin.messaging().sendToDevice(dashboardFCMToken, payload);
                }).then(() => {
                    admin.messaging().sendToDevice(driverFCMToken, payload);
                }).then(() => {
                    return null;
                }).catch((error) => {
                    console.log(error);
                });
            }
        }

        if ((batchObj.isFragile) && newEntry.KY002.Box_shocked) {
            payload = {
                notification: {
                    title: "Fragile Cargo Alert",
                    body: `The cargo is fragile`,
                    // icon: "https://firebasestorage.googleapis.com/v0/b/cargo-tracker-f9f9f.appspot.com/o/logo.png?alt=media&token=f9f9f9f9-f9f9-f9f9-f9f9-f9f9f9f9f9f"
                },
            }
            admin.messaging().sendToDevice(dashboardFCMToken, payload);
        }

        if (batchObj.isUpright) {
            const orientation = newEntry.MPU6050.Rotation;
            //TODO: orientation extraction
        }

        const opened = newEntry.Photoresistor.Box_opened;
    });
});

exports.checkDelivered = functions.https.onRequest((req, res) => {
    const truckID = req.query.truckID;
    const batchID = req.query.batchID;
    var currLocation = {
        lat: 0.0,
        lon, 0.0
    };
    admin.database().ref(`trucks/${truckID}`).once('value', (snapshot) => {
        const truckObj = snapshot.val();
        const locationStr = truckObj.location;
        const locationArr = locationStr.split(',');
        currLocation.lat = parseFloat(locationArr[0]);
        currLocation.lon = parseFloat(locationArr[1]);
    }).then(
    admin.database().ref(`batches/${batchID}`).once('value', (snapshot) => {
        const batchObj = snapshot.val();
        const address = batchObj.address;
    }))
});

exports.runSignOff = functions.https.onRequest((req, res) => {
    const batchID = req.query.batchID;
});

exports.exportReport = functions.https.onRequest((req, res) => {
    const xl = require('excel4node');

    const wb = new xl.Workbook();

    const generalSheet = wb.addWorksheet('General');
    const alertsSheet = wb.addWorksheet('Alerts');
    const batchSheet = wb.addWorksheet('Batch Details');

    var trucks = [];
    var batches = [];
    var alerts = [];
    var numDriverResolvable = 0;
    var numNonResolvable = 0;
    var numAlertsResolved = 0;

    const truckRef = admin.database().ref('trucks');
    const batchRef = admin.database().ref('batches');
    const alertRef = admin.database().ref('alerts/resolved');
    truckRef.once('value', (snapshot) => {
        const values = snapshot.val();
        trucks = Object.values(values);
    }).then(
    batchRef.once('value', (snapshot) => {
        const values = snapshot.val();
        batches = Object.values(values);
    })).then(
    alertRef.once('value', (snapshot) => {
        const values = snapshot.val();
        alerts = Object.values(values);
    })).catch(
        (error) => {
            console.log(error);
        }
    )

    generalSheet.cell(1, 1).string('Daily Summary Report');
    generalSheet.cell(2, 1).string('Date: ');
    generalSheet.cell(3, 1).string('Number of trucks: ');
    generalSheet.cell(4, 1).string('Number of batches: ');
    generalSheet.cell(5, 1).string('Number of driver-resolvable alerts: ');
    generalSheet.cell(6, 1).string('Number of non-resolvable alerts: ');
    generalSheet.cell(7, 1).string('Total number of alerts: ');
    generalSheet.cell(8, 1).string('Number of alerts resolved: ');

    const date = Date();
    generalSheet.cell(2, 2).string(date);
    generalSheet.cell(3, 2).string(trucks.length);  
    generalSheet.cell(4, 2).string(batches.length);

    alertsSheet.cell(1, 1, 1, 4, true).string('Alerts summary (Sort by time)');
    alertsSheet.cell(2, 1).string('Date: ');
    alertsSheet.cell(3, 1).string('Alert ID');
    alertsSheet.cell(3, 2).string('Time');
    alertsSheet.cell(3, 3).string('Carton ID');
    alertsSheet.cell(3, 4).string('Batch ID');
    alertsSheet.cell(3, 5).string('Truck ID');
    alertsSheet.cell(3, 6).string('Type of alert');
    alertsSheet.cell(3, 7).string('Is it resolved?');
    alertsSheet.cell(3, 8).string('Resolved by');
    alertsSheet.cell(3, 9).string('Resolved time');
    alertsSheet.cell(3, 10).string('Environment Requirements');
    alertsSheet.cell(3, 11).string('Alerts Details');

    alerts.forEach((alert, index) => {
        const row = index + 4;
        alertsSheet.cell(row, 1).string(alert.id);
        alertsSheet.cell(row, 2).string(alert.time);
        alertsSheet.cell(row, 3).string(alert.cartonID);
        alertsSheet.cell(row, 4).string(alert.batchID);
        alertsSheet.cell(row, 5).string(alert.truckID);
        alertsSheet.cell(row, 6).string(alert.type);
        alertsSheet.cell(row, 7).string(alert.resolved);
        alertsSheet.cell(row, 8).string(alert.resolvedBy);
        alertsSheet.cell(row, 9).string(alert.resolvedTime);
        alertsSheet.cell(row, 10).string(alert.environmentRequirements);
        alertsSheet.cell(row, 11).string(alert.details);
    });

    batchSheet.cell(1, 1).string('Batch Details');
    batchSheet.cell(2, 1).string('Date: ');
    batchSheet.cell(3, 1).string('Batch ID');
    batchSheet.cell(3, 2).string('Time leaving the warehouse');
    batchSheet.cell(3, 3).string('Truck ID');
    batchSheet.cell(3, 4).string('Cartons');
    batchSheet.cell(3, 5).string('Arrival Time');
    batchSheet.cell(3, 6).string('Shipping Time');
    batchSheet.cell(3, 7).string('Delivered by');
    batchSheet.cell(3, 8).string('Environment Requirements');
    batchSheet.cell(3, 9).string('Any Alerts?');
});