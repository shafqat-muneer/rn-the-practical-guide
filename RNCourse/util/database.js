import { openDatabaseSync } from "expo-sqlite";
import { Place } from "../models/place";

const database = openDatabaseSync("places.db");

// Initialize database and create table
export async function init() {
  try {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        imageUri TEXT NOT NULL,
        address TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL
      );
    `);
  } catch (err) {
    throw err;
  }
}

// Insert a new place
export async function insertPlace(place) {
  try {
    const result = await database.runAsync(
      `INSERT INTO places (title, imageUri, address, lat, lng)
       VALUES (?, ?, ?, ?, ?);`,
      [
        place.title,
        place.imageUri,
        place.address,
        place.location.lat,
        place.location.lng,
      ]
    );
    return result.lastInsertRowId;
  } catch (err) {
    throw err;
  }
}

// Fetch all places
export async function fetchPlaces() {
  try {
    const rows = await database.getAllAsync("SELECT * FROM places");
    return rows.map((dp) => {
      return new Place(
        dp.title,
        dp.imageUri,
        {
          address: dp.address,
          lat: dp.lat,
          lng: dp.lng,
        },
        dp.id
      );
    });
  } catch (err) {
    throw err;
  }
}

// Fetch place details by id
export async function fetchPlaceDetails(id) {
  try {
    const dp = await database.getFirstAsync(
      "SELECT * FROM places WHERE id = ?",
      [id]
    );

    return new Place(
      dp.title,
      dp.imageUri,
      { lat: dp.lat, lng: dp.lng, address: dp.address },
      dp.id
    );
  } catch (err) {
    throw err;
  }
}

// // import * as SQLite from "expo-sqlite";
// import { openDatabaseSync } from "expo-sqlite";

// import { Place } from "../models/place";

// //const database = SQLite.openDatabase("places.db");
// const database = openDatabaseSync("places.db");

// export function init() {
//   const promise = new Promise((resolve, reject) => {
//     database.transaction((tx) => {
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS places (
//           id INTEGER PRIMARY KEY NOT NULL,
//           title TEXT NOT NULL,
//           imageUri TEXT NOT NULL,
//           address TEXT NOT NULL,
//           lat REAL NOT NULL,
//           lng REAL NOT NULL
//         )`,
//         [],
//         () => {
//           resolve();
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });

//   return promise;
// }

// export function insertPlace(place) {
//   const promise = new Promise((resolve, reject) => {
//     database.transaction((tx) => {
//       tx.executeSql(
//         `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
//         [
//           place.title,
//           place.imageUri,
//           place.address,
//           place.location.lat,
//           place.location.lng,
//         ],
//         (_, result) => {
//           resolve(result);
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });

//   return promise;
// }

// export function fetchPlaces() {
//   const promise = new Promise((resolve, reject) => {
//     database.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM places",
//         [],
//         (_, result) => {
//           const places = [];

//           for (const dp of result.rows._array) {
//             places.push(
//               new Place(
//                 dp.title,
//                 dp.imageUri,
//                 {
//                   address: dp.address,
//                   lat: dp.lat,
//                   lng: dp.lng,
//                 },
//                 dp.id
//               )
//             );
//           }
//           resolve(places);
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });

//   return promise;
// }

// export function fetchPlaceDetails(id) {
//   const promise = new Promise((resolve, reject) => {
//     database.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM places WHERE id = ?",
//         [id],
//         (_, result) => {
//           const dbPlace = result.rows._array[0];
//           const place = new Place(
//             dbPlace.title,
//             dbPlace.imageUri,
//             { lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address },
//             dbPlace.id
//           );
//           resolve(place);
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });

//   return promise;
// }
