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
import { toast } from "react-toastify";

const SignUp = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Input validation state
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(signupRequest());

    try {
      const response = await axios.post(`${serverUrl}/api/admin/signup`, {
        email,
        password,
      });
      if (response && response.status === 200) {
        toast.success("Signup Successful!");
        dispatch(signupSuccess(response.data.admin));
        navigate("/login");
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      dispatch(signupFailure(error.response?.data?.message || "Signup failed"));
    }
  };

  return (
    <div className="min-h-screen bg-purple-400 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign Up</h1>
            <div className="w-full flex-1 mt-8">
              <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm ${
                      validationErrors.email ? "border-red-500" : ""
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs">{validationErrors.email}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-6 relative">
                  <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm ${
                        validationErrors.password ? "border-red-500" : ""
                      }`}
                    />
                    {/* Toggle password visibility */}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-yellow-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-yellow-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-500 text-xs">{validationErrors.password}</p>
                  )}
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create an account"}
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-gray-700 underline hover:cursor-pointer">
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
