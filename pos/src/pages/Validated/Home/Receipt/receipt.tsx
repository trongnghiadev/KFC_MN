import {useDispatch, useSelector} from "react-redux";
import {
    checkoutCart,
    clearCart,
    depositedCart,
    pendingCart,
    removeItem,
    selectCart, updateItem
} from "../../../../store/reducers/cartReducers.ts";
import 'kioskboard/dist/kioskboard-keys-english.json'
import {motion} from "framer-motion";
import IFood from "../../../../interfaces/foodInterface.ts";
import {BsCashCoin, BsFillCreditCard2FrontFill, BsQrCodeScan} from "react-icons/bs";
import {EventHandler, useEffect, useRef, useState} from "react";
import {FiDelete, FiEdit} from "react-icons/fi";
import axios from "axios";
import env from "../../../../env.ts";
import KioskBoard from "kioskboard";
import {Button} from "@mui/material";
import _default from "@mui/material/styles/identifier";

interface foodItemReceiptRenderProp {index: number, item: IFood}

const EditModal = (props : {item: foodItemReceiptRenderProp["item"], visible: boolean, closeFn: EventHandler<never> }) => {
    const {item, visible, closeFn} = props

    const dispatch = useDispatch()

    const [nInput, setNInput] = useState<number>(item.amount)

    const inputReceiveRef = useRef<HTMLInputElement>()
    useEffect(()=>{
        if (inputReceiveRef.current) KioskBoard.run(inputReceiveRef.current, {
  /*!
  * Required
  * An Array of Objects has to be defined for the custom keys. Hint: Each object creates a row element (HTML) on the keyboard.
  * e.g. [{"key":"value"}, {"key":"value"}] => [{"0":"A","1":"B","2":"C"}, {"0":"D","1":"E","2":"F"}]
  */
  keysArrayOfObjects: null,

  /*!
  * Required only if "keysArrayOfObjects" is "null".
  * The path of the "kioskboard-keys-${langugage}.json" file must be set to the "keysJsonUrl" option. (XMLHttpRequest to get the keys from JSON file.)
  * e.g. '/Content/Plugins/KioskBoard/dist/kioskboard-keys-english.json'
  */
  keysJsonUrl: "node_modules/kioskboard/dist/kioskboard-keys-english.json",

  /*
  * Optional: An Array of Strings can be set to override the built-in special characters.
  * e.g. ["#", "€", "%", "+", "-", "*"]
  */
  keysSpecialCharsArrayOfStrings: null,

  /*
  * Optional: An Array of Numbers can be set to override the built-in numpad keys. (From 0 to 9, in any order.)
  * e.g. [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  */
  keysNumpadArrayOfNumbers: null,

  // Optional: (Other Options)

  // Language Code (ISO 639-1) for custom keys (for language support) => e.g. "de" || "en" || "fr" || "hu" || "tr" etc...
  language: 'en',

  // The theme of keyboard => "light" || "dark" || "flat" || "material" || "oldschool"
  theme: 'light',

  // Scrolls the document to the top or bottom(by the placement option) of the input/textarea element. Prevented when "false"
  autoScroll: false,

  // Uppercase or lowercase to start. Uppercased when "true"
  capsLockActive: true,

  /*
  * Allow or prevent real/physical keyboard usage. Prevented when "false"
  * In addition, the "allowMobileKeyboard" option must be "true" as well, if the real/physical keyboard has wanted to be used.
  */
  allowRealKeyboard: true,

  // Allow or prevent mobile keyboard usage. Prevented when "false"
  allowMobileKeyboard: false,

  // CSS animations for opening or closing the keyboard
  cssAnimations: true,

  // CSS animations duration as millisecond
  cssAnimationsDuration: 360,

  // CSS animations style for opening or closing the keyboard => "slide" || "fade"
  cssAnimationsStyle: 'slide',

  // Enable or Disable Spacebar functionality on the keyboard. The Spacebar will be passive when "false"
  keysAllowSpacebar: false,

  // Text of the space key (Spacebar). Without text => " "
  keysSpacebarText: 'Space',

  // Font family of the keys
  keysFontFamily: 'sans-serif',

  // Font size of the keys
  keysFontSize: '22px',

  // Font weight of the keys
  keysFontWeight: 'normal',

  // Size of the icon keys
  keysIconSize: '25px',

  // Text of the Enter key (Enter/Return). Without text => " "
  keysEnterText: 'Enter',

  // The callback function of the Enter key. This function will be called when the enter key has been clicked.
  keysEnterCallback: ()=> {
      setNInput(parseFloat(inputReceiveRef?.current?.value) || 0)
      inputReceiveRef.current.value = "0";
  },
  // The Enter key can close and remove the keyboard. Prevented when "false"
  keysEnterCanClose: true,
});
    }, [inputReceiveRef])

    return (
        <motion.div className={"fixed left-0 p-4 top-0 transition-all w-screen h-screen overflow-hidden bg-gray-700/50 "}
            animate={{opacity: visible ? 1 : 0, display: visible ? "flex" : "none"}}
        >
            <div className={"bg-white p-6 rounded md:w-[30vw] min-w-fit w-full absolute left-1/3 top-[2rem]"} onClick={(e)=>e.stopPropagation()}>
                <p className={"text-xl font-medium"}>Change amount of</p>
                <h2 className={"mb-2 text-2xl"}>{item.name}</h2>
                <hr/>
                <div className={"grid grid-cols-2 w-full gap-4 mt-6"}>
                    <div >
                        <h2>From</h2>
                        <input value={item.amount} className={"border border-sky-800 rounded p-4 text-xl"} disabled={true}/>
                    </div>
                    <div >
                        <h2>To</h2>
                        <input
                            value={nInput}
                            type={"number"}
                             data-kioskboard-type="numpad" data-kioskboard-placement="bottom"
                            className={"border border-sky-800 rounded p-4 text-xl"}
                            ref={inputReceiveRef}
                            placeholder={"Change to"}
                        />
                    </div>
                </div>
                <div className={"flex justify-end gap-4 mt-6"}>
                    <Button sx={{px: 4, py: 2}} variant={"outlined"} className={"p-6"}
                        onClick={closeFn}
                    >Cancel</Button>
                    <Button sx={{px: 4, py: 2}} variant={"contained"} className={"p-6"}
                        disabled={nInput == item.amount}
                        onClick={(e)=>{
                            dispatch(updateItem({id: item.id, amount: nInput}))
                            let a:never;
                            closeFn(a)
                        }}
                    >Confirm</Button>
                </div>

            </div>
        </motion.div>
    )
}

