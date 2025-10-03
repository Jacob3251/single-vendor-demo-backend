import "dotenv/config";

import app from "./app";
import config from "./app/config/config";
import sequelize from "./app/database";
import setupAssociations from "./app/database/associations";

const port = config.PORT || 5000;

async function main() {
  try {
    // ✅ Add these debug lines
    console.log("🔍 Starting server with configuration:");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Database dialect:", sequelize.getDialect());
    console.log("Database config:", {
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      user: config.db.user
    });

    await sequelize.authenticate();
    console.log("✅ Database authentication successful");
    
    setupAssociations();
    console.log("✅ Associations setup complete");

    // Comment out sync temporarily to test connection
    // await sequelize.sync({ alter: true });

    console.log("✅ Database connection has been established successfully.");

    app.listen(port, () => {
      console.log(`🚀 App is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Exit on failure
  }
}

main();