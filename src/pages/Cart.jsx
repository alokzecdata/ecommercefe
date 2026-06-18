import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Assuming cart items are populated with product details (e.g., item.product.price)
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Handle different possible backend structures
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Your Cart is Empty</h2>
        <Link to="/" className="btn" style={{ marginTop: '1rem' }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id || item.productId || item.product?._id}>
                <td>{item.product?.name || item.name || 'Product'}</td>
                <td>${item.product?.price || item.price}</td>
                <td>{item.quantity || 1}</td>
                <td>${((item.product?.price || item.price) * (item.quantity || 1)).toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => removeFromCart(item.product?._id || item.productId || item._id)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Total: ${calculateTotal()}
        </div>
        <button className="btn" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
