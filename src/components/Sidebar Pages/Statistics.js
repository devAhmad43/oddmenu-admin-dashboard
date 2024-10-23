import { useSelector } from "react-redux";
import { selectorders } from "../../StoreRedux/orderSlice";
import {selectproducts} from "../../StoreRedux/productSlice";

const Statistics = () => {
  const storeOrders = useSelector(selectorders);
const StoreProducts=useSelector(selectproducts)
console.log("stats products===>",StoreProducts);
  return (
    <div>
      <h2 className="text-3xl font-bold mt-8 mb-5 text-gray-900 sm:text-4xl">
       Products Stats
      </h2>

     
      <hr></hr>
      <h1 className="text-lg font-bold font-serif my-2 underline text-yellow-400">Products</h1>
      <div className="w-full  grid grid-cols-1 gap-3 px-6 ">
        {StoreProducts &&
          <div className="flex col-span-1 items-center px-5 my-5 py-6 shadow-sm rounded-md bg-slate-300">

            <div className="p-1 rounded-full bg-purple-600 bg-opacity-75">

              <img className="h-10 w-10 m-3 " src="/allcards.png" alt="blogsitems" />

            </div>

            <div className="mx-5">
              <h4 className="text-2xl font-semibold text-purple-700">
              {StoreProducts.filter((item)=> item.status===false).length}
              </h4>
              <div className="text-purple-500">Total Store Products</div>
            </div>
          </div>}
      </div>
       
      <div className="w-full  grid grid-cols-1 gap-3 px-6 ">
        {StoreProducts &&
          <div className="flex col-span-1 items-center px-5 my-5 py-6 shadow-sm rounded-md bg-slate-300">

            <div className="p-1 rounded-full bg-pink-500 bg-opacity-75">

              <img className="h-10 w-10 m-3 " src="/allcards.png" alt="blogsitems" />

            </div>

            <div className="mx-5">
              <h4 className="text-2xl font-semibold text-pink-500">
                {StoreProducts.filter((item)=> item.status===true).length}
              </h4>
              <div className="text-pink-500">Total Sold Out Products</div>
            </div>
          </div>}
      </div>
       
      <div className="w-full mt-2  grid grid-cols-2 gap-3 px-6 ">
        {StoreProducts &&
          <div className="flex my-4 items-center col-span-2 md:col-span-1 px-5 py-6 shadow-lg rounded-md bg-slate-300">
            <div className="p-2 rounded-full bg-green-600 bg-opacity-75">
            <img className="h-10 w-10 m-3 " src="/fried-rice.png" alt="blogsitems" />
            </div>

            <div className="mx-5">
              <h4 className="text-2xl font-semibold text-green-600">
                {StoreProducts.filter((item)=>item.producttype === "hotmeal"  && !item.status).length}
              </h4>
              <div className="text-green-600">Hot Meals</div>
            </div>
          </div>}
          <div className="flex my-4 items-center col-span-2  md:col-span-1 px-5 py-6 shadow-lg rounded-md bg-slate-300">
          <div className="p-2 rounded-full bg-yellow-300 bg-opacity-75">
          <img className="h-10 w-10 m-3 " src="/cake.png" alt="desert" />

          </div>

          <div className="mx-5">
            <h4 className="text-2xl font-semibold text-yellow-500">
            {StoreProducts?.filter((item)=>item?.producttype === "desert" && !item.status).length}
            </h4>
            <div className="text-yellow-500">Desert</div>
          </div>
        </div>

        <div className="flex my-4 items-center col-span-2  md:col-span-1 px-5 py-6 shadow-lg rounded-md bg-slate-300">
          <div className="p-2 rounded-full bg-red-600 bg-opacity-75">
          <img className="h-10 w-10 m-3 " src="/breakfast.png" alt="breakfast" />

          </div>

          <div className="mx-5">
            <h4 className="text-2xl font-semibold text-red-600">
            {StoreProducts?.filter((item)=>item?.producttype === "breakfast" && !item.status).length}
            </h4>
            <div className="text-red-500">BreakFast</div>
          </div>
        </div>
        <div className="flex my-4 items-center col-span-2  md:col-span-1 px-5 py-6 shadow-lg rounded-md bg-slate-300">
          <div className="p-2 rounded-full bg-blue-500 bg-opacity-75">
          <img className="h-10 w-10 m-2 " src="/salad.png" alt="salad" />

          </div>

          <div className="mx-5">
            <h4 className="text-2xl font-semibold text-blue-600">
            {StoreProducts?.filter((item)=>item?.producttype === "salad" && !item.status).length}
            </h4>
            <div className="text-blue-500">Salad</div>
          </div>
        </div>
      </div> 

      <h1 className="text-lg font-bold font-serif text-purple-500 underline my-2">Orders</h1>
      <div className="w-full  grid grid-cols-1 gap-3 px-6 ">
        {storeOrders &&
          <div className="flex col-span-1 items-center px-5 my-5 py-6 shadow-sm rounded-md bg-slate-300">

            <div className="p-1 rounded-full bg-purple-600 bg-opacity-75">

              <img className="h-10 w-10 m-3 " src="/order.png" alt="orderitems" />

            </div>

            <div className="mx-5">
              <h4 className="text-2xl font-semibold text-purple-600">
              {storeOrders.length}
              </h4>
              <div className="text-purple-500">Total Orders</div>
            </div>
          </div>}
      </div>


             
      <div className="w-full mt-2  grid grid-cols-2 gap-3 px-6 ">
        {storeOrders &&
          <div className="flex my-4 items-center col-span-2 md:col-span-1 px-5 py-6 shadow-lg rounded-md bg-slate-300">
            <div className="p-2 rounded-full bg-green-600 bg-opacity-75">
            <img className="h-10 w-10 m-3 " src="/order.png" alt="blogsitems" />
            </div>

            <div className="mx-5">
              <h4 className="text-2xl font-semibold text-green-600">
                {storeOrders.filter((item)=>  item.status).length}
              </h4>
              <div className="text-green-500">Completed</div>
            </div>
          </div>}


        <div className="flex my-4 items-center col-span-2  md:col-span-1 px-5 py-6 shadow-lg rounded-md bg-slate-300">
          <div className="p-2 rounded-full bg-red-600 bg-opacity-75">
          <img className="h-10 w-10 m-3 " src="/order.png" alt="blogsitems" />

          </div>

          <div className="mx-5">
            <h4 className="text-2xl font-semibold text-red-600">
            {storeOrders.filter((item)=> !item.status).length}
            </h4>
            <div className="text-red-500">Pending</div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Statistics;
