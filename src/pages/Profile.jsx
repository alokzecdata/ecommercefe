import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { orderService, userService } from '../services/api';

const Profile = () => {
  const { user, fetchProfile } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setEditData({ name: user.name || '', email: user.email || '' });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      setOrders(data.orders || data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(editData);
      await fetchProfile();
      setEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Profile Info */}
        <div className="form-container" style={{ margin: '0', flex: '1', minWidth: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Account Details</h2>
            {!editing && (
              <button className="btn" onClick={() => setEditing(true)} style={{ padding: '0.25rem 0.75rem' }}>Edit</button>
            )}
          </div>
          
          {editing ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={editData.name} 
                  onChange={(e) => setEditData({...editData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={editData.email} 
                  onChange={(e) => setEditData({...editData, email: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn">Save</button>
                <button type="button" className="btn" style={{ background: '#6b7280' }} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {user?.name}</p>
              <p style={{ marginTop: '0.5rem' }}><strong>Email:</strong> {user?.email}</p>
              <p style={{ marginTop: '0.5rem' }}><strong>Role:</strong> {user?.isAdmin ? 'Admin' : 'User'}</p>
            </div>
          )}
        </div>

        {/* Order History */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h2>Order History</h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            <div className="table-container" style={{ marginTop: '1rem' }}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id || order.id}>
                      <td>{order._id || order.id}</td>
                      <td>{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          background: order.status === 'Delivered' ? '#dcfce7' : '#fef9c3',
                          color: order.status === 'Delivered' ? '#166534' : '#854d0e'
                        }}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td>${order.totalPrice || order.total || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
