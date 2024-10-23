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
  const [qrCodeDetails, setQrCodeDetails] = useState(null);

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

      if (response.data.length > 0) {
        setQrCodeDetails(response.data[response.data.length - 1]);
      }
    } catch (error) {
      console.error('Failed to fetch QR codes:', error);
    }
  };

  const handleGenerate = async () => {
    if (!adminId || !tableNumber) {
      console.error('Admin ID or Table Number missing');
      return;
    }
    const qrCodeUrl = `https://oddmenu.netlify.app/shop/${adminId}?table=${tableNumber}`;
    setQrData(qrCodeUrl);
    try {
      setLoading(true);
      await axios.post(`${serverUrl}/api/qr/generateQRCode`, {
        admin: adminId,
        tableNumber,
        qrCodeUrl,
      });
      fetchQrCodes(adminId);
      toast.success('QR Code generated and saved successfully!');
      setTableNumber('');
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toast.error('Failed to generate or save QR code');
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (tableNumber) => {
    try {
      await axios.delete(`${serverUrl}/api/qr/deleteQRCode/${adminId}/${tableNumber}`);
      toast.success(`QR Code for table ${tableNumber} deleted successfully!`);
      fetchQrCodes(adminId);
    } catch (error) {
      console.error('Failed to delete QR code:', error);
      toast.error('Failed to delete QR code');
    }
  };
  const handleDownload = (qrCodeUrl, tableNumber) => {
    const svg = document.querySelector(`#qr-code-svg-${tableNumber} svg`);
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
      downloadLink.download = `qr-code-table-${tableNumber}.png`;
      downloadLink.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
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
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {loading ? 'Generating...' : 'Generate and Save QR Code'}
      </button>
      {qrData && (
        <div style={{ marginTop: '20px' }}>
          <h2>QR Code for Table {tableNumber}</h2>
          <div id={`qr-code-svg-${tableNumber}`}>
            <QRCodeSVG value={qrData} size={200} />
          </div>
          <button
            onClick={() => handleDownload(qrData, tableNumber)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Download QR Code
          </button>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h2>All Generated QR Codes:</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {qrCodes.length > 0 ? (
            qrCodes.map((qrCode, index) => (
              <div
                key={index}
                style={{
                  position: 'relative', // Make the container position relative
                  flex: '1 1 calc(33.333% - 20px)',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '8px',
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <p>Table Number: {qrCode.tableNumber}</p>
                <div id={`qr-code-svg-${qrCode.tableNumber}`}>
                  <QRCodeSVG value={qrCode.qrCodeUrl} size={150} />
                </div>
                <div className='flex flex-col mt-10 md:mr-1 mr-8' style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex' , gap: '10px' }}>
                  <button
                    onClick={() => handleDownload(qrCode.qrCodeUrl, qrCode.tableNumber)}
                    style={{
                      backgroundColor: '#ffc107',
                      color: '#000',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      padding: '8px',
                    }}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    onClick={() => handleDelete(qrCode.tableNumber)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      padding: '8px',
                    }}
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
