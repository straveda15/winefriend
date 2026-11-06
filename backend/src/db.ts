import dns from "node:dns";
import { MongoClient, type Db } from "mongodb";
import { config, isProduction } from "./config";

// Some home/office routers and ISPs refuse the SRV lookup that mongodb+srv:// URIs need
// (error "querySrv ECONNREFUSED"). For local development only, resolve through public DNS.
if (!isProduction && !process.env.VERCEL) dns.setServers(["8.8.8.8", "1.1.1.1"]);

/**
 * One shared MongoDB connection. It is kept on globalThis so that serverless hosts (Vercel) reuse it
 * between requests instead of opening a new connection every time.
 */
const globalForMongo = globalThis as typeof globalThis & { __winefriendMongo?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  if (!config.mongodbUri) {
    throw new Error("MONGODB_URI is not set. Add it to backend/.env.local (or your host's environment variables).");
  }
  if (!globalForMongo.__winefriendMongo) {
    const connecting = new MongoClient(config.mongodbUri, { maxPoolSize: 5, serverSelectionTimeoutMS: 8000 }).connect();
    // If the first attempt fails, allow the next request to try again.
    connecting.catch(() => {
      globalForMongo.__winefriendMongo = undefined;
    });
    globalForMongo.__winefriendMongo = connecting;
  }
  return (await globalForMongo.__winefriendMongo).db(config.mongodbDb);
}
