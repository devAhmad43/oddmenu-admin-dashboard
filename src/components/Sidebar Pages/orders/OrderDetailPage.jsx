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
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold text-purple-900 mb-6">Order Details</h1>

                    {/* Order Details Table in a Single Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div>
                            <p className="text-purple-600 font-bold">Order ID:</p>
                            <p className="text-gray-600">{orderDetails._id}</p>
                        </div>
                        <div>
                            <p className="text-purple-600 font-bold">Table Number:</p>
                            <p className="text-gray-600">{orderDetails.tableNumber}</p>
                        </div>
                        <div>
                            <p className="text-purple-600 font-bold">Total Price:</p>
                            <p className="text-gray-600">${orderDetails.price}</p>
                        </div>
                        <div>
                            <p className="text-purple-600 font-bold">Number of Items:</p>
                            <p className="text-gray-600">{orderDetails.noofitems}</p>
                        </div>
                        <div>
                            <p className="text-purple-600 font-bold">Created At:</p>
                            <p className="text-gray-600">{new Date(orderDetails.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-purple-600 font-bold">Status:</p>
                            <p className="text-gray-600">{orderDetails.status ? 'Completed' : 'Pending'}</p>
                        </div>
                    </div>

                    {/* Product Details */}
                    {book ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {book.map((book1, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center"
                                >
                                    {/* Product Image */}
                                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                                        <img
                                            className="h-32 w-32 object-cover rounded-md"
                                            src={book1.imageUrl}
                                            alt="Product"
                                        />
                                    </div>

                                    {/* Product Information */}
                                    <div className="flex-grow">
                                        <p className="text-purple-600 font-bold">Title:</p>
                                        <p className="text-gray-600 mb-2">{book1.title}</p>

                                        <p className="text-purple-600 font-bold">Price:</p>
                                        <p className="text-gray-600 mb-2">${book1.price}</p>

                                        <p className="text-purple-600 font-bold">Product Type:</p>
                                        <p className="text-gray-600 mb-2">{book1.producttype}</p>

                                        <p className="text-purple-600 font-bold">Description:</p>
                                        <p className="text-gray-600">{book1.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
