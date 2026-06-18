// Define the base URL for your backend API here
// If your backend is running on a different port or domain, change it here.
const BASE_URL = 'http://localhost:5000'; 

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Helper to handle standard API responses
const handleResponse = async (response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data;
};

// ==========================================
// PRODUCT APIs
// ==========================================
export const productService = {
  // Get all products
  // GET /products (or just / depending on your backend router mounting)
  // Assuming router is mounted at /api/products
  getProducts: () => 
    fetch(`${BASE_URL}/api/products`).then(handleResponse),

  // Get product by ID
  // GET /products/:id
  getProductById: (id) => 
    fetch(`${BASE_URL}/api/products/${id}`).then(handleResponse),

  // Create new product (Admin)
  // POST /products/add
  // Note: Uses FormData since backend expects upload.single("image")
  createProduct: (productData) => 
    fetch(`${BASE_URL}/api/products/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
        // Do NOT set Content-Type here, browser sets it automatically with boundary for FormData
      },
      body: productData,
    }).then(handleResponse),

  // Update product (Admin)
  // PUT /products/update/:id
  updateProduct: (id, productData) => 
    fetch(`${BASE_URL}/api/products/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(productData),
    }).then(handleResponse),

  // Delete product (Admin)
  // DELETE /products/delete/:id
  deleteProduct: (id) => 
    fetch(`${BASE_URL}/api/products/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
    }).then(handleResponse),
};

// ==========================================
// USER APIs
// ==========================================
export const userService = {
  // Signup
  // POST /users/signup
  signup: (userData) => 
    fetch(`${BASE_URL}/api/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(handleResponse),

  // Login
  // POST /users/login
  login: (credentials) => 
    fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse),

  // Get Profile
  // GET /users/profile
  getProfile: () => 
    fetch(`${BASE_URL}/api/users/profile`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Update Profile
  // PUT /users/profile
  updateProfile: (profileData) => 
    fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(profileData),
    }).then(handleResponse),

  // Get all users (Admin)
  // GET /users/
  getUsers: () => 
    fetch(`${BASE_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Get user by ID (Admin)
  // GET /users/:id
  getUserById: (id) => 
    fetch(`${BASE_URL}/api/users/${id}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Delete user (Admin)
  // DELETE /users/:id
  deleteUser: (id) => 
    fetch(`${BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Mark user as Admin (Admin)
  // PUT /users/mark-admin/:id
  markAdmin: (id) => 
    fetch(`${BASE_URL}/api/users/mark-admin/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),
};

// ==========================================
// CART APIs
// ==========================================
export const cartService = {
  // Get User Cart
  // GET /cart/
  getCart: () => 
    fetch(`${BASE_URL}/api/cart`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Add Item to Cart
  // POST /cart/
  addToCart: (productId, quantity = 1) => 
    fetch(`${BASE_URL}/api/cart/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ productId, quantity }),
    }).then(handleResponse),

  // Remove Item from Cart
  // DELETE /cart/:productId
  removeFromCart: (productId) => 
    fetch(`${BASE_URL}/api/cart/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),
};

// ==========================================
// ORDER APIs
// ==========================================
export const orderService = {
  // Checkout (Create Order from Cart)
  // POST /orders/
  checkout: (checkoutDetails) => 
    fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(checkoutDetails),
    }).then(handleResponse),

  // Get Current User's Orders
  // GET /orders/
  getUserOrders: () => 
    fetch(`${BASE_URL}/api/orders`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Get All Orders (Admin)
  // GET /orders/all
  getAllOrders: () => 
    fetch(`${BASE_URL}/api/orders/all`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse),

  // Update Order Status (Admin)
  // PUT /orders/:id/status
  updateOrderStatus: (id, status) => 
    fetch(`${BASE_URL}/api/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ status }),
    }).then(handleResponse),
};
