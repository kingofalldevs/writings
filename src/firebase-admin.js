import admin from "firebase-admin";

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Private key needs to handle escaped newlines if coming from env
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

function initializeAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // If we have a private key, use service account, otherwise try to use default credentials (useful for some environments)
  if (firebaseAdminConfig.privateKey && firebaseAdminConfig.clientEmail) {
    return admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
    });
  } else {
    // Fallback to project ID only (works in some GCP environments or if only using Firestore with ADC)
    return admin.initializeApp({
      projectId: firebaseAdminConfig.projectId,
    });
  }
}

const adminApp = initializeAdmin();
const adminDb = adminApp.firestore();

export { adminDb };
