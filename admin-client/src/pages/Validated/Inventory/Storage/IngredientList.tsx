import React, {useState} from 'react';
import IIngredient, {demoIngredient, initIngredient} from "../../../../Interfaces/ingredient.interface";
import IngredientItem from "./ingredientItem";
import NoDataFound from "../../../../components/NoDataFound/noDataFound";
import {Button} from "@mui/material";
import IngredientEdit from "./ingredientEdit";
import useFetch from "../../../../Hooks/useFetch";
import ingredientItem from "./ingredientItem";

export type ingredientListProps = {
    ingredients: Array<IIngredient>,
    rerender: Function
}

function IngredientList(props: ingredientListProps) {

    // Props getters
    const {ingredients, rerender} = props
    // Modal controller
    const [modalController, updateModalController] = useState({
        addModal: false,
        editModal: false,
        selected: initIngredient
    })
    const modalCloseHandler = ()=>{
        updateModalController({addModal: false, editModal: false, selected: initIngredient})
        rerender();
    }

    // Are there any modal that opening ?
    const isEditModalOpen = modalController.addModal || modalController.editModal
    return (
        <>
            {isEditModalOpen && <IngredientEdit
                isOpen={isEditModalOpen}
                ingredient={modalController.selected}
                rerender={rerender} isUpdate={modalController.editModal}
                closeHandler={modalCloseHandler}
            />}
            <div className={"flex flex-row gap-2 justify-end w-full mb-4"}>
                <Button variant={"contained"} color={"primary"} className={""}
                        onClick={()=> {
                            updateModalController((prev) => ({...prev, addModal: true, selected: initIngredient}))
                        }}
                >
                    + Add
                </Button>
            </div>
            {
                ingredients.length == 0 && <NoDataFound title={"There is no ingredients"} addHandler={()=>updateModalController((prev) => ({...prev, addModal: true, selected: initIngredient}))}/>
            }{
                ingredients.length > 0 &&
            <div className={"grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"}>
                {
                    ingredients.map ((ingredient:IIngredient) =>
                        <IngredientItem
                            onClick={()=>
                                updateModalController((prev) =>
                                    ({...prev, editModal: true, selected: ingredient}))}
                            key={ingredient.id}
                            item={ingredient} />)
                }
            </div>
        }
        </>
    );
}

export default IngredientList;