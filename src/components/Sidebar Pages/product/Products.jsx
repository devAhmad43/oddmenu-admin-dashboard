import { selectproducts, updateproducts } from '../../../StoreRedux/productSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../../DeleteModal';
import { Loader } from '../../Loader/loader';
import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from 'react';
import { toast } from "react-toastify"
import { serverUrl } from "../../../config";
import axios from "axios"
function Products() {
    const dispatch = useDispatch();
    const { producttype } = useParams();
    const allfoods = useSelector(selectproducts);
    const [delId, setdelId] = useState(null);
    const [filteritem, setfilterItem] = useState("");
    const [showModal, setshowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const host = useNavigate()
    const [product, setProducts] = useState()
    useEffect(() => {
        let type=[];
        if(filteritem===""){
            type = allfoods?.filter((item) => item.producttype === producttype)
            setProducts(type)
        }
        else if(filteritem==="sold"){
            type = allfoods.filter((item) => item.producttype === producttype && item.status===true)
            setProducts(type)
        }
        else if(filteritem==="store"){
            type = allfoods.filter((item) => item.producttype === producttype && item.status===false)
            setProducts(type)
        }
        // eslint-disable-next-line
    }, [allfoods, producttype,filteritem]);
    const updatestatus = async (value, id) => {
        setLoading(true);
        console.log()
        try {
            setLoading(true);
            const response = await axios.put(`${serverUrl}/api/product/updateStatus/${id}`, {
                status: value
            });
            console.log(response)
            if (response && response.status === 200) {
                setLoading(false);
                dispatch(updateproducts(response.data.data))
                console.log(response.data.data)
                toast.success(response.data.message);
                host(`/Admin/product/${response.data.data.producttype}`)
            }
            setfilterItem("")
        } catch (error) {
            setLoading(false);
            console.error(error);
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    }
    return (
        <div>
            <div className="flex items-center justify-between gap-2  w-full mb-5">
                <span className="font-bold text-2xl text-left w-full  text-purple-700">All {producttype}</span>
                <div className='flex gap-2'>
                    <span className="mt-1 text-purple-700">Filter:</span>
                    <select onChange={(e) => setfilterItem(e.target.value)
                    } className="py-1  bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700"   name="status" id="status">
                        <option value="">All item</option>
                        <option value="sold">Sold out items</option>
                        <option value="store">Store items</option>
                    </select>
                </div>
            </div>
            {product && <div className="container mx-auto px-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {product.map((book, index) => {
                        return <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <Link to={`/Admin/products/${book._id}`}><img src={book.imageUrl} alt="Book Cover" className="w-full h-64  object-fill" /></Link>
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-800">{book.title}</h3>
                                <div className="mt-2 flex justify-between items-center">
                                    <i className="fa-solid fa-pen-to-square text-[25px] text-purple-600 hover:cursor-pointer"
                                        onClick={() => {
                                            host(`/Admin/editproduct/${book._id}`)
                                        }}></i>
                                    <i className="fa-regular fa-trash-can text-[25px] text-red-700 hover:cursor-pointer"
                                        onClick={() => {
                                            setshowModal(true);
                                            setdelId(book._id);

                                        }}></i>
                                    <p>
                                        {book.status ? (
                                            <span className="inline-flex px-4 text-xs leading-5 font-semibold rounded-full bg-red-200 text-green-900">
                                                Sold out
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-900">
                                                Store item
                                            </span>
                                        )}
                                    </p>


                                    <select onChange={(e) => {
                                        updatestatus(e.target.value, book._id)
                                    }} className=" py-1  bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700" value={book.status} name="status" id="status">
                                        <option value={true}>Sold out</option>
                                        <option value={false}>Store item</option>
                                    </select>
                                    {/* <button className="px-4 py-1 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700"
                                        onClick={() => {
                                            host(`/Admin/products/${book._id}`)
                                        }}
                                    >Detail</button> */}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>}
            <DeleteModal
                setloading={setLoading}
                showModal={showModal}
                setshowModal={setshowModal}
                delId={delId}
                whatdelete="product"
            />
            <Loader loading={loading} />
        </div>
    )
}

export default Products

