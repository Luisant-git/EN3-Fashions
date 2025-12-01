import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

try {
    const root = createRoot(document.getElementById('root'));
    root.render(<App />);
} catch (error) {
    console.error('React render error:', error);
    document.getElementById('root').innerHTML = '<h1>Loading Error</h1><p>Please refresh the page</p>';
}