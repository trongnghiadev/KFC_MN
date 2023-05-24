import React, {EventHandler} from 'react';
import IIngredient from "../../../../Interfaces/ingredient.interface";

export type ingredientItemProps = {
    item: IIngredient,
    onClick?: EventHandler<any>
}

function IngredientItem(props: ingredientItemProps) {
    const {item, onClick} = props

    return (
        <div onClick={onClick} className={"bg-white rounded p-4 relative transition-all cursor-pointer hover:drop-shadow-md hover:scale-[1.05]"}>
            <p className={"font-semibold"}>{item.name}</p>
            <p>Price: {item.cost}</p>
            <p>On hand: {item.stock} {item.unit != "the" ? item.unit : ""}</p>
            {item.stock <= 0 && <div className={"text-sm absolute top-0.5 right-0.5 bg-orange-700 text-white font-semibold p-0.5 px-1 rounded max-w-full"}>
                Out of stock
            </div>}
        </div>
    );
}

export default IngredientItem;