import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
    CONTRACT_ADDRESSES, 
    LOGISTICS_REGISTRY_ABI, 
    SHIPMENT_ABI,
    SPACE_OPTIMIZER_ABI 
} from '../../config/contracts';
import SpaceOptimizer from './SpaceOptimizer';

const LogisticsDashboard = () => {
    const [showSpaceOptimizer, setShowSpaceOptimizer] = useState(false);
    const [providerDetails, setProviderDetails] = useState(null);
    const [shipments, setShipments] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [spaceData, setSpaceData] = useState(null);

    const initializeProvider = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("Please install MetaMask!");
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            // Initialize contracts
            const registryContract = new ethers.Contract(
                CONTRACT_ADDRESSES.LOGISTICS_REGISTRY,
                LOGISTICS_REGISTRY_ABI,
                signer
            );

            const shipmentContract = new ethers.Contract(
                CONTRACT_ADDRESSES.SHIPMENT,
                SHIPMENT_ABI,
                signer
            );

            const spaceOptimizerContract = new ethers.Contract(
                CONTRACT_ADDRESSES.SPACE_OPTIMIZER,
                SPACE_OPTIMIZER_ABI,
                signer
            );

            // Load provider details
            const details = await registryContract.getLogisticsProvider(address);
            setProviderDetails(details);

            // Load shipments
            const shipmentCount = await shipmentContract.shipmentsByProvider(address);
            const shipmentPromises = [];
            for (let i = 0; i < shipmentCount.length; i++) {
                shipmentPromises.push(shipmentContract.shipments(shipmentCount[i]));
            }
            const shipmentData = await Promise.all(shipmentPromises);
            setShipments(shipmentData);

            // Load vehicles
            const vehicleCount = await shipmentContract.getVehicleCount(address);
            const vehiclePromises = [];
            for (let i = 0; i < vehicleCount; i++) {
                vehiclePromises.push(shipmentContract.vehicles(address, i));
            }
            const vehicleData = await Promise.all(vehiclePromises);
            setVehicles(vehicleData);

            // Load space optimization data
            const spaceOptimization = await spaceOptimizerContract.getSpaceOptimization(address);
            setSpaceData(spaceOptimization);

        } catch (error) {
            console.error("Error initializing provider:", error);
        }
    };

    useEffect(() => {
        initializeProvider();
    }, []);

    return (
        <div className="container mt-4">
            <button 
                className="btn btn-primary mb-4"
                onClick={() => setShowSpaceOptimizer(!showSpaceOptimizer)}
            >
                {showSpaceOptimizer ? 'Hide Space Optimizer' : 'Add Space'}
            </button>

            {showSpaceOptimizer && <SpaceOptimizer />}
            
            {/* Provider Details */}
            {providerDetails && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h3>Provider Details</h3>
                    </div>
                    <div className="card-body">
                        <p>Name: {providerDetails.name}</p>
                        <p>Status: {providerDetails.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                </div>
            )}

            {/* Space Optimization */}
            {spaceData && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h3>Space Optimization</h3>
                    </div>
                    <div className="card-body">
                        <p>Total Volume: {ethers.utils.formatUnits(spaceData.totalVolume, 2)} m³</p>
                        <p>Free Volume: {ethers.utils.formatUnits(spaceData.freeVolume, 2)} m³</p>
                        <p>Free Space: {ethers.utils.formatUnits(spaceData.freeSpacePercentage, 2)}%</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowSpaceOptimizer(true)}
                        >
                            Update Space
                        </button>
                    </div>
                </div>
            )}

            {/* Shipments */}
            <div className="card mb-4">
                <div className="card-header">
                    <h3>Active Shipments</h3>
                </div>
                <div className="card-body">
                    {shipments.map((shipment, index) => (
                        <div key={index} className="mb-3">
                            <p>From: {shipment.source}</p>
                            <p>To: {shipment.destination}</p>
                            <p>Status: {shipment.status}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vehicles */}
            <div className="card">
                <div className="card-header">
                    <h3>Registered Vehicles</h3>
                </div>
                <div className="card-body">
                    {vehicles.map((vehicle, index) => (
                        <div key={index} className="mb-3">
                            <p>Registration: {vehicle.registrationNumber}</p>
                            <p>Capacity: {ethers.utils.formatUnits(vehicle.capacity, 2)} m³</p>
                            <p>Status: {vehicle.available ? 'Available' : 'In Use'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogisticsDashboard; 