const FoodItem = (props: foodItemReceiptRenderProp) => {
    const dispatch = useDispatch()
    const {index, item} = props

    const [isShowFn, showFn] = useState(false)

    const [openEdit, setOpenEdit] = useState(false)
    return (
        <>
        <EditModal item={item} visible={openEdit} closeFn={()=>setOpenEdit(false)}/>
        <div className={"flex"}>
            <motion.div
                onClick={()=>{showFn(prev => !prev)}}
                animate={{borderRadius: !isShowFn ? ["4px", "4px", "4px", "4px"] : ["0px", "4px", "4px", "0px"]}}
                className={"flex flex-row gap-2 justify-between w-full py-4 bg-sky-50 pr-4 pl-2 transition-all border border-sky-50 hover:border-sky-400 active:border-sky-600 active:border-[2px]"}>
                <div className={"flex flex-row gap-2 "}>
                    <div className={"rounded-full text-sky-700 text-sm font-semibold flex justify-center w-[30px] aspect-square items-center bg-blue-200"}>{index}</div>
                    <div className={"font-semibold text-md"}>{item.name}</div>
                    <div className={"font-semibold text-md text-sky-600"}>x{item.amount}</div>
                </div>
                <p>{(item.sale_price*item.amount).toLocaleString(undefined, {minimumFractionDigits: 2})} VND</p>
            </motion.div>

            <motion.div className={"text-2xl cursor-pointer font-semibold text-right gap-4 h-full p-4 justify-center items-center bg-sky-600 hover:bg-sky-500 transition-all text-blue-100 hover:text-white"}
                animate={{opacity: isShowFn ? "1" : "0", widths: isShowFn ? "unset" : "0px", display: isShowFn ? "flex" : "none"}}
                onClick={()=> {
                    setOpenEdit(true)
                }}
            >
                <FiEdit/>
            </motion.div>

            <motion.div className={"text-2xl cursor-pointer font-semibold text-right gap-4 h-full p-4 justify-center items-center bg-red-600 hover:bg-red-500 transition-all rounded-r text-blue-100 hover:text-white"}
                animate={{opacity: isShowFn ? "1" : "0", widths: isShowFn ? "unset" : "0px", display: isShowFn ? "flex" : "none"}}
                onClick={()=> {
                    dispatch(removeItem(index-1))
                }}
            >
                <FiDelete/>
            </motion.div>
        </div>
        </>
    )
}

