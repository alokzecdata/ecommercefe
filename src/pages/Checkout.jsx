import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await orderService.checkout({
        address,
        paymentMethod,
        items: cartItems
      });
      clearCart();
      alert('Order placed successfully!');
      navigate('/profile'); // Redirect to profile to see orders
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Checkout</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      
      <form onSubmit={handleCheckout}>
        <div className="form-group">
          <label>Shipping Address</label>
          <textarea 
            rows="4"
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
            placeholder="Enter full shipping address"
          />
        </div>
        
        <div className="form-group">
          <label>Payment Method</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          >
            <option value="card">Credit / Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn" 
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
