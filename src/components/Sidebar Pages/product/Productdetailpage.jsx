import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectproducts } from '../../../StoreRedux/productSlice';
// import { selectorders } from '../../../StoreRedux/orderSlice';
// import { selectUsers } from '../../../StoreRedux/UserSlice'
import { useSelector } from 'react-redux';
function Productdetailpage() {
    const bookdata = useSelector(selectproducts)
    // const orderdata = useSelector(selectorders)
    // const userdata = useSelector(selectUsers)
    const { productId } = useParams();
    console.log(productId);
    const [book, setBook] = useState(null);
    // const [user, setUser] = useState(null);
    useEffect(() => {
        // const order = orderdata.find(data => data._id === productId)
        const datadetail = bookdata.find(data => data._id === productId)
        setBook(datadetail);
       // eslint-disable-next-line
    }, [bookdata]);

    return (
        <div className="container mx-auto md:px-4">
            {book ? (
                <div className="bg-white grid grid-cols-2 rounded-lg shadow-md overflow-hidden">
                    <div className="col-span-2 md:col-span-1">
                        <img className="h-[300px] w-full" src={book.imageUrl} alt="fooditem" />
                    </div>
                    <div className="col-span-2 md:col-span-1  flex flex-col justify-center p-4">
                        <h3 className="text-2xl font-semibold text-purple-800">{book.title}</h3>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Price:</span> ${book.price}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Hosting Fee:</span> ${book.hostingfee}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Monthly Support</span> ${book.monthlysupport}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold"> Setup and Installation</span> ${book.installation}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Deposit</span> ${book.deposit}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Producttype:</span> {book.producttype}
                        </p>
                        <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">Power :</span> {book.power}
                            <p className="text-sm text-gray-600 my-2">
                            <span className="text-purple-600 font-bold">No of Machines: </span> {book.machines}
                          
                        </p>
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
