import { Navigate } from "react-router-dom";
import { FulllayoutMain } from "./Layout";
import SignIn from "../authPages/SingIn";
import SignUp from "../authPages/SignUp"
import Error from "../Error";

export const ThemeRoutes=[ 
    {
      path:"/",
      element:<FulllayoutMain />,
      children:[
        {path:"/", exact:true, element:<Navigate to="Login"/>},
        {path:"login", exact:true, element:<SignIn/>},
        {path:"signup", exact:true, element:<SignUp/>},
        {path:"*", element:<Error />}
      ],
    },
];

