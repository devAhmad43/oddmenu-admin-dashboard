import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { serverUrl } from "../../../config";
import { Loader } from "../../Loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { AddNewproduct } from "../../../StoreRedux/productSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { selectAdmin } from "../../../StoreRedux/adminSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../../DeleteModal";
import { Sidebar } from "../SideBar";

const Addproduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialProductState = {
    title: "",
    price: "",
    image: null,
    producttype: "",
    description: "",
  };

  const initialErrorState = {
    title: "",
    price: "",
    image: "",
    producttype: "",
    description: "",
  };
  const [error, setError] = useState(initialErrorState);
  const [addProduct, setAddProduct] = useState(initialProductState);
  const [previewImage, setPreviewImage] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [delId, setdelId] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const admin = useSelector(selectAdmin);
  console.log("categories", categories);

  // Fetch categories from the server
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/categories/getCategories`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [categories]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setAddProduct((prev) => ({ ...prev, [name]: value }));

    if (value.trim() === "") {
      setError((prevError) => ({ ...prevError, [name]: "Required" }));
    } else {
      setError((prevError) => ({ ...prevError, [name]: "" }));
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const response = await axios.post(
          `${serverUrl}/api/categories/createCategory`,
          { name: newCategory.trim() }
        );
        const createdCategory = response.data.category;
        setCategories((prev) => [...prev, createdCategory]);
        setAddProduct((prev) => ({
          ...prev,
          producttype: createdCategory.name,
        }));
        setNewCategory("");
        toast.success(`Category "${createdCategory.name}" added successfully!`);
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error(
          error.response
            ? error.response.data.message
            : "Failed to add category."
        );
      }
    } else {
      toast.error("Category name cannot be empty.");
    }
  };

  const handleEditCategory = async (categoryId) => {
    if (newCategory.trim()) {
      try {
        const response = await axios.put(
          `${serverUrl}/api/categories/update/${categoryId}`,
          { name: newCategory.trim() }
        );
        const updatedCategory = response.data.category;
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === updatedCategory._id ? updatedCategory : cat
          )
        );
        setNewCategory("");
        setEditCategoryId(null);
        toast.success(
          `Category "${updatedCategory.name}" updated successfully!`
        );
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error(
          error.response
            ? error.response.data.message
            : "Failed to update category."
        );
      }
    } else {
      toast.error("Category name cannot be empty.");
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddProduct((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const compressedImage = await imageCompression(addProduct.image, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      const formData = new FormData();
      formData.append("file", compressedImage);
      formData.append("upload_preset", "zuifyjrj");
      formData.append("folder", "product");
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dxtbs0yyv/image/upload`,
        formData
      );
      const imageUrl = uploadResponse.data.secure_url;
      const productResponse = await axios.post(
        `${serverUrl}/api/product/createProduct`,
        {
          admin: admin._id,
          title: addProduct.title,
          price: parseInt(addProduct.price, 10),
          imageUrl: imageUrl,
          producttype: addProduct.producttype,
          description: addProduct.description,
        }
      );
      if (productResponse.status === 200) {
        dispatch(AddNewproduct(productResponse.data.data));
        toast.success(productResponse.data.message);
        navigate(`/Admin/product/${addProduct.producttype}`);
        setAddProduct(initialProductState);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error.response
          ? error.response.data.message
          : "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="space-y-12 p-4 h-screen">
          <div>
            {/* Create Category Section */}
            <div className="my-4">
              <h3 className="text-xl mb-2 font-bold leading-6 text-purple-900">
                Create/Edit Category
              </h3>
              <div className="flex justify-between">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                  className="block max-w-3xl w-full border-b-2 border-gray-300 py-1.5 rounded-md text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={
                    editCategoryId
                      ? () => handleEditCategory(editCategoryId)
                      : handleAddCategory
                  }
                  className=" rounded-md bg-purple-900 px-1 ml-1.5 md:px-4 py-1.5 sm:py-1 text-sm whitespace-nowrap font-semibold text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:ring-offset-2"
                >
                  {editCategoryId ? "Edit Category" : "Create Category"}
                </button>
              </div>
              <div className="text-start">
                <h1 className="font-bold text-4xl text-purple-900">
                  All Categories
                </h1>
                <ol
                  className="pl-4 my-4 space-y-2"
                  style={{ listStyleType: "decimal", marginLeft: "1rem" }}
                >
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between pr-4"
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "0.5rem",
                      }}
                    >
                      <span>{category.name}</span>
                      <div className="flex items-center space-x-4">
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="cursor-pointer text-purple-900 mx-2"
                          onClick={() => {
                            setNewCategory(category.name);
                            setEditCategoryId(category._id);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="cursor-pointer text-red-600"
                          onClick={() => {
                            setshowModal(true);
                            setdelId(category._id);
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <h2 className="text-3xl mt-4 font-bold tracking-tight text-purple-900 sm:text-4xl">
              Add Product
            </h2>{" "}
            <div className="flex flex-wrap">
  <div className="w-full lg:w-1/2">
    <div className="mt-4">
      <select
        name="producttype"
        onChange={handleChangeInput}
        className="block w-full max-w-xl border-b-2 border-gray-300 py-1.5 text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
      >
        <option value="">Select Product Type</option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {error.producttype && (
        <span className="text-red-500">{error.producttype}</span>
      )}
    </div>

    {/* Other Inputs */}
    <div className="mt-4">
      <input
        type="text"
        name="title"
        value={addProduct.title}
        onChange={handleChangeInput}
        placeholder="Product Title"
        className="block w-full max-w-xl border-b-2 border-gray-300 py-1.5 text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
      />
      {error.title && <span className="text-red-500">{error.title}</span>}
    </div>

    <div className="mt-4">
      <input
        type="number"
        name="price"
        value={addProduct.price}
        onChange={handleChangeInput}
        placeholder="Product Price"
        className="block w-full max-w-xl border-b-2 border-gray-300 py-1.5 text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
      />
      {error.price && <span className="text-red-500">{error.price}</span>}
    </div>

    <div className="mt-4">
      <textarea
        name="description"
        value={addProduct.description}
        onChange={handleChangeInput}
        placeholder="Product Description"
        className="block w-full max-w-xl border-b-2 border-gray-300 py-1.5 text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
      />
      {error.description && <span className="text-red-500">{error.description}</span>}
    </div>
  </div>

  <div className="w-full lg:w-1/3 lg:ml-2">
    <div className="mt-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full max-w-xl border-b-2 border-gray-300 py-1.5 text-purple-900 focus:ring-0 focus:border-purple-600 sm:text-sm sm:leading-6"
      />
      {previewImage && (
        <img src={previewImage} alt="Preview" className="mt-2 h-36 w-full" />
      )}
      {error.image && <span className="text-red-500">{error.image}</span>}
    </div>
  </div>
</div>

         
            <button
              type="submit"
              className="mt-6 rounded-md bg-purple-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:ring-offset-2"
            >
              {loading ? <Loader /> : "Submit Product"}
            </button>
          </div>
        </div>
      </form>
      <Sidebar categories={categories} />
      <Loader loading={loading} />
      <DeleteModal
        setloading={setLoading}
        showModal={showModal}
        setshowModal={setshowModal}
        delId={delId}
        whatdelete="category"
      />
    </>
  );
};

export default Addproduct;
