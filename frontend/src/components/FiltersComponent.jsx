import React from 'react';

const FiltersComponent = ({ filters, setFilters, availableSizes, availableColors }) => {
    const handleFilterChange = (type, value) => {
        setFilters(prev => ({...prev, [type]: value}));
    };
    
    const handleMultiSelect = (type, value) => {
        setFilters(prev => {
            const current = new Set(prev[type] || []);
            if (current.has(value)) {
                current.delete(value);
            } else {
                current.add(value);
            }
            return {...prev, [type]: Array.from(current)};
        });
    };

    const resetFilters = () => {
        setFilters({});
    }

    return (
        <div className="filters-container">
            <h3>Filters</h3>
            <div className="filter-group">
                <h4>Price</h4>
                <div className="price-inputs">
                    <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => handleFilterChange('minPrice', e.target.value)} className={filters.minPrice ? 'active-filter' : ''}/>
                    <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} className={filters.maxPrice ? 'active-filter' : ''}/>
                </div>
            </div>
             <div className="filter-group">
                <h4>Size</h4>
                <div className="size-selector">
                    {availableSizes.map((size) => (
                         <button 
                            key={size}
                            onClick={() => handleMultiSelect('sizes', size)}
                            className={`size-option ${filters.sizes?.includes(size) ? 'active' : ''} ${filters.sizes?.includes(size) ? 'active-filter' : ''}`}
                         >{size}</button>
                    ))}
                </div>
            </div>
            <div className="filter-group">
                <h4>Color</h4>
                <div className="color-selector">
                    {availableColors.map((colorObj) => (
                         <button 
                            key={colorObj.name}
                            onClick={() => handleMultiSelect('colors', colorObj.name)}
                            className={`color-option ${filters.colors?.includes(colorObj.name) ? 'active' : ''} ${filters.colors?.includes(colorObj.name) ? 'active-filter' : ''}`}
                         ><span style={{backgroundColor: colorObj.code}}></span> {colorObj.name}</button>
                    ))}
                </div>
            </div>
            <button onClick={resetFilters} className="reset-filters-btn">Reset Filters</button>
        </div>
    );
};

export default FiltersComponent;