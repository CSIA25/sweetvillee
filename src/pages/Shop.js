import React, { useState, useContext } from "react";
import { CartContext } from "../App";
import "./Shop.css";


function Shop() {
  const { products, addToCart } = useContext(CartContext);
  const [filter, setFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const categories = ["All", ...new Set(products.map((p) => p.category))]; // Dynamic categories
  const filteredProducts = filter === "All" ? products : products.filter((p) => p.category === filter);


  const openPopup = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity when opening a new popup
  };

  const closePopup = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product, qty) => {
    const productWithQuantity = { ...product, quantity: qty };
    addToCart(productWithQuantity);
    if (selectedProduct) closePopup(); // Close popup only if it’s from the popup
  };

  const adjustQuantity = (change) => {
    setQuantity((prev) => Math.max(1, prev + change)); // Minimum quantity is 1
  };

  return (
    <div className="shop">
      <header className="shop-header">
        <h1>Shop Artisan Delights</h1>
        <p>Crafted with love, baked to perfection.</p>
      </header>

      <div className="shop-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${filter === category ? "active" : ""}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="shop-grid">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="shop-card"
            style={{ "--order": index }}
            onClick={() => openPopup(product)}
          >
            <img src={product.img} alt={product.name} className="shop-img" />
            <div className="shop-info">
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <button
                className="add-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the popup
                  handleAddToCart(product, 1); // Add 1 item directly from card
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Popup */}
      {selectedProduct && (
        <div className="product-popup-overlay" onClick={closePopup}>
          <div className="product-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={closePopup}>×</button>
            <img src={selectedProduct.img} alt={selectedProduct.name} className="popup-img" />
            <div className="popup-details">
              <h2>{selectedProduct.name}</h2>
              <p className="popup-price">${selectedProduct.price.toFixed(2)}</p>
              <p className="popup-description">{selectedProduct.description}</p>
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={() => adjustQuantity(-1)}>-</button>
                <span className="quantity">{quantity}</span>
                <button className="quantity-btn" onClick={() => adjustQuantity(1)}>+</button>
              </div>
              <button
                className="popup-add-btn"
                onClick={() => handleAddToCart(selectedProduct, quantity)}
              >
                Add {quantity} to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;