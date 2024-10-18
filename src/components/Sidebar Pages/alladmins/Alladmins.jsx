import React, { useEffect, useState } from "react";
// import { saveMiqatsToJSON } from "./createJson/createJson";
import { selectalladmins } from "../../../StoreRedux/alladminSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../Loader/loader";
import DeleteModal from "../../DeleteModal";

const Alladmins = () => {
  const [myusers, setmyusers] = useState([]);
  const [delId, setdelId] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const storeAllUsers = useSelector(selectalladmins);
    console.log(storeAllUsers);
  const dispatch = useDispatch();
  useEffect(() => {
    
    setmyusers(storeAllUsers);
    // console.log(storeAllUsers);
  }, [storeAllUsers, dispatch]);

//   const handleChange = async (status, id) => {
//     let changestatus = false;
//     if (status === true) {
//       changestatus = false;
//     }
//     else {
//       changestatus = true;
//     }
//     try {
//       setLoading(true)
//       const response = await axios.post(`${serverUrl}/api/users/${id}/update_user_status`, {
//         status: changestatus
//       })
//       console.log(response.data.user);
//       if (response && response.status === 200) {
//         setLoading(false)

//         dispatch(updateUserStatus(response.data.user))
//         toast.success(response.data.message)
//       }
//     } catch (error) {
//       setLoading(false)
//       if (error.response.status === 401) {
//         toast.error(error.response.message);
//       } else if (error.response.status === 400) {
//         toast.error(error.response.message);
//       } else if (error.response.status === 500) {
//         toast.error(error.response.message);

//       } else {
//         toast.error("Failed to Update user status")
//       }

//     }
//   }
  return (
    <>
      <div className="min-w-full overflow-x-auto">
        <h2 className="mr-3 font-bold text-2xl text-center mb-4 text-purple-700">All Admins</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-center min-w-[150px] text-md font-bold uppercase tracking-wider">
                  Profile
                </th>
                <th scope="col" className="px-3 py-3 text-center min-w-[200px] text-md font-bold uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-3 py-3 text-center min-w-[100px] text-md font-bold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myusers && myusers.length > 0 ? (
                myusers.map((user, index) => (
                  <tr key={index} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center font-medium  text-gray-900">
                      {!user.ProfileImageUrl || user.ProfileImageUrl === "" ? <img className="rounded-full h-16" src="/profile.jpg" alt="userImage" />
                        : <img className="rounded-full h-16" src={user.ProfileImageUrl} alt="userImage" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.adminemail}
                    </td>


                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setshowModal(true);
                          setdelId(user._id);
                        }}
                        className="ml-2 text-red-600 hover:text-red-900 text-2xl"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-2 font-semibold text-center">
                    No admin found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>
      <Loader loading={loading} />
      <DeleteModal
        setloading={setLoading}
        showModal={showModal}
        setshowModal={setshowModal}
        delId={delId}
        whatdelete="admin"
      />
    </>
  );
};

export default Alladmins;
