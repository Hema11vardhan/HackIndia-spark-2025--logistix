import React, { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import GoogleMapRoute from './GoogleMapRoute';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [estimatedArrival, setEstimatedArrival] = useState(null);
    const [availableSpaces, setAvailableSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        // Load available spaces from local storage
        const spaces = JSON.parse(localStorage.getItem('logisticsSpaces') || '[]');
        setAvailableSpaces(spaces);
    }, []);

    const handleSearch = () => {
        if (source && destination) {
            setShowMap(true);
            const processingTime = 1;
            const transitTime = 48;
            const now = new Date();
            const estimatedTime = new Date(now.getTime() + (processingTime + transitTime) * 60 * 60 * 1000);
            
            setEstimatedArrival({
                processingTime,
                transitTime,
                estimatedTime
            });

            // Filter spaces based on route
            const filteredSpaces = availableSpaces.filter(space => 
                space.source.toLowerCase() === source.toLowerCase() &&
                space.destination.toLowerCase() === destination.toLowerCase() &&
                space.status === 'Available'
            );

            if (filteredSpaces.length > 0) {
                setSelectedSpace(filteredSpaces[0]);
            } else {
                toast.info('No available spaces for this route');
            }
        }
    };

    const handlePayment = async () => {
        if (!selectedSpace) {
            toast.error('Please select a space first');
            return;
        }

        try {
            if (!window.ethereum) {
                toast.error("Please install MetaMask!");
                return;
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const paymentAmount = ethers.utils.parseEther(selectedSpace.price.toString());
            const tx = await signer.sendTransaction({
                to: "0xa674d0b7E3eF665e851C18c386094d6556d4A107", // Your payment address
                value: paymentAmount
            });

            await tx.wait();

            // Update space status
            const updatedSpaces = availableSpaces.map(space => 
                space.id === selectedSpace.id 
                    ? { ...space, status: 'Booked' }
                    : space
            );
            localStorage.setItem('logisticsSpaces', JSON.stringify(updatedSpaces));
            setAvailableSpaces(updatedSpaces);

            generatePDF(tx);
            toast.success("Payment successful! Downloading shipment details...");
        } catch (error) {
            console.error(error);
            toast.error("Payment failed: " + error.message);
        }
    };

    const generatePDF = (paymentDetails) => {
        const doc = new jsPDF();
        const newShipmentId = 'SHP' + Math.random().toString(36).substr(2, 9).toUpperCase();

        doc.setFontSize(20);
        doc.text('Shipment Details', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Shipment ID: ${newShipmentId}`, 20, 40);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
        doc.text(`Source: ${source}`, 20, 60);
        doc.text(`Destination: ${destination}`, 20, 70);
        doc.text(`Payment Amount: ${selectedSpace.price} ETH`, 20, 80);
        doc.text(`Transaction Hash: ${paymentDetails.hash}`, 20, 90);
        
        if (estimatedArrival) {
            doc.text('Estimated Delivery Details:', 20, 110);
            doc.text(`Processing Time: ${estimatedArrival.processingTime} hour`, 20, 120);
            doc.text(`Transit Time: ${estimatedArrival.transitTime} hours`, 20, 130);
            doc.text(`Expected Arrival: ${estimatedArrival.estimatedTime.toLocaleString()}`, 20, 140);
        }

        doc.save(`shipment-${newShipmentId}.pdf`);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Search Section */}
                <div className="col-md-12 mb-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3>Search Route</h3>
                        </div>
                        <div className="card-body bg-white">
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label>Source Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={source}
                                            onChange={(e) => setSource(e.target.value)}
                                            placeholder="Enter source location"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label>Destination</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            placeholder="Enter destination"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <button 
                                        className="btn btn-primary mt-4 w-100"
                                        onClick={handleSearch}
                                        disabled={!source || !destination}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                {showMap && (
                    <>
                        <div className="col-md-12 mb-4">
                            <div className="card">
                                <div className="card-header bg-primary text-white">
                                    <h3>Route Map</h3>
                                </div>
                                <div className="card-body bg-white">
                                    <GoogleMapRoute
                                        ref={mapRef}
                                        initialSource={source}
                                        initialDestination={destination}
                                    />
                                    {estimatedArrival && (
                                        <div className="mt-3">
                                            <h5>Estimated Delivery Time</h5>
                                            <p>Expected Arrival: {estimatedArrival.estimatedTime.toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedSpace && (
                            <div className="col-md-12 mb-4">
                                <div className="card">
                                    <div className="card-header bg-success text-white">
                                        <h3>Available Space Details</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h5>Dimensions</h5>
                                                <p>Length: {selectedSpace.dimensions.length}m</p>
                                                <p>Width: {selectedSpace.dimensions.width}m</p>
                                                <p>Height: {selectedSpace.dimensions.height}m</p>
                                            </div>
                                            <div className="col-md-6">
                                                <h5>Price</h5>
                                                <p>{selectedSpace.price} ETH</p>
                                                <button 
                                                    className="btn btn-success btn-lg w-100"
                                                    onClick={handlePayment}
                                                >
                                                    Pay {selectedSpace.price} ETH
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;