import React, {useEffect, useState} from 'react';
import ReturnPrevious from "../../../../components/ReturnPrevious/returnPrevious";
import useFetch from "../../../../Hooks/useFetch";
import { useParams} from "react-router-dom";
import IngredientList from "./IngredientList";
import IIngredient from "../../../../Interfaces/ingredient.interface";
import LoadingCover from "../../../../components/LoadingCover/loadingCover";

const Storage = () => {
    // Get the params such as whId (Warehouse id)
    const params = useParams();

    // For data fetch and recall
    const [fetchOptions, setFetchData] =
        useState({path:"/ingredients/", query: {warehouse: params.whId}, reFetch: false, isNotify: false});
    let {data, isLoading} = useFetch(fetchOptions);
    const rerender = () => {
        setFetchData((prev) => ({...prev, reFetch: !prev.reFetch}))
    };
    // Ingredients list that fetched
    const [ingredients, setIngredients] = useState<Array<IIngredient>>([]);
    useEffect(()=>{
        if (data != null) {
        // @ts-ignore data that fetch can't be predictable right now ;-;
            setIngredients(data.ingredients)
        }
    }, [fetchOptions,data])

    return (
        <>
        <LoadingCover visible={isLoading} />
        <div className={"py-6 px-4"}>
            <ReturnPrevious/>
            <h1>Storage management</h1>
            <hr className={"mb-10 mt-2"}/>
            <IngredientList rerender={rerender} ingredients={ingredients}/>
        </div>
        </>
    );
};

export default Storage;