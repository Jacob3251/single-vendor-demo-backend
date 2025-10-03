import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class Profile extends Model {}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: true, // 🔥 CHANGED: Allow null for Google sign-in users
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true, // 🔥 CHANGED: Allow null for Google sign-in users
    },
    county: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true, // 🔥 CHANGED: Allow null for Google sign-in users
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // This is the foreign key from the User model (Firebase UID)
    userId: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for guest profiles created before login
      unique: true,
    },
    // 🔥 NEW: Add a field to track if profile is complete
    isComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Profile",
    timestamps: true,
  }
);

export default Profile;