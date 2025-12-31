import React, { useState, useEffect } from 'react';
import { getActiveSizeCharts } from '../api/sizeChartApi';
import LoadingSpinner from './LoadingSpinner';
import '../styles/SizeChartPage.css';

const SizeChartPage = () => {
    const [charts, setCharts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCharts();
    }, []);

    const fetchCharts = async () => {
        try {
            const data = await getActiveSizeCharts();
            setCharts(data);
        } catch (error) {
            console.error('Failed to fetch size charts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><LoadingSpinner /></div>;
    }

    return (
        <div className="size-chart-page">
            <h1>Size Chart</h1>
            {charts.length === 0 ? (
                <p className="no-charts">No size charts available</p>
            ) : (
                <div className="charts-container">
                    {charts.map((chart) => (
                        <div key={chart.id} className="chart-card">
                            <h2>{chart.title}</h2>
                            <img src={chart.image} alt={chart.title} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SizeChartPage;
