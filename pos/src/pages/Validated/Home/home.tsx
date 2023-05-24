import CategoryAndFood from "./Menu/categoryAndFood.tsx";
import Receipt from "./Receipt/receipt.tsx";
import PayInCash from "./Cashier/payInCash.tsx";

const Home = () => {
    return (
        <div className={"flex gap-4 py-4 h-full"}>
            <CategoryAndFood/>
            <Receipt/>
            <PayInCash/>
        </div>
    );
};

export default Home;