import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../config";
import {
  signupRequest,
  signupSuccess,
  signupFailure,
  selectAuthLoading,
  selectAuthError,
} from "../../StoreRedux/adminSlice";
import axios from "axios";
// import dashboard from "../assests/dashboard.png";
import { toast } from "react-toastify";
const SignUp = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // console.log(serverUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signupRequest());

    try {
      const response = await axios.post(`${serverUrl}/api/admin/signup`, {
        email,
        password,
      });
      if (response && response.status === 200) {
        console.log("Successfully Sign Up");
        // alert("User SignUp Successfully");
        console.log("server data ====>", response.data);
        toast.success("SignUp Success")
        dispatch(signupSuccess(response.data.admin));
        navigate("/login");
      }
    } catch (error) {
      if (error) {
        console.log(error.response.data);
        console.log(error.response.status);
        toast.error("Signup failed. Please try again.");
      } else {
        console.log("Failed to Sign Up");
        //  dispatch(signupFailure(error.response.data.error));
        dispatch(signupFailure(error.response.data.message));
      }
    }
  };

  return (
    <div className="min-h-screen top-0 bg-yellow-300 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            {/* <img src={dashboard} className="w-12 h-12 mx-auto" alt="Logo" /> */}
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
            <div className="w-full flex-1 mt-8">
              <form action="#" className="mt-8 grid grid-cols-6 gap-6">
                {/* <div className="col-span-6 sm:col-span-3">
            <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>

            <input
              type="text"
              id="FirstName"
              name="first_name"
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div> */}

                {/* <div className="col-span-6 sm:col-span-3">
            <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>

            <input
              type="text"
              id="LastName"
              name="last_name"
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div> */}

                <div className="col-span-6">
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {" "}
                    Email{" "}
                  </label>

                  <input
                    type="email"
                    id="Email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {" "}
                    Password{" "}
                  </label>

                  <input
                    type="password"
                    id="Password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                  />
                </div>
                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    By creating an account, you agree to our
                    <a href="#" className="text-gray-700 underline">
                      {" "}
                      terms and conditions{" "}
                    </a>
                    and
                    <a href="#" className="text-gray-700 underline">
                      privacy policy
                    </a>
                    .
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Create an account
                  </button>
                  {error && alert({ error })}
                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?
                    <Link
                      to="/Login"
                      className="text-gray-700 underline hover:cursor-pointer"
                    >
                      Log in
                    </Link>
                    .
                  </p>
                </div>
              </form>

              {error && <p className="mt-5 text-red-500">{error}</p>}

              <p className="mt-6 text-xs text-gray-600 text-center">
                By signing up, you agree to our{" "}
                <a href="#" className="border-b border-gray-500 border-dotted">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="border-b border-gray-500 border-dotted">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://plus.unsplash.com/premium_vector-1682269608279-c30dcfc02e95?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            }}
          ></div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
