import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Leaf, MessageCircle, ExternalLink, Home, ShoppingBag, Plus } from "lucide-react";

// Données produits CBD - Images placeholder en attendant vos vraies photos
const products = [
  // Résines CBD
  { id: 1, name: "Afghan Gold", category: "resine", price: 8, image: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop&q=80", badge: "TOP" },
  { id: 2, name: "Moroccan Dream", category: "resine", price: 10, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&q=80", badge: null },
  { id: 3, name: "Nepal Temple", category: "resine", price: 12, image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=400&fit=crop&q=80", badge: "NEW" },
  { id: 4, name: "Blonde Libanaise", category: "resine", price: 9, image: "https://images.unsplash.com/photo-1457530378978-8bac673b8062?w=400&h=400&fit=crop&q=80", badge: null },
  // Fleurs CBD
  { id: 5, name: "Amnesia Haze", category: "fleur", price: 6, image: "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=400&h=400&fit=crop&q=80", badge: "TOP" },
  { id: 6, name: "OG Kush", category: "fleur", price: 7, image: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&h=400&fit=crop&q=80", badge: null },
  { id: 7, name: "Lemon Haze", category: "fleur", price: 6, image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=400&fit=crop&q=80", badge: "NEW" },
  { id: 8, name: "White Widow", category: "fleur", price: 8, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&q=80", badge: null },
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
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="catalogue-container" data-testid="catalogue">
      {/* Header Ticker */}
      <div className="ticker-header">
        <div className="ticker-content">
          <span>🌿 Bienvenue chez plant.nvls ! Livraison rapide • CBD Premium • Qualité garantie 🌿</span>
          <span>🌿 Bienvenue chez plant.nvls ! Livraison rapide • CBD Premium • Qualité garantie 🌿</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs" data-testid="category-tabs">
        <button 
          className={`tab-btn ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
          data-testid="tab-all"
        >
          Tout 🌿
        </button>
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

      {/* Products Grid */}
      <div className="products-grid" data-testid="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card" data-testid={`product-${product.id}`}>
            {product.badge && (
              <span className={`product-badge ${product.badge.toLowerCase()}`}>
                {product.badge}
              </span>
            )}
            <div className="product-image">
              <img src={product.image} alt={product.name} loading="lazy" />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <span className="product-category">
                {product.category === "resine" ? "RÉSINE" : "FLEUR"} 🌿
              </span>
              <div className="product-footer">
                <span className="product-price">{product.price}€/g</span>
                <button className="add-btn" data-testid={`add-${product.id}`}>
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
