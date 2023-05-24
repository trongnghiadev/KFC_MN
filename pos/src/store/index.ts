import { configureStore } from '@reduxjs/toolkit'
import cartReducers from "./reducers/cartReducers.ts";
const store = configureStore({
  reducer: {
    cart: cartReducers
  },
})
export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch