import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import style from "./sidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addAdmin, selectAdmin } from "../../StoreRedux/adminSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { selectproducts } from "../../StoreRedux/productSlice";
import { serverUrl } from "../../config";
import { selectThemeColor, setThemeColor } from "../../StoreRedux/themeSlice"; // Adjust the path as needed
import axios from "axios";
export function Sidebar() {
  const location = useLocation();
  const storeAdmin = useSelector(selectAdmin);
  const id = storeAdmin._id;
  const products = useSelector(selectproducts);
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const [color, setColor] = useState("#E460E6"); // default color
  const saveColor = async () => {
    try {
      // Save color to the database for a specific admin
      const response = await axios.post(
        `${serverUrl}/api/theme/createtheme/${id}`,
        { color }
      );
      if (response.status === 200) {
        dispatch(setThemeColor(response.data.color));
      }
    } catch (error) {
      console.error("Error saving color:", error);
    }
  };
  const Handlelogout = () => {
    dispatch(addAdmin(null));
    localStorage.removeItem("ARABIC_ADMIN_KEY_STRING");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    toast.success("Logout Successfully");
  };
  const [dropDown, setDropDown] = useState(false);
  const handleDropDown = () => {
    setDropDown(!dropDown);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsDrawerOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const uniqueCategories = Array.from(
    new Set(products.map((category) => category.producttype))
  ).map((producttype) =>
    products.find((category) => category.producttype === producttype)
  );
  const menuItems = [
    {
      text: "Products",
      icon: (
        <img src={"/allcards.png"} alt="Products Icon" className="w-6 h-8" />
      ),
      submenu: [
        {
          text: "Add Product",
          icon: <img src={"/add.svg"} alt="Add Icon" className="w-8 h-8" />,
          link: "/Admin/addproduct",
        },

        // Dynamically map categories from products.categories
        ...uniqueCategories?.map((category) => ({
          text: category.producttype,
          link: `/Admin/product/${category.producttype}`,
        })),
      ],
    },
  ];
  const themeColor = useSelector(selectThemeColor);

  const [dropDownOpen, setDropDownOpen] = useState(menuItems?.map(() => false));
  const toggleDropDown = (index) => {
    const updatedState = [...dropDownOpen];
    updatedState[index] = !updatedState[index];
    setDropDownOpen(updatedState);
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // State to hold Cloudinary image URL
  const cloudName = "dxtbs0yyv";
  const uploadPreset = "zuifyjrj";
  // Fetch existing image when the component mounts
  useEffect(() => {
    getImageFromDatabase();
  }, []);

  // Function to fetch the existing image URL from the server
  const getImageFromDatabase = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/logo/logo/${id}`);
      if (response.status === 200) {
        console.log("logo", response.data);
        const imageData = response.data.data; // Assuming your response structure
        setImageUrl(imageData.imageUrl);
      } else {
        toast.error("Failed to fetch image URL.");
      }
    } catch (error) {
      console.error("Failed to retrieve image from the database:", error);
      toast.error("Failed to retrieve image URL.");
    }
  };
  // function to get theme color
  useEffect(() => {
    const fetchThemeColor = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/theme/gettheme/${id}`
        );
        if (response.status === 200) {
          dispatch(setThemeColor(response.data.color));
        }
      } catch (error) {
        console.error("Error fetching color:", error);
      }
    };

    fetchThemeColor();
  }, [dispatch]);
  // Function to handle image selection

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      uploadImage(file); // Upload the selected image
    }
  };
  // Close drawer when navigating to any menu item
  const handleMenuClick = () => {
    setIsDrawerOpen(false); // Close the drawer
  };
  // Function to upload image to Cloudinary and replace the existing one
  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "product");
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      const newImageUrl = response.data.secure_url;
      // Set the new image URL in the state
      setImageUrl(newImageUrl);

      // Post the new image URL in the database
      await postImageToDatabase(newImageUrl);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed. Please try again.");
    }
  };

  // Function to post the new image URL to the database
  const postImageToDatabase = async (newImageUrl) => {
    try {
      await axios.post(`${serverUrl}/api/logo/upload-image/${id}`, {
        imageUrl: newImageUrl,
      });
      toast.success("Image URL posted successfully!");
    } catch (error) {
      console.error("Failed to post image URL to the database:", error);
      toast.error("Failed to post image URL.");
    }
  };
  return (
    <>
      <nav
        style={{ backgroundColor: themeColor }}
        className={
          "px-4 py-2.5 fixed left-0 border-1 border-b right-0 top-0 z-50"
        }
      >
        <div className="flex justify-between items-center">
          {/* Left Section: Toggle Button and Logo/Slogan */}
          <div className="flex items-center">
            <button
              aria-label="Toggle sidebar"
              onClick={toggleDrawer}
              className="p-1 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className={`w-6 h-6 ${isDrawerOpen ? "hidden" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                aria-hidden="true"
                className={`w-6 h-6 ${isDrawerOpen ? "" : "hidden"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </button>

            <div className="relative">
              {selectedImage || imageUrl ? (
                <div className="relative ">
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : imageUrl
                    }
                    alt="Selected or Uploaded"
                    className="mt-1 w-40 h-16 mr-8 border-4 border border-gray-300 rounded-md"
                  />
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 cursor-pointer"
                  >
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden" // Hide the input
                    />
                    <span className="ml-4">
                      <FontAwesomeIcon className="text-white" icon={faEdit} />
                    </span>
                  </label>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm focus:ring-2 focus:ring-purple-600"
                />
              )}
            </div>
          </div>
          <span className="self-center  transition ease-in-out delay-300 hover:-translate-x-1  hover:scale-110 duration-500 hidden md:block text-2xl font-semibold whitespace-nowrap dark:text-white">
            Your best cafe partner{" "}
          </span>
          {/* Right Section: Theme Button */}
          <div className="flex items-center lg:order-2">
            <div className="relative inline-block mt-4 px-6 sm:ml-1.5">
            <button
  onClick={() => {
    handleDropDown();
    if (dropDown) saveColor(); // Save color if dropDown is open
  }}
  className="p-1 lg:px-6 bg-white rounded hover:text-blue-400 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
>
  {dropDown ? "Save" : "Theme"}
</button>

              {dropDown && (
                <div className="absolute mt-1 px-4 text-center text-black rounded-md shadow-lg bg-white ring-4 ring-black ring-opacity-5 z-10">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* <!-- Sidebar --> */}

      <aside
        style={{ backgroundColor: themeColor }}
        className={`
         fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${
           isDrawerOpen ? "translate-x-0" : "-translate-x-full"
         } border-r border-gray-200 md:translate-x-0 dark:border-gray-700`}
        aria-label="Sidenav"
      >
        <div className="overflow-y-auto py-5 px-3 h-full ">
          <ul className="space-y-2 h-96">
            <div className={`${style.heightScroll} pt-3`}>
              <li className="mb-1 mt-1">
                <Link
                  to="/Admin/starter"
                  onClick={() => {
                    handleMenuClick();
                  }}
                  className={
                    location.pathname === "/Admin/starter"
                      ? "text-black bg-gray-200 flex items-center p-2 text-base font-medium rounded-lg"
                      : "text-white flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 hover:text-black group"
                  }
                >
                  <img
                    src="/dashboard.png"
                    alt="Dashboard Icon"
                    className="w-6 h-6"
                  />
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/Admin/qrcode"
                  onClick={() => {
                  handleMenuClick();
                  }}
                  className={
                    location.pathname === "/Admin/qrcode"
                      ? "text-black bg-gray-200 flex items-center p-2 text-base font-medium rounded-lg"
                      : "text-white flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 hover:text-black group"
                  }
                >
                  <img
                    src="/qr-code.png"
                    alt="QR Code Icon"
                    className="w-6 h-6"
                  />
                  <span className="ml-3">Qr Code</span>
                </Link>
              </li >
              {menuItems?.map((item, index) => (
                <li key={index} className="mb-1">
                  <div
                    onClick={() => {
                      toggleDropDown(index);
                    }}
                    className="flex items-center cursor-pointer p-2 w-full text-base font-medium text-white rounded-lg hover:bg-gray-200 hover:text-black"
                  >
                    <span>{item.icon}</span>
                    <span className="flex-1 ml-3">{item.text}</span>
                    <svg
                      className="w-6 h-6 text-gray-500 hover:text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <ul
                    style={{ display: dropDownOpen[index] ? "block" : "none" }}
                    className="hidden py-2 space-y-2"
                  >
                    {item?.submenu?.map((menu, index) => (
                      <li key={index} className="mb-1">
                        <Link
                          onClick={() => {
                            handleMenuClick();
                          }}
                          to={menu.link}
                          className={
                            location.pathname === menu.link
                              ? "text-black bg-gray-200 flex items-center p-2 capitalize text-base font-medium rounded-lg"
                              : "text-white flex items-center p-2 text-base capitalize font-medium rounded-lg hover:bg-gray-100 hover:text-black"
                          }
                        >
                          {menu.icon}
                          <span className="ml-3">{menu.text}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              <li className="mb-1">
                <Link
                  to="/Admin/orders/allorders"
                  onClick={() => {
                    handleMenuClick();
                  }}
                  className={
                    location.pathname === "/Admin/orders"
                      ? "text-black bg-gray-200 flex items-center p-2 text-base font-medium rounded-lg"
                      : "text-white flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 hover:text-black"
                  }
                >
                  <img src="/order.png" alt="Orders Icon" className="w-6 h-6" />
                  <span className="ml-3">Orders</span>
                </Link>
              </li>
            </div>
          </ul>
          <div
            className="absolute cursor-pointer flex bottom-0 w-full"
            onClick={Handlelogout}
          >
            <div
              className={`inline-flex  px-14 mb-2 left-0  py-2 bottom-0 gap-1 transform text-xl font-semibold font-mono  border border-white rounded  hover:text-purple-900 bg-white focus:outline-none focus:ring`}
            >
              <span className="text-md">Log Out</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-1"
                width="2em"
                height="1em"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M3 3a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1m10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 1 0-1.414 1.414L14.586 9H7a1 1 0 1 0 0 2h7.586z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
