import KioskBoard from 'kioskboard';
import {useEffect, useRef, useState} from "react";
import 'kioskboard/dist/kioskboard-keys-english.json'
import {motion} from "framer-motion"
import {useDispatch, useSelector} from "react-redux";
import {clearCart, depositedCart, selectCart} from "../../../../store/reducers/cartReducers.ts";
import LoadingCover from "../../../../components/LoadingCover/loadingCover.tsx";
import useFetch, {fetchProps} from "../../../../Hooks/useFetch.ts";

const PayInCash = () => {
    const cart = useSelector(selectCart)
    const inputReceiveRef = useRef<HTMLInputElement>()


    const dispatch = useDispatch()
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
  autoScroll: true,

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
      dispatch(depositedCart(parseFloat(inputReceiveRef?.current?.value) || 0))
      inputReceiveRef.current.value = "";
  },

  // The Enter key can close and remove the keyboard. Prevented when "false"
  keysEnterCanClose: true,
});
    }, [dispatch, inputReceiveRef])

    const [fetchProps, setFetch] = useState<fetchProps>({
        method: "get",
        path: "",
        fetchFor: "connect"
    })
    const {data, isLoading, isError} = useFetch(fetchProps);


    const confirmHandler = ()=> {
        setFetch({
            method: "post",
            path: "/sale/cart",
            fetchFor: "checkout",
            sendData: {
                foods: cart.items,
                cartId: cart.id,
                paymentMethod: cart.paymentMethod
            }
        })

        if (!isError) dispatch(clearCart())
    }

    return (
        <motion.div
            className={"flex-col gap-4 flex-grow relative"}
            animate={{
                visibility: cart.state == "checkout" ? "visible" : "hidden",
                opacity: cart.state == "checkout" ? 1 : 0,
                display: cart.state =="checkout" ? "flex" : "none"
        }}>
            <LoadingCover visible={isLoading}/>
            <motion.div
                className={"bg-white p-6 shadow transition-all h-fit border border-sky-100"}
            >
                <h3>Receive</h3>
                <input className="mt-2 w-full border border-sky-200 p-4 text-xl" data-kioskboard-type="numpad" data-kioskboard-placement="bottom"
                       type={"number"}
                        placeholder="Receive"
                       ref={inputReceiveRef}
                />
            </motion.div>
            <motion.div className={"flex flex-col justify-between p-6 bg-white shadow border-2 border-sky-200"}>
                <div>
                    <div className={"flex justify-between gap-2"}>
                        <h2>Received</h2>
                        <p className={"text-xl"}>{cart.deposited.toLocaleString(undefined, {minimumFractionDigits: 2})} VND</p>
                    </div>
                    {cart.deposited > cart.subtotal && <div className={"flex justify-between gap-2"}>
                        <h3>Change</h3>
                        <p className={"text-xl"}>{(cart.subtotal - cart.deposited).toLocaleString(undefined, {minimumFractionDigits: 2})} VND</p>
                    </div>}
                    {
                        cart.deposited < cart.subtotal &&
                        <div className={"flex justify-between gap-2"}>
                            <h3>Remaining</h3>
                            <p className={"text-xl"}>{(cart.subtotal - cart.deposited).toLocaleString(undefined, {minimumFractionDigits: 2})} VND</p>
                        </div>
                    }

                    {
                        cart.deposited >= cart.subtotal && (
                            <button className={"mt-10 w-full bg-blue-100 hover:bg-blue-900 hover:text-white text-blue-900 p-3 rounded text-xl transition-all"}
                                onClick={confirmHandler}
                            >
                                Confirm Paid
                            </button>
                        )
                    }
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PayInCash;