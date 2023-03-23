import React from 'react';
import {Chip} from "@mui/material";
import {HiCheck, HiCurrencyDollar, HiXCircle} from "react-icons/hi";

export type FoodDetailProps = {
    food?: {
        name: string,
        id: string,
        price: string,
        sale_price: string,
        description: string | null,
        state: string,
        img: string | undefined,
        category: string
    }
}
const FoodDetails = (props: FoodDetailProps) => {
    const food = props.food

    const ChipMapping = ({state}: { state: string })=>{
        switch (state) {
            case "available":
                return <Chip className={"w-fit capitalize"} sx={{paddingInline: "0.5rem"}} icon={<HiCheck />} color="success" label={state}/>
            case "onsale":
                return <Chip className={"w-fit capitalize"}  sx={{paddingInline: "0.5rem"}} icon={<HiCurrencyDollar />} color="primary" label={state}/>
            case "unavailable":
                return <Chip className={"w-fit capitalize"} sx={{paddingInline: "0.5rem"}} icon={<HiXCircle />} color="error" label={state}/>
        }
        return <Chip icon={<HiXCircle />} sx={{paddingInline: "0.5rem"}} color="error" label={"Unknown"}/>
    }

    return (food ?
        <div className={"relative flex flex-col gap-4 max-w-[30vw] mt-4"}>
            <div>
                <ChipMapping state={food.state}></ChipMapping>
                <Chip variant={"outlined"} sx={{paddingInline: "0.5rem"}} label={food.category} className={"ml-2 w-fit capitalize"}/>
            </div>
            <img src={food.img} alt={food.name} className={"md:w-[50%] object-cover self-center"}/>
            <p className={"text-center text-gray-600"}>{food.id}</p>
            <p><b>Name</b> : {food.name}</p>
            <p><b>Price</b> : {food.price}đ</p>
            {food.state === "onsale" && <p><b>Sale price</b> : {food.sale_price}đ</p>}
            {food.description && <p><b>Description</b> : {food.description}</p>}
        </div>
            :
        <></>
    );
};

export default FoodDetails;