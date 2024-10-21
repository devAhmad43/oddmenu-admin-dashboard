import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectproducts } from '../../../StoreRedux/productSlice';
import { useSelector } from 'react-redux';

function Productdetailpage() {
    const bookdata = useSelector(selectproducts);
    const { productId } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const datadetail = bookdata.find(data => data._id === productId);
        setBook(datadetail);
        // eslint-disable-next-line
    }, [bookdata]);

    return (
        <div className="container mx-auto md:px-4">
            {book ? (
                <div className="bg-white grid grid-cols-2 rounded-lg shadow-md overflow-hidden">
                    <div className="col-span-2 md:col-span-1">
                        <img className="h-[300px] w-full" src={book.imageUrl} alt="food item" />
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col justify-center p-4">
                        <h3 className="text-2xl font-semibold text-purple-800">{book.title}</h3>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Price:</span> ${book.price}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Product Type:</span> {book.producttype}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Description:</span> {book.description || 'No description available.'}
                        </p>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Productdetailpage;
