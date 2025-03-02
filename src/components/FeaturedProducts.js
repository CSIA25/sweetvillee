import React from "react";

function FeaturedProducts() {
  const products = [
    { name: "Artisan Sourdough", price: "$5.99", img: "https://i.postimg.cc/cHXmNcqB/image.png" },
    { name: "Chocolate Croissant", price: "$3.49", img: "https://i.postimg.cc/d0Wb5rWg/image.png" },
    { name: "Velvet Cake", price: "$25.99", img: "https://i.postimg.cc/7hPXdWfV/image.png" },
  ];

  return (
    <section className="featured">
      <h2>Our Favorites</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <img src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;