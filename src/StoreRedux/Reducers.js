import { combineReducers } from "redux";
import adminReducer from './adminSlice';
import orderReducer from "./orderSlice"
import productReducer from "./productSlice"
import themeReducer from './themeSlice'
const rootReducer = combineReducers({
  admin: adminReducer,
  order:orderReducer,
  product:productReducer,
  theme:themeReducer
});
export default rootReducer;