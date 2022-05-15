const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const dashboardFCMToken = "cPzL1SgzCNkqiE_6I-E3hN:APA91bF8pBEDkbdxO6PPmXSP8vQQUuhDukjtQUdDNwuYFaHZr81UtiXqC1-fZ0jb-QJXwWP0TPt4fwTTFJ25BkGeqS5yYUD3fkCfWrm4U5c-4ZgvzZBozFN7Utg8bDKAnOWobtcybouf";

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.handleAlerts = functions.database.ref('batches/{batchID}/cargo/{cargoID}/{time}').onWrite(async (change, context) => {
    // if (!change.before.exists()) {
    //     return null;
    // }

    // if (!change.after.exists()) {
    //     return null;
    // }

    const newEntry = change.after.val();
    const batchID = context.params.batchID;
    const cargoID = context.params.cargoID;
    const time = context.params.time;
    var batchObj = {};

    functions.logger.info("fetching: ", batchID);

    await admin.database().ref(`batches/${batchID}`).once('value', (snapshot) => {
        batchObj = snapshot.val();
        functions.logger.info('batchObj', batchObj);
        functions.logger.info('newEntry: ', newEntry);
    });

    functions.logger.info('batchObj: ', batchObj);
    functions.logger.info('batchObj.requiresTemp: ', batchObj.requiresTemp);

    if (batchObj.requiresTemp) {
        var temperature = newEntry.BME280.Temperature;
        temperature = temperature.slice(0, -3);
        temperature = parseFloat(temperature);
        functions.logger.info('temperature: ', temperature, ' batchObj.tempThreshold: ', batchObj.tempLowerBound, ' ', batchObj.tempUpperBound);

        if ((temperature < batchObj.tempLowerBound) || (temperature > batchObj.tempUpperBound)) {
            // var driverFCMToken = "";
            // var driverID = "";
            // const date = Date();
            // var alertObj = {
            //     time: date,
            //     cargoID: cargoID,
            //     batchID: batchID,
            //     truckID: batchObj.truckID,
            //     type: "temperature",
            //     resolved: false,
            // };
            // const truckID = batchObj.truckID;
            // admin.database().ref(`trucks/${truckID}`).once('value', (snapshot) => {
            //     const truckObj = snapshot.val();
            //     driverID = truckObj.driverID;
            // }).then(() => {
            //     admin.database().ref(`drivers/${driverID}`).once('value', (snapshot) => {
            //         const driverObj = snapshot.val();
            //         driverFCMToken = driverObj.FCMtoken;
            //     })
            // }).then(() => {
            //     payload = {
            //         notification: {
            //             title: "Temperature Alert",
            //             body: `The temperature is ${temperature}°C`,
            //         },
            //         data: alertObj
            //     }
            // }).then(() => {
            //     const dashboardFCMRef = admin.database().ref('dashboardFCMToken');
            //     dashboardFCMRef.once('value', (snapshot) => {
            //         dashboardFCMToken = snapshot.val();
            //     }).then(() => {
            //         admin.messaging().sendToDevice(dashboardFCMToken, payload);
            //     })
            // }).then(() => {
            //     admin.messaging().sendToDevice(dashboardFCMToken, payload);
            // }).then(() => {
            //     return admin.database().ref('alerts').push(alertObj);
            // }).catch((error) => {
            //     console.log(error);
            // });
            functions.logger.log("Temperature Alert");
            console.log("Temperature Alert");
            const issueObj = {
                time: time,
                cargoID: cargoID,
                batchID: batchID,
                issue: "temperature",
                resolved: false,
            };
            await admin.database().ref('issues').push(issueObj);
        } else {
            functions.logger.log("Temperature OK");
            console.log("Temperature OK");
            // return "Temperature OK";
        }}
    // const issueObj = {
    //     time: time,
    //     cargoID: cargoID,
    //     batchID: batchID,
    //     issue: "temperature",
    //     resolved: false,
    // };
    // await admin.database().ref('issues/1').set(issueObj);
    // return admin.database().ref('alerts').push(issueObj);

    // if (batchObj.requiresHumidity) {
    //     const humidity = newEntry.BME280.Humidity;
    //     humidity = humidity.slice(-2);

    //     if ((humidity < batchObj.humidityLowerBound) || (humidity > batchObj.humidityUpperBound)) {
    //         var driverFCMToken = "";
    //         var driverID = "";
    //         const truckID = batchObj.truckID;
    //         admin.database().ref(`trucks/${truckID}`).once('value', (snapshot) => {
    //             const truckObj = snapshot.val();
    //             driverID = truckObj.driverID;
    //         }).then(() => {
    //             admin.database().ref(`drivers/${driverID}`).once('value', (snapshot) => {
    //                 const driverObj = snapshot.val();
    //                 driverFCMToken = driverObj.FCMtoken;
    //             })
    //         }).then(() => {
    //             payload = {
    //                 notification: {
    //                     title: "Humidity Alert",
    //                     body: `The humidity is ${temperature}°C`,
    //                 },
    //             }
    //         }).then(() => {
    //             const dashboardFCMRef = admin.database().ref('dashboardFCMToken');
    //             dashboardFCMRef.once('value', (snapshot) => {
    //                 dashboardFCMToken = snapshot.val();
    //             }).then(() => {
    //                 admin.messaging().sendToDevice(dashboardFCMToken, payload);
    //             })
    //         }).then(() => {
    //             admin.messaging().sendToDevice(driverFCMToken, payload);
    //         }).then(() => {
    //             return null;
    //         }).catch((error) => {
    //             console.log(error);
    //         });
    //     }
    // }

    functions.logger.info('batchObj.isFragile: ', batchObj.isFragile);
    functions.logger.info('newEntry.KY002.Box_shocked: ', newEntry.KY002.Box_shocked);
    if ((batchObj.isFragile) && newEntry.KY002.Box_shocked) {
    //     payload = {
    //         notification: {
    //             title: "Fragile Cargo Alert",
    //             body: `The cargo is fragile`,
    //             // icon: "https://firebasestorage.googleapis.com/v0/b/cargo-tracker-f9f9f.appspot.com/o/logo.png?alt=media&token=f9f9f9f9-f9f9-f9f9-f9f9-f9f9f9f9f9f"
    //         },
    //     }
    //     const dashboardFCMRef = admin.database().ref('dashboardFCMToken');
    //     dashboardFCMRef.once('value', (snapshot) => {
    //         dashboardFCMToken = snapshot.val();
    //     }).then(() => {
    //         admin.messaging().sendToDevice(dashboardFCMToken, payload);
    //     })
    // }
        functions.logger.log("Shock Alert");
        // console.log("Temperature Alert");
        const issueObj = {
            time: time,
            cargoID: cargoID,
            batchID: batchID,
            issue: "shocked",
            resolved: false,
        };
        await admin.database().ref('issues').push(issueObj);
    } else {
        functions.logger.log("Shock OK");
        // console.log("Temperature OK");
        // return "Temperature OK";
    }}

    // if (batchObj.isUpright) {
    //     const orientation = newEntry.MPU6050.Rotation;
    //     //TODO: orientation extraction
    //     var orientationArray = orientation.split(",");
    //     orientationArray.map((element) => {
    //         element = element.split(" ");
    //         return parseFloat(element[1]);
    //     });
    //     if ((orientationArray[0] > ))
    // }

    // const opened = newEntry.Photoresistor.Box_opened;
);

