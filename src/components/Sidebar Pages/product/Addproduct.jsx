import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { serverUrl } from "../../../config";
import { Loader } from "../../Loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { AddNewproduct } from "../../../StoreRedux/productSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { selectAdmin } from "../../../StoreRedux/adminSlice";

const Addproduct = () => {
  const host = useNavigate();
  const dispatch = useDispatch();
  const doorinitial = {
    title: "",
    price: "",
    imageUrl: "",
    producttype: "",
    description: "",
  };
  const Doorerror = {
    title: "",
    price: "",
    imageUrl: "",
    producttype: "",
    description: "",
  };
  const [error, setError] = useState(Doorerror);
  const [addproduct, setaddproduct] = useState(doorinitial);
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const admin = useSelector(selectAdmin);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setError((prevError) => ({ ...prevError, [name]: `Required` }));
    } else {
      setError((prevError) => ({ ...prevError, [name]: "" }));
    }
    setaddproduct((prev) => ({ ...prev, [name]: value }));
  };

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  const cloudName = "dxtbs0yyv";
  const uploadPreset = "zuifyjrj";

  const handleImageSelect = async (filename) => {
    const file = filename;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "product");
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      console.log("upload");
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const img = await imageCompression(addproduct.image, options);
      const data = await handleImageSelect(img);
      const response = await axios.post(
        `${serverUrl}/api/product/createProduct`,
        {
          admin: admin._id,
          title: addproduct.title,
          price: parseInt(addproduct.price),
          imageUrl: data,
          producttype: addproduct.producttype,
          description: addproduct.description,
        }
      );
      if (response && response.status === 200) {
        setloading(false);
        dispatch(AddNewproduct(response.data.data));
        toast.success(response.data.message);
        host(`/Admin/product/${response.data.data.producttype}`);
        setaddproduct(doorinitial);
        setPreviewImage(null); // Reset the image preview
      }
    } catch (error) {
      setloading(false);
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setaddproduct((prev) => ({
      ...prev,
      image: file,
    }));

    // Generate image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result); // Set the preview image URL
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="space-y-12 h-screen">
          <div>
            <h2 className="text-3xl mt-4 font-bold tracking-tight text-purple-900 sm:text-4xl">
              Add Product
            </h2>
            <div className="my-4 grid grid-cols-3 gap-x-6 gap-y-2 ">
              <div className=" col-sapn-3 sm:col-span-1">
                <label
                  htmlFor="producttype"
                  className="block text-md font-medium leading-6 text-purple-900"
                >
                  Product Type
                </label>
                <div className="mt-2">
                  <select
                    onChange={handleChangeInput}
                    required
                    name="producttype"
                    value={addproduct.producttype}
                    className="block w-full border-b-2 border-gray-300 py-1.5 text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select product type</option>
                    <option value="breakfast">BreakFast</option>
                    <option value="hotmeal">Hot Meal</option>
                    <option value="desert">Desert</option>
                    <option value="salad">Salad</option>
                  </select>
                  {error.title && (
                    <p className="text-red-700 text-sm font-normal">
                      {error.producttype}
                    </p>
                  )}
                </div>
              </div>
              <div className=" col-sapn-3 sm:col-span-1">
                <label
                  htmlFor="title"
                  className="block text-md font-medium leading-6 text-purple-900"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleChangeInput}
                    required
                    type="text"
                    name="title"
                    value={addproduct.title}
                    placeholder="Title"
                    className="block w-full border-b-2 border-gray-300 py-1.5 text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
                  />
                  {error.title && (
                    <p className="text-red-700 text-sm font-normal">
                      {error.title}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-sapn-3 sm:col-span-1">
                <label
                  htmlFor="price"
                  className="block text-md font-medium leading-6 text-purple-900"
                >
                  Price
                </label>
                <div className="mt-2">
                  <input
                    value={addproduct.price}
                    name="price"
                    onChange={handleChangeInput}
                    type="number"
                    placeholder="0"
                    className="block w-full border-b-2 border-gray-300 py-1.5 text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
                  />
                  {error.price && (
                    <p className="text-red-700 text-sm font-normal">
                      {error.price}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="description"
                  className="block text-md font-medium leading-6 text-purple-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <input
                    value={addproduct.description}
                    name="description"
                    onChange={handleChangeInput}
                    type="text"
                    placeholder="description..."
                    className="block w-full border-b-2 border-gray-300 py-1.5 text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
                  />
                  {error.description && (
                    <p className="text-red-700 text-sm font-normal">
                      {error.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto my-1">
            <div className="border-l-2 border-purple-600 pl-8">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl text-purple-900 font-bold mb-2">
                    Product Image
                  </h3>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                  className="block w-full text-sm text-purple-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-900 hover:file:bg-purple-100"
                />
              </div>
              {/* Preview section */}
              {previewImage && (
                <div className="mt-4">
                  <h3 className="text-lg text-purple-900 font-semibold">
                    Image Preview:
                  </h3>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-40 mt-2"
                  />
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-purple-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:ring-offset-2"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
          </div>
        </div>
      </form>
      <Loader loading={loading} />
    </>
  );
};

export default Addproduct;
