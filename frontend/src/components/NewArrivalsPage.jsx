import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveProducts } from '../api/productApi';
import ProductCard from './ProductCard';
import FiltersComponent from './FiltersComponent';
import LoadingSpinner from './LoadingSpinner';

const NewArrivalsPage = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [gridLoading, setGridLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const firstRender = useRef(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getActiveProducts();
                const newArrivals = data.filter(p => p.newArrivals === true);
                setProducts(newArrivals);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isFilterOpen]);
    
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        setGridLoading(true);
        const timer = setTimeout(() => {
            setGridLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [filters]);

    const availableSizes = Array.from(new Set(products.flatMap(p => 
        p.colors.flatMap(c => c.sizes.map(s => s.size))
    ))).sort();
    
    const availableColors = Array.from(new Set(products.flatMap(p => 
        p.colors.map(c => c.name)
    )));

    const filteredProducts = products.filter(p => {
        const { minPrice, maxPrice, sizes, colors } = filters;
        const productPrice = parseFloat(p.basePrice);
        if (minPrice && productPrice < Number(minPrice)) return false;
        if (maxPrice && productPrice > Number(maxPrice)) return false;
        if (sizes && sizes.length > 0) {
            const hasSizes = p.colors.some(c => c.sizes.some(s => sizes.includes(s.size)));
            if (!hasSizes) return false;
        }
        if (colors && colors.length > 0) {
            const hasColors = p.colors.some(c => colors.includes(c.name));
            if (!hasColors) return false;
        }
        return true;
    });

    if (loading) {
        return <div className="loading-container"><LoadingSpinner /></div>;
    }

    return (
        <div className="category-page">
            <h1 className="category-title">New Arrivals</h1>
            <button className="mobile-filter-trigger" onClick={() => setIsFilterOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                <span>Filters</span>
            </button>
            <div className="category-content">
                 <div className="desktop-filters">
                    <FiltersComponent filters={filters} setFilters={setFilters} availableSizes={availableSizes} availableColors={availableColors} />
                 </div>
                 {isFilterOpen && (
                    <div className="filter-overlay">
                        <div className="filter-backdrop" onClick={() => setIsFilterOpen(false)}></div>
                        <div className="mobile-filters">
                            <div className="mobile-filters-header">
                                <h2>Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)}>&times;</button>
                            </div>
                            <div className="mobile-filters-content">
                                <FiltersComponent filters={filters} setFilters={setFilters} availableSizes={availableSizes} availableColors={availableColors} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="product-grid-container">
                    {gridLoading && <div className="loading-overlay"><LoadingSpinner /></div>}
                    {filteredProducts.length > 0 ? (
                        <div className="product-grid">
                            {filteredProducts.map(product => {
                                const firstColor = product.colors[0];
                                const firstSize = firstColor?.sizes[0];
                                return (
                                    <ProductCard 
                                        key={product.id} 
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            price: firstSize?.price || product.basePrice,
                                            mrp: product.mrp,
                                            imageUrl: firstColor?.image || product.gallery[0]?.url,
                                            altImageUrl: product.gallery[1]?.url || firstColor?.image
                                        }} 
                                        navigate={navigate} 
                                    />
                                );
                            })}
                             </div>
                        ) : (
                                <p className="no-results-message">No new arrivals found.</p>
                        )}
                   
                </div>
            </div>
        </div>
    );
};

export default NewArrivalsPage;
