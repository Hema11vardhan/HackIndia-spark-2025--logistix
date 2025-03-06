import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PaymentManagement = ({ shipmentId, logisticsAddress }) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      // Add your payment processing logic here
      toast.success('Payment processed successfully');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-management bg-white rounded-lg shadow p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">Payment Management</h3>
      <p className="text-sm text-gray-600 mb-4">
        Shipment ID: {shipmentId}
      </p>
      <button
        onClick={handlePayment}
        disabled={processing}
        className={`w-full py-2 px-4 rounded ${
          processing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600'
        } text-white transition-colors`}
      >
        {processing ? 'Processing...' : 'Process Payment'}
      </button>
    </div>
  );
};

export default PaymentManagement; 