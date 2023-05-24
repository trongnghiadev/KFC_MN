export default interface IFood {
    id: string,
    name: string,
    price: number,
    sale_price: number,
    image?: string,
    description?: string,
    create_at?: Date,
    category?: string,
    amount?: number
}