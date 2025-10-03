import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class User extends Model {}

User.init(
  {
    userId: {
      // This is the Firebase UID, which is a string.
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userType: {
      type: DataTypes.ENUM("ADMIN", "SEO", "GUEST"),
      allowNull: false,
      defaultValue: "GUEST",
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

export default User;
