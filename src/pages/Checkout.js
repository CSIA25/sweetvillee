import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../App";
import emailjs from "@emailjs/browser";
import "./Checkout.css";

function Checkout() {
  const { cart, recordSale } = useContext(CartContext); 
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); 
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const sendEmail = (order) => {
    const orderDetails = cart.map(item => `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join("\n");
    const shippingAddress = `${fullName}, ${address}, ${city}, ${zipCode}`;

    const templateParamsCustomer = {
      to_email: email || "customer@example.com", 
      customer_name: fullName,
      order_id: order.id,
      order_details: orderDetails,
      total: order.total,
      shipping_address: shippingAddress,
    };

    const templateParamsOwner = {
      to_email: "parth.spam.mails@gmail.com", 
      customer_name: fullName,
      order_id: order.id,
      order_details: orderDetails,
      total: order.total,
      shipping_address: shippingAddress,
    };

    
    emailjs.send("service_7mgvdtt", "template_skv6n0q", templateParamsCustomer, "-mN9eY7IAqNYUbbZ_")
      .then(() => console.log("Customer email sent!"))
      .catch(error => console.error("Customer email error:", error));

    
    emailjs.send("service_7mgvdtt", "template_skv6n0q", templateParamsOwner, "-mN9eY7IAqNYUbbZ_")
      .then(() => console.log("Owner email sent!"))
      .catch(error => console.error("Owner email error:", error));
  };

  const mockPaymentProcess = () => {
    return new Promise((resolve) => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        resolve("Payment successful!");
      }, 2000); 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty! Add some goodies first.");
      return;
    }

    console.log("Form submitted - Cart length:", cart.length);
    console.log("Calling recordSale with:", cart);

    recordSale(cart);
    const order = {
      id: Date.now(),
      items: cart,
      total: total,
    };

    await mockPaymentProcess();
    alert("Payment processed successfully!");

    sendEmail(order);

    console.log("recordSale completed");
    alert("Order placed successfully!");
    navigate("/home");
  };

  return (
    <div className="checkout">
      <header className="checkout-header">
        <h1>Checkout</h1>
        <p>Review your order and complete your purchase.</p>
      </header>

      {cart.length === 0 ? (
        <p className="empty-message">Your cart is empty! Add some goodies first.</p>
      ) : (
        <div className="checkout-container">
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            {cart.map((item, index) => (
              <div key={item.id || index} className="checkout-item">
                <img src={item.img} alt={item.name} className="checkout-img" />
                <div className="checkout-details">
                  <h3>{item.name}</h3>
                  <p>
                    ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <h2 className="checkout-total">Total: ${total}</h2>
          </div>

          <div className="checkout-form">
            <h2>Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                required
              />
              <input
                type="email"
                placeholder="Email (for order confirmation)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="form-input"
                required
              />

              <h2>Payment Information</h2>
              <input
                type="text"
                placeholder="Card Number (e.g., 1234 5678 9012 3456)"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="form-input"
                required
              />
              <div className="payment-row">
                <input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="form-input half-width"
                  required
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="form-input half-width"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
