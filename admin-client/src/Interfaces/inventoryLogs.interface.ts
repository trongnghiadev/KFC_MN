export default interface IInventoryLog{
    id?: string,
    createdAt?: string,
    deliveredAt?: string,
    from: string,
    to: string,
    note?:string,
    receivedAt?: string,
    type: "inbound" | "outbound" | "transfer" | "update" | "scrap",
    warehouse?: any,
    detail?: IInventoryLog
}

export const inventoryLogInit:IInventoryLog = {
    from: "",
    to: "",
    note: "",
    type: "scrap"
}

export interface IInventoryDetail {
    id?:string,
    ingredientId?:string,
    diff: number
}