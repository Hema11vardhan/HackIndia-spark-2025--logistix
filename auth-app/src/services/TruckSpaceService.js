import Web3 from 'web3';
import TruckSpaceToken from '../artifacts/contracts/TruckSpaceToken.sol/TruckSpaceToken.json';

class TruckSpaceService {
    constructor(web3Provider) {
        this.web3 = new Web3(web3Provider);
        this.contract = null;
    }

    async init() {
        try {
            const contractAddress = "0x9d83e140330758a8fFD07F8Bd73e86ebcA8a5692";
            this.contract = new this.web3.eth.Contract(
                TruckSpaceToken.abi,
                contractAddress
            );
            
            // Verify contract is deployed
            const code = await this.web3.eth.getCode(contractAddress);
            if (code === '0x') {
                throw new Error('Contract not deployed at specified address');
            }
        } catch (error) {
            console.error('Failed to initialize contract:', error);
            throw error;
        }
    }

    async tokenizeSpace(spaceData, account) {
        try {
            console.log('Tokenizing space with params:', spaceData);

            // Convert dimensions to Wei
            const lengthInWei = this.web3.utils.toWei(spaceData.length.toString(), 'ether');
            const widthInWei = this.web3.utils.toWei(spaceData.width.toString(), 'ether');
            const heightInWei = this.web3.utils.toWei(spaceData.height.toString(), 'ether');
            const priceInWei = this.web3.utils.toWei(spaceData.price.toString(), 'ether');

            // Convert strings to bytes32
            const locationBytes = this.stringToBytes32(spaceData.location);
            const destinationBytes = this.stringToBytes32(spaceData.destination);
            const truckIdBytes = this.stringToBytes32(spaceData.truckId || 'Default');

            // Get the current gas price
            const gasPrice = await this.web3.eth.getGasPrice();
            
            // Prepare transaction parameters
            const params = {
                from: account,
                gasPrice: gasPrice,
                gas: 500000
            };

            // Call the contract method with properly formatted parameters
            const result = await this.contract.methods.tokenizeSpace(
                lengthInWei,
                widthInWei,
                heightInWei,
                locationBytes,
                destinationBytes,
                priceInWei,
                truckIdBytes
            ).send(params);

            console.log('Space tokenized successfully:', result);
            return result;
        } catch (error) {
            console.error('Failed to tokenize space:', error);
            if (error.code === -32603) {
                throw new Error('Transaction failed. Please check your MetaMask wallet and try again.');
            }
            throw error;
        }
    }

    async getProviderSpaces(address) {
        try {
            // Get token balance
            const balance = await this.contract.methods.balanceOf(address, 0).call();
            console.log('Provider balance:', balance);

            const tokens = [];
            for (let i = 0; i < balance; i++) {
                try {
                    const tokenId = await this.contract.methods.tokenOfOwnerByIndex(address, i).call();
                    const details = await this.contract.methods.getSpaceDetails(tokenId).call();
                    
                    tokens.push({
                        tokenId,
                        length: this.web3.utils.fromWei(details.length || '0', 'ether'),
                        width: this.web3.utils.fromWei(details.width || '0', 'ether'),
                        height: this.web3.utils.fromWei(details.height || '0', 'ether'),
                        location: this.web3.utils.hexToUtf8(details.location || '0x'),
                        destination: this.web3.utils.hexToUtf8(details.destination || '0x'),
                        price: this.web3.utils.fromWei(details.price || '0', 'ether'),
                        truckId: this.web3.utils.hexToUtf8(details.truckId || '0x'),
                        isAvailable: details.isAvailable,
                        provider: details.provider
                    });
                } catch (error) {
                    console.error(`Error fetching token ${i}:`, error);
                }
            }
            
            return tokens;
        } catch (error) {
            console.error('Failed to get provider spaces:', error);
            throw error;
        }
    }

    stringToBytes32(str) {
        if (!str) return this.web3.utils.rightPad('0x', 64);
        const hex = this.web3.utils.utf8ToHex(str);
        return this.web3.utils.rightPad(hex, 64);
    }

    async getSpaceDetails(tokenId) {
        try {
            const details = await this.contract.methods.getSpaceDetails(tokenId).call();
            return {
                length: this.web3.utils.fromWei(details.length, 'ether'),
                width: this.web3.utils.fromWei(details.width, 'ether'),
                height: this.web3.utils.fromWei(details.height, 'ether'),
                volume: this.web3.utils.fromWei(details.volume, 'ether'),
                location: details.location,
                price: this.web3.utils.fromWei(details.price, 'ether'),
                isAvailable: details.isAvailable,
                provider: details.provider,
                truckId: details.truckId,
                timestamp: new Date(details.timestamp * 1000)
            };
        } catch (error) {
            console.error('Failed to get space details:', error);
            throw error;
        }
    }

    async bookSpace(tokenId, price, account) {
        try {
            return await this.contract.methods.bookSpace(tokenId)
                .send({ 
                    from: account,
                    value: this.web3.utils.toWei(price.toString(), 'ether')
                });
        } catch (error) {
            console.error('Failed to book space:', error);
            throw error;
        }
    }
}

export default TruckSpaceService; 