import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../config/maps';
import '../styles/GoogleMapRoute.css';

const GoogleMapRoute = forwardRef(({ initialSource, initialDestination }, ref) => {
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [source, setSource] = useState(initialSource || '');
    const [destination, setDestination] = useState(initialDestination || '');
    const [isLoaded, setIsLoaded] = useState(false);

    const center = { lat: 20.5937, lng: 78.9629 }; // Center of India

    const calculateRoute = useCallback(async () => {
        if (!source || !destination || !isLoaded || !window.google) return;

        try {
            const directionsService = new window.google.maps.DirectionsService();
            
            const results = await directionsService.route({
                origin: source,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING
            });

            setDirectionsResponse(results);
            setDistance(results.routes[0].legs[0].distance.text);
            setDuration(results.routes[0].legs[0].duration.text);
        } catch (error) {
            console.error("Error calculating route:", error);
        }
    }, [source, destination, isLoaded]);

    useImperativeHandle(ref, () => ({
        calculateRoute
    }));

    useEffect(() => {
        if (initialSource && initialDestination) {
            setSource(initialSource);
            setDestination(initialDestination);
        }
    }, [initialSource, initialDestination]);

    useEffect(() => {
        if (isLoaded && source && destination) {
            calculateRoute();
        }
    }, [isLoaded, source, destination, calculateRoute]);

    const onLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div className="container mt-4">
            <div className="map-container">
                <LoadScript 
                    googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
                    libraries={["places"]}
                    onLoad={onLoad}
                >
                    <GoogleMap
                        mapContainerStyle={{
                            width: '100%',
                            height: '400px',
                            borderRadius: '8px'
                        }}
                        center={center}
                        zoom={5}
                    >
                        {directionsResponse && (
                            <DirectionsRenderer
                                directions={directionsResponse}
                                options={{
                                    polylineOptions: {
                                        strokeColor: '#2196F3',
                                        strokeWeight: 5
                                    }
                                }}
                            />
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>

            {distance && duration && (
                <div className="route-info mt-3">
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Distance:</h5>
                            <p>{distance}</p>
                        </div>
                        <div className="col-md-6">
                            <h5>Duration:</h5>
                            <p>{duration}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

GoogleMapRoute.displayName = 'GoogleMapRoute';

export default GoogleMapRoute; 