import {motion} from 'framer-motion'
import useFetch from "../../../../Hooks/useFetch.ts";
import {useEffect, useState} from "react";
import NoDataFound from "../../../../components/NoDataFound/noDataFound.tsx";
import LoadingCover from "../../../../components/LoadingCover/loadingCover.tsx";
import {useDispatch, useSelector} from "react-redux";
import IFood from "../../../../interfaces/foodInterface.ts";
import {addItem, newCart, selectCart} from "../../../../store/reducers/cartReducers.ts";
import env from "../../../../env.ts";
import axios from "axios";

const FoodItem = (props) => {
    const {item, itemClickHandler} = props
    return (
        <motion.div
            onClick={itemClickHandler}
            className={"p-3 border w-full cursor-pointer bg-sky-100 h-fit rounded hover:bg-white hover:shadow-xl transition-all"}>
            <p className={"text-sky-700 mb-3"}>Order &rarr; Kitchen</p>
            <p className={"text-xl"}>{item.name}</p>
            <p className={"text-emerald-700 mb-4"}>{item.sale_price} VND</p>
            <p className={"text-right"}>{item.category}</p>
        </motion.div>
    )
}

export interface foodListProps {
    filter: string,
    categories: Array<{name:string, label: string}>
}

const FoodList = (props: foodListProps) => {
    const {filter, categories} = props
    const dispatch = useDispatch()
    const cart = useSelector(selectCart)

    const {data, isLoading: dataFetchLoading} = useFetch({
        method: "get",
        path: filter !== 'none' ? "/foods/category/" + filter : "/foods",
        isNotify: false,
        fetchFor: "get foods list"
    })

    const [addItemLoading, setItemLoading] = useState(false)

    const isLoading = dataFetchLoading || addItemLoading

    const [foods, setFoods] = useState<Array<IFood>>([])

    useEffect(()=>{
        if (data != null) setFoods(filter != 'none' ? data.categoryDetail?.foods : data?.foods)
    }, [filter, data])

    const addNewItemToCart = (item:IFood)=>{
        setItemLoading(true)
        if (cart.isEmpty) (async()=>{
            const res = await axios.get(env.serverUrl + "/sale/cart")
            dispatch(newCart(res.data.cartId))
            dispatch(addItem(item))
            setItemLoading(false)
        })()
        else {
            dispatch(addItem(item))
            setItemLoading(false)
        }
    }

    return (
        <>
            <LoadingCover visible={isLoading}/>
            {foods?.length > 0 && <div className={"grid grid-cols-3 h-[50%] overflow-y-scroll gap-4"}>
                {foods?.map((food:IFood, i) => {
                    food.category = categories.find((cat)=>cat.name == food.category)?.label || food.category
                    return <FoodItem
                        itemClickHandler={()=>addNewItemToCart(food)}
                        item={food} key={`food${i}`}/>
                })}
            </div>}
            {
                foods?.length == 0 && <NoDataFound title={"No item found"} />
            }
        </>
    );
};

export default FoodList;