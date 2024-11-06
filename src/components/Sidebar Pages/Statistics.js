import { useSelector } from "react-redux";
import { selectorders } from "../../StoreRedux/orderSlice";
import {selectproducts} from "../../StoreRedux/productSlice";

const Statistics = () => {
  const storeOrders = useSelector(selectorders);
const StoreProducts=useSelector(selectproducts)
const productIcons = {
  hotmeal: "/fried-rice.png",
  desert: "/cake.png",
  breakfast: "/breakfast.png",
  salad: "/salad.png",
  // Add more icons for additional product types
};

const productColors = {
  hotmeal: "green-600",
  desert: "yellow-500",
  breakfast: "red-600",
  salad: "blue-600",
  // Define colors for additional product types
};
console.log("stats products===>",StoreProducts);
  return (
    <div>
      <h2 className="text-3xl font-bold mt-8 mb-5 text-purple-900 sm:text-4xl">
       Products Stats
      </h2>
      <hr></hr>
      <h1 className="text-lg font-bold font-serif my-2 underline text-purple-700">Products</h1>
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
       
      <div className="w-full mt-2 grid grid-cols-2 gap-3 px-6">
    {StoreProducts &&
      [...new Set(StoreProducts.map((item) => item.producttype))].map((type) => {
        const productCount = StoreProducts.filter(
          (item) => item.producttype === type && !item.status
        ).length;

        if (productCount === 0) return null;

        return (
          <div
            key={type}
            className="flex my-4 items-center col-span-2 md:col-span-1 px-5 py-6 shadow-lg rounded-md bg-slate-300"
          >
            <div className=" rounded-full bg-blue-500 p-4  bg-opacity-75">
             <img src='/dairy.png' alt="product" className="h-12 w-12"/>
            </div>
            <div className="mx-5">
              <h4 className="text-2xl font-semibold text-blue-600">
                {productCount}
              </h4>
              <div className="text-pink-500 underline">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </div>
          </div>
        );
      })}
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
