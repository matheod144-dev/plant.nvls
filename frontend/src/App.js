import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Leaf, MessageCircle, ExternalLink, Home, ShoppingBag, Plus, Minus, X, Send, Clock, User } from "lucide-react";

// Données produits
const products = [
  { 
    id: 1, 
    name: "Amnesia", 
    category: "fleur", 
    image: "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=400&h=400&fit=crop&q=80", 
    badge: "TOP",
    prices: [
      { qty: "1g", price: 10, grams: 1 },
      { qty: "2g", price: 20, grams: 2 },
      { qty: "5g", price: 40, grams: 5 },
      { qty: "10g", price: 80, grams: 10 },
      { qty: "25g", price: 190, grams: 25 },
    ]
  },
];

// Liens Telegram
const TELEGRAM_CONTACT = "https://t.me/+A0IQGf2DjC1kNDZk";
const TELEGRAM_ORDERS = "https://t.me/+dgR1-petSrYyMmJk";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Mini-App Landing Page
const MiniApp = () => {
  return (
    <div className="mini-app-container" data-testid="mini-app">
      <div className="background-pattern"></div>
      
      <div className="mini-app-header">
        <div className="logo-container" data-testid="logo">
          <Leaf className="logo-icon" />
          <span className="logo-text">plant.nvls</span>
        </div>
      </div>

      <div className="mini-app-content">
        <div className="logo-circle" data-testid="main-logo">
          <Leaf size={80} className="main-leaf-icon" />
        </div>
        
        <h1 className="brand-title">plant.nvls</h1>
        <p className="brand-subtitle">Premium • Qualité Supérieure</p>

        <div className="message-box" data-testid="welcome-message">
          <div className="message-header">
            <Leaf size={18} className="message-icon" />
            <span>plant.nvls Bot</span>
          </div>
          <p className="message-text">
            Bienvenue chez plant.nvls ! 🌿<br />
            Découvrez notre sélection premium.
          </p>
          <p className="message-hint">
            Utilisez les boutons ci-dessous pour naviguer 👇
          </p>
        </div>

        <div className="action-buttons">
          <a href="/catalogue" className="action-btn primary" data-testid="catalogue-btn">
            <ShoppingBag size={18} />
            <span>Catalogue</span>
          </a>
          <a href={TELEGRAM_CONTACT} target="_blank" rel="noopener noreferrer" className="action-btn secondary" data-testid="contact-btn">
            <MessageCircle size={18} />
            <span>Contact</span>
          </a>
          <button className="action-btn secondary" data-testid="links-btn">
            <ExternalLink size={18} />
            <span>Nos Liens</span>
          </button>
        </div>
      </div>

      <div className="bottom-nav">
        <a href="/catalogue" className="nav-btn catalogue-nav" data-testid="nav-catalogue">
          <ShoppingBag size={20} />
          <span>Catalogue</span>
        </a>
      </div>
    </div>
  );
};

