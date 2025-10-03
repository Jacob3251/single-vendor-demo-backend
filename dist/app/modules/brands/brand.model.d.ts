import { Model } from "sequelize";
declare class Brand extends Model {
    id: number;
    name: string;
    status: "ACTIVE" | "INACTIVE";
    description: string | null;
    image: string | null;
}
export default Brand;
//# sourceMappingURL=brand.model.d.ts.map