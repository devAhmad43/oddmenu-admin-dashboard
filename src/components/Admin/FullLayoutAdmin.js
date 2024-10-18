/* eslint-disable flowtype/require-valid-file-annotation */
import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Loader } from "../Loader/loader";
import axios from "axios";
import { serverUrl } from "../../config";
import { useDispatch, useSelector} from "react-redux";
 import { Addorder } from "../../StoreRedux/orderSlice";
import { toast } from "react-toastify";
import { Sidebar } from "../Sidebar Pages/SideBar";
import { Addproduct } from "../../StoreRedux/productSlice";
import {selectAdmin} from '../../StoreRedux/adminSlice'
export const AdminLayout = () => {
  const [loader, setloader] = useState(false);
  const dispatch = useDispatch();
const storeAdmin=useSelector(selectAdmin)
const id=storeAdmin._id
//// ////////  fetch products ////////////
useEffect(() => {
  const fetchProducts = async () => {

    try {
      const response = await axios.get(
        `${serverUrl}/api/product/getProducts/${id}`
      );
      if (response && response.status === 200) {
        setloader(false);
        console.log(response.data.finddata);
        dispatch(Addproduct(response.data.finddata));
        toast.success("Products fetch successfully");
      }
    } catch (error) {
      setloader(false);
      console.log(error);
      if (error.response) {
        toast.error("Failed to Fetch Products");
      } else {
        toast.error("Failed to Fetch Products");
        console.log("Failed to fetch Products")
      }
    }
  };

  fetchProducts();
  // eslint-disable-next-line
}, []);
  ///////////////////////////////fetch total orders////////////////////////////////////////////
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/order/getallorder`);
        if (response && response.status === 200) {
          setloader(false);
          dispatch(Addorder(response.data.data));
           toast.success("Orders fetched successfully");
        }
      } catch (error) {
        setloader(false);
        console.log(error);
        if (error.response) {
           toast.error("Failed to fetch orders");
        } else {
           toast.error("Failed to fetch orders");
          console.log("Failed to fetch orders");
        }
      }
    };

    fetchOrders(); // Call fetchOrders initially

    // Set interval to call fetchOrders every 2 minutes (120000 milliseconds)
    const intervalId = setInterval(fetchOrders, 120000);

    // Clean up function to clear interval on component unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [serverUrl, dispatch]); 
  return (
    <>
      <div className="antialiased bg-gray-100 dark:bg-white-600">
        <Sidebar />
        <main className="p-4 md:ml-64 h-auto pt-20">
          <Outlet />
        </main>
        <Loader loading={loader}></Loader>
      </div>
    </>
  );
};


