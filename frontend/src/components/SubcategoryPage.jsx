import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubCategories } from '../api/subcategoryApi';
import LoadingSpinner from './LoadingSpinner';

const SubcategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState(null);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                setLoading(true);
                const data = await getSubCategories();
                const categoryId = parseInt(categoryName);
                const filtered = data.filter(sub => sub.category.id === categoryId);
                setSubcategories(filtered);
                if (filtered.length > 0) {
                    setCategoryInfo(filtered[0].category);
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubcategories();
    }, [categoryName]);

    if (loading) {
        return <div className="loading-container"><LoadingSpinner /></div>;
    }

    return (
        <div className="subcategory-page">
            <h1 className="subcategory-title">{categoryInfo?.name || 'Collection'}</h1>
            <div className="subcategory-grid">
                {subcategories.map((subcat) => (
                    <div key={subcat.id} className="subcategory-card" onClick={() => navigate(`/category/${categoryName}/products?sub=${subcat.id}`)}>
                        <img src={subcat.image} alt={subcat.name} />
                        <p>{subcat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubcategoryPage;