import React, { useRef, useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode'; // Importing html5-qrcode
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Scanner.css';

const BarcodeScannerComponent = () => {
  const videoRef = useRef(null);
  const [barcodeResult, setBarcodeResult] = useState('No barcode detected');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraHidden, setCameraHidden] = useState(false);
  const html5QrcodeRef = useRef(null); // Reference for the Html5Qrcode instance

  useEffect(() => {
    const successToastId = 'success-toast-id'; // Unique ID for success toast
    const errorToastId = 'error-toast-id'; // Unique ID for error toast

    const startVideo = () => {
      const html5QrCode = new Html5Qrcode(videoRef.current.id);
      html5QrcodeRef.current = html5QrCode; // Store the instance in ref

      const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        if (isValidBarcode(decodedText)) {
          setBarcodeResult(decodedText);
          setIsScanning(false);
          setCameraHidden(true); // Hide the camera after successful scan
          setCameraStarted(false); // Update cameraStarted state
          if (!toast.isActive(successToastId)) {
            toast.success('QR Code successfully scanned!', { toastId: successToastId });
          }
        }
      };

      const qrCodeErrorCallback = (errorMessage) => {
        console.log('Error scanning barcode:', errorMessage);
        if (!toast.isActive(errorToastId)) {
          toast.error('Error scanning barcode.', { toastId: errorToastId });
        }
      };

      const config = { fps: 10, qrbox: 250 }; // QR code scanning config
      html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera
        config,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      ).catch(err => {
        console.log('Error starting camera:', err);
        if (!toast.isActive(errorToastId)) {
          toast.error('Error starting camera. Please check your camera.', { toastId: errorToastId });
        }
      });

      setIsScanning(true);
    };

    if (cameraStarted && !cameraHidden) {
      startVideo();
    }

    return () => {
      if (html5QrcodeRef.current) {
        html5QrcodeRef.current.stop().catch(err => {
          console.log('Error stopping the camera:', err);
        });
      }
    };
  }, [cameraStarted, cameraHidden]);

  const isValidBarcode = (barcodeText) => {
    return barcodeText && barcodeText.trim() !== '';
  };

  const toggleCamera = () => {
    if (cameraStarted) {
      setCameraStarted(false);
      setCameraHidden(true);
      setBarcodeResult('No barcode detected');
    } else {
      setCameraStarted(true);
      setCameraHidden(false);
    }
  };

  const copyToClipboard = () => {
    if (barcodeResult && barcodeResult !== 'No barcode detected') {
      navigator.clipboard.writeText(barcodeResult).then(() => {
        const toastId = 'copy-toast-id';
        if (!toast.isActive(toastId)) {
          toast.success('Barcode result copied to clipboard!', { toastId });
        }
      }).catch(error => {
        console.log('Error copying to clipboard:', error);
        toast.error('Error copying to clipboard.');
      });
    } else {
      toast.warn('No barcode result to copy.');
    }
  };

  return (
    <div>
      <div className='video-container'>
        <div id={videoRef.current ? videoRef.current.id : 'video'} style={{ width: '40%', height: 'auto' }}></div>
      </div>
      <div className='container-row'>
        <p className='out'>Result: {barcodeResult}</p>
        <div className='container2'>
          <button className="copy" onClick={copyToClipboard} disabled={barcodeResult === 'No barcode detected'}>
            <span data-text-end="Copied!" data-text-initial="Copy to clipboard" className="tooltip"></span>
            <span>
              {/* Your existing SVG icons for the button */}
            </span>
          </button>
        </div>
      </div>
      {isScanning && !cameraHidden && (
        <div className='load-comp'>
          <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </div>
      )}
      <button onClick={toggleCamera} className='btn1' style={{ margin: '15px' }}>
        {cameraStarted ? 'Stop Camera' : 'Start Camera'}
      </button>
      <ToastContainer />
    </div>
  );
};

export default BarcodeScannerComponent;
