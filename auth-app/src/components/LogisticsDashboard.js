import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { toast } from 'react-toastify';

const LogisticsDashboard = () => {
    const [truckDimensions, setTruckDimensions] = useState({
        length: 10.6,
        width: 2.8,
        height: 3.4
    });

    const [freeSpace, setFreeSpace] = useState({
        length: 8.0,
        width: 2.4,
        height: 3.0
    });

    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [spaceAnalysis, setSpaceAnalysis] = useState(null);
    
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.position.set(10, 10, 10);
        scene.background = new THREE.Color(0xf5f5f5); // Light gray background

        // Enhanced lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-10, 5, -10);
        scene.add(backLight);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 5;
        controls.maxDistance = 50;
        controls.maxPolarAngle = Math.PI / 2;

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        controlsRef.current = controls;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (!sceneRef.current) return;

        // Clear existing meshes
        while(sceneRef.current.children.length > 0){ 
            sceneRef.current.remove(sceneRef.current.children[0]); 
        }

        // Add lights back
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        sceneRef.current.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(10, 10, 10);
        sceneRef.current.add(directionalLight);

        // Create truck container (outer box)
        const truckGeometry = new THREE.BoxGeometry(
            truckDimensions.length,
            truckDimensions.height,
            truckDimensions.width
        );
        
        // Create materials with darker colors
        const truckMaterial = new THREE.MeshPhongMaterial({
            color: 0x90CAF9, // Light blue
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const occupiedMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4A4A4A, // Dark gray
            transparent: true,
            opacity: 0.9
        });

        // Create wireframe for the truck
        const edgesGeometry = new THREE.EdgesGeometry(truckGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x2196F3 });
        const wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);

        // Create the free space visualization (reversed from occupied)
        const freeSpaceGeometry = new THREE.BoxGeometry(
            freeSpace.length,
            freeSpace.height,
            freeSpace.width
        );
        
        const freeSpaceMesh = new THREE.Mesh(freeSpaceGeometry, truckMaterial);
        
        // Calculate position to align with the left side
        freeSpaceMesh.position.x = -(truckDimensions.length - freeSpace.length) / 2;

        // Create the occupied space (full truck minus free space)
        const occupiedGeometry = new THREE.BoxGeometry(
            truckDimensions.length - freeSpace.length,
            truckDimensions.height,
            truckDimensions.width
        );
        
        const occupiedMesh = new THREE.Mesh(occupiedGeometry, occupiedMaterial);
        // Position occupied space on the right
        occupiedMesh.position.x = freeSpace.length / 2;

        // Create group and add all elements
        const group = new THREE.Group();
        group.add(wireframe);
        group.add(freeSpaceMesh);
        group.add(occupiedMesh);

        // Center the entire group
        group.position.x = 0;
        
        // Add grid helper with darker color
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x666666);
        sceneRef.current.add(gridHelper);

        sceneRef.current.add(group);

        // Update camera position for better view
        if (cameraRef.current) {
            cameraRef.current.position.set(8, 6, 8);
            cameraRef.current.lookAt(0, 0, 0);
        }

    }, [truckDimensions, freeSpace]);

    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setClearColor(0xf5f5f5); // Light gray background
        }
    }, []);

    const calculateSpace = () => {
        const totalVolume = truckDimensions.length * truckDimensions.width * truckDimensions.height;
        const freeVolume = freeSpace.length * freeSpace.width * freeSpace.height;
        const occupiedVolume = totalVolume - freeVolume;
        const freeSpacePercentage = (freeVolume / totalVolume) * 100;

        setSpaceAnalysis({
            totalVolume: totalVolume.toFixed(2),
            freeVolume: freeVolume.toFixed(2),
            occupiedVolume: occupiedVolume.toFixed(2),
            freeSpacePercentage: freeSpacePercentage.toFixed(1)
        });
    };

    const handleSaveSpace = () => {
        if (!source || !destination) {
            toast.error('Please enter source and destination');
            return;
        }

        const spaceData = {
            id: Date.now(),
            source: source.toLowerCase().trim(),
            destination: destination.toLowerCase().trim(),
            dimensions: {
                length: truckDimensions.length,
                width: truckDimensions.width,
                height: truckDimensions.height
            },
            freeSpace: {
                length: freeSpace.length,
                width: freeSpace.width,
                height: freeSpace.height
            },
            price: "0.000001", // Price in ETH
            status: "Available",
            timestamp: new Date().toLocaleString()
        };

        // Save to local storage for persistence
        const existingSpaces = JSON.parse(localStorage.getItem('logisticsSpaces') || '[]');
        localStorage.setItem('logisticsSpaces', JSON.stringify([...existingSpaces, spaceData]));

        toast.success('Space saved successfully!');

        // Reset form
        setSource('');
        setDestination('');
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h3>Route Details</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <label>Source Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    placeholder="Enter source location"
                                />
                            </div>
                            <div className="form-group mb-3">
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
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <h3>Truck Dimensions</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <label>Length (m): {truckDimensions.length}</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="4"
                                    max="12"
                                    step="0.1"
                                    value={truckDimensions.length}
                                    onChange={(e) => setTruckDimensions({
                                        ...truckDimensions,
                                        length: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Width (m): {truckDimensions.width}</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="2"
                                    max="4"
                                    step="0.1"
                                    value={truckDimensions.width}
                                    onChange={(e) => setTruckDimensions({
                                        ...truckDimensions,
                                        width: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Height (m): {truckDimensions.height}</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="2"
                                    max="4"
                                    step="0.1"
                                    value={truckDimensions.height}
                                    onChange={(e) => setTruckDimensions({
                                        ...truckDimensions,
                                        height: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <h3>Free Space</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <label>Length (m): {freeSpace.length}</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0"
                                    max={truckDimensions.length}
                                    step="0.1"
                                    value={freeSpace.length}
                                    onChange={(e) => setFreeSpace({
                                        ...freeSpace,
                                        length: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Width (m): {freeSpace.width}</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0"
                                    max={truckDimensions.width}
                                    step="0.1"
                                    value={freeSpace.width}
                                    onChange={(e) => setFreeSpace({
                                        ...freeSpace,
                                        width: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Height (m): {freeSpace.height}</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0"
                                    max={truckDimensions.height}
                                    step="0.1"
                                    value={freeSpace.height}
                                    onChange={(e) => setFreeSpace({
                                        ...freeSpace,
                                        height: parseFloat(e.target.value)
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">
                            <h3>3D Visualization</h3>
                        </div>
                        <div className="card-body">
                            <canvas 
                                ref={canvasRef} 
                                style={{ 
                                    width: '100%', 
                                    height: '400px',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            />
                            <div className="mt-3 text-muted">
                                <small>
                                    <i className="fas fa-info-circle"></i> Controls: 
                                    Click and drag to rotate • Scroll to zoom • Right-click to pan
                                </small>
                            </div>
                            <div className="mt-2">
                                <div className="d-flex align-items-center mb-2">
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#4a90e2',
                                        opacity: 0.2,
                                        marginRight: '8px'
                                    }}></div>
                                    <span>Total Space</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#27ae60',
                                        opacity: 0.6,
                                        marginRight: '8px'
                                    }}></div>
                                    <span>Occupied Space</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {spaceAnalysis && (
                        <div className="card mb-4">
                            <div className="card-header">
                                <h3>Space Analysis</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6">
                                        <h5>Total Volume</h5>
                                        <p>{spaceAnalysis.totalVolume} m³</p>
                                    </div>
                                    <div className="col-6">
                                        <h5>Free Volume</h5>
                                        <p>{spaceAnalysis.freeVolume} m³</p>
                                    </div>
                                    <div className="col-6">
                                        <h5>Occupied Volume</h5>
                                        <p>{spaceAnalysis.occupiedVolume} m³</p>
                                    </div>
                                    <div className="col-6">
                                        <h5>Free Space</h5>
                                        <p>{spaceAnalysis.freeSpacePercentage}%</p>
                                    </div>
                                </div>
                                <div className="progress">
                                    <div 
                                        className="progress-bar bg-success" 
                                        style={{width: `${spaceAnalysis.freeSpacePercentage}%`}}
                                    >
                                        {spaceAnalysis.freeSpacePercentage}% Free
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <button 
                        className="btn btn-primary btn-lg me-2"
                        onClick={calculateSpace}
                        disabled={!source || !destination}
                    >
                        Calculate Space
                    </button>
                    <button 
                        className="btn btn-success btn-lg"
                        onClick={handleSaveSpace}
                        disabled={!source || !destination || !spaceAnalysis}
                    >
                        Save Space
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogisticsDashboard;
