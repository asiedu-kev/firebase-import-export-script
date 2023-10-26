const admin = require("firebase-admin");
const fs = require("fs");
const serviceAccount = require("./config/yara-224ff-firebase-adminsdk-mnfwm-750ae1d062.json");

let collectionName = process.argv[2];
let subCollection = process.argv[3];

// You should replace databaseURL with your own
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://yara-224ff-default-rtdb.firebaseio.com", // put your database rtdb link here
});

let db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

let data = {};
data[collectionName] = {};

let results = db
  .collection(collectionName)
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      data[collectionName][doc.id] = doc.data();
    });
    return data;
  })
  .catch((error) => {
    console.log(error);
  });

results.then((dt) => {
  getSubCollection(dt).then(() => {
    // Write collection to JSON file
    fs.writeFile("users.json", JSON.stringify(data), function (err) {
      // replace table name here
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  });
});

async function getSubCollection(dt) {
  for (let [key, value] of Object.entries([dt[collectionName]][0])) {
    if (subCollection !== undefined) {
      data[collectionName][key]["subCollection"] = {};
      await addSubCollection(key, data[collectionName][key]["subCollection"]);
    }
  }
}

function addSubCollection(key, subData) {
  return new Promise((resolve) => {
    db.collection(collectionName)
      .doc(key)
      .collection(subCollection)
      .get()
      .then((snapshot) => {
        snapshot.forEach((subDoc) => {
          subData[subDoc.id] = subDoc.data();
          resolve("Added data");
        });
      });
  });
}
