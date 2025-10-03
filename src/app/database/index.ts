import { Sequelize } from "sequelize";
import config from "../config/config";

console.log("🔍 Initializing Sequelize with PostgreSQL...");
console.log("DB CONFIG:", {
  database: config.db.name,
  username: config.db.user,
  host: config.db.host,
  port: config.db.port,
  dialect: "postgres"
});

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port || 5432,
    dialect: "postgres",
    logging: config.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      // Add this for better PostgreSQL compatibility
      ssl: false
    }
  }
);

console.log("✅ Sequelize instance created with dialect:", sequelize.getDialect());

export default sequelize;