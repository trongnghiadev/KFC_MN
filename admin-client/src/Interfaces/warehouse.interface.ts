import {IFacilities} from "../pages/Validated/Inventory/Facility/facilityDetails";

export default interface IWarehouse {
    id?: string,
    name: string,
    address?: string,
    ownerId?: string,
    owner?: string,
    state: "inactive" | "active",
    ingredients?: Array<any>,
    facilities?: Array<IFacilities>
}

export const warehouseInit:IWarehouse = {
    name: "",
    address: "",
    ownerId: localStorage.getItem("uid") || "",
    state: "inactive"
}