const Receipt = () => {
    const cart = useSelector(selectCart)
    const dispatch = useDispatch()
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "qr">("cash")

    const cancelHandler = ()=>{
        axios.head(env.serverUrl + "/sale/cart/" + cart.id, {
            params: {action: "cancel"}
        }).then()
        dispatch(clearCart())
    }

    return (
        <motion.div className={"bg-white h-full flex-col justify-between sticky top-0 pt-4 transition-all rounded border shadow-xl"}
            animate={{width: cart.state == "ready" ? "0" : "40vw", opacity: cart.state == "ready" ? "0" : "1", display: cart.state == "ready" ? "none" : "flex"}}
        >
            <div className={"receipt-top flex-grow-0 flex flex-col gap-4 h-[65%] relative px-2"}>
                <h2 className={"text-center"}>Receipt</h2>
                <hr/>
                <motion.div className={"flex flex-col gap-2 overflow-y-scroll h-[90%] px-2 py-4"}>
                    {
                        !cart.isEmpty && cart.items.map((food, i)=>(<FoodItem key={"receiptItem"+i} index={i+1} item={food}/>))
                    }
                </motion.div>
                <hr/>
            </div>

            <div className={"receipt-bottom flex flex-col justify-between flex-grow"}>
                <div className={"my-4 px-4"}>
                    <div className={"flex justify-between px-2"}>
                        <p className={"text-xl"}>Subtotal</p>
                        <p className={"text-xl"}>{(cart.subtotal).toLocaleString(undefined, {minimumFractionDigits: 2})} VND</p>
                    </div>
                    <div className={"flex justify-between px-2"}>
                        <p className={"text-2xl"}>Total</p>
                        <p className={"text-2xl font-semibold"}>{(cart.subtotal).toLocaleString(undefined, {minimumFractionDigits: 2})} VND</p>
                    </div>
                </div>
                <div className={"payment bg-blue-700 p-6 text-white rounded-b"}>
                    <em>Payment method</em>
                    <div className={"grid-cols-3 grid gap-2 text-xl my-2"}>
                        <div
                            className={"cursor-pointer"}
                            onClick={()=>setPaymentMethod("cash")}>
                            <div className={`p-3 flex-all-center rounded border-white border hover:bg-blue-50 hover:text-blue-400 transition-all ${paymentMethod == "cash" ? " bg-white text-blue-500 " : " "}`}>
                                <BsCashCoin/>
                            </div>
                            <motion.p className={"text-sm text-center"}
                                animate={{textDecoration: paymentMethod == "cash" ? "underline" : "none", fontWeight: paymentMethod == "cash" ? 600 : 300}}
                            >Cash</motion.p>
                        </div>
                        <div
                            className={"cursor-pointer"}
                            onClick={()=>setPaymentMethod("card")}>
                            <div className={`p-3 flex-all-center rounded border-white border hover:bg-blue-50 hover:text-blue-400 transition-all ${paymentMethod == "card" ? " bg-white text-blue-500 " : " "}`}>
                                <BsFillCreditCard2FrontFill/>
                            </div>
                            <motion.p className={"text-sm text-center"}
                                animate={{textDecoration: paymentMethod == "card" ? "underline" : "none", fontWeight: paymentMethod == "card" ? 600 : 300}}
                            >Card</motion.p>
                        </div>
                        <div
                            className={"cursor-pointer"}
                            onClick={()=>setPaymentMethod("qr")}>
                            <div className={`p-3 flex-all-center rounded border-white border hover:bg-blue-50 hover:text-blue-400 transition-all ${paymentMethod == "qr" ? " bg-white text-blue-500 " : " "}`}>
                                <BsQrCodeScan/>
                            </div>
                            <motion.p className={"text-sm text-center"}
                                animate={{textDecoration: paymentMethod == "qr" ? "underline" : "none", fontWeight: paymentMethod == "qr" ? 600 : 300}}
                            >E-Wallet</motion.p>
                        </div>
                    </div>
                    <div className={"transition-all flex gap-4"}>
                        <motion.button
                            animate={{width: cart.state == "checkout" ? "0" : "100%", display: cart.state == "checkout" ? "none" : "block", opacity: cart.state == "checkout" ? "0" : "1"}}
                            onClick={cancelHandler}
                            className={"bg-amber-100 hover:bg-white text-amber-900 p-3 mt-2 rounded text-xl transition-all"}>
                            Cancel
                        </motion.button>

                        <button
                            onClick={()=> {
                                if(cart.state == "pending") dispatch(checkoutCart(paymentMethod))
                                if(cart.state == "checkout") dispatch(pendingCart())
                            }}
                            className={"w-full bg-blue-100 hover:bg-white text-blue-900 p-3 mt-2 rounded text-xl transition-all"}>
                            {cart.state == "checkout" ? "Return" : "Place order"}
                        </button>

                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default Receipt;