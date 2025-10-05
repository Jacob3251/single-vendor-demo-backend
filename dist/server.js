"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config/config"));
const database_1 = __importDefault(require("./app/database"));
const associations_1 = __importDefault(require("./app/database/associations"));
const port = config_1.default.PORT || 5000;
async function main() {
    try {
        // ✅ Add these debug lines
        console.log("🔍 Starting server with configuration:");
        console.log("Environment:", process.env.NODE_ENV);
        console.log("Database dialect:", database_1.default.getDialect());
        console.log("Database config:", {
            host: config_1.default.db.host,
            port: config_1.default.db.port,
            database: config_1.default.db.name,
            user: config_1.default.db.user
        });
        await database_1.default.authenticate();
        console.log("✅ Database authentication successful");
        (0, associations_1.default)();
        console.log("✅ Associations setup complete");
        // Comment out sync temporarily to test connection
        await database_1.default.sync({ alter: true });
        console.log("✅ Database connection has been established successfully.");
        app_1.default.listen(port, () => {
            console.log(`🚀 App is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        process.exit(1); // Exit on failure
    }
}
main();
//# sourceMappingURL=server.js.map