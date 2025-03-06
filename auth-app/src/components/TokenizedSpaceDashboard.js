import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import TruckSpaceService from '../services/TruckSpaceService';
import { toast } from 'react-toastify';
import './TokenizedSpaceDashboard.css';

const TokenizedSpaceDashboard = () => {
    const { web3, account } = useContext(Web3Context);
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [spaceService, setSpaceService] = useState(null);

    useEffect(() => {
        if (web3) {
            const service = new TruckSpaceService(web3.currentProvider);
            service.init().then(() => {
                setSpaceService(service);
                loadSpaces(service);
            });
        }
    }, [web3]);

    const loadSpaces = async (service) => {
        try {
            setLoading(true);
            const tokenIds = await service.contract.methods.getProviderSpaces(account).call();
            const spaceDetails = await Promise.all(
                tokenIds.map(id => service.getSpaceDetails(id))
            );
            setSpaces(spaceDetails);
        } catch (error) {
            console.error('Error loading spaces:', error);
            toast.error('Failed to load tokenized spaces');
        } finally {
            setLoading(false);
        }
    };

    const handleBookSpace = async (tokenId, price) => {
        try {
            await spaceService.bookSpace(tokenId, price, account);
            toast.success('Space booked successfully!');
            loadSpaces(spaceService);
        } catch (error) {
            console.error('Error booking space:', error);
            toast.error('Failed to book space');
        }
    };

    return (
        <div className="tokenized-space-dashboard">
            <h1>Tokenized Truck Spaces</h1>
            
            {loading ? (
                <div className="loading">Loading spaces...</div>
            ) : (
                <div className="spaces-grid">
                    {spaces.map((space, index) => (
                        <div key={index} className="space-card">
                            <div className="space-header">
                                <h3>Truck ID: {space.truckId}</h3>
                                <span className={`status ${space.isAvailable ? 'available' : 'booked'}`}>
                                    {space.isAvailable ? 'Available' : 'Booked'}
                                </span>
                            </div>
                            
                            <div className="space-details">
                                <p>Dimensions: {space.length}m × {space.width}m × {space.height}m</p>
                                <p>Volume: {space.volume}m³</p>
                                <p>Location: {space.location}</p>
                                <p>Price: {space.price} ETH</p>
                            </div>
                            
                            {space.isAvailable && (
                                <button 
                                    className="book-button"
                                    onClick={() => handleBookSpace(index, space.price)}
                                >
                                    Book Space
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TokenizedSpaceDashboard; 