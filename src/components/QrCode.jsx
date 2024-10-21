import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';
import { selectAdmin } from '../StoreRedux/adminSlice';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications
import {serverUrl} from '../config.js'
const QrCode = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [qrCodeDetails, setQrCodeDetails] = useState(null); // New state for QR code details

  const admin = useSelector(selectAdmin);
  const adminId = admin?._id;

  // Fetch QR codes for the admin when the component loads
  useEffect(() => {
    if (adminId) {
      fetchQrCodes(adminId);
    }
  }, [adminId]);
  //dafadadfafa
  // Function to fetch QR codes from the backend
  const fetchQrCodes = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/qr/getQRCode/${adminId}`);
      setQrCodes(response.data); // Set QR codes returned by the backend

      // Optional: If you want to display the last created QR code
      if (response.data.length > 0) {
        setQrCodeDetails(response.data[response.data.length - 1]);
      }
    } catch (error) {
      console.error('Failed to fetch QR codes:', error);
    }
  };

  // Function to handle QR code generation
  const handleGenerate = async () => {
    if (!adminId || !tableNumber) {
      console.error('Admin ID or Table Number missing');
      return;
    }

    const qrCodeUrl = `http://localhost:5173/shop/${adminId}?table=${tableNumber}`;
    setQrData(qrCodeUrl);
    try {
      setLoading(true);
      // Post the QR code data to the backend without uploading to Cloudinary
      await axios.post(`${serverUrl}/api/qr/generateQRCode`, {
        admin: adminId,      // Send admin ID
        tableNumber,         // Send table number
        qrCodeUrl,          // Send the generated QR Code URL (not from Cloudinary)
      });
      // Fetch the updated list of QR codes
      fetchQrCodes(adminId);
      toast.success('QR Code generated and saved successfully!'); // Show success toast
      // Clear the input field
      setTableNumber('');
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toast.error('Failed to generate or save QR code'); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Generate QR Code for Table</h1>
      <input
        type="text"
        placeholder="Enter Table Number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        style={{ padding: '10px', margin: '10px 0', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button onClick={handleGenerate} disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        {loading ? 'Generating...' : 'Generate and Save QR Code'}
      </button>
      {qrData && (
        <div style={{ marginTop: '20px' }}>
          <h2>QR Code for Table {tableNumber}</h2>
          <QRCodeSVG value={qrData} id="qr-code-svg" size={200} />
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h2>All Generated QR Codes:</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {qrCodes.length > 0 ? (
            qrCodes.map((qrCode, index) => (
              <div key={index} style={{ flex: '1 1 calc(33.333% - 20px)', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                <p>Table Number: {qrCode.tableNumber}</p>
                <QRCodeSVG value={qrCode.qrCodeUrl} size={150} />
              </div>
            ))
          ) : (
            <p>No QR codes generated yet.</p>
          )}
        </div>
      </div>
      {/* Render the provided QR code response */}
      {qrCodeDetails && (
        <div style={{ marginTop: '20px', border: '1px solid #007bff', borderRadius: '8px', padding: '10px', backgroundColor: '#e7f1ff' }}>
          <h2>Latest Generated QR Code:</h2>
          <p>Table Number: {qrCodeDetails.tableNumber}</p>
          <QRCodeSVG value={qrCodeDetails.qrCodeUrl} size={200} />
          <p>QR Code URL: <a href={qrCodeDetails.qrCodeUrl} target="_blank" rel="noopener noreferrer">{qrCodeDetails.qrCodeUrl}</a></p>
          <p>Created At: {new Date(qrCodeDetails.createdAt.$date).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default QrCode;
