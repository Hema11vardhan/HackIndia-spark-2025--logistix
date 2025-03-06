import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './TruckSpaceAnalyzer.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TruckSpaceAnalyzer = () => {
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({
    truck: {
      length: 6.0,
      width: 2.4,
      height: 2.6
    },
    freeSpace: {
      length: 2.0,
      width: 2.4,
      height: 2.6
    }
  });

  const [analysis, setAnalysis] = useState({
    totalVolume: 0,
    occupiedVolume: 0,
    freeVolume: 0,
    freeSpacePercentage: 0
  });

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameRef = useRef(null);

  const dimensionLimits = {
    truck: {
      length: { min: 2, max: 20, step: 0.1 },
      width: { min: 1.5, max: 3.5, step: 0.1 },
      height: { min: 1.5, max: 4.5, step: 0.1 }
    },
    freeSpace: {
      length: { min: 0, max: 20, step: 0.1 },
      width: { min: 0, max: 3.5, step: 0.1 },
      height: { min: 0, max: 4.5, step: 0.1 }
    }
  };

  const calculateVolumes = useCallback(() => {
    const truckVolume = dimensions.truck.length * dimensions.truck.width * dimensions.truck.height;
    const freeVolume = dimensions.freeSpace.length * dimensions.freeSpace.width * dimensions.freeSpace.height;
    const occupiedVolume = truckVolume - freeVolume;
    const freeSpacePercentage = (freeVolume / truckVolume) * 100;

    setAnalysis({
      totalVolume: Number(truckVolume.toFixed(2)),
      occupiedVolume: Number(occupiedVolume.toFixed(2)),
      freeVolume: Number(freeVolume.toFixed(2)),
      freeSpacePercentage: Number(freeSpacePercentage.toFixed(1))
    });
  }, [dimensions]);

  const updateScene = useCallback(() => {
    if (!sceneRef.current) return;

    // Remove existing truck meshes
    sceneRef.current.children = sceneRef.current.children.filter(
      child => !(child instanceof THREE.Mesh && child.userData.type === 'truck')
    );

    // Create truck container
    const truckGeometry = new THREE.BoxGeometry(
      dimensions.truck.length,
      dimensions.truck.height,
      dimensions.truck.width
    );

    // Create wireframe
    const edges = new THREE.EdgesGeometry(truckGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x2196f3,
      linewidth: 2
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    wireframe.position.y = dimensions.truck.height / 2;
    wireframe.userData.type = 'truck';
    sceneRef.current.add(wireframe);

    // Create truck walls
    const truckMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2196f3,
      transparent: true,
      opacity: 0.15,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
    });

    const truckMesh = new THREE.Mesh(truckGeometry, truckMaterial);
    truckMesh.position.y = dimensions.truck.height / 2;
    truckMesh.castShadow = true;
    truckMesh.receiveShadow = true;
    truckMesh.userData.type = 'truck';
    sceneRef.current.add(truckMesh);

    // Create occupied space
    const occupiedGeometry = new THREE.BoxGeometry(
      dimensions.truck.length - dimensions.freeSpace.length,
      dimensions.truck.height,
      dimensions.truck.width
    );

    const occupiedMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff4081,
      transparent: true,
      opacity: 0.7,
      metalness: 0.1,
      roughness: 0.4,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2
    });

    const occupiedMesh = new THREE.Mesh(occupiedGeometry, occupiedMaterial);
    occupiedMesh.position.set(
      -dimensions.freeSpace.length / 2,
      dimensions.truck.height / 2,
      0
    );
    occupiedMesh.castShadow = true;
    occupiedMesh.receiveShadow = true;
    occupiedMesh.userData.type = 'truck';
    sceneRef.current.add(occupiedMesh);

    // Add helper axes
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.y = 0.01;
    sceneRef.current.add(axesHelper);
  }, [dimensions]);

  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    animationFrameRef.current = requestAnimationFrame(animate);
    controlsRef.current?.update();
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, []);

  useEffect(() => {
    const init = () => {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f2f5);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(12, 8, 12);
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        shadowMap: {
          enabled: true,
          type: THREE.PCFSoftShadowMap
        }
      });
      renderer.setSize(window.innerWidth * 0.6, window.innerHeight * 0.6);
      renderer.shadowMap.enabled = true;
      mountRef.current?.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Controls setup
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 5;
      controls.maxDistance = 50;
      controls.maxPolarAngle = Math.PI / 2 - 0.1;
      controlsRef.current = controls;

      // Initial scene update
      updateScene();
      animate();
    };

    init();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [animate, updateScene]);

  useEffect(() => {
    updateScene();
    calculateVolumes();
  }, [dimensions, updateScene, calculateVolumes]);

  const handleDimensionChange = (type, dimension, value) => {
    const newValue = parseFloat(value);
    if (isNaN(newValue)) return;

    setDimensions(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [dimension]: newValue
      }
    }));
  };

  const renderDimensionInput = (type, dimension, value) => {
    const limits = dimensionLimits[type][dimension];
    
    return (
      <div key={dimension} className="dimension-input">
        <label>{dimension.charAt(0).toUpperCase() + dimension.slice(1)} (m)</label>
        <div className="input-range-container">
          <input
            type="range"
            value={value}
            onChange={(e) => handleDimensionChange(type, dimension, e.target.value)}
            min={limits.min}
            max={limits.max}
            step={limits.step}
            className="dimension-range"
          />
          <input
            type="number"
            value={value}
            onChange={(e) => handleDimensionChange(type, dimension, e.target.value)}
            min={limits.min}
            max={limits.max}
            step={limits.step}
            className="dimension-number"
          />
        </div>
        <div className="range-limits">
          <span>{limits.min}m</span>
          <span>{limits.max}m</span>
        </div>
      </div>
    );
  };

  const saveSpaceAnalysis = () => {
    const analysisData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      dimensions: dimensions,
      analysis: analysis,
    };

    // Get existing analyses from localStorage
    const existingAnalyses = JSON.parse(localStorage.getItem('spaceAnalyses') || '[]');
    
    // Add new analysis
    const updatedAnalyses = [analysisData, ...existingAnalyses];
    
    // Save to localStorage
    localStorage.setItem('spaceAnalyses', JSON.stringify(updatedAnalyses));
    
    toast.success('Space analysis saved successfully!');
    navigate('/logistics-dashboard');
  };

  return (
    <div className="analyzer-container">
      <div className="analyzer-header">
        <h1>Truck Space Analyzer</h1>
        <div className="analyzer-actions">
          <button onClick={() => navigate('/logistics-dashboard')} className="back-btn">
            Back to Dashboard
          </button>
          <button onClick={saveSpaceAnalysis} className="save-btn">
            Save Analysis
          </button>
        </div>
      </div>

      <div className="analyzer-content">
        <div className="dimensions-panel">
          <div className="dimensions-section">
            <h2>Total Truck Dimensions</h2>
            {Object.entries(dimensions.truck).map(([key, value]) => 
              renderDimensionInput('truck', key, value)
            )}
          </div>

          <div className="dimensions-section">
            <h2>Free Space Dimensions</h2>
            {Object.entries(dimensions.freeSpace).map(([key, value]) => 
              renderDimensionInput('freeSpace', key, value)
            )}
          </div>

          <div className="analysis-section">
            <h2>Space Analysis</h2>
            <div className="analysis-grid">
              <div className="analysis-item">
                <label>Total Volume:</label>
                <span>{analysis.totalVolume} m³</span>
              </div>
              <div className="analysis-item">
                <label>Occupied Volume:</label>
                <span>{analysis.occupiedVolume} m³</span>
              </div>
              <div className="analysis-item">
                <label>Free Volume:</label>
                <span>{analysis.freeVolume} m³</span>
              </div>
              <div className="analysis-item">
                <label>Free Space:</label>
                <span>{analysis.freeSpacePercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="visualization-panel" ref={mountRef}>
          <div className="controls-hint">
            <p>Controls:</p>
            <ul>
              <li>Rotate: Click + Drag</li>
              <li>Zoom: Scroll wheel</li>
              <li>Pan: Right-click + Drag</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckSpaceAnalyzer; 