import IFood from "./foodInterface.ts";

export default interface IReceipt {
    id?: string,
    create_at?: string,
    state: "paid" | "pending" | "cancel" | "done",
    paymentMethod: "cash" | "qr" | "card",
    foods: Array<IFood>,
    total?: number
}