exports.checkDelivered = functions.https.onCall( async (req, res) => {
    const axios = require('axios');
    const truckID = req.truckID;
    const batchID = req.batchID;
    functions.logger.info(`Checking if batch ${batchID} has been delivered by truck ${truckID}`);
    const calculateDistance = (curr, dest) => {
        let lon1 = curr.lon * Math.PI / 180;
        let lon2 = dest.lon * Math.PI / 180;
        let lat1 = curr.lat * Math.PI / 180;
        let lat2 = dest.lat * Math.PI / 180;

        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
                    + Math.cos(lat1) * Math.cos(lat2)
                    * Math.pow(Math.sin(dlon / 2), 2);
        let c = 2 * Math.asin(Math.sqrt(a));
        let r = 6371;
        return (c * r);
    }
    var currLocation = {
        lat: 22.3373,
        lon: 114.26384
    };
    // var address = "Hong Kong University of Science and Technology";
    // await admin.database().ref(`trucks/${truckID}`).once('value', (snapshot) => {
    //     const truckObj = snapshot.val();
    //     const locationStr = truckObj.location;
    //     const locationArr = locationStr.split(',');
    //     currLocation.lat = parseFloat(locationArr[0]);
    //     currLocation.lon = parseFloat(locationArr[1]);
    // });
    var address = "";
    await admin.database().ref(`batches/${batchID}`).once('value', (snapshot) => {
        const batchObj = snapshot.val();
        address = batchObj.address;
    });
    const response = await axios.get(`https://api.tomtom.com/search/2/search/${encodeURIComponent(address)}.json?key=Pf3TNIqZkfJZHAuYLSazmpLqMe24AWDp`);
    functions.logger.log(response);
    const destination = response.data.results[0].position;
    functions.logger.log(destination);
    const distance = calculateDistance(currLocation, destination);
    // const distance = 0.1;
    if (distance > 0.1) {
        //TODO: Send message to app and dashboard
        // await admin.database().ref(`drivers/${truckObj.driverID}`).once('value' , (snapshot) => {
        //     const driverObj = snapshot.val();
        //     const driverFCMToken = driverObj.FCMtoken;
        //     const payload = {
        //         notification: {
        //             title: `Wrong location for batch ${batchID}!`,
        //             body: `You are ${distance} away from the actual destination.`
        //         }
        //     }
        //     admin.messaging().sendToDevice(driverFCMToken, payload);
        //     const dashboardFCMRef = admin.database().ref('dashboardFCMToken');
        //     dashboardFCMRef.once('value', (snapshot) => {
        //         dashboardFCMToken = snapshot.val();
        //     }).then(() => {
        //         admin.messaging().sendToDevice(dashboardFCMToken, payload);
        //     })
        // })
        functions.logger.log("Wrong location");
        return {
            deliveredCheck: false,
            distance: distance
        }
    }
    functions.logger.log(`Batch ${batchID} is delivered!`);
    admin.database().ref(`batches/${batchID}`).update({
        'deliveryStatus': 'delivered',
    }).catch((error) => {
        console.log(error);
    })
    return {
        deliveredCheck: true
    }
});

