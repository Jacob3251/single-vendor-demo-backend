import Collection from "./collection.model";
export declare const CollectionServices: {
    createCollectionInDB: (payload: {
        name: string;
        slug?: string | null;
        description?: string | null;
        status?: "ACTIVE" | "INACTIVE";
        order?: number;
        image?: string | null;
        productIds?: number[];
    }) => Promise<Collection | null>;
    getCollectionByIdFromDB: (id: string) => Promise<Collection>;
    updateCollectionInDB: (id: string, payload: {
        name?: string;
        slug?: string | null;
        description?: string | null;
        status?: "ACTIVE" | "INACTIVE";
        order?: number;
        image?: string | null;
        productIds?: number[];
    }) => Promise<Collection>;
    getAllCollectionsFromDB: () => Promise<Collection[]>;
    deleteCollectionFromDB: (id: string) => Promise<{
        id: string;
    }>;
    getCollectionBySlugFromDB: (slug: string) => Promise<Collection>;
};
//# sourceMappingURL=collection.service.d.ts.map