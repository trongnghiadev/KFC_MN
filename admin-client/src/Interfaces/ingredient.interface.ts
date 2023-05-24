import ISupplier from "./supplier.interface";

export default interface IIngredient {
    id?: string,
    name: string,
    unit: IngredientUnit,
    supplierId?: string,
    supplier?: ISupplier
    cost: number,
    stock: number,
    warehouseId?: string
}

export type IngredientUnit = "the" | "g" | "kg" | "l" | "ml"

export const initIngredient : IIngredient = {
    name: "",
    unit: "the",
    cost: 0,
    stock: 0,
    supplierId: "7861d25f-578a-4954-91fe-6eeda1dcdb9d"
}

export const demoIngredient : IIngredient = {
    name: "Flour",
    unit: "kg",
    cost: 120000,
    stock: 51
}