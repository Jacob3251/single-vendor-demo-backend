"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
console.log("🔍 Initializing Sequelize with PostgreSQL...");
console.log("DB CONFIG:", {
    database: config_1.default.db.name,
    username: config_1.default.db.user,
    host: config_1.default.db.host,
    port: config_1.default.db.port,
    dialect: "postgres"
});
const sequelize = new sequelize_1.Sequelize(config_1.default.db.name, config_1.default.db.user, config_1.default.db.password, {
    host: config_1.default.db.host,
    port: config_1.default.db.port || 5432,
    dialect: "postgres",
    logging: config_1.default.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
        ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
    },
});
console.log("✅ Sequelize instance created with dialect:", sequelize.getDialect());
exports.default = sequelize;
//# sourceMappingURL=index.js.map