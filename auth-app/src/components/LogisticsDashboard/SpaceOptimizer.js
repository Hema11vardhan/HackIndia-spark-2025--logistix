import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, SPACE_OPTIMIZER_ABI } from '../../config/contracts';

const SpaceOptimizer = () => {
    const [truckDimensions, setTruckDimensions] = useState({
        length: 6.0,
        width: 2.4,
        height: 2.6
    });

    const [freeSpace, setFreeSpace] = useState({
        length: 2.0,
        width: 2.4,
        height: 2.6
    });

    const calculateVolumes = () => {
        const totalVolume = truckDimensions.length * truckDimensions.width * truckDimensions.height;
        const freeVolume = freeSpace.length * freeSpace.width * freeSpace.height;
        const occupiedVolume = totalVolume - freeVolume;
        const freeSpacePercentage = (freeVolume / totalVolume * 100).toFixed(1);

        return {
            totalVolume: totalVolume.toFixed(2),
            freeVolume: freeVolume.toFixed(2),
            occupiedVolume: occupiedVolume.toFixed(2),
            freeSpacePercentage
        };
    };

    const handleUpdate = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const contract = new ethers.Contract(
                CONTRACT_ADDRESSES.SPACE_OPTIMIZER,
                SPACE_OPTIMIZER_ABI,
                signer
            );

            const volumes = calculateVolumes();

            // Convert dimensions to blockchain format (multiply by 100 to handle decimals)
            const truckDimensionsArray = [
                Math.floor(truckDimensions.length * 100),
                Math.floor(truckDimensions.width * 100),
                Math.floor(truckDimensions.height * 100)
            ];

            const freeSpaceArray = [
                Math.floor(freeSpace.length * 100),
                Math.floor(freeSpace.width * 100),
                Math.floor(freeSpace.height * 100)
            ];

            const tx = await contract.updateSpaceOptimization(
                truckDimensionsArray,
                freeSpaceArray,
                Math.floor(volumes.totalVolume * 100),
                Math.floor(volumes.occupiedVolume * 100),
                Math.floor(volumes.freeVolume * 100),
                Math.floor(volumes.freeSpacePercentage * 100)
            );

            await tx.wait();
            alert('Space optimization data updated on blockchain successfully!');

        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update space optimization data');
        }
    };

    useEffect(() => {
        const loadExistingData = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const address = await signer.getAddress();

                const contract = new ethers.Contract(
                    CONTRACT_ADDRESSES.SPACE_OPTIMIZER,
                    SPACE_OPTIMIZER_ABI,
                    provider
                );

                const data = await contract.getSpaceOptimization(address);
                
                // Convert blockchain data back to decimals
                setTruckDimensions({
                    length: data.truckDimensions[0] / 100,
                    width: data.truckDimensions[1] / 100,
                    height: data.truckDimensions[2] / 100
                });

                setFreeSpace({
                    length: data.freeSpace[0] / 100,
                    width: data.freeSpace[1] / 100,
                    height: data.freeSpace[2] / 100
                });

            } catch (error) {
                console.error('Error loading existing data:', error);
            }
        };

        loadExistingData();
    }, []);

    const volumes = calculateVolumes();

    return (
        <div className="space-optimizer p-4">
            <h2 className="mb-4">Truck Space Analyzer</h2>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h3>Total Truck Dimensions</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Length (m)</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="1"
                                    max="15"
                                    step="0.1"
                                    value={truckDimensions.length}
                                    onChange={(e) => setTruckDimensions({
                                        ...truckDimensions,
                                        length: parseFloat(e.target.value)
                                    })}
                                />
                                <input
                                    type="number"
                                    className="form-control"
                                    value={truckDimensions.length}
                                    onChange={(e) => setTruckDimensions({
                                        ...truckDimensions,
                                        length: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                            {/* Similar inputs for width and height */}
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <h3>Free Space Dimensions</h3>
                        </div>
                        <div className="card-body">
                            {/* Similar inputs for free space dimensions */}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Space Analysis</h3>
                        </div>
                        <div className="card-body">
                            <div className="analysis-item">
                                <h4>Total Volume</h4>
                                <p>{volumes.totalVolume} m³</p>
                            </div>
                            <div className="analysis-item">
                                <h4>Occupied Volume</h4>
                                <p>{volumes.occupiedVolume} m³</p>
                            </div>
                            <div className="analysis-item">
                                <h4>Free Volume</h4>
                                <p>{volumes.freeVolume} m³</p>
                            </div>
                            <div className="analysis-item">
                                <h4>Free Space</h4>
                                <div className="progress">
                                    <div 
                                        className="progress-bar bg-success" 
                                        style={{width: `${volumes.freeSpacePercentage}%`}}
                                    >
                                        {volumes.freeSpacePercentage}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        className="btn btn-primary mt-3 w-100"
                        onClick={handleUpdate}
                    >
                        Update Space Optimization
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpaceOptimizer; 