import AuthABI from '../contracts/Auth.sol/Auth.json';
import ShipmentABI from '../contracts/Shipment.sol/Shipment.json';
import LogisticsRegistryABI from '../contracts/LogisticsRegistry.sol/LogisticsRegistry.json';
import ShipmentTrackingABI from '../contracts/ShipmentTracking.sol/ShipmentTracking.json';
import addresses from '../contracts/addresses.json';

export const contractConfig = {
  Auth: {
    address: addresses.auth,
    abi: AuthABI.abi
  },
  Shipment: {
    address: addresses.shipment,
    abi: ShipmentABI.abi
  },
  LogisticsRegistry: {
    address: addresses.logisticsRegistry,
    abi: LogisticsRegistryABI.abi
  },
  ShipmentTracking: {
    address: addresses.shipmentTracking,
    abi: ShipmentTrackingABI.abi
  }
}; 