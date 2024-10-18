import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../../../config";
import { Loader } from "../../Loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { selectproducts, updateproducts } from "../../../StoreRedux/productSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
const EditProduct = () => {
    const host = useNavigate();
    const { productId } = useParams()
    const dispatch = useDispatch()
    const products = useSelector(selectproducts)
    const Doorerror = {
        title: "", price: "", hostingfee: "", condition: "", power: "", machines: "", producttype: "",monthlysupport:"",installation:"",date:""
    }
    const [error, setError] = useState(Doorerror);
    const [addproduct, setaddproduct] = useState();
    const [loading, setloading] = useState(false);
    useEffect(() => {
        const find = products.find((item) => item._id === productId)
        setaddproduct(find)
        // eslint-disable-next-line
    }, [products])

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        if (value.trim() === "") {
            setError((prevError) => ({ ...prevError, [name]: `Required` }));
        } else {
            setError((prevError) => ({ ...prevError, [name]: "" }));
        }
        setaddproduct((prev) => ({ ...prev, [name]: value }))
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        console.log(addproduct)
        try {
            setloading(true);
            const response = await axios.put(`${serverUrl}/api/product/updateProduct/${productId}`, {
                title: addproduct.title, price: parseInt(addproduct.price), hostingfee: parseInt(addproduct.hostingfee), condition: addproduct.condition, power: addproduct.power, machines: addproduct.machines, producttype: addproduct.producttype,installation:parseInt(addproduct.installation),monthlysupport:parseInt(addproduct.monthlysupport),deposit:parseInt(addproduct.deposit),date:addproduct.date
            });
            console.log(response)
            if (response && response.status === 200) {
                setloading(false);
                dispatch(updateproducts(response.data.data))
                console.log(response.data.data)
                toast.success(response.data.message);
                host(`/Admin/product/${response.data.data.producttype}`)
            }
        } catch (error) {
            setloading(false);
            console.error(error);
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <>
            {addproduct &&
                <form onSubmit={handleFormSubmit}>
                    <div className="space-y-12 h-screen">
                        <div>
                            <h2 className="text-3xl mt-4 font-bold tracking-tight text-purple-900 sm:text-4xl">
                                Update Product
                            </h2>
                            <div className="my-4 grid grid-cols-3 gap-x-6 gap-y-2 ">
                                <div className=" col-sapn-3 sm:col-span-1">
                                    <label htmlFor="title" className="block text-md font-medium leading-6 text-purple-900">
                                        Product Type
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            onChange={handleChangeInput}
                                            required
                                            name="producttype"
                                            value={addproduct.producttype}

                                            className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                        >
                                            <option value="">Select product type</option>
                                            <option value="special">Special</option>
                                            <option value="equipment">Equipment</option>
                                        </select>

                                        {error.title && <p className="text-red-700 text-sm font-normal">{error.producttype}</p>}
                                    </div>
                                </div>
                                <div className=" col-sapn-3 sm:col-span-1">
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
                                            className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                        />
                                        {error.title && <p className="text-red-700 text-sm font-normal">{error.title}</p>}
                                    </div>
                                </div>
                                <div className="col-sapn-3 sm:col-span-1">
                                    <label htmlFor="price" className="block text-md font-medium leading-6 text-purple-900">
                                        price
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={addproduct.price}
                                            name="price"
                                            onChange={handleChangeInput}
                                            type="number"
                                            placeholder="0"
                                            className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                        />
                                        {error.price && <p className="text-red-700 text-sm font-normal">{error.price}</p>}
                                    </div>
                                </div>
                                <div className="col-sapn-3 sm:col-span-1">
                                    <label htmlFor="hostingfee" className="block text-md font-medium leading-6 text-purple-900">
                                        Hosting fee
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={addproduct.hostingfee}
                                            name="hostingfee"
                                            onChange={handleChangeInput}
                                            type="number"
                                            placeholder="0"
                                            className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                        />
                                        {error.hostingfee && <p className="text-red-700 text-sm font-normal">{error.hostingfee}</p>}
                                    </div>
                                </div>
                                <div className="col-sapn-3 sm:col-span-1">
                                    <label htmlFor="monthlysupport" className="block text-md font-medium leading-6 text-purple-900">
                                        Monthly Support
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={addproduct.monthlysupport?addproduct.monthlysupport:""}  
                                            name="monthlysupport"
                                            onChange={handleChangeInput}
                                            type="number"
                                            placeholder="0"
                                            className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                        />
                                        {error.monthlysupport && <p className="text-red-700 text-sm font-normal">{error.monthlysupport}</p>}
                                    </div>
                                </div>
                                <div className="col-sapn-3 sm:col-span-1">
                                    <label htmlFor="installation" className="block text-md font-medium leading-6 text-purple-900">
                                        Setup and Installation
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={addproduct.installation?addproduct.installation:""}
                                            name="installation"
                                            onChange={handleChangeInput}
                                            type="number"
                                            placeholder="0"
                                            className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                        />
                                        {error.installation && <p className="text-red-700 text-sm font-normal">{error.installation}</p>}
                                    </div>
                                </div>
                                <div className="col-sapn-3 sm:col-span-1">
                                <label htmlFor="installation" className="block text-md font-medium leading-6 text-purple-900">
                                Deposit
                                </label>
                                <div className="mt-2">
                                    <input
                                       value={addproduct.deposit?addproduct.deposit:""}
                                        name="deposit"
                                        onChange={handleChangeInput}
                                        type="number"
                                        placeholder="0"
                                        className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                    />
                                    {error.deposit && <p className="text-red-700 text-sm font-normal">{error.deposit}</p>}
                                </div>
                            </div>
                                <div className="col-sapn-3 sm:col-span-1">
                                    <label htmlFor="itemPrice" className="block text-md font-medium leading-6 text-purple-900">
                                        Condition
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={addproduct.condition}
                                            name="condition"
                                            onChange={handleChangeInput}
                                            type="text"
                                            placeholder="Enter condition"
                                            className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                        />
                                        {error.condition && <p className="text-red-700 text-sm font-normal">{error.condition}</p>}
                                    </div>
                                </div>
                                <div className="col-sapn-3 sm:col-span-1">
                                    <label htmlFor="machines" className="block text-md font-medium leading-6 text-purple-900">
                                        No of Machines
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={addproduct.machines}
                                            name="machines"
                                            onChange={handleChangeInput}
                                            type="number"
                                            placeholder="0"
                                            className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                        />
                                        {error.machines && <p className="text-red-700 text-sm font-normal">{error.machines}</p>}
                                    </div>
                                </div>
                                <div className="col-sapn-3 sm:col-span-1">
                                    <label htmlFor="itemPrice" className="block text-md font-medium leading-6 text-purple-900">
                                        Power
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={addproduct.power}
                                            name="power"
                                            onChange={handleChangeInput}
                                            type="text"
                                            placeholder="Enter machine power"
                                            className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                        />
                                        {error.power && <p className="text-red-700 text-sm font-normal">{error.power}</p>}
                                    </div>
                                </div>
                                <div className="col-sapn-3 sm:col-span-1">
                                <label htmlFor="itemPrice" className="block text-md font-medium leading-6 text-purple-900">
                                Online Date
                                </label>
                                <div className="mt-2">
                                    <input
                                        value={addproduct.date}
                                        name="date"
                                        onChange={handleChangeInput}
                                        type="date"
                                       
                                        className="block w-full rounded-md border-0 py-1.5 text-purple-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                    />
                                    {error.date && <p className="text-red-700 text-sm font-normal">{error.date}</p>}
                                </div>
                            </div>

                            </div>

                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button
                                type="submit"

                                className="rounded-md mr-3 bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                            >
                                Update Product
                            </button>
                        </div>
                    </div>
                </form>
            }
            <Loader loading={loading} />
        </>
    );
};

export default EditProduct;