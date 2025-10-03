import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

// Validate essential database variables
const requiredDbVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const v of requiredDbVars) {
  if (!process.env[v]) {
    throw new Error(`FATAL ERROR: Environment variable ${v} is not defined.`);
  }
}

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  // ... your other keys
  db: {
    host: process.env.DB_HOST!, // The '!' asserts that this is not undefined
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
  },
};