// Catalogue Page avec Panier et Formulaire
const Catalogue = () => {
  const [activeCategory, setActiveCategory] = useState("fleur");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({ prenom: "", heure: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const filteredProducts = products.filter(p => p.category === activeCategory);
  const hasProducts = filteredProducts.length > 0;

  // Ajouter au panier
  const addToCart = (product, priceOption) => {
    const existingItem = cart.find(
      item => item.productId === product.id && item.qty === priceOption.qty
    );
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id && item.qty === priceOption.qty
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        qty: priceOption.qty,
        price: priceOption.price,
        grams: priceOption.grams,
        quantity: 1
      }]);
    }
  };

  // Modifier quantité
  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  // Supprimer du panier
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Calculer le total
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Passer à la commande
  const proceedToOrder = () => {
    setShowOrderForm(true);
  };

  // Envoyer commande
  const submitOrder = async () => {
    if (!orderForm.prenom.trim() || !orderForm.heure.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);

    // Construire le message
    let message = `🌿 *NOUVELLE COMMANDE*\n\n`;
    message += `👤 *Client:* ${orderForm.prenom}\n`;
    message += `🕐 *Heure souhaitée:* ${orderForm.heure}\n\n`;
    message += `📦 *Articles:*\n`;
    cart.forEach(item => {
      message += `  • ${item.name} (${item.qty}) x${item.quantity} = ${item.price * item.quantity}€\n`;
    });
    message += `\n💰 *TOTAL: ${totalPrice}€*`;

    try {
      // Envoyer via le backend (bot Telegram)
      const response = await fetch(`${BACKEND_URL}/api/send-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: orderForm.prenom,
          heure: orderForm.heure,
          cart: cart,
          total: totalPrice,
          message: message
        })
      });

      if (response.ok) {
        setOrderSuccess(true);
        setCart([]);
        setOrderForm({ prenom: "", heure: "" });
        setTimeout(() => {
          setShowCart(false);
          setShowOrderForm(false);
          setOrderSuccess(false);
        }, 3000);
      } else {
        // Fallback: ouvrir Telegram directement
        const encodedMessage = encodeURIComponent(message);
        window.open(`${TELEGRAM_ORDERS}?text=${encodedMessage}`, '_blank');
        setShowCart(false);
        setShowOrderForm(false);
        setCart([]);
      }
    } catch (error) {
      // Fallback: ouvrir Telegram directement
      const encodedMessage = encodeURIComponent(message);
      window.open(`${TELEGRAM_ORDERS}?text=${encodedMessage}`, '_blank');
      setShowCart(false);
      setShowOrderForm(false);
      setCart([]);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="catalogue-container" data-testid="catalogue">
      {/* Header Ticker */}
      <div className="ticker-header">
        <div className="ticker-content">
          <span>🌿 Disponible 24h/24 7j/7 • plant.nvls • Premium 🌿</span>
          <span>🌿 Disponible 24h/24 7j/7 • plant.nvls • Premium 🌿</span>
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
                  {product.category === "resine" ? "RÉSINE" : "FLEUR"} 🌿
                </span>
                
                {/* Grille de prix avec boutons d'ajout */}
                <div className="price-grid">
                  {product.prices.map((p, idx) => (
                    <button 
                      key={idx} 
                      className="price-item clickable"
                      onClick={() => addToCart(product, p)}
                      data-testid={`add-${product.id}-${p.qty}`}
                    >
                      <span className="price-qty">{p.qty}</span>
                      <span className="price-value">{p.price}€</span>
                      <Plus size={14} className="price-add-icon" />
                    </button>
                  ))}
                </div>
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
          <p>Notre sélection de {activeCategory === "resine" ? "résines" : "fleurs"} arrive très prochainement !</p>
          <p className="stay-tuned">Restez connectés 🌿</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="catalogue-nav">
        <a href="/" className="nav-item" data-testid="nav-home">
          <Home size={24} />
        </a>
        <a href={TELEGRAM_CONTACT} target="_blank" rel="noopener noreferrer" className="nav-item" data-testid="nav-chat">
          <MessageCircle size={24} />
        </a>
        <button 
          className={`nav-item cart-btn ${totalItems > 0 ? 'has-items' : ''}`} 
          onClick={() => setShowCart(true)}
          data-testid="nav-cart"
        >
          <ShoppingBag size={24} />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="cart-overlay" onClick={() => { setShowCart(false); setShowOrderForm(false); }}>
          <div className="cart-modal" onClick={e => e.stopPropagation()} data-testid="cart-modal">
            <div className="cart-header">
              <h2>{showOrderForm ? "Finaliser la commande" : "Votre Panier"}</h2>
              <button className="close-cart" onClick={() => { setShowCart(false); setShowOrderForm(false); }}>
                <X size={24} />
              </button>
            </div>

            {orderSuccess ? (
              <div className="order-success">
                <div className="success-icon">✓</div>
                <h3>Commande envoyée !</h3>
                <p>Nous vous contacterons bientôt 🌿</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="cart-empty">
                <ShoppingBag size={48} />
                <p>Votre panier est vide</p>
              </div>
            ) : showOrderForm ? (
              /* Formulaire de commande */
              <div className="order-form">
                <div className="order-summary">
                  <h4>Récapitulatif</h4>
                  {cart.map((item, index) => (
                    <div key={index} className="summary-item">
                      <span>{item.name} ({item.qty}) x{item.quantity}</span>
                      <span>{item.price * item.quantity}€</span>
                    </div>
                  ))}
                  <div className="summary-total">
                    <span>Total</span>
                    <span>{totalPrice}€</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <User size={18} />
                    Votre prénom
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez votre prénom"
                    value={orderForm.prenom}
                    onChange={(e) => setOrderForm({...orderForm, prenom: e.target.value})}
                    data-testid="input-prenom"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Clock size={18} />
                    Heure de retrait souhaitée
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 18h30, ce soir, demain 14h..."
                    value={orderForm.heure}
                    onChange={(e) => setOrderForm({...orderForm, heure: e.target.value})}
                    data-testid="input-heure"
                  />
                </div>

                <button 
                  className="submit-order-btn" 
                  onClick={submitOrder}
                  disabled={isSubmitting}
                  data-testid="submit-order"
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send size={20} />
                      Envoyer la commande
                    </>
                  )}
                </button>

                <button 
                  className="back-btn"
                  onClick={() => setShowOrderForm(false)}
                >
                  ← Retour au panier
                </button>
              </div>
            ) : (
              /* Liste du panier */
              <>
                <div className="cart-items">
                  {cart.map((item, index) => (
                    <div key={index} className="cart-item" data-testid={`cart-item-${index}`}>
                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-qty">{item.qty}</span>
                      </div>
                      <div className="cart-item-controls">
                        <button onClick={() => updateQuantity(index, -1)} data-testid={`decrease-${index}`}>
                          <Minus size={16} />
                        </button>
                        <span className="cart-item-quantity">{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, 1)} data-testid={`increase-${index}`}>
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="cart-item-price">
                        {item.price * item.quantity}€
                      </div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(index)}>
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <span className="cart-total-price">{totalPrice}€</span>
                  </div>
                  <button className="checkout-btn" onClick={proceedToOrder} data-testid="checkout-btn">
                    <Send size={20} />
                    Passer commande
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
