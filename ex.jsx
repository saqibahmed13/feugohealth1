import { useState, useEffect } from "react";

const [quotationNumber, setQuotationNumber] = useState(null);

useEffect(() => {
  if (showQuotation) {
    setQuotationNumber(generateUniqueNumber());
  }
}, [showQuotation]);

const generateUniqueNumber = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
};

const exportToExcel = () => {
    const data = [];
    
    // Add Quotation Number
    data.push([`Quotation Number: ${quotationNumber}`]); 
    data.push([]); // Empty row for spacing
    
    // Add Header Row
    data.push(['Type', 'Component/System', 'Size/Option/Diameter', 'Quantity', 'Price']);

    // Add System Items
    systemItems.forEach(item => {
        data.push([
            'System',
            item.selectedSystem,
            item.selectedDimension,
            item.quantity,
            item.price
        ]);
    });

    // Add Add-On Items
    addOnItems.forEach(item => {
        data.push([
            'Add-On',
            item.selectedSubCategory 
                ? `${item.selectedCategory} - ${item.selectedSubCategory} - ${item.selectedItem}`
                : `${item.selectedCategory} - ${item.selectedItem}`,
            item.selectedSize || item.selectedOption || item.selectedDiameter || "",
            item.quantity,
            item.price
        ]);
    });

    // Add Grand Total Row
    data.push([]);
    data.push([
        'Grand Total', '', '', '',
        systemItems.reduce((sum, i) => sum + (i.price || 0), 0) +
        addOnItems.reduce((sum, i) => sum + (i.price || 0), 0)
    ]);

    // Convert to Excel (assuming you use XLSX library)
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quotation');

    // Download the file
    XLSX.writeFile(wb, `Quotation_${quotationNumber}.xlsx`);
};

{showQuotation && (
  <div style={styles.tableContainer}>
    <h2 style={styles.tableTitle}>Quotation #{quotationNumber}</h2>
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
        {systemItems.map((item, idx) => (
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
        {addOnItems.map((item, idx) => (
          <tr key={`addon-${idx}`}>
            <td style={styles.td}>Add-On</td>
            <td style={styles.td}>
              {item.selectedSubCategory
                ? `${item.selectedCategory} - ${item.selectedSubCategory} - ${item.selectedItem}`
                : `${item.selectedCategory} - ${item.selectedItem}`}
            </td>
            <td style={styles.td}>
              {item.selectedSize || item.selectedOption || item.selectedDiameter || ""}
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
    <button
      style={{ ...styles.button, ...styles.exportButton }}
      onClick={exportToExcel}
    >
      Export
    </button>
    <button
      style={{ ...styles.button, ...styles.exportButton }}
      onClick={() => setShowQuotation(false)}
    >
      Back
    </button>
  </div>
)}
