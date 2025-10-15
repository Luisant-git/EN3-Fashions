import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import p1 from '/p1.png';
import p2 from '/p2.png';
import p3 from '/p3.png';
import p4 from '/p4.png';
import p5 from '/p5.png';
import p6 from '/p6.png';

const SubcategoryPage = () => {
    const { tag } = useParams();
    const navigate = useNavigate();
    
    const title = `${tag.charAt(0).toUpperCase() + tag.slice(1)}'s Collection`;
    
    const subcategories = [
        { name: 'Polo T-Shirts', image: p1 },
        { name: 'Round Neck T-Shirts', image: p2 },
        { name: 'Long Sleeve T-Shirts', image: p3 },
        { name: 'Track Pants', image: p4 },
        { name: 'Trousers', image: p6 },
        { name: 'Shorts', image: p5 }
    ];

    return (
        <div className="subcategory-page">
            <h1 className="subcategory-title">{title}</h1>
            <div className="subcategory-grid">
                {subcategories.map((subcat, index) => (
                    <div key={index} className="subcategory-card" onClick={() => navigate(`/category/${tag}`)}>
                        <img src={subcat.image} alt={subcat.name} />
                        <p>{subcat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubcategoryPage;