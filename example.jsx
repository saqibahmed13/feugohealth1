import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Addon({ showQuotation, setShowQuotation }) {
  const navigate = useNavigate();
  const [quotationNumber, setQuotationNumber] = useState(null);

  useEffect(() => {
    if (showQuotation) {
      setQuotationNumber(generateUniqueNumber());
    }
  }, [showQuotation]);

  return (
    <div>
      {showQuotation ? (
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>Quotation No #{quotationNumber}</h2>
          <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Type</th>
          <th style={styles.th}>Component/System</th>
          <th style={styles.th}>Size/Option/Diameter</th>
          <th style={styles.th}>Quantity</th>
          <th style={styles.th}>Price</th>
        </tr>
      </thead>
      <tbody>
        {systemItems.filter(item => item.selectedSystem && item.selectedDimension && item.quantity).map((item, idx) => (
          <tr key={`system-${idx}`}>
            <td style={styles.td}>System</td>
            <td style={styles.td}>{item.selectedSystem}</td>
            <td style={styles.td}>{item.selectedDimension}</td>
            <td style={styles.td}>
              <input
                type="number"
                style={styles.input}
                value={item.quantity}
                min={1}
                onChange={(e) => updateQuantity(idx, e.target.value, "system")}
              />
            </td>
            <td style={styles.td}>{item.price}</td>
          </tr>
        ))}
        {addOnItems.filter(item => item.selectedCategory && item.selectedItem && item.quantity && item.price != null).map((item, idx) => (
          <tr key={`addon-${idx}`}>
            <td style={styles.td}>Add-On</td>
            <td style={styles.td}>
              {item.selectedSubCategory
                ? `${item.selectedCategory} - ${item.selectedSubCategory} - ${item.selectedItem}`
                : `${item.selectedCategory} - ${item.selectedItem}`}
            </td>
            <td style={styles.td}>
              {getDisplayValue(item)}
            </td>
            <td style={styles.td}>
              <input
                type="number"
                style={styles.input}
                value={item.quantity}
                min={1}
                onChange={(e) => updateQuantity(idx, e.target.value, "addon")}
              />
            </td>
            <td style={styles.td}>{item.price}</td>
          </tr>
        ))}
        <tr style={styles.totalRow}>
          <td style={styles.td} colSpan={4}>Grand Total</td>
          <td style={styles.td}>
            {systemItems.reduce((sum, i) => sum + (i.price || 0), 0) +
              addOnItems.reduce((sum, i) => sum + (i.price || 0), 0)}
          </td>
        </tr>
      </tbody>
    </table>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      ) : (
        <div>
          {/* Normal Add-On Form */}
          <h2>Add-On Selection</h2>
        </div>
      )}
    </div>
  );
}
