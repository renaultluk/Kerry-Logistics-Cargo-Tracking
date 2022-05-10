const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.handleAlerts = functions.database.ref('cargo/{cargoID}').onWrite(async (change, context) => {
    if (!change.before.exists()) {
        return null;
    }

    if (!change.after.exists()) {
        return null;
    }

    const newEntry = change.after.val();
    const cargoID = context.params.cargoID;
    const batchID = context.params.batchID;

    admin.database().ref(`batches/pending/${batchID}`).once('value').then((snapshot) => {
        const batchObj = snapshot.val();

        if (batchObj.requiresTemp) {
            const temperature = newEntry.BME280.Temperature;
            temperature = temperature.slice(-3);

            if ((temperature < batchObj.tempLowerBound) || (temperature > batchObj.tempUpperBound)) {
                //TODO: send message to app and dashboard
            }
        }

        if (batchObj.requiresHumidity) {
            const humidity = newEntry.BME280.Humidity;
            humidity = humidity.slice(-2);

            if ((humidity < batchObj.humidityLowerBound) || (humidity < batchObj.humidityUpperBound)) {
                //TODO: send message to app and dashboard
            }
        }

        if ((batchObj.isFragile) && newEntry.KY002.Box_shocked) {
            //TODO: send message to dashboard
        }

        if (batchObj.isUpright) {
            const orientation = newEntry.MPU6050.Rotation;
            //TODO: orientation extraction
        }

        const opened = newEntry.Photoresistor.Box_opened;
    });
});

exports.exportReport = functions.https.onRequest((req, res) => {
    const xl = require('excel4node');
    const rootRef = admin.database.ref();

    const wb = new xl.Workbook();

    const generalSheet = wb.addWorksheet('General');
    const alertsSheet = wb.addWorksheet('Alerts');
    const cartonSheet = wb.addWorksheet('Carton Details');

    generalSheet.cell(1, 1).string('Daily Summary Report');
    generalSheet.cell(2, 1).string('Date: ');
    generalSheet.cell(3, 1).string('Number of trucks: ');
    generalSheet.cell(4, 1).string();
});