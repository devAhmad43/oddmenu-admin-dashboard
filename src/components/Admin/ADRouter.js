import { Navigate } from "react-router-dom";
import Error from "../Error";
import { AdminLayout } from "./FullLayoutAdmin";
import Statistics from "../Sidebar Pages/Statistics";
import { PrivateRouteAdmin } from "./PrivateRouteAdmin";
import Addproduct from "../Sidebar Pages/product/Addproduct"
import Equipmentproduct from "../Sidebar Pages/product/Products";
import Orders from "../Sidebar Pages/orders/Orders"
import QrCode from '../QrCode';
import Productdetailpage from "../Sidebar Pages/product/Productdetailpage"
import Editproduct from "../Sidebar Pages/product/Editproduct";
import OrderDetailPage from "../Sidebar Pages/orders/OrderDetailPage";
export const ThemeRoutes = [
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "/", element: <Navigate to="starter" /> },
      { path: "starter", exact: true, element: <PrivateRouteAdmin element={<Statistics />} /> },
      { path: "product/:producttype", exact: true, element: <PrivateRouteAdmin element={<Equipmentproduct/>} /> },
      { path: "addproduct", exact: true, element: <PrivateRouteAdmin element={<Addproduct />} /> },
      { path: "products/:productId", exact: true, element: <PrivateRouteAdmin element={<Productdetailpage />} /> },
      { path: "editproduct/:productId", exact: true, element: <PrivateRouteAdmin element={<Editproduct/>} /> },
      { path: 'orders/:userId', exact: true, element: <PrivateRouteAdmin element={<Orders />} /> },
      { path: 'qrcode', exact: true, element: <PrivateRouteAdmin element={<QrCode />} /> },
      { path: 'order/:orderId', exact: true, element: <PrivateRouteAdmin element={<OrderDetailPage />} /> },
      { path: "*", exact: true, element: <Error /> },
      // { path: "starter", exact: true, element: <Statistics /> },
    ],
  },
];


