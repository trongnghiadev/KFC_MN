export default interface ISupplier{
    id?: string,
    name: string,
    email: string,
    phone?: string,
    description?:string
}

export const initSupplier:ISupplier = {
    name: "",
    email: ""
}