import React from 'react';

const TopSellingProducts = () => {
  const products = [
    { name: 'Air Jordan 8', pieces: 752, img: 'public/stylish-phone-case.png' },
    { name: 'Air Jordan 5', pieces: 752, img: 'public/stylish-phone-case.png' },
    { name: 'Air Jordan 13', pieces: 752, img: 'public/stylish-phone-case.png' },
    { name: 'Nike Air Max', pieces: 752, img: 'public/stylish-phone-case.png' },
    { name: 'Nike Fly 3', pieces: 752, img: 'public/stylish-phone-case.png' },
  ];

  return (
    <div className="products-scroller">
      {products.map((product, index) => (
        <div key={index} className="product-card">
          <div className="product-image-bg">
            <img src={product.img} alt={product.name} />
          </div>
          <h4>{product.name}</h4>
          <p>{product.pieces} Pcs</p>
        </div>
      ))}
    </div>
  );
};

export default TopSellingProducts;