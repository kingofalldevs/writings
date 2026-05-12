const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function deleteCollection(collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}

async function reset() {
  console.log('Resetting database...');
  
  // 1. Delete Portfolios
  console.log('Deleting portfolios...');
  await deleteCollection('portfolios', 100);
  
  // 2. Delete Users and their subcollections
  console.log('Deleting users and works...');
  const usersSnapshot = await db.collection('users').get();
  for (const userDoc of usersSnapshot.docs) {
    // Delete works subcollection
    await deleteCollection(`users/${userDoc.id}/works`, 100);
    // Delete user doc
    await userDoc.ref.delete();
  }

  console.log('Database reset complete.');
  process.exit(0);
}

reset().catch(err => {
  console.error('Reset failed:', err);
  process.exit(1);
});
