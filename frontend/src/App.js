import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Leaf, MessageCircle, ExternalLink, Home, ShoppingBag } from "lucide-react";

// Données produits CBD
const products = [
  // Fleurs CBD - Seul produit disponible pour le moment
  { 
    id: 1, 
    name: "Amnesia", 
    category: "fleur", 
    image: "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=400&h=400&fit=crop&q=80", 
    badge: "TOP",
    prices: [
      { qty: "1g", price: 10 },
      { qty: "2g", price: 20 },
      { qty: "5g", price: 40 },
      { qty: "10g", price: 80 },
      { qty: "25g", price: 190 },
    ]
  },
];

// Mini-App Landing Page
const MiniApp = () => {
  return (
    <div className="mini-app-container" data-testid="mini-app">
      {/* Background Pattern */}
      <div className="background-pattern"></div>
      
      {/* Header */}
      <div className="mini-app-header">
        <div className="logo-container" data-testid="logo">
          <Leaf className="logo-icon" />
          <span className="logo-text">plant.nvls</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mini-app-content">
        {/* Logo Circle */}
        <div className="logo-circle" data-testid="main-logo">
          <Leaf size={80} className="main-leaf-icon" />
        </div>
        
        <h1 className="brand-title">plant.nvls</h1>
        <p className="brand-subtitle">CBD Premium • Qualité Supérieure</p>

        {/* Message Box */}
        <div className="message-box" data-testid="welcome-message">
          <div className="message-header">
            <Leaf size={18} className="message-icon" />
            <span>plant.nvls Bot</span>
          </div>
          <p className="message-text">
            Bienvenue chez plant.nvls ! 🌿<br />
            Découvrez notre sélection premium de CBD.
          </p>
          <p className="message-hint">
            Utilisez les boutons ci-dessous pour naviguer 👇
          </p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <a href="/catalogue" className="action-btn primary" data-testid="catalogue-btn">
            <ShoppingBag size={18} />
            <span>Catalogue CBD</span>
          </a>
          <button className="action-btn secondary" data-testid="contact-btn">
            <MessageCircle size={18} />
            <span>Contact</span>
          </button>
          <button className="action-btn secondary" data-testid="links-btn">
            <ExternalLink size={18} />
            <span>Nos Liens</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <a href="/catalogue" className="nav-btn catalogue-nav" data-testid="nav-catalogue">
          <ShoppingBag size={20} />
          <span>Catalogue</span>
        </a>
      </div>
    </div>
  );
};

// Catalogue Page
const Catalogue = () => {
  const [activeCategory, setActiveCategory] = useState("fleur");
  
  const filteredProducts = products.filter(p => p.category === activeCategory);
  const hasProducts = filteredProducts.length > 0;

  return (
    <div className="catalogue-container" data-testid="catalogue">
      {/* Header Ticker */}
      <div className="ticker-header">
        <div className="ticker-content">
          <span>🌿 Disponible 24h/24 7j/7 • plant.nvls • CBD Premium 🌿</span>
          <span>🌿 Disponible 24h/24 7j/7 • plant.nvls • CBD Premium 🌿</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs" data-testid="category-tabs">
        <button 
          className={`tab-btn ${activeCategory === "fleur" ? "active" : ""}`}
          onClick={() => setActiveCategory("fleur")}
          data-testid="tab-fleurs"
        >
          Fleurs 🌸
        </button>
        <button 
          className={`tab-btn ${activeCategory === "resine" ? "active" : ""}`}
          onClick={() => setActiveCategory("resine")}
          data-testid="tab-resines"
        >
          Résines 🧱
        </button>
      </div>

      {/* Products Grid or Coming Soon */}
      {hasProducts ? (
        <div className="products-grid" data-testid="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card-full" data-testid={`product-${product.id}`}>
              {product.badge && (
                <span className={`product-badge ${product.badge.toLowerCase()}`}>
                  {product.badge}
                </span>
              )}
              <div className="product-image-large">
                <img src={product.image} alt={product.name} loading="lazy" />
              </div>
              <div className="product-info-full">
                <h3 className="product-name-large">{product.name}</h3>
                <span className="product-category-label">
                  {product.category === "resine" ? "RÉSINE CBD" : "FLEUR CBD"} 🌿
                </span>
                
                {/* Grille de prix */}
                <div className="price-grid">
                  {product.prices.map((p, idx) => (
                    <div key={idx} className="price-item">
                      <span className="price-qty">{p.qty}</span>
                      <span className="price-value">{p.price}€</span>
                    </div>
                  ))}
                </div>

                <a href="https://t.me/+A0IQGf2DjC1kNDZk" target="_blank" rel="noopener noreferrer" className="order-btn" data-testid={`order-${product.id}`}>
                  <ShoppingBag size={18} />
                  Commander
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="coming-soon" data-testid="coming-soon">
          <div className="coming-soon-icon">
            <Leaf size={60} />
          </div>
          <h2>Nouveaux produits bientôt disponibles</h2>
          <p>Notre sélection de {activeCategory === "resine" ? "résines" : "fleurs"} CBD arrive très prochainement !</p>
          <p className="stay-tuned">Restez connectés 🌿</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="catalogue-nav">
        <a href="/" className="nav-item" data-testid="nav-home">
          <Home size={24} />
        </a>
        <button className="nav-item" data-testid="nav-chat">
          <MessageCircle size={24} />
        </button>
        <button className="nav-item" data-testid="nav-cart">
          <ShoppingBag size={24} />
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MiniApp />} />
          <Route path="/catalogue" element={<Catalogue />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
