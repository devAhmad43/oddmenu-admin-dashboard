import { combineReducers } from "redux";
import adminReducer from './adminSlice';
import orderReducer from "./orderSlice"
import productReducer from "./productSlice"
const rootReducer = combineReducers({
  admin: adminReducer,
  order:orderReducer,
  product:productReducer,
});
export default rootReducer;