import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSubCategory } from '../api/subcategoryApi';
import LoadingSpinner from './LoadingSpinner';
import '../styles/SizeChartPage.css';

const SizeChartPage = () => {
    const { subCategoryId } = useParams();
    const [subCategory, setSubCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (subCategoryId) {
            fetchSizeChart();
        }
    }, [subCategoryId]);

    const fetchSizeChart = async () => {
        try {
            const data = await getSubCategory(subCategoryId);
            setSubCategory(data);
        } catch (error) {
            console.error('Failed to fetch size chart:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><LoadingSpinner /></div>;
    }

    if (!subCategory || !subCategory.sizeChart) {
        return (
            <div className="size-chart-page">
                <h1>Size Chart</h1>
                <p className="no-charts">No size chart available for this category</p>
            </div>
        );
    }

    return (
        <div className="size-chart-page">
            <h1>Size Chart - {subCategory.name}</h1>
            <div className="charts-container">
                <div className="chart-card">
                    <img src={subCategory.sizeChart} alt={`${subCategory.name} Size Chart`} />
                </div>
            </div>
        </div>
    );
};

export default SizeChartPage;
