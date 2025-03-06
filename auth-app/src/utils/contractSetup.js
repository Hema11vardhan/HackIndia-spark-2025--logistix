import Web3 from 'web3';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import TruckSpaceToken from '../artifacts/contracts/TruckSpaceToken.sol/TruckSpaceToken.json';

export const setupProvider = async (web3Provider) => {
    try {
        const web3 = new Web3(web3Provider);
        const truckSpaceContract = new web3.eth.Contract(
            TruckSpaceToken.abi,
            CONTRACT_ADDRESSES.TRUCK_SPACE_TOKEN // Using the deployed contract address
        );

        return {
            web3,
            truckSpaceContract
        };
    } catch (error) {
        console.error('Error in setupProvider:', error);
        throw error;
    }
}; 