import {
    cert,
    getApps,
    initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

let firebaseApp;

if (getApps().length > 0) {
    firebaseApp = getApps()[0];
} else {
    firebaseApp = initializeApp({
        credential: cert(serviceAccount),
    });
}

export const adminAuth = getAuth(firebaseApp);