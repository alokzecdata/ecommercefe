import React, { useState, useEffect } from 'react';
import { productService, orderService, userService } from '../services/api';
import socket from "../socket";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  
  // Data States
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Form State for Adding Product
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

useEffect(() => {
  // Listen for new orders
  socket.on("newOrder", (order) => {
    console.log("New order received:", order);
    setOrders((prev) => [...prev, order]); // append new order to state
  });

  // Cleanup when component unmounts
  return () => {
    socket.off("newOrder");
  };
}, []);

  // --- Fetch Data ---
  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data.products || data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data.orders || data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data.users || data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // --- Handlers ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('stock', productForm.stock);
      if (productImage) formData.append('image', productImage);

      await productService.createProduct(formData);
      alert('Product added successfully!');
      setProductForm({ name: '', description: '', price: '', stock: '' });
      setProductImage(null);
      fetchProducts();
    } catch (error) {
      alert(error.message || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert(error.message || 'Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      fetchOrders();
    } catch (error) {
      alert(error.message || 'Failed to update order status');
    }
  };

  const handleMakeAdmin = async (id) => {
    if (window.confirm('Make this user an admin?')) {
      try {
        await userService.markAdmin(id);
        fetchUsers();
      } catch (error) {
        alert(error.message || 'Failed to make admin');
      }
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn" onClick={() => setActiveTab('products')} style={{ opacity: activeTab === 'products' ? 1 : 0.7 }}>Products</button>
        <button className="btn" onClick={() => setActiveTab('orders')} style={{ opacity: activeTab === 'orders' ? 1 : 0.7 }}>Orders</button>
        <button className="btn" onClick={() => setActiveTab('users')} style={{ opacity: activeTab === 'users' ? 1 : 0.7 }}>Users</button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="form-container" style={{ marginLeft: 0, marginBottom: '2rem', maxWidth: '600px' }}>
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Price ($)</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Stock</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input type="file" onChange={e => setProductImage(e.target.files[0])} accept="image/*" />
              </div>
              <button type="submit" className="btn">Add Product</button>
            </form>
          </div>

          <h2>Manage Products</h2>
          {loading ? (
            <p style={{ marginTop: '1rem' }}>Loading products...</p>
          ) : products.length === 0 ? (
            <p style={{ marginTop: '1rem' }}>No products found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id || p.id}>
                      <td>{p.name}</td>
                      <td>${p.price}</td>
                      <td>{p.stock || p.countInStock || 0}</td>
                      <td>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => handleDeleteProduct(p._id || p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2>Manage Orders</h2>
          {loading ? (
            <p style={{ marginTop: '1rem' }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={{ marginTop: '1rem' }}>No orders found.</p>
          ) : (
            <div className="table-container" style={{ marginTop: '1rem' }}>
              <table>
                <thead><tr><th>Order ID</th><th>User</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id || o.id}>
                      <td>{o._id || o.id}</td>
                      <td>{o.user?.name || o.user?.email || 'N/A'}</td>
                      <td>${o.totalPrice || o.total || 0}</td>
                      <td>{o.status || 'Pending'}</td>
                      <td>
                        <select 
                          value={o.status || 'Pending'}
                          onChange={(e) => handleUpdateOrderStatus(o._id || o.id, e.target.value)}
                          style={{ padding: '0.25rem', borderRadius: '4px' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2>Manage Users</h2>
          {loading ? (
            <p style={{ marginTop: '1rem' }}>Loading users...</p>
          ) : users.length === 0 ? (
            <p style={{ marginTop: '1rem' }}>No users found.</p>
          ) : (
            <div className="table-container" style={{ marginTop: '1rem' }}>
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Admin</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id || u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.isAdmin ? 'Yes' : 'No'}</td>
                      <td>
                        {!u.isAdmin && (
                          <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => handleMakeAdmin(u._id || u.id)}>
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
