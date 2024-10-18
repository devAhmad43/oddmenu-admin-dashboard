import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../../../config";
import { Loader } from "../../Loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { selectproducts, updateproducts } from "../../../StoreRedux/productSlice";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const host = useNavigate();
  const { productId } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectproducts);

  const Doorerror = {
    title: "",
    price: "",
    hostingfee: "",
    condition: "",
    power: "",
    machines: "",
    producttype: "",
    monthlysupport: "",
    installation: "",
    date: "",
  };

  const [error, setError] = useState(Doorerror);
  const [addproduct, setaddproduct] = useState();
  const [loading, setloading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // State for new image
  const cloudName = 'dxtbs0yyv';  // Cloudinary cloud name
  const uploadPreset = 'zuifyjrj'; // Cloudinary upload preset

  useEffect(() => {
    const find = products.find((item) => item._id === productId);
    setaddproduct(find);
  }, [products, productId]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setError((prevError) => ({ ...prevError, [name]: `Required` }));
    } else {
      setError((prevError) => ({ ...prevError, [name]: "" }));
    }
    setaddproduct((prev) => ({ ...prev, [name]: value }));
  };

  // Delete the old image from Cloudinary
  const deleteOldImage = async (publicId) => {
    try {
      await axios.post(`${serverUrl}/api/cloudinary/delete`, { publicId });
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Upload the new image to Cloudinary
  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'product');
    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
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
      // Delete old image if it exists
      if (addproduct.imagePublicId) {
        await deleteOldImage(addproduct.imagePublicId);
      }

      // Upload new image if a new one is selected
      let imageUrl = addproduct.imageUrl;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      // Update product with new data
      const updatedProduct = {
        title: addproduct.title,
        price: parseInt(addproduct.price),
        producttype: addproduct.producttype,
        description: addproduct.description,
        imageUrl, // New image URL
      };

      const response = await axios.put(`${serverUrl}/api/product/updateProduct/${productId}`, updatedProduct);
      if (response && response.status === 200) {
        setloading(false);
        dispatch(updateproducts(response.data.data));
        toast.success(response.data.message);
        host(`/Admin/product/${response.data.data.producttype}`);
      }
    } catch (error) {
      setloading(false);
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      {addproduct && (
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-12 h-screen">
            <div>
              <h2 className="text-3xl mt-4 font-bold tracking-tight text-purple-900 sm:text-4xl">
                Update Product
              </h2>
              <div className="my-4 grid grid-cols-3 gap-x-6 gap-y-2 ">
                {/* Product Type */}
                <div className="col-span-3 sm:col-span-1">
                  <label htmlFor="producttype" className="block text-md font-medium leading-6 text-purple-900">
                    Product Type
                  </label>
                  <div className="mt-2">
                    <select
                      onChange={handleChangeInput}
                      required
                      name="producttype"
                      value={addproduct.producttype}
                      className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm"
                    >
                      <option value="">Select product type</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="cuisine">Cuisine</option>
                      <option value="desert">Desert</option>
                      <option value="drink">Drinks</option>
                    </select>
                    {error.producttype && (
                      <p className="text-red-700 text-sm font-normal">{error.producttype}</p>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="col-span-3 sm:col-span-1">
                  <label htmlFor="title" className="block text-md font-medium leading-6 text-purple-900">
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
                      className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm"
                    />
                    {error.title && <p className="text-red-700 text-sm font-normal">{error.title}</p>}
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-3 sm:col-span-1">
                  <label htmlFor="price" className="block text-md font-medium leading-6 text-purple-900">
                    Price
                  </label>
                  <div className="mt-2">
                    <input
                      value={addproduct.price}
                      name="price"
                      onChange={handleChangeInput}
                      type="number"
                      placeholder="0"
                      className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm"
                    />
                    {error.price && <p className="text-red-700 text-sm font-normal">{error.price}</p>}
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-3 sm:col-span-1">
                  <label htmlFor="description" className="block text-md font-medium leading-6 text-purple-900">
                    Description
                  </label>
                  <div className="mt-2">
                    <input
                      value={addproduct.description}
                      name="description"
                      onChange={handleChangeInput}
                      type="text"
                      placeholder="Enter description"
                      className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm"
                    />
                    {error.description && <p className="text-red-700 text-sm font-normal">{error.description}</p>}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-md font-medium leading-6 text-purple-900">Product Image</label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm"
                    />
                                       {selectedImage ? (
                      <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="mt-2 h-32" />
                    ) : addproduct.imageUrl ? (
                      <img src={addproduct.imageUrl} alt="Previous" className="mt-2 h-32" />
                    ) : null}

                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
              >
                Update Product
              </button>
            </div>
          </div>
        </form>
      )}
      <Loader loading={loading} />
    </>
  );
};

export default EditProduct;
