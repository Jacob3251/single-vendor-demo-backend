"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const profile_model_1 = __importDefault(require("../modules/profile/profile.model"));
const order_model_1 = __importDefault(require("../modules/orders/order.model"));
const product_model_1 = __importDefault(require("../modules/products/product.model"));
const transaction_model_1 = __importDefault(require("../modules/transaction/transaction.model"));
const shipping_model_1 = __importDefault(require("../modules/shipping/shipping.model"));
const blog_model_1 = __importDefault(require("../modules/blog/blog.model"));
const brand_model_1 = __importDefault(require("../modules/brands/brand.model"));
const collection_model_1 = __importDefault(require("../modules/collections/collection.model"));
const order_product_model_1 = __importDefault(require("../modules/orders/order_product.model"));
const collection_product_model_1 = __importDefault(require("../modules/collections/collection_product.model"));
const setupAssociations = () => {
    console.log("Setting up database associations with Profile model...");
    // User <-> Profile (One-to-One)
    user_model_1.default.hasOne(profile_model_1.default, {
        foreignKey: "userId",
        as: "profile",
        onDelete: "CASCADE",
    });
    profile_model_1.default.belongsTo(user_model_1.default, { foreignKey: "userId", as: "user" });
    // Profile <-> Order (One-to-Many)
    profile_model_1.default.hasMany(order_model_1.default, {
        foreignKey: "profileId",
        as: "orders",
        onDelete: "CASCADE",
    });
    order_model_1.default.belongsTo(profile_model_1.default, { foreignKey: "profileId", as: "profile" });
    // Transaction <-> Order (One-to-One)
    transaction_model_1.default.hasOne(order_model_1.default, {
        foreignKey: "transactionId",
        as: "order",
        onDelete: "CASCADE",
    });
    order_model_1.default.belongsTo(transaction_model_1.default, {
        foreignKey: "transactionId",
        as: "transaction",
    });
    // Brand <-> Product (One-to-Many)
    brand_model_1.default.hasMany(product_model_1.default, { foreignKey: "brandId", as: "products" });
    product_model_1.default.belongsTo(brand_model_1.default, { foreignKey: "brandId", as: "brand" });
    // User <-> Blog (One-to-Many for Authorship)
    user_model_1.default.hasMany(blog_model_1.default, { foreignKey: "authorId", as: "blogs" });
    blog_model_1.default.belongsTo(user_model_1.default, { foreignKey: "authorId", as: "author" });
    // Order <-> Shipping (One-to-One)
    // An order has one shipping record, and a shipping record belongs to one order.
    order_model_1.default.hasOne(shipping_model_1.default, { foreignKey: "orderId", as: "shippingDetails" });
    shipping_model_1.default.belongsTo(order_model_1.default, { foreignKey: "orderId", as: "order" });
    // Order <-> Product (Many-to-Many)
    order_model_1.default.belongsToMany(product_model_1.default, {
        through: order_product_model_1.default,
        foreignKey: "orderId",
        as: "products",
    });
    product_model_1.default.belongsToMany(order_model_1.default, {
        through: order_product_model_1.default,
        foreignKey: "productId",
        as: "orders",
    });
    // ✅ NEW: Explicitly define the relationships for the junction table itself
    // This is required for the stats service to perform its include query.
    order_product_model_1.default.belongsTo(product_model_1.default, { foreignKey: "productId", as: "product" });
    // Collection <-> Product (Many-to-Many)
    collection_model_1.default.belongsToMany(product_model_1.default, {
        through: collection_product_model_1.default,
        foreignKey: "collectionId",
        as: "products",
    });
    product_model_1.default.belongsToMany(collection_model_1.default, {
        through: collection_product_model_1.default,
        foreignKey: "productId",
        as: "collections",
    });
    console.log("Associations configured successfully.");
};
exports.default = setupAssociations;
//# sourceMappingURL=associations.js.map