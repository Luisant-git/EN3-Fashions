import React from 'react';

const SubcategoryPage = ({ title, tag, setView }) => {
    const subcategories = [
        { name: 'Polo T-Shirts', image: '/p1.png' },
        { name: 'Round Neck T-Shirts', image: '/p2.png' },
        { name: 'Long Sleeve T-Shirts', image: '/p3.png' },
        { name: 'Track Pants', image: '/p4.png' },
        { name: 'Trousers', image: '/p6.png' },
        { name: 'Shorts', image: '/p5.png' }
    ];

    return (
        <div className="subcategory-page">
            <h1 className="subcategory-title">{title}</h1>
            <div className="subcategory-grid">
                {subcategories.map((subcat, index) => (
                    <div key={index} className="subcategory-card" onClick={() => setView({ page: 'category', title: subcat.name, filter: { type: 'tag', value: tag } })}>
                        <img src={subcat.image} alt={subcat.name} />
                        <p>{subcat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubcategoryPage;