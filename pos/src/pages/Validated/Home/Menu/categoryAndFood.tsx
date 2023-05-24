import {useEffect, useState} from "react";
import useFetch from "../../../../Hooks/useFetch.ts";
import {CiDiscount1} from "react-icons/ci";
import {GiBottleCap, GiBowlOfRice, GiChipsBag, GiMeal, GiRoastChicken} from "react-icons/gi";
import {HiDotsHorizontal} from "react-icons/hi";
import {motion} from "framer-motion";
import {AiFillPushpin} from "react-icons/ai";
import FoodList from "./foodList.tsx";
import {useSelector} from "react-redux";
import {selectCart} from "../../../../store/reducers/cartReducers.ts";

const IconForCat = (props) => {
    const cat = props.cat
    switch (cat){
        case "New":
            return <CiDiscount1 className={"text-2xl mb-6"}/>
        case "Combo":
            return <GiMeal className={"text-2xl mb-6"}/>
        case "Group Combo":
            return <GiMeal className={"text-2xl mb-6"}/>
        case "Fry chicken":
            return <GiRoastChicken className={"text-2xl mb-6"}/>
        case "Carb":
            return <GiBowlOfRice className={"text-2xl mb-6"}/>
        case "Snack":
            return <GiChipsBag className={"text-2xl mb-6"}/>
        case "Dessert & Drink":
            return <GiBottleCap className={"text-2xl mb-6"}/>
        default:
            return <HiDotsHorizontal className={"text-2xl mb-6"}/>
    }
}

const Category = (props) => {
    const {cat, itemClickHandler, current} = props

    const [catDetail, setCatDetail] = useState<{ foods: Array<unknown>, count: number}>()

    const {data} = useFetch({
        method: "get",
        path: "/foods/category/" + cat.name,
        isNotify: false
    })

    useEffect(()=> {
        if (data != null) setCatDetail(data.categoryDetail)
    }, [data])

    return(
    <div className={"p-4 border bg-white hover:shadow-xl transition-all cursor-pointer relative"}
        onClick={itemClickHandler}
    >
        <IconForCat cat={cat.label}/>
        <h3>{cat.label}</h3>
        {catDetail && <p className={"text-[#c3c3c3]"}> {catDetail.count} items</p>}
        <motion.div
            animate={{
                opacity: cat.name == current ? "1" : "0"
            }}
            className={"absolute top-2 right-2 text-xl transition-all"}>
            <AiFillPushpin/>
        </motion.div>
    </div>
)}

const CategoryAndFood = () => {
    const cart = useSelector(selectCart)
    const [categories, setCategories] = useState<Array<{ name: string, label: string }>>([])
    const {data} = useFetch({
        method: "get",
        path: "/foods/categories",
        isNotify: false
    })

    useEffect(()=>{
        if(data != null) setCategories(data.categoriesWithLabel)
    }, [data])

    const [foodFilter, setFoodFilter] = useState<string>('none')

    const catQuery = (cat:string) => {
        const filter = cat
        if (filter == foodFilter) setFoodFilter('none')
        else setFoodFilter(filter)
    }

    return (
        <motion.div className={"h-screen transition-all"}
            animate={{width: cart.state !== "checkout" ? "100%" : "0px",
                opacity: cart.state !== "checkout" ? "1" : "0",
                display: cart.state !== "checkout" ? "block" : "none"
            }}
        >
            <div className={"grid rounded grid-cols-4 gap-2 mb-3 h-[45%] overflow-y-scroll"}>
                {categories.map((cat)=> <Category key={cat.name} cat={cat}
                    itemClickHandler={()=>catQuery(cat.name)}
                    current={foodFilter}
                />)}
            </div>
            <FoodList filter={foodFilter} categories={categories}/>
        </motion.div>
    );
};

export default CategoryAndFood;