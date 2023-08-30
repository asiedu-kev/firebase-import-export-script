const admin = require("firebase-admin");
const fs = require('fs');
const serviceAccount = require("./config/yara-224ff-firebase-adminsdk-mnfwm-5b0ca596cd.json");


let collectionName = process.argv[2];
let subCollection = process.argv[3];

// You should replace databaseURL with your own
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://yara-224ff-default-rtdb.firebaseio.com"
});

let db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

let data = {};
data[collectionName] = {};

let results = db.collection(collectionName)
    .get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            data[collectionName][doc.id] = doc.data();
        })
        return data;
    })
    .catch(error => {
        console.log(error);
    })


results.then(dt => {

})

