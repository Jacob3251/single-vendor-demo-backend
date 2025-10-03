import { Op } from "sequelize";
import User from "./user.model";
import Profile from "../profile/profile.model";
import sequelize from "../../database";
import admin from "../../../firebase/firebaseAdmin"; // Import Firebase Admin SDK
import { ProfileServices } from "../profile/profile.service";

// syncUser remains the same as it's for login/signup
const syncUser = async (payload: {
  firebaseUID: string;
  email: string;
  name?: string | null;
  profileData?: Record<string, any>;
}) => {
  if (!payload || !payload.firebaseUID) {
    throw new Error(
      "syncUser service was called with an invalid payload. 'firebaseUID' is missing."
    );
  }

  const transaction = await sequelize.transaction();
  try {
    console.log("Step 1: Starting user sync transaction...");

    // Step 1: Find or Create the User
    let user = await User.findByPk(payload.firebaseUID, { transaction });

    if (!user) {
      console.log(
        ` -> User with UID ${payload.firebaseUID} not found. Creating new user...`
      );
      const isFirstUser = (await User.count({ transaction })) === 0;
      user = await User.create(
        {
          userId: payload.firebaseUID,
          userType: isFirstUser ? "ADMIN" : "GUEST",
        },
        { transaction }
      );
      console.log(` -> User created with role: ${user.get("userType")}`);
    } else {
      console.log(` -> User with UID ${payload.firebaseUID} found.`);
    }

    // Step 2: Handle Profile Creation/Update
    console.log("Step 2: Handling profile creation/update...");

    // Check if profile already exists
    let existingProfile = await Profile.findOne({
      where: { userId: payload.firebaseUID },
      transaction,
    });

    if (!existingProfile && payload.email) {
      console.log(` -> Creating profile for user ${payload.firebaseUID}...`);

      // Extract name parts
      const nameParts = payload.name?.split(" ") || [];
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Create basic profile data
      const basicProfileData = {
        firstName,
        lastName,
        email: payload.email,
        phoneNumber: payload.profileData?.phoneNumber || "",
        addressLine1: payload.profileData?.addressLine1 || "",
        addressLine2: payload.profileData?.addressLine2 || null,
        city: payload.profileData?.city || "",
        postalCode: payload.profileData?.postalCode || "",
        county: payload.profileData?.county || null,
      };

      // Use ProfileServices to create the profile within the transaction
      await ProfileServices.updateOrCreateProfile(
        payload.firebaseUID,
        basicProfileData,
        payload.email,
        transaction
      );

      console.log(
        ` -> Profile created successfully for user ${payload.firebaseUID}`
      );
    } else if (existingProfile) {
      console.log(` -> Profile already exists for user ${payload.firebaseUID}`);
    } else {
      console.log(` -> No email provided, skipping profile creation`);
    }

    // Step 3: Return user with profile
    const userWithProfile = await User.findByPk(user.get("userId") as string, {
      include: [{ model: Profile, as: "profile" }],
      transaction,
    });

    await transaction.commit();
    console.log("✅ User sync completed successfully");
    return userWithProfile;
  } catch (error) {
    await transaction.rollback();
    console.error(
      "❌ Failed to sync user. Transaction rolled back. Full error:",
      error
    );
    throw new Error(`User sync failed: ${(error as Error).message}`);
  }
};

/**
 * ✅ UPDATED: Retrieves a paginated and searchable list of all users.
 * Now correctly handles the `userType` filter parameter.
 */
const getAllUsers = async (options: {
  searchTerm?: string;
  userType?: "ADMIN" | "SEO" | "GUEST";
  page?: number;
  limit?: number;
}) => {
  const { searchTerm, userType, page = 1, limit = 10 } = options;

  const whereClause: any = {};
  const profileWhereClause: any = {};

  if (userType) {
    whereClause.userType = userType;
  }

  if (searchTerm) {
    profileWhereClause[Op.or] = [
      { firstName: { [Op.iLike]: `%${searchTerm}%` } },
      { lastName: { [Op.iLike]: `%${searchTerm}%` } },
      { email: { [Op.iLike]: `%${searchTerm}%` } },
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Profile,
        as: "profile",
        where:
          Object.keys(profileWhereClause).length > 0
            ? profileWhereClause
            : undefined,
        required: Object.keys(profileWhereClause).length > 0,
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    distinct: true,
  });

  return {
    users: rows,
    meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
  };
};

/**
 * Updates the role of a specific user.
 */
const updateUserRole = async (
  userId: string,
  userType: "ADMIN" | "SEO" | "GUEST"
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }
  await user.update({ userType });
  return user;
};

/**
 * ✅ NEW: Deletes a user from Firebase Authentication and the local database.
 * The database deletion will cascade to the Profile table.
 * @param userId - The Firebase UID of the user to delete.
 */
const deleteUser = async (userId: string) => {
  const transaction = await sequelize.transaction();
  try {
    // Step 1: Delete the user from the local database.
    // The `onDelete: 'CASCADE'` in your association will handle deleting the profile.
    const user = await User.findByPk(userId, { transaction });
    if (user) {
      await user.destroy({ transaction });
    } else {
      console.warn(
        `User ${userId} not in DB, proceeding to delete from Firebase.`
      );
    }

    // Step 2: Delete the user from Firebase Authentication.
    await admin.auth().deleteUser(userId);

    await transaction.commit();
    return { message: "User deleted successfully from all systems." };
  } catch (error) {
    await transaction.rollback();
    console.error(`Failed to delete user ${userId}:`, error);
    throw error;
  }
};

const getUserById = async (userId: string) => {
  const userWithProfile = await User.findByPk(userId, {
    include: [{ model: Profile, as: "profile" }],
  });
  return userWithProfile;
};

export const UserServices = {
  syncUser,
  getAllUsers,
  updateUserRole,
  getUserById,
  deleteUser, // ✅ Export the new function
};
