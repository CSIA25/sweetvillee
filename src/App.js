import React, { useState, useContext, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import "./App.css";
import image1 from "./assets/image1.jpg";
import image2 from "./assets/image2.avif";
import image3 from "./assets/image3.jpg";
import image4 from "./assets/image4.jpg";
import image5 from "./assets/image5.jpg";
import image6 from "./assets/image6.jpg";

export const CartContext = createContext();

function AppContent() {
  const location = useLocation();
  const { cart, userRole } = useContext(CartContext);

  const showNavbar = location.pathname !== "/" && location.pathname !== "/admin";
  const isCustomer = userRole === "customer";
  const isAdmin = userRole === "admin";

  return (
    <>
      {showNavbar && isCustomer && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={isCustomer ? <Home /> : <Navigate to="/" />} />
        <Route path="/about" element={isCustomer ? <About /> : <Navigate to="/" />} />
        <Route path="/shop" element={isCustomer ? <Shop /> : <Navigate to="/" />} />
        <Route path="/cart" element={isCustomer ? <Cart /> : <Navigate to="/" />} />
        <Route path="/checkout" element={isCustomer ? <Checkout /> : <Navigate to="/" />} />
        <Route path="/contact" element={isCustomer ? <Contact /> : <Navigate to="/" />} />
        <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const availableImages = { image1, image2, image3, image4, image5, image6 }; // Object of available images
  const [products, setProducts] = useState([
    { id: 1, name: "Triple Chocolate Cake", price: 29.99, category: "Cakes", img: image1, description: "A rich, moist cake layered with three types of chocolate—perfect for any celebration." },
    { id: 2, name: "Artisan Sourdough", price: 6.99, category: "Bread", img: image2, description: "Handcrafted with a crispy crust and tangy, chewy interior—baked daily." },
    { id: 3, name: "Butter Croissant", price: 3.99, category: "Pastries", img: image3, description: "Flaky, golden layers of buttery goodness, made fresh every morning." },
    { id: 4, name: "Raspberry Tart", price: 5.49, category: "Pastries", img: image4, description: "A sweet pastry crust filled with creamy custard and topped with fresh raspberries." },
    { id: 5, name: "Whole Grain Loaf", price: 7.49, category: "Bread", img: image5, description: "Nutty and wholesome, packed with grains for a hearty, healthy bite." },
    { id: 6, name: "Vanilla Cupcake", price: 4.29, category: "Cakes", img: image6, description: "A light, fluffy cupcake topped with creamy vanilla frosting—simple and sweet." },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Auth state changed - Logged in user:", user.email);
        setUserRole(user.email === "admin@secret.com" ? "admin" : "customer");
        setUserEmail(user.email);
      } else {
        console.log("Auth state changed - No user logged in");
        setUserRole(null);
        setUserEmail(null);
        setCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const quantityToAdd = product.quantity || 1;
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updatedCart.filter((item) => item.quantity > 0);
    });
  };

  const recordSale = (items) => {
    console.log("recordSale started with items:", items);
    const order = {
      id: Date.now(),
      items: items.map((item) => ({ ...item })),
      timestamp: new Date().toISOString(),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
      userId: auth.currentUser?.uid || "anonymous",
    };
    console.log("Recording sale locally:", order);
    setSales((prevSales) => [...prevSales, order]);
    setCart([]);
    console.log("Cart cleared after purchase");
  };

  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [
      ...prevProducts,
      { ...newProduct, id: prevProducts.length + 1 },
    ]);
  };

  const signup = async (email, password) => {
    try {
      console.log("Attempting signup with:", email);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Signup error:", error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", email);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        setUserRole(null);
        setUserEmail(null);
        setCart([]);
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const contextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    sales,
    recordSale,
    products,
    addProduct,
    availableImages, // Share the imported images
    userRole,
    userEmail,
    login,
    signup,
    logout,
  };

  return (
    <CartContext.Provider value={contextValue}>
      <Router>
        <div className="app-container">
          <AppContent />
        </div>
      </Router>
    </CartContext.Provider>
  );
}

export default App;