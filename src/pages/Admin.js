import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../App";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { jsPDF } from "jspdf";
import "./Admin.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const chartColors = {
  gold: "#d4a373",
  darkBrown: "#3f2a1d",
  cream: "#f9e4b7",
  toasted: "#8b5e3c",
  lightGold: "#e6b98a",
  black: "#000000",
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Items Sold by Product", color: chartColors.black, font: { size: 20, family: "Georgia" } },
  },
  scales: {
    y: { beginAtZero: true, ticks: { color: chartColors.black }, grid: { color: chartColors.darkBrown } },
    x: { ticks: { color: chartColors.black } },
  },
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: { position: "right", labels: { color: chartColors.black, font: { family: "Arial", size: 14 } } },
    title: { display: true, text: "Sales Value Distribution", color: chartColors.black, font: { size: 20, family: "Georgia" } },
  },
};

const Admin = () => {
  const { sales, logout, addProduct, availableImages } = useContext(CartContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    img: "",
    imgType: "local",
  });
  const [activeSection, setActiveSection] = useState("dashboard"); // Sidebar state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Logout popup state

  const filterSales = () => {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (filter) {
      case "today": return sales.filter((order) => new Date(order.timestamp) >= startOfToday);
      case "week": return sales.filter((order) => new Date(order.timestamp) >= startOfWeek);
      case "month": return sales.filter((order) => new Date(order.timestamp) >= startOfMonth);
      case "year": return sales.filter((order) => new Date(order.timestamp) >= startOfYear);
      case "all":
      default: return sales;
    }
  };

  const filteredSales = filterSales();

  const calculateStats = (salesData) => {
    const itemsSold = salesData.reduce((sum, order) => sum + order.items.length, 0);
    const totalRevenue = salesData.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2);
    const byProduct = salesData.flatMap((order) => order.items).reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});
    const byValue = salesData.flatMap((order) => order.items).reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.price;
      return acc;
    }, {});

    return { itemsSold, totalRevenue, byProduct, byValue };
  };

  const { itemsSold, totalRevenue, byProduct, byValue } = calculateStats(filteredSales);

  const barData = {
    labels: Object.keys(byProduct),
    datasets: [{ label: "Items Sold", data: Object.values(byProduct), backgroundColor: chartColors.gold, borderColor: chartColors.darkBrown, borderWidth: 2 }],
  };

  const pieData = {
    labels: Object.keys(byValue),
    datasets: [{ label: "Sales Value", data: Object.values(byValue), backgroundColor: [chartColors.gold, chartColors.lightGold, chartColors.cream, chartColors.toasted, chartColors.darkBrown], borderColor: chartColors.cream, borderWidth: 2 }],
  };

  const handleLogoutClick = () => setShowLogoutPopup(true);

  const confirmLogout = () => {
    logout();
    setShowLogoutPopup(false);
    navigate("/");
  };

  const cancelLogout = () => setShowLogoutPopup(false);

  const generateInvoicePDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPos = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Bakery Sales Invoice", margin, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPos);
    yPos += 10;
    doc.text(`Filter: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`, margin, yPos);
    yPos += 15;

    filteredSales.forEach((order) => {
      const estimatedLines = order.items.length * 10 + 35;
      if (yPos + estimatedLines > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Order #${order.id}`, margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date(order.timestamp).toLocaleString()}`, margin, yPos);
      yPos += 10;

      order.items.forEach((item) => {
        if (yPos + 10 > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(`${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`, margin + 10, yPos);
        yPos += 10;
      });

      if (yPos + 10 > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(`Total: $${order.total}`, margin + 10, yPos);
      yPos += 15;
    });

    if (yPos + 30 > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Items Sold: ${itemsSold}`, margin, yPos);
    yPos += 10;
    doc.text(`Total Revenue: $${totalRevenue}`, margin, yPos);

    doc.save(`bakery_sales_invoice_${filter}.pdf`);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const imgValue = newProduct.imgType === "local" && newProduct.img
      ? availableImages[newProduct.img]
      : newProduct.img || "https://via.placeholder.com/250";
    const product = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      img: imgValue,
    };
    addProduct(product);
    setNewProduct({ name: "", price: "", category: "", description: "", img: "", imgType: "local" });
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>Bakery Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeSection === "add-product" ? "active" : ""}
            onClick={() => setActiveSection("add-product")}
          >
            Add Product
          </button>
          <button
            className={activeSection === "sales-log" ? "active" : ""}
            onClick={() => setActiveSection("sales-log")}
          >
            Sales Log
          </button>
          <button onClick={handleLogoutClick}>Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {activeSection === "dashboard" && (
          <>
            <header className="admin-header">
              <h1>Admin Dashboard</h1>
              <p>Manage your bakery with ease</p>
            </header>
            <section className="admin-stats">
              <StatCard title="Total Items Sold" value={itemsSold} />
              <StatCard title="Total Revenue" value={`$${totalRevenue}`} />
            </section>
            <section className="admin-charts">
              <ChartContainer><Bar data={barData} options={barOptions} /></ChartContainer>
              <ChartContainer><Pie data={pieData} options={pieOptions} /></ChartContainer>
            </section>
            <section className="admin-details">
              <h2>Sales by Product</h2>
              {Object.keys(byProduct).length === 0 ? (
                <p>No sales recorded yet.</p>
              ) : (
                <ul className="product-list">
                  {Object.entries(byProduct).map(([name, count]) => (
                    <li key={name} className="product-item">
                      <span>{name}</span>
                      <span>{count} sold</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {activeSection === "add-product" && (
          <section className="admin-add-product">
            <h2>Add New Product</h2>
            <form className="add-product-form" onSubmit={handleProductSubmit}>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleProductChange}
                placeholder="Product Name"
                required
              />
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleProductChange}
                placeholder="Price"
                step="0.01"
                min="0"
                required
              />
              <select
                name="category"
                value={newProduct.category}
                onChange={handleProductChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Cakes">Cakes</option>
                <option value="Bread">Bread</option>
                <option value="Pastries">Pastries</option>
              </select>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleProductChange}
                placeholder="Description"
                required
              />
              <select
                name="imgType"
                value={newProduct.imgType}
                onChange={handleProductChange}
              >
                <option value="local">Use Local Image</option>
                <option value="url">Use Image URL</option>
              </select>
              {newProduct.imgType === "local" ? (
                <select
                  name="img"
                  value={newProduct.img}
                  onChange={handleProductChange}
                >
                  <option value="">Select Image</option>
                  <option value="image1">Triple Chocolate Cake</option>
                  <option value="image2">Artisan Sourdough</option>
                  <option value="image3">Butter Croissant</option>
                  <option value="image4">Raspberry Tart</option>
                  <option value="image5">Whole Grain Loaf</option>
                  <option value="image6">Vanilla Cupcake</option>
                </select>
              ) : (
                <input
                  type="text"
                  name="img"
                  value={newProduct.img}
                  onChange={handleProductChange}
                  placeholder="Image URL (optional)"
                />
              )}
              <button type="submit" className="add-product-btn">Add Product</button>
            </form>
          </section>
        )}

        {activeSection === "sales-log" && (
          <section className="admin-sales-log">
            <div className="sales-log-header">
              <h2>Sales Log</h2>
              <div className="filter-buttons">
                <button onClick={() => setFilter("today")} className={filter === "today" ? "active" : ""}>Today</button>
                <button onClick={() => setFilter("week")} className={filter === "week" ? "active" : ""}>Week</button>
                <button onClick={() => setFilter("month")} className={filter === "month" ? "active" : ""}>Month</button>
                <button onClick={() => setFilter("year")} className={filter === "year" ? "active" : ""}>Year</button>
                <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
              </div>
              <button className="invoice-btn" onClick={generateInvoicePDF}>Download Invoices</button>
            </div>
            {filteredSales.length === 0 ? (
              <p>No sales recorded for this period.</p>
            ) : (
              <ul className="sales-list">
                {filteredSales.map((order) => (
                  <li key={order.id} className="sales-item">
                    <span>Order #{order.id}</span>
                    <span>{order.items.length} items - ${order.total}</span>
                    <span>{new Date(order.timestamp).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>Are You Sure?</h3>
            <p>Do you really want to log out?</p>
            <div className="popup-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>Yes</button>
              <button className="cancel-btn" onClick={cancelLogout}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h2>{title}</h2>
    <p>{value}</p>
  </div>
);

const ChartContainer = ({ children }) => (
  <div className="chart-container">{children}</div>
);

export default Admin;