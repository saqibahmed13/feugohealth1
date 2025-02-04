import React from 'react';

const Quotation = ({ systemItems, addOnItems, handleBack }) => {
  // Inline styles
  const styles = {
    container: {
      padding: '16px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#333',
    },
    tableContainer: {
      marginTop: '32px',
    },
    tableTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#555',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px',
      border: '1px solid #ddd',
      backgroundColor: '#f2f2f2',
      textAlign: 'left',
      color: '#333',
    },
    td: {
      padding: '12px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    totalRow: {
      fontWeight: '600',
      backgroundColor: '#fafafa',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      cursor: 'pointer',
      marginBottom: '16px',
      marginRight: '8px',
    },
  };

  // Calculate totals
  const systemTotal = systemItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const addOnTotal = addOnItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const grandTotal = systemTotal + addOnTotal;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quotation</h1>

      {/* System Items Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.tableTitle}>System Items</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>System</th>
              <th style={styles.th}>Sharing Type</th>
              <th style={styles.th}>Dimension</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Price</th>
            </tr>
          </thead>
          <tbody>
            {systemItems.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{item.selectedSystem}</td>
                <td style={styles.td}>{item.selectedSharing}</td>
                <td style={styles.td}>{item.selectedDimension}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>{item.price}</td>
              </tr>
            ))}
            <tr style={styles.totalRow}>
              <td style={styles.td} colSpan="4">Subtotal</td>
              <td style={styles.td}>{systemTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add-On Items Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.tableTitle}>Add-On Items</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Component</th>
              <th style={styles.th}>Size</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Price</th>
            </tr>
          </thead>
          <tbody>
            {addOnItems.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{item.selectedComponent}</td>
                <td style={styles.td}>{item.selectedSize}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>{item.price}</td>
              </tr>
            ))}
            <tr style={styles.totalRow}>
              <td style={styles.td} colSpan="3">Subtotal</td>
              <td style={styles.td}>{addOnTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Grand Total */}
      <div style={{ marginTop: '24px' }}>
        <h2 style={styles.tableTitle}>Grand Total: {grandTotal}</h2>
      </div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{ ...styles.button, backgroundColor: '#6c757d', marginTop: '16px' }}
      >
        Back
      </button>
    </div>
  );
};

export default Quotation;