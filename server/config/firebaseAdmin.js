import {
    applicationDefault,
    cert,
    getApps,
    initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let firebaseApp;

if (getApps().length > 0) {
    firebaseApp = getApps()[0];
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT
    );

    firebaseApp = initializeApp({
        credential: cert(serviceAccount),
    });
} else {
    firebaseApp = initializeApp({
        credential: applicationDefault(),
    });
}

export const adminAuth = getAuth(firebaseApp);