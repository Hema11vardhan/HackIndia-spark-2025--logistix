import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { NETWORKS } from '../config/contracts';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [networkId, setNetworkId] = useState(null);

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                const accounts = await web3Instance.eth.getAccounts();
                const netId = await web3Instance.eth.getChainId();
                
                // Check if we're on Sepolia
                if (netId !== 11155111) {
                    await switchToSepolia();
                }

                setWeb3(web3Instance);
                setAccount(accounts[0]);
                setNetworkId(netId);
            }
        } catch (error) {
            console.error('Error connecting to wallet:', error);
        }
    };

    const switchToSepolia = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
            });
        } catch (switchError) {
            // If Sepolia is not added to MetaMask, add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [NETWORKS.SEPOLIA],
                    });
                } catch (addError) {
                    console.error('Error adding Sepolia network:', addError);
                }
            }
        }
    };

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            setAccount(accounts[0]);
        };

        const handleChainChanged = (networkId) => {
            setNetworkId(parseInt(networkId));
            window.location.reload();
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    return (
        <Web3Context.Provider value={{ 
            web3, 
            account, 
            networkId, 
            connectWallet,
            isConnected: !!account
        }}>
            {children}
        </Web3Context.Provider>
    );
};