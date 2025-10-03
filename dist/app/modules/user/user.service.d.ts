import User from "./user.model";
export declare const UserServices: {
    syncUser: (payload: {
        firebaseUID: string;
        email: string;
        name?: string | null;
        profileData?: Record<string, any>;
    }) => Promise<User | null>;
    getAllUsers: (options: {
        searchTerm?: string;
        userType?: "ADMIN" | "SEO" | "GUEST";
        page?: number;
        limit?: number;
    }) => Promise<{
        users: User[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateUserRole: (userId: string, userType: "ADMIN" | "SEO" | "GUEST") => Promise<User>;
    getUserById: (userId: string) => Promise<User | null>;
    deleteUser: (userId: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map