"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("./user.model"));
const profile_model_1 = __importDefault(require("../profile/profile.model"));
const database_1 = __importDefault(require("../../database"));
const firebaseAdmin_1 = __importDefault(require("../../../firebase/firebaseAdmin")); // Import Firebase Admin SDK
const profile_service_1 = require("../profile/profile.service");
// syncUser remains the same as it's for login/signup
const syncUser = async (payload) => {
    if (!payload || !payload.firebaseUID) {
        throw new Error("syncUser service was called with an invalid payload. 'firebaseUID' is missing.");
    }
    const transaction = await database_1.default.transaction();
    try {
        console.log("Step 1: Starting user sync transaction...");
        // Step 1: Find or Create the User
        let user = await user_model_1.default.findByPk(payload.firebaseUID, { transaction });
        if (!user) {
            console.log(` -> User with UID ${payload.firebaseUID} not found. Creating new user...`);
            const isFirstUser = (await user_model_1.default.count({ transaction })) === 0;
            user = await user_model_1.default.create({
                userId: payload.firebaseUID,
                userType: isFirstUser ? "ADMIN" : "GUEST",
            }, { transaction });
            console.log(` -> User created with role: ${user.get("userType")}`);
        }
        else {
            console.log(` -> User with UID ${payload.firebaseUID} found.`);
        }
        // Step 2: Handle Profile Creation/Update
        console.log("Step 2: Handling profile creation/update...");
        // Check if profile already exists
        let existingProfile = await profile_model_1.default.findOne({
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
            await profile_service_1.ProfileServices.updateOrCreateProfile(payload.firebaseUID, basicProfileData, payload.email, transaction);
            console.log(` -> Profile created successfully for user ${payload.firebaseUID}`);
        }
        else if (existingProfile) {
            console.log(` -> Profile already exists for user ${payload.firebaseUID}`);
        }
        else {
            console.log(` -> No email provided, skipping profile creation`);
        }
        // Step 3: Return user with profile
        const userWithProfile = await user_model_1.default.findByPk(user.get("userId"), {
            include: [{ model: profile_model_1.default, as: "profile" }],
            transaction,
        });
        await transaction.commit();
        console.log("✅ User sync completed successfully");
        return userWithProfile;
    }
    catch (error) {
        await transaction.rollback();
        console.error("❌ Failed to sync user. Transaction rolled back. Full error:", error);
        throw new Error(`User sync failed: ${error.message}`);
    }
};
/**
 * ✅ UPDATED: Retrieves a paginated and searchable list of all users.
 * Now correctly handles the `userType` filter parameter.
 */
const getAllUsers = async (options) => {
    const { searchTerm, userType, page = 1, limit = 10 } = options;
    const whereClause = {};
    const profileWhereClause = {};
    if (userType) {
        whereClause.userType = userType;
    }
    if (searchTerm) {
        profileWhereClause[sequelize_1.Op.or] = [
            { firstName: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
            { lastName: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
            { email: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
        ];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await user_model_1.default.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: profile_model_1.default,
                as: "profile",
                where: Object.keys(profileWhereClause).length > 0
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
const updateUserRole = async (userId, userType) => {
    const user = await user_model_1.default.findByPk(userId);
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
const deleteUser = async (userId) => {
    const transaction = await database_1.default.transaction();
    try {
        // Step 1: Delete the user from the local database.
        // The `onDelete: 'CASCADE'` in your association will handle deleting the profile.
        const user = await user_model_1.default.findByPk(userId, { transaction });
        if (user) {
            await user.destroy({ transaction });
        }
        else {
            console.warn(`User ${userId} not in DB, proceeding to delete from Firebase.`);
        }
        // Step 2: Delete the user from Firebase Authentication.
        await firebaseAdmin_1.default.auth().deleteUser(userId);
        await transaction.commit();
        return { message: "User deleted successfully from all systems." };
    }
    catch (error) {
        await transaction.rollback();
        console.error(`Failed to delete user ${userId}:`, error);
        throw error;
    }
};
const getUserById = async (userId) => {
    const userWithProfile = await user_model_1.default.findByPk(userId, {
        include: [{ model: profile_model_1.default, as: "profile" }],
    });
    return userWithProfile;
};
exports.UserServices = {
    syncUser,
    getAllUsers,
    updateUserRole,
    getUserById,
    deleteUser, // ✅ Export the new function
};
//# sourceMappingURL=user.service.js.map