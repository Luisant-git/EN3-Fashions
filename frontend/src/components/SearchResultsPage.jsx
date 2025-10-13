import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../data/mockData';
import ProductCard from './ProductCard';
import FiltersComponent from './FiltersComponent';
import LoadingSpinner from './LoadingSpinner';

const SearchResultsPage = ({ query, setView }) => {
    const [filters, setFilters] = useState({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [gridLoading, setGridLoading] = useState(false);
    const firstRender = useRef(true);

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

    const initialProducts = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    const availableSizes = Array.from(new Set(initialProducts.flatMap(p => p.sizes))).sort();
    const availableColors = Array.from(new Set(initialProducts.flatMap(p => p.colors)));

    const filteredProducts = initialProducts.filter(p => {
        const { minPrice, maxPrice, sizes, colors } = filters;
        if (minPrice && p.price < Number(minPrice)) return false;
        if (maxPrice && p.price > Number(maxPrice)) return false;
        if (sizes && sizes.length > 0 && !p.sizes.some(s => sizes.includes(s))) return false;
        if (colors && colors.length > 0 && !p.colors.some(c => colors.includes(c))) return false;
        return true;
    });

    if (initialProducts.length === 0) {
        return (
            <div className="category-page">
                <h1 className="category-title">Search Results</h1>
                <p className="no-results-message">No products found for "{query}".</p>
            </div>
        )
    }

    return (
        <div className="category-page">
            <h1 className="category-title">Search Results for "{query}"</h1>
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
                    <div className="product-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => <ProductCard key={product.id} product={product} setView={setView} />)
                        ) : (
                            <p className="no-results-message">No products found matching your filter criteria.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;