import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

const PaymentForm = () => {
    const [amount, setAmount] = useState('');
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        // Generate a unique order ID using uuidv4
        const generatedOrderId = uuidv4();
        setOrderId(generatedOrderId); // Optionally set it in the state

        try {
            const response = await axios.get('http://localhost:5001/api/auth/phonepe', {
                amount: parseInt(amount) * 100, // Convert to paise
                orderId: orderId,
            });

            console.log('Payment Response:', response.data);

            if (response.data && response.data.redirectUrl) {
                // Redirect to PhonePe payment page
                window.location.href = response.data.redirectUrl;
            }
        } catch (error) {
            console.error('Payment initiation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>PhonePe Payment</h1>
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handlePayment} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default PaymentForm;
