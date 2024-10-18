// AdminPanel.js
import React, { useState } from 'react';
import {selectmessages,deletemessage} from "../../StoreRedux/messageSlice";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {serverUrl} from "../../config"
import {Loader} from "../../components/Loader/loader"
const Message = () => {
    const allmessages=useSelector(selectmessages)
    const [loading,setloading]=useState(false);
    const dispatch=useDispatch();
  const deleteMessage = async (delId) => {
    try {
        setloading(true);
    const delResponse = await axios.delete(
        `${serverUrl}/api/contact/deleteContact/${delId}`
      );
      if (delResponse.status === 200) {
        dispatch(deletemessage(delId));
        toast.success("Message deleted successfully");
        setloading(false);
      }
      else {
        toast.error("Failed to delete Message");
        setloading(false);

      }
    }catch (error) {
        setloading(false);
        console.log(error);
        toast.error("fail to delete  Message")
      }
  };

  return (
    <div>
   {allmessages && <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Us Messages</h1>
      {allmessages.map(msg => (
        <div key={msg.id} className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-4">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{msg.Name} {msg.lastname}</div>
            <p className="text-gray-700 text-base">{msg.email}</p>
            <p className="text-gray-700 text-base mt-2">{msg.message}</p>
            <button
              onClick={() => deleteMessage(msg._id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>}
    <Loader loading={loading} />
    </div>
  );
};

export default Message;
