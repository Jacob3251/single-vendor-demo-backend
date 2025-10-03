import Blog from "./blog.model";
export declare const BlogServices: {
    createBlogPostInDB: (blogData: any) => Promise<Blog>;
    getAllBlogPostsFromDB: (options: {
        search?: string;
        page?: number;
        limit?: number;
    }) => Promise<{
        posts: Blog[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getBlogPostBySlugFromDB: (slug: string) => Promise<Blog>;
    getBlogPostByIdFromDB: (id: number) => Promise<Blog>;
    updateBlogPostInDB: (id: number, payload: any) => Promise<Blog>;
    deleteBlogPostFromDB: (id: number) => Promise<void>;
    deleteMultipleBlogPostsFromDB: (ids: number[]) => Promise<number>;
};
//# sourceMappingURL=blog.service.d.ts.map