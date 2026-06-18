import React, { useState, useEffect, useContext } from 'react';
import { productService } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data.products || data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(productId, 1);
    // Optional: could replace alert with a nicer toast notification in the future
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", system-ui, sans-serif' }}>
      <style>{`
        .pro-loader-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1.5rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div className="pro-loader-spinner"></div>
      <div style={{ color: '#64748b', fontSize: '1.125rem', fontWeight: 500 }}>Curating products for you...</div>
    </div>
  );

  return (
    <div style={{ fontFamily: '"Inter", system-ui, sans-serif', paddingBottom: '4rem' }}>
      <style>{`
        .pro-hero { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 6rem 2rem; text-align: center; border-radius: 1.5rem; margin-bottom: 4rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); position: relative; overflow: hidden; }
        .pro-hero h1 { font-size: 3.5rem; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 1.25rem; position: relative; z-index: 1; }
        .pro-hero p { font-size: 1.25rem; color: #94a3b8; max-width: 600px; margin: 0 auto 2.5rem; position: relative; z-index: 1; line-height: 1.6; }
        .pro-btn { background: white; color: #0f172a; font-weight: 600; font-size: 1.125rem; padding: 1rem 2.5rem; border-radius: 9999px; text-decoration: none; display: inline-block; transition: all 0.2s ease-in-out; position: relative; z-index: 1; }
        .pro-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); }
        
        .pro-section-title { font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 2.5rem; letter-spacing: -0.025em; }
        
        .pro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2.5rem; }
        .pro-card { background: white; border-radius: 1.25rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); transition: all 0.3s ease; display: flex; flex-direction: column; border: 1px solid #f1f5f9; }
        .pro-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border-color: #e2e8f0; }
        .pro-image-wrapper { width: 100%; aspect-ratio: 1; overflow: hidden; background: #f8fafc; position: relative; }
        .pro-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .pro-card:hover .pro-image { transform: scale(1.08); }
        .pro-info { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
        .pro-title { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; line-height: 1.3; }
        .pro-desc { color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .pro-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
        .pro-price { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
        .pro-add-btn { background: #0f172a; color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s ease; }
        .pro-add-btn:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
        
        .pro-empty { text-align: center; padding: 6rem 2rem; background: #f8fafc; border-radius: 1.5rem; border: 2px dashed #e2e8f0; margin-top: 2rem; }
        .pro-empty h3 { color: #0f172a; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .pro-empty p { color: #64748b; font-size: 1rem; }
      `}</style>

      {/* Hero Banner */}
      <div className="pro-hero">
        <h1>Discover the Extraordinary</h1>
        <p>Elevate your lifestyle with our premium selection of curated products. Designed for those who demand the absolute best.</p>
        <a href="#products" className="pro-btn">Shop the Collection</a>
      </div>

      <h2 id="products" className="pro-section-title">Trending Now</h2>
      
      <div className="pro-grid">
        {products.map((product) => (
          <div key={product._id || product.id} className="pro-card">
            <div className="pro-image-wrapper">
              <img 
                src={product.image ? `http://localhost:5000${product.image}` : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                alt={product.name} 
                className="pro-image" 
              />
            </div>
            <div className="pro-info">
              <h3 className="pro-title">{product.name}</h3>
              <p className="pro-desc">{product.description || "A premium product built with incredible attention to detail and high-quality materials."}</p>
              
              <div className="pro-footer">
                <span className="pro-price">${product.price}</span>
                <button className="pro-add-btn" onClick={() => handleAddToCart(product._id || product.id)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="pro-empty">
          <h3>No products found</h3>
          <p>We are currently restocking our premium collection. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
