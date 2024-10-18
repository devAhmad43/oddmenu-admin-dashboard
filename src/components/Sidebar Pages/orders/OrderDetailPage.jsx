// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { selectproducts } from '../../../StoreRedux/productSlice';
// import { selectorders } from '../../../StoreRedux/orderSlice';
// import { useSelector } from 'react-redux';
// function OrderDetailPage() {
//     const bookdata = useSelector(selectproducts)
//     const orderdata = useSelector(selectorders)
//     const { orderId } = useParams();
//     const [book, setBook] = useState(null);
//     const [user, setUser] = useState(null);
//     useEffect(() => {
//         const order = orderdata.find(data => data._id === orderId)
//         const datadetail = bookdata.filter(product =>
//             order.product.some(idObj => idObj.productId === product._id)
//         );
//         // console.log(order.product);
//         console.log(bookdata);
//         console.log(datadetail);
//         setBook(datadetail);
//         console.log(datadetail)
//         const tableInfo = userdata.find(data => data._id === order.userId)
//         setUser(userInfo);
//         console.log(userInfo)
//         // eslint-disable-next-line
//     }, [bookdata]);
//     return (
//         <div className="container mx-auto md:px-4">
//             {book ?
//                 <div>

//                     {book.map((book1, index) => {
//                         return <div className="bg-white grid grid-cols-2 rounded-lg shadow-md overflow-hidden">
//                             <div className="col-span-2 md:col-span-1">
//                                 <img className="h-[300px] w-full" src={book1.imageUrl} alt="fooditem" />
//                             </div>
//                             <div className="col-span-2 md:col-span-1  flex flex-col justify-center p-4">
//                                 <h3 className="text-2xl font-semibold text-purple-800">{book1.title}</h3>
//                                 <p className="text-sm text-gray-600 my-2">
//                                     <span className="text-purple-600 font-bold">Price:</span>${book1.price}
//                                 </p>
//                                 <p className="text-sm text-gray-600 my-2">
//                                     <span className="text-purple-600 font-bold">Hosting Fee:</span>{book1.hostingfee}
//                                 </p>
//                                 <p className="text-sm text-gray-600 my-2">
//                                     <span className="text-purple-600 font-bold">Monthly Support</span> ${book1.monthlysupport}
//                                 </p>
//                                 <p className="text-sm text-gray-600 my-2">
//                                     <span className="text-purple-600 font-bold">Deposit </span> ${book1.deposit}
//                                 </p>
//                                 <p className="text-sm text-gray-600 my-2">
//                                     <span className="text-purple-600 font-bold">Setup and Installation</span> ${book1.installation}
//                                 </p>
//                                 <p className="text-sm text-gray-600 my-2">
//                                     <span className="text-purple-600 font-bold">Producttype:</span>{book1.producttype}
//                                 </p>
//                                 <p className="text-sm text-gray-600 my-2">
//                                     <span className="text-purple-600 font-bold">Power :</span>{book1.power}
//                                     <p className="text-sm text-gray-600 my-2">
//                                         <span className="text-purple-600 font-bold">No of Machines: </span>{book1.machines}
//                                     </p>
//                                 </p>
//                             </div>
//                             <div className='col-span-2 '>
//                                 <h1 className='text-2xl font-bold p-4 text-purple-900'>User Detail:</h1>
//                             </div>
//                             <div className="col-span-2 md:col-span-1  flex flex-col justify-center p-4">
//                                 <p className="text-sm text-gray-600 md:my-2">
//                                     <span className="text-purple-600 font-bold">Email: </span> {user.email}
//                                 </p>
//                                 <p className="text-sm text-gray-600 md:my-2">
//                                     <span className="text-purple-600 font-bold">Mobile Number: </span> {user.mobileNumber}
//                                 </p>

//                             </div>
//                             <div className="col-span-2 md:col-span-1 flex flex-col justify-center p-4">
//                                 <p className="text-sm text-gray-600 md:my-2">
//                                     <span className="text-purple-600 font-bold">Address: </span> {user.address}
//                                 </p>

//                             </div>
//                         </div>
//                     })}
//                 </div>


//                 : (
//                     <p>Loading...</p>
//                 )}
//         </div>
//     );
// }

// export default OrderDetailPage;
