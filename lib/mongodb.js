import { MongoClient } from 'mongodb';

const dbName = process.env.MONGODB_DB || 'labora';
let clientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing. Add it to .env.local (local) or your hosting environment variables.');
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }
  if (!clientPromise) clientPromise = new MongoClient(uri).connect();
  return clientPromise;
}

export async function getCollection(name) {
  const connectedClient = await getClientPromise();
  return connectedClient.db(dbName).collection(name);
}

export function apiError(error) {
  console.error('[Labora API]', error);
  if (!process.env.MONGODB_URI) {
    return Response.json({ success: false, error: 'Server is missing MONGODB_URI. Configure the environment variable and redeploy/restart.' }, { status: 503 });
  }
  return Response.json({ success: false, error: 'Database request failed. Check server logs, MongoDB Atlas network access, and database credentials.' }, { status: 500 });
}
