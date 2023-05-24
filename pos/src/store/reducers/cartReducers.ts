import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import type { RootState } from '../'
import IFood from "../../interfaces/foodInterface.ts";
import axios from "axios";
import env from "../../env.ts";
import {isElement} from "react-dom/test-utils";

// Define a type for the slice state
interface ICart {
    id?: string,
    items: Array<IFood>,
    isEmpty: boolean,
    subtotal: number,
    // When cart is empty : Ready -> cart is using : Pending -> cart is checking out : Checkout -> finish checkout or cancel : Ready
    state: "ready" | "pending" | "checkout",
    paymentMethod?: "cash" | "card" | "qr",
    deposited: number
}

// Define the initial state using that type
const initialState: ICart = {
  id: '',
  items: [],
  isEmpty: true,
  subtotal: 0,
  state: "ready",
  deposited: 0,
}

const subTotalCalc = (items:Array<IFood>) => {
  return items.reduce((val, item) => val += item.amount * item.sale_price, 0)
}

export const cartSplice = createSlice({
  name: 'cart',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existedItem = state.items.findIndex((item)=>item.id == action.payload.id)
      if (existedItem == -1) state.items.push({...action.payload, amount: 1})
      else state.items[existedItem].amount += 1;
      state.subtotal += parseFloat(action.payload.sale_price)
      state.state = "pending"
      state.isEmpty = false
    },
    removeItem: (state, action:{payload: number, type:string}) => {
    //   Remove base on position
      state.subtotal -= state.items[action.payload].sale_price
      state.items.splice(action.payload, 1)

      if (state.items.length == 0) {
        state.isEmpty = true
        state.state = "ready"
      }
    },
    // for update new amount
    updateItem: (state, action:{payload:{id: string, amount: number}, type:string}) => {
      const existedItem = state.items.findIndex((item)=>item.id == action.payload.id)
      if (action.payload.amount > 0) state.items[existedItem].amount = action.payload.amount
      if (action.payload.amount == 0) state.items.splice(existedItem, 1)
      state.subtotal = subTotalCalc(state.items)
    },
    newCart: (state, action)=>{
      state.id = action.payload
    },
    clearCart: (state) => {
      state.id = undefined
      state.state = "ready"
      state.items = []
      state.paymentMethod = undefined
      state.isEmpty = true
      state.subtotal = 0
      state.deposited = 0
    },
    checkoutCart: (state, action: {payload: ICart["paymentMethod"], type:string}) => {
      state.state = "checkout";
      state.paymentMethod = action.payload
    },
    depositedCart: (state, action:{payload: number, type: "number"})=>{
      state.deposited += action.payload
    },
    pendingCart: (state)=>{
      state.state = "pending"
    }
  },
})

export const { addItem, removeItem,depositedCart, pendingCart,newCart, updateItem, clearCart, checkoutCart } = cartSplice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCart = (state: RootState) => state.cart
export default cartSplice.reducer