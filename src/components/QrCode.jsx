import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';
import { selectAdmin } from '../StoreRedux/adminSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';

const QrCode = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [generalQrData, setGeneralQrData] = useState('');
  const [selectedOption, setSelectedOption] = useState('table');

  const admin = useSelector(selectAdmin);
  const adminId = admin?._id;

  useEffect(() => {
    if (adminId) {
      fetchQrCodes(adminId);
    }
  }, [adminId]);

  const fetchQrCodes = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/qr/getQRCode/${adminId}`);
      setQrCodes(response.data);
      const generalQR = response.data.find((code) => code.category === 'general');
      if (generalQR) {
        setGeneralQrData(generalQR.qrCodeUrl);
      }
    } catch (error) {
      console.error('Failed to fetch QR codes:', error);
    }
  };

  const handleGenerate = async () => {
    if (!adminId) {
      console.error('Admin ID is missing');
      return;
    }

    let qrCodeUrl;
    const category = selectedOption === 'general' ? 'general' : 'table';

    if (selectedOption === 'general') {
      qrCodeUrl = `https://oddmenu.netlify.app/shop/${adminId}`;
      setGeneralQrData(qrCodeUrl);
    } else {
      if (!tableNumber) {
        toast.error('Please enter a table number');
        return;
      }
      qrCodeUrl = `https://oddmenu.netlify.app/shop/${adminId}?table=${tableNumber}`;
      setQrData(qrCodeUrl);
    }

    try {
      setLoading(true);
      await axios.post(`${serverUrl}/api/qr/generateQRCode`, {
        admin: adminId,
        tableNumber: selectedOption === 'general' ? null : tableNumber,
        qrCodeUrl,
        category,
      });
      fetchQrCodes();
      toast.success(`${selectedOption === 'general' ? 'General' : 'Table-specific'} QR Code generated and saved successfully!`);
      if (selectedOption === 'table') setTableNumber('');
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toast.error('Failed to generate or save QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (identifier) => {
    try {
      await axios.delete(`${serverUrl}/api/qr/deleteQRCode/${adminId}/${identifier}`);
      toast.success(`QR Code for ${identifier === 'general' ? 'general' : `table ${identifier}`} deleted successfully!`);
      fetchQrCodes();
    } catch (error) {
      console.error('Failed to delete QR code:', error);
      toast.error('Failed to delete QR code');
    }
  };

  const handleDownload = (qrCodeUrl, identifier) => {
    const svg = document.querySelector(`#qr-code-svg-${identifier} svg`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngFile;
      downloadLink.download = `qr-code-${identifier}.png`;
      downloadLink.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="p-5  mx-auto">
      <h1 className="text-4xl font-bold mb-5 text-purple-900">Generate QR Code</h1>
      <div className="mb-4">
        <label className="inline-flex items-center mr-4">
          <input
            type="radio"
            value="table"
            checked={selectedOption === 'table'}
            onChange={() => setSelectedOption('table')}
            className="mr-2"
          />
          Generate for Table Number {tableNumber}
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="general"
            checked={selectedOption === 'general'}
            onChange={() => setSelectedOption('general')}
            className="mr-2"
          />
          Generate General QR Code
        </label>
      </div>

      {selectedOption === 'table' && (
        <input
          type="text"
          placeholder="Enter Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="p-2 border rounded w-md mb-4"
        />
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`p-2 ml-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-purple-900 hover:bg-purple-800'}`}
      >
        {loading ? 'Generating...' : 'Generate QR Code'}
      </button>

      <div className="mt-10">
        {qrData && (
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Table QR Code {tableNumber}</h2>
            <div id={`qr-code-svg-${tableNumber}`}>
              <QRCodeSVG value={qrData} size={200} />
            </div>
            <button
              onClick={() => handleDownload(qrData, tableNumber)}
              className="mt-2 p-2 text-black bg-yellow-400 rounded hover:bg-yellow-500"
            >
              Download Table QR Code
            </button>
          </div>
        )}

        {generalQrData && (
          <div className="mb-5">
            <h2 className="text-xl font-semibold">General QR Code</h2>
            <div id="qr-code-general">
              <QRCodeSVG value={generalQrData} size={200} />
            </div>
            <button
              onClick={() => handleDownload(generalQrData, 'general')}
              className="mt-2 p-2 text-black bg-yellow-400 rounded hover:bg-yellow-500"
            >
              Download General QR Code
            </button>
          </div>
        )}
      </div>

      <div className="mt-10">
  <h2 className="text-xl font-semibold text-purple-900">All Generated QR Codes:</h2>
  <div className="flex flex-wrap gap-6">
    {qrCodes.length > 0 ? (
      qrCodes.map((qrCode, index) => (
        <div key={index} className="relative flex px-4 flex-col items-center border border-gray-300 rounded-lg m-2 p-2 bg-gray-100 shadow-md max-w-full">
          <p className="mb-2">{qrCode.category === 'general' ? 'General QR Code' : `Table Number: ${qrCode.tableNumber}`}</p>
          <div id={`qr-code-svg-${qrCode.tableNumber || 'general'}`}>
            <QRCodeSVG value={qrCode.qrCodeUrl} size={140} />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => handleDownload(qrCode.qrCodeUrl, qrCode.tableNumber || 'general')}
              className="p-2 text-black bg-yellow-400 rounded hover:bg-yellow-500"
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
            <button
              onClick={() => handleDelete(qrCode.tableNumber || 'general')}
              className="p-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))
    ) : (
      <p>No QR codes generated yet.</p>
    )}
  </div>
</div>

    </div>
  );
};

export default QrCode;
