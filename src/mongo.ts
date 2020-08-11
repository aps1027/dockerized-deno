import { MongoClient } from "./deps.ts";

interface UserSchema {
  _id: { $oid: string };
  name: string;
  email: string;
  password: string;
}
interface SurveySchema {
  _id: { $oid: string };
  userId: string;
  name: string;
  description: string;
}

const client = new MongoClient();
client.connectWithUri(Deno.env.get("MONGODB_URI") || "");

const db = client.database(Deno.env.get("DB_NAME") || "");

export const userCollection = db.collection("user");
export const surveyCollection = db.collection("survey");
