import React from 'react';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

const SalesAnalytics = () => {
  return (
    <>
      <div className="card-header">
        <h3>Sales Analytic</h3>
        <div className="sort-by">
          <span>Sort by</span>
          <button className="date-filter">
            Jul 2023 <ChevronDown size={16} />
          </button>
        </div>
      </div>
      <div className="analytics-summary">
        <div className="summary-item">
          <p>Income</p>
          <h4>23,262.00</h4>
          <span className="change up">+0.05% <ArrowUp size={12} /></span>
        </div>
        <div className="summary-item">
          <p>Expenses</p>
          <h4>11,135.00</h4>
          <span className="change down">+0.05% <ArrowDown size={12} /></span>
        </div>
        <div className="summary-item">
          <p>Balance</p>
          <h4>48,135.00</h4>
          <span className="change up">+0.05% <ArrowUp size={12} /></span>
        </div>
      </div>
      <div className="chart-container">
        {/* Static SVG Chart to match the design */}
        <svg width="100%" height="150" viewBox="0 0 500 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 Q50,80 100,90 T200,70 T300,100 T400,60 T500,80 L500,150 L0,150 Z"
            fill="url(#areaGradient)"
          />
          <path
            d="M0,120 Q50,80 100,90 T200,70 T300,100 T400,60 T500,80"
            stroke="var(--primary-color)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g className="chart-labels" fontSize="10" fill="#999">
            <text x="20" y="145">22 July</text>
            <text x="90" y="145">24 July</text>
            <text x="170" y="145">26 July</text>
            <text x="260" y="145">28 July</text>
            <text x="340" y="145">29 July</text>
          </g>
        </svg>
      </div>
    </>
  );
};

export default SalesAnalytics;