import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectproducts } from '../../../StoreRedux/productSlice';
import { selectorders } from '../../../StoreRedux/orderSlice';
import { useSelector } from 'react-redux';

function OrderDetailPage() {
    const bookdata = useSelector(selectproducts); // Product data from Redux
    const orderdata = useSelector(selectorders); // Order data from Redux
    const { orderId } = useParams(); // Get the order ID from the URL
    const [book, setBook] = useState(null); // To store the product details
    const [orderDetails, setOrderDetails] = useState(null); // To store the order details

    useEffect(() => {
        const order = orderdata.find(data => data._id === orderId); // Find the specific order by ID

        if (order) {
            const datadetail = bookdata.filter(product =>
                order.product.some(idObj => idObj.productId === product._id)
            );
            setBook(datadetail); // Set the product details
            setOrderDetails(order); // Set the order details
        }
    }, [bookdata, orderdata, orderId]);

    return (
        <div className="container mx-auto md:px-4">
            {orderDetails ? (
                <div>
                    {/* Render Order Details */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <h1 className="text-2xl font-bold text-purple-900">Order Details:</h1>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Order ID: </span>{orderDetails._id}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Table: </span>{orderDetails.table}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Total Price: </span>${orderDetails.price}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">No of Items: </span>{orderDetails.noofitems}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Created At: </span>{new Date(orderDetails.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Status: </span>{orderDetails.status ? 'Completed' : 'Pending'}
                        </p>
                    </div>

                    {/* Render each Product */}
                    {book ? (
                        book.map((book1, index) => {
                            return (
                                <div key={index} className="bg-white grid grid-cols-2 rounded-lg shadow-md overflow-hidden mb-6">
                                    {/* Product Image */}
                                    <div className="col-span-2 md:col-span-1">
                                        <img className="h-[300px] w-full" src={book1.imageUrl} alt="fooditem" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="col-span-2 md:col-span-1 flex flex-col justify-center p-4">
                                        <h3 className="text-2xl font-semibold text-purple-800">{book1.title}</h3>
                                        <p className="text-sm text-gray-600 my-2">
                                            <span className="text-purple-600 font-bold">Price: </span>${book1.price}
                                        </p>
                                       
                                       
                    
                                        <p className="text-sm text-gray-600 my-2">
                                            <span className="text-purple-600 font-bold">Product Type: </span>{book1.producttype}
                                        </p>
                                       
                                        <p className="text-sm text-gray-600 my-2">
                                            <span className="text-purple-600 font-bold">Description: </span>{book1.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No products found for this order.</p>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default OrderDetailPage;