exports.runSignOff = functions.https.onCall((req, res) => {
    const batchID = req.batchID;

    admin.database().ref(`batches/${batchID}`).update({
        'deliveryStatus': 'signed off',
    }).catch((error) => {
        console.log(error);
    })
    // res.send({
    //     status: 'success',
    //     data: {
    //         signOffSuccessful: true
    //     }
    // });
    return {
        status: 'success',
        data: {
            signOffSuccessful: true
        }
    };
});

exports.exportReport = functions.https.onCall( async (req, res) => {
    // const xl = require('excel4node');

    // const wb = new xl.Workbook();

    // const generalSheet = wb.addWorksheet('General');
    // const alertsSheet = wb.addWorksheet('Alerts');
    // const batchSheet = wb.addWorksheet('Batch Details');

    // functions.logger.log("request: ", req);
    
    var trucks = [];
    var batches = [];
    var alerts = [];
    // var cartons = [];
    var numTrucks = 0;
    var numBatches = 0;
    var numDriverResolvable = 0;
    var numNonResolvable = 0;
    var numAlerts = 0;
    var numAlertsResolved = 0;

    const truckRef = admin.database().ref('trucks');
    const batchRef = admin.database().ref('batches');
    const alertRef = admin.database().ref('issues');

    await batchRef.once('value', (snapshot) => {
        const values = snapshot.val();
        batches = Object.values(values);
        numBatches = batches.length;
        // batches.forEach(batch => {
        //     cartons.push(...batch.cargo);
        // });
    });

    await truckRef.once('value', (snapshot) => {
        const values = snapshot.val();
        trucks = Object.values(values);
        numTrucks = trucks.length;
    });


    await alertRef.once('value', (snapshot) => {
        const values = snapshot.val();
        alerts = Object.values(values);
        numAlerts = alerts.length;
    });

    // await admin.messaging().send({
    //     token: dashboardFCMToken,
    //     notification: {
    //         title: 'Export Report',
    //         body: 'Generating report...'
    //     },
    // })

    // functions.logger.log('Sent notif');

    return {
        general: [
            ["Daily Summary Report"],
            ["Date: ", Date()],
            ["Number of trucks: ", numTrucks],
            ["Number of batches: ", numBatches],
            ["Number of driver-resolvable alerts: "],
            ["Number of non-resolvable alerts: "],
            ["Total number of alerts: ", numAlerts],
            ["Number of alerts resolved: "]
        ],
        // carton: [
        //     ["Carton Details"],
        //     ["Date: ", Date()],
        //     ["Time leaving the warehouse", "Truck ID", "Batch ID", "Carton ID", "Arrival Time", "Any Alerts?"],
        // //     ...cartons.map(carton => {
        // //         return [
                    
        // //         ]
        // //     })
        // ],
        // alert: [
        //     ["Alert Details"],
        //     ["Date: ", Date()],
        //     ["Time of alert", "Carton ID", "Batch ID", "Truck ID", "Alert Type", "Is it resolved?", "Resolved by", "Alert Details"],
        //     // ...alerts.map(alert => {
        //     //     return [
        //     //     ]
        //     // })
        // ]
    }
});