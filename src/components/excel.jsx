import { useEffect, useState } from 'react';
import excelData from '../assets/data.xlsx';
import readXlsxFile from 'read-excel-file';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css';

const Excel = ({ systemItems, setSystemItems, handleNext }) => {
    
    const [rows, setRows] = useState([]);
    const [systems, setSystems] = useState([]);
    const [showQuotation, setShowQuotation] = useState(false);
    const [items, setItems] = useState(
        systemItems && systemItems.length > 0
            ? systemItems
            : [
                {
                    selectedSystem: '',
                    selectedSharing: '',
                    dimensions: [],
                    selectedDimension: '',
                    quantity: 1,
                    unitPrice: null,
                    price: null,
                },
            ]
    );

    useEffect(() => {
        if (systemItems && systemItems.length > 0) {
            setItems(systemItems);
        }
    }, [systemItems]);

    useEffect(() => {
        setSystemItems(items);
    }, [items, setSystemItems]);

    async function fetchData() {
        try {
            const response = await fetch(excelData);
            const blob = await response.blob();
            const data = await readXlsxFile(blob, { sheet: 'System' });
            const systemsData = [];
            const dimensionTypes = data[1].slice(1);
            data.slice(2).forEach((priceRow) => {
                const systemName = priceRow[0];
                priceRow.slice(1).forEach((price, priceIndex) => {
                    systemsData.push({
                        systemName: systemName,
                        sharingType: data[0][priceIndex + 1].trim() === 'Sharing' ? 'Sharing' : 'Non-Sharing',
                        dimension: dimensionTypes[priceIndex],
                        price: price
                    });
                });
            });
            const uniqueSystems = Array.from(new Set(systemsData.map(row => row.systemName)));
            setSystems(uniqueSystems);
            setRows(systemsData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === 'selectedSystem') {
            newItems[index].selectedSharing = '';
            newItems[index].dimensions = [];
            newItems[index].selectedDimension = '';
            newItems[index].price = null;
        }
        if (field === 'selectedSharing') {
            const filteredDimensions = rows
                .filter(row => row.systemName === newItems[index].selectedSystem && row.sharingType === value)
                .map(row => row.dimension);
            newItems[index].dimensions = Array.from(new Set(filteredDimensions));
            newItems[index].selectedDimension = '';
            newItems[index].price = null;
        }
        if (field === 'selectedDimension') {
            const selectedRow = rows.find(row =>
                row.systemName === newItems[index].selectedSystem &&
                row.sharingType === newItems[index].selectedSharing &&
                row.dimension === value
            );
            if (selectedRow) {
                newItems[index].unitPrice = selectedRow.price;
                newItems[index].price = selectedRow.price * newItems[index].quantity;
            } else {
                newItems[index].unitPrice = null;
                newItems[index].price = null;
            }
        }
        if (field === 'quantity') {
            const newQuantity = Math.max(1, parseInt(value) || 1);
            newItems[index].quantity = newQuantity;

            // Recalculate price based on the new quantity
            const selectedRow = rows.find(row =>
                row.systemName === newItems[index].selectedSystem &&
                row.sharingType === newItems[index].selectedSharing &&
                row.dimension === newItems[index].selectedDimension
            );
            if (selectedRow) {
                newItems[index].price = selectedRow.price * newQuantity;
            }
        }
        setItems(newItems);
    };

    const addItem = () => {
        const lastItem = items[items.length - 1];
        
        // Check if the last item has been fully completed (selected system, sharing, dimension, and price)
        if (lastItem.selectedSystem && lastItem.selectedSharing && lastItem.selectedDimension && lastItem.price !== null) {
            setItems([
                ...items,
                {
                    selectedSystem: '',
                    selectedSharing: '',
                    dimensions: [],
                    selectedDimension: '',
                    quantity: 1,
                    unitPrice: null,
                    price: null,
                },
            ]);
        } else {
            alert(`Please add Item ${items.length} before adding Item ${items.length + 1}`);
        }
    };

    const updateQuantity = (index, value) => {
        const newItems = [...items];
        const newQuantity = Math.max(1, parseInt(value) || 1);
        newItems[index].quantity = newQuantity;

        // Recalculate price based on the new quantity using unitPrice
        if (newItems[index].unitPrice) {
            newItems[index].price = newItems[index].unitPrice * newQuantity;
        }

        setItems(newItems);
    };

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
        itemContainer: {
            marginBottom: '24px',
            borderBottom: '1px solid #ccc',
            paddingBottom: '16px',
        },
        itemTitle: {
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#555',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#444',
        },
        input: {
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
            width: '100%',
            boxSizing: 'border-box',
        },
        select: {
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
            width: '100%',
            boxSizing: 'border-box',
        },
        priceContainer: {
            marginTop: '16px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
        },
        priceText: {
            fontWeight: '600',
            color: '#222',
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
        addButton: {
            backgroundColor: '#007BFF',
        },
        generateButton: {
            backgroundColor: '#28A745',
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
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Excel Data Viewer</h1>

            {items.map((item, index) => (
                <div key={index} style={styles.itemContainer}>
                    <h2 style={styles.itemTitle}>Item {index + 1}</h2>

                    {/* System Dropdown */}
                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor={`system-select-${index}`} style={styles.label}>Select System:</label>
                        <SelectSearch
                            id={`system-select-${index}`}
                            value={item.selectedSystem}
                            onChange={(value) => handleItemChange(index, 'selectedSystem', value)}
                            options={systems.map(system => ({ value: system, name: system }))}
                            search
                            placeholder="-- Select System --"
                        />
                    </div>

                    {/* Sharing Type Dropdown */}
                    {item.selectedSystem && (
                        <div style={{ marginBottom: '16px' }}>
                            <label htmlFor={`sharing-select-${index}`} style={styles.label}>Select Sharing Type:</label>
                            <SelectSearch
                                id={`sharing-select-${index}`}
                                value={item.selectedSharing}
                                onChange={(value) => handleItemChange(index, 'selectedSharing', value)}
                                options={[
                                    { value: 'Sharing', name: 'Sharing' },
                                    { value: 'Non-Sharing', name: 'Non-Sharing' }
                                ]}
                                search
                                placeholder="-- Select Sharing Type --"
                            />
                        </div>
                    )}

                    {/* Dimension Dropdown */}
                    {item.selectedSharing && (
                        <div style={{ marginBottom: '16px' }}>
                            <label htmlFor={`dimension-select-${index}`} style={styles.label}>Select Dimension:</label>
                            <SelectSearch
                                id={`dimension-select-${index}`}
                                value={item.selectedDimension}
                                onChange={(value) => handleItemChange(index, 'selectedDimension', value)}
                                options={item.dimensions.map(dimension => ({ value: dimension, name: dimension }))}
                                search
                                placeholder="-- Select Dimension --"
                            />
                        </div>
                    )}

                    {/* Quantity Input */}
                    {item.selectedDimension && (
                        <div style={{ marginBottom: '16px' }}>
                            <label htmlFor={`quantity-input-${index}`} style={styles.label}>Quantity:</label>
                            <input
                                id={`quantity-input-${index}`}
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(index, e.target.value)}
                                style={styles.input}
                                min="1"
                            />
                        </div>
                    )}

                    {/* Display Price */}
                    {item.price !== null && (
                        <div style={styles.priceContainer}>
                            <p style={styles.priceText}>
                                <strong>Total Price:</strong> {item.price}
                            </p>
                        </div>
                    )}
                </div>
            ))}

            {/* Add More Button */}
            <button
                onClick={addItem}
                style={{ ...styles.button, ...styles.addButton }}
            >
                Add More
            </button>

            {/* Next Button */}
            {items.some((item) => item.price !== null) && (
                <button
                    onClick={handleNext}
                    style={{ ...styles.button, ...styles.generateButton }}
                >
                    Next
                </button>
            )}

            {/* Generate Quotation Button */}
            {items.some(item => item.price !== null) && (
                <button
                    onClick={() => setShowQuotation(true)}
                    style={{ ...styles.button, ...styles.generateButton }}
                >
                    Generate Quotation
                </button>
            )}

            {/* Quotation Table */}
            {showQuotation && (
                <div style={styles.tableContainer}>
                    <h2 style={styles.tableTitle}>Quotation</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Item</th>
                                <th style={styles.th}>System</th>
                                <th style={styles.th}>Sharing Type</th>
                                <th style={styles.th}>Dimension</th>
                                <th style={styles.th}>Quantity</th>
                                <th style={styles.th}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => item.price !== null && (
                                <tr key={index}>
                                    <td style={styles.td}>{index + 1}</td>
                                    <td style={styles.td}>{item.selectedSystem}</td>
                                    <td style={styles.td}>{item.selectedSharing}</td>
                                    <td style={styles.td}>{item.selectedDimension}</td>
                                    <td style={styles.td}>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(index, e.target.value)}
                                            style={styles.input}
                                            min="1"
                                        />
                                    </td>
                                    <td style={styles.td}>{item.price}</td>
                                </tr>
                            ))}
                            {/* Total Price */}
                            <tr style={styles.totalRow}>
                                <td style={styles.td} colSpan="5">Total:</td>
                                <td style={styles.td}>
                                    {items.reduce((total, item) => total + (item.price || 0), 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Excel;
