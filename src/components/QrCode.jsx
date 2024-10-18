// components/QRCodeDisplay.js

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {QRCodeSVG} from 'qrcode.react'; // Importing QRCode component
import { selectAdmin } from "../StoreRedux/adminSlice"; // Assuming this slice holds admin data

const QrCode = () => {
  const [tableNumber, setTableNumber] = useState(''); // State to store the table number
  const [qrData, setQrData] = useState(''); // State to store the URL data for the QR code

  // Get admin information from Redux store
  const admin = useSelector(selectAdmin);
  const adminId = admin?._id;

  console.log("Admin ID:", adminId);

  const handleGenerate = () => {
    if (!adminId || !tableNumber) {
      console.error('Admin ID or Table Number missing');
      return;
    }
    // Construct the URL for the QR code
    const qrCodeUrl = `http://localhost:3000/Admin/product/breakfast/${adminId}?table=${tableNumber}`;
    
    // Set the constructed URL as the data for the QR code
    setQrData(qrCodeUrl);
  };

  return (
    <div>
      <h1>Generate QR Code for Table</h1>

      {/* Input for table number */}
      <input
        type="text"
        placeholder="Enter Table Number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
      />

      {/* Button to trigger QR code generation */}
      <button onClick={handleGenerate}>Generate QR Code</button>

      {/* Display the generated QR code */}
      {qrData && (
        <div>
          <h2>QR Code for Table {tableNumber}</h2>
          <QRCodeSVG value={qrData} size={200} /> {/* Generates the QR code */}
        </div>
      )}
    </div>
  );
}

export default QrCode;
