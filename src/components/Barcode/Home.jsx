import React, { useState,createElement } from 'react';
import BarcodeGenerator from './BarcodeGenerator';
import BarcodeScanner from './BarcodeScanner';
import { ToastContainer } from 'react-toastify';
import './Home.css';

function Home() {
  const [scannedValue, setScannedValue] = useState('');

  const handleDetected = (code) => {
    setScannedValue(code);
  };

  return (
    <div className="App">
      <div className='container1'>
      <div className='card1'>
        <h2 className='title1'>Barcode Generator</h2>
        <BarcodeGenerator/>
      </div>

      <div className='card1'>
        <h2 className='title1'>Barcode Scanner</h2>
        <BarcodeScanner onDetected={handleDetected} />
        {scannedValue && <p>Scanned Barcode: {scannedValue}</p>}
      </div>
      </div>
      <ToastContainer
        closeOnClick={true}
        className="custom-toast"/>
    </div>
  );
}

export default Home;
