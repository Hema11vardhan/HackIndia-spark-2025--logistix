import React, { createContext, useState, useContext } from 'react';

const LogisticsContext = createContext();

export const LogisticsProvider = ({ children }) => {
    const [logisticsData, setLogisticsData] = useState(null);

    const updateLogisticsData = (data) => {
        setLogisticsData(data);
    };

    return (
        <LogisticsContext.Provider value={{ logisticsData, updateLogisticsData }}>
            {children}
        </LogisticsContext.Provider>
    );
};

export const useLogistics = () => useContext(LogisticsContext);