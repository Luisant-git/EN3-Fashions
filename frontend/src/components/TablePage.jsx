import React from 'react';

const TablePage = () => {
  return (
    <div style={{
      backgroundColor: '#202124',
      color: '#bdc1c6',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      textAlign: 'left'
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ marginBottom: '40px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#bdc1c6">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" opacity=".3"/>
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '400', color: '#e8eaed', marginBottom: '20px', lineHeight: '1.3' }}>
          This site can’t be reached
        </h1>

        <p style={{ fontSize: '14px', marginBottom: '15px', color: '#bdc1c6' }}>
          Check if there is a typo in <span style={{ fontWeight: '600' }}>saravana.ss.luisantin</span>.
        </p>

        <p style={{ fontSize: '14px', marginBottom: '30px', color: '#bdc1c6' }}>
          If spelling is correct, <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#8ab4f8', textDecoration: 'none' }}>try running Windows Network Diagnostics</a>.
        </p>

        <p style={{ fontSize: '12px', color: '#9aa0a6', marginBottom: '40px' }}>
          DNS_PROBE_FINISHED_NXDOMAIN
        </p>

        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#8ab4f8',
            color: '#202124',
            border: 'none',
            borderRadius: '100px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#aecbfa'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8ab4f8'}
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default TablePage;
