import User from "../modules/user/user.model";
import Profile from "../modules/profile/profile.model";
import Order from "../modules/orders/order.model";
import Product from "../modules/products/product.model";
import Transaction from "../modules/transaction/transaction.model";
import Shipping from "../modules/shipping/shipping.model";
import Blog from "../modules/blog/blog.model";
import Brand from "../modules/brands/brand.model";
import Collection from "../modules/collections/collection.model";
import OrderProduct from "../modules/orders/order_product.model";
import CollectionProduct from "../modules/collections/collection_product.model";

const setupAssociations = () => {
  console.log("Setting up database associations with Profile model...");

  // User <-> Profile (One-to-One)
  User.hasOne(Profile, {
    foreignKey: "userId",
    as: "profile",
    onDelete: "CASCADE",
  });
  Profile.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Profile <-> Order (One-to-Many)
  Profile.hasMany(Order, {
    foreignKey: "profileId",
    as: "orders",
    onDelete: "CASCADE",
  });
  Order.belongsTo(Profile, { foreignKey: "profileId", as: "profile" });

  // Transaction <-> Order (One-to-One)
  Transaction.hasOne(Order, {
    foreignKey: "transactionId",
    as: "order",
    onDelete: "CASCADE",
  });
  Order.belongsTo(Transaction, {
    foreignKey: "transactionId",
    as: "transaction",
  });

  // Brand <-> Product (One-to-Many)
  Brand.hasMany(Product, { foreignKey: "brandId", as: "products" });
  Product.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });

  // User <-> Blog (One-to-Many for Authorship)
  User.hasMany(Blog, { foreignKey: "authorId", as: "blogs" });
  Blog.belongsTo(User, { foreignKey: "authorId", as: "author" });

  // Order <-> Shipping (One-to-One)
  // An order has one shipping record, and a shipping record belongs to one order.
  Order.hasOne(Shipping, { foreignKey: "orderId", as: "shippingDetails" });
  Shipping.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  // Order <-> Product (Many-to-Many)
  Order.belongsToMany(Product, {
    through: OrderProduct,
    foreignKey: "orderId",
    as: "products",
  });
  Product.belongsToMany(Order, {
    through: OrderProduct,
    foreignKey: "productId",
    as: "orders",
  });
  // ✅ NEW: Explicitly define the relationships for the junction table itself
  // This is required for the stats service to perform its include query.
  OrderProduct.belongsTo(Product, { foreignKey: "productId", as: "product" });
  // Collection <-> Product (Many-to-Many)
  Collection.belongsToMany(Product, {
    through: CollectionProduct,
    foreignKey: "collectionId",
    as: "products",
  });
  Product.belongsToMany(Collection, {
    through: CollectionProduct,
    foreignKey: "productId",
    as: "collections",
  });

  console.log("Associations configured successfully.");
};

export default setupAssociations;
