// import { useEffect, useState } from 'react';
// import excelData from '../assets/data.xlsx';
// import readXlsxFile from 'read-excel-file';
// import SelectSearch from 'react-select-search';
// import { useNavigate } from "react-router-dom";
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// // import 'react-select-search/style.css';
// import "./System.css";

// const defaultItem = {
//     selectedSystem: '',
//     selectedSharing: '',
//     dimensions: [],
//     selectedDimension: '',
//     quantity: 1,
//     unitPrice: null,
//     price: null,
// };

// const System = ({ customer, handleCustomerUpdate }) => {
//     const [rows, setRows] = useState([]);
//     const [systems, setSystems] = useState([]);
//     const [showQuotation, setShowQuotation] = useState(false);
//     const navigate = useNavigate();
    
//     // Initialize local state from customer's systemItems (or default item) only on mount.
//     const [items, setItems] = useState(customer?.systemItems || [defaultItem]);

//     const handleNext = () => {
//         navigate('/addon');
//     };

//     // Removed the effect that continuously updates items from customer?.systemItems
//     // because it was causing an infinite loop.

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const canNavigate = () => {
//         return items.every(item => item.selectedSystem && item.selectedSharing && item.selectedDimension && item.price !== null);
//     };

//     const goToAddon = () => {
//         if (canNavigate()) {
//             navigate('/addon');
//         }
//     };

//     const deleteItem = (index) => {
//         if (items.length > 1) { // Prevent deletion if only one item exists
//             const updatedItems = items.filter((_, idx) => idx !== index);
//             setItems(updatedItems);
//         } else {
//             alert('Cannot delete the default item.');
//         }
//     };

//     async function fetchData() {
//         try {
//             const response = await fetch(excelData);
//             const blob = await response.blob();
//             const data = await readXlsxFile(blob, { sheet: 'System' });
//             const systemsData = [];
//             const dimensionTypes = data[1].slice(1);
//             data.slice(2).forEach((priceRow) => {
//                 const systemName = priceRow[0];
//                 priceRow.slice(1).forEach((price, priceIndex) => {
//                     systemsData.push({
//                         systemName: systemName,
//                         sharingType: data[0][priceIndex + 1].trim() === 'Sharing' ? 'Sharing' : 'Non-Sharing',
//                         dimension: dimensionTypes[priceIndex],
//                         price: price
//                     });
//                 });
//             });
//             const uniqueSystems = Array.from(new Set(systemsData.map(row => row.systemName)));
//             setSystems(uniqueSystems);
//             setRows(systemsData);
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     const handleItemChange = (index, field, value) => {
//         const newItems = [...items];
//         newItems[index][field] = value;
//         if (field === 'selectedSystem') {
//             newItems[index].selectedSharing = '';
//             newItems[index].dimensions = [];
//             newItems[index].selectedDimension = '';
//             newItems[index].price = null;
//         }
//         if (field === 'selectedSharing') {
//             const filteredDimensions = rows
//                 .filter(row => row.systemName === newItems[index].selectedSystem && row.sharingType === value)
//                 .map(row => row.dimension);
//             newItems[index].dimensions = Array.from(new Set(filteredDimensions));
//             newItems[index].selectedDimension = '';
//             newItems[index].price = null;
//         }
//         if (field === 'selectedDimension') {
//             const selectedRow = rows.find(row =>
//                 row.systemName === newItems[index].selectedSystem &&
//                 row.sharingType === newItems[index].selectedSharing &&
//                 row.dimension === value
//             );
//             if (selectedRow) {
//                 newItems[index].unitPrice = selectedRow.price;
//                 newItems[index].price = selectedRow.price * newItems[index].quantity;
//             } else {
//                 newItems[index].unitPrice = null;
//                 newItems[index].price = null;
//             }
//         }
//         if (field === 'quantity') {
//             const newQuantity = Math.max(1, parseInt(value) || 1);
//             newItems[index].quantity = newQuantity;

//             // Recalculate price based on the new quantity
//             const selectedRow = rows.find(row =>
//                 row.systemName === newItems[index].selectedSystem &&
//                 row.sharingType === newItems[index].selectedSharing &&
//                 row.dimension === newItems[index].selectedDimension
//             );
//             if (selectedRow) {
//                 newItems[index].price = selectedRow.price * newQuantity;
//             }
//         }
//         setItems(newItems);
//     };

//     const addItem = () => {
//         if (!items) {
//             console.error('Items is undefined or null');
//             return;
//         }

//         const lastItem = items.length > 0 ? items[items.length - 1] : undefined;

//         // Check if the last item has been fully completed
//         if (lastItem?.selectedSystem && lastItem?.selectedSharing && lastItem?.selectedDimension && lastItem?.price !== null) {
//             setItems([
//                 ...items,
//                 { ...defaultItem },
//             ]);
//         } else {
//             alert(`Please complete Item ${items.length} before adding another item.`);
//         }
//     };

//     const updateQuantity = (index, value) => {
//         const newItems = [...items];
//         const newQuantity = Math.max(1, parseInt(value) || 1);
//         newItems[index].quantity = newQuantity;

//         // Recalculate price based on the new quantity using unitPrice
//         if (newItems[index].unitPrice) {
//             newItems[index].price = newItems[index].unitPrice * newQuantity;
//         }

//         setItems(newItems);
//     };

//     const exportToExcel = () => {
//         const data = [];
    
//         data.push(['QUOTATION NUMBER:', customer?.quotationNumber ?? 'N/A']); 
//         data.push([]); // Empty row for spacing

//         // Customer Details Header
//         data.push(['CUSTOMER DETAILS']);
//         data.push(['Customer Name:', customer?.customerDetails.customerName || '']);
//         data.push(['Date:', customer?.customerDetails.date || '']);
//         data.push(['Phone Number:', customer?.customerDetails.phoneNumber || '']);
//         data.push(['Location:', customer?.customerDetails.location || '']);
//         data.push(['Email:', customer?.customerDetails.email || '']);
//         data.push([]); 
    
//         // Header for System Items and Add-Ons
//         data.push(['ITEM DETAILS']);
//         data.push(['Type', 'Component/System', 'Size/Option/Diameter', 'Sharing Type', 'Quantity', 'Price']);
    
//         items.forEach((item) => {
//           if (item.selectedSystem && item.selectedDimension && item.quantity) {
//             data.push([
//               'System',
//               item.selectedSystem,
//               item.selectedDimension,
//               item.selectedSharing || '',
//               item.quantity,
//               item.price || 0,
//             ]);
//           }
//         });
    
//         const grandTotal = items.reduce((acc, cur) => acc + (cur.price || 0), 0);
    
//         data.push(['', '', '', '', 'Grand Total', grandTotal]);
    
//         // Create worksheet and workbook
//         const ws = XLSX.utils.aoa_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Quotation');
    
//         const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//         saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'quotation.xlsx');
//     };

//     // Update parent when local items change.
//     useEffect(() => {
//         handleCustomerUpdate({ ...customer, systemItems: items });
//     }, [items]);

//     return (
//         <div className="container">
//             <h1 className="title">Excel Data Viewer</h1>

//             {!showQuotation && (
//                 <>
//                 {items?.map((item, index) => (
//                     <div key={index} className="item-container">
//                         <h2 className="item-title">Item {index + 1}</h2>

//                         {/* System Dropdown */}
//                         <div className="dropdown-container">
//                             <label htmlFor={`system-select-${index}`} className="label">Select System:</label>
//                             <SelectSearch
//                                 id={`system-select-${index}`}
//                                 value={item.selectedSystem}
//                                 onChange={(value) => handleItemChange(index, 'selectedSystem', value)}
//                                 options={systems.map(system => ({ value: system, name: system }))}
//                                 search
//                                 placeholder="-- Select System --"
//                             />
//                         </div>

//                         {/* Sharing Type Dropdown */}
//                         {item.selectedSystem && (
//                             <div className="dropdown-container">
//                                 <label htmlFor={`sharing-select-${index}`} className="label">Select Sharing Type:</label>
//                                 <SelectSearch
//                                     id={`sharing-select-${index}`}
//                                     value={item.selectedSharing}
//                                     onChange={(value) => handleItemChange(index, 'selectedSharing', value)}
//                                     options={[
//                                         { value: 'Sharing', name: 'Sharing' },
//                                         { value: 'Non-Sharing', name: 'Non-Sharing' }
//                                     ]}
//                                     search
//                                     placeholder="-- Select Sharing Type --"
//                                 />
//                             </div>
//                         )}

//                         {/* Dimension Dropdown */}
//                         {item.selectedSharing && (
//                             <div className="dropdown-container">
//                                 <label htmlFor={`dimension-select-${index}`} className="label">Select Dimension:</label>
//                                 <SelectSearch
//                                     id={`dimension-select-${index}`}
//                                     value={item.selectedDimension}
//                                     onChange={(value) => handleItemChange(index, 'selectedDimension', value)}
//                                     options={item.dimensions.map(dimension => ({ value: dimension, name: dimension }))}
//                                     search
//                                     placeholder="-- Select Dimension --"
//                                 />
//                             </div>
//                         )}

//                         {/* Quantity Input */}
//                         {item.selectedDimension && (
//                             <div className="input-container">
//                                 <label htmlFor={`quantity-input-${index}`} className="label">Quantity:</label>
//                                 <input
//                                     id={`quantity-input-${index}`}
//                                     type="number"
//                                     value={item.quantity}
//                                     onChange={(e) => updateQuantity(index, e.target.value)}
//                                     className="input"
//                                     min="1"
//                                 />
//                             </div>
//                         )}

//                         {/* Display Price */}
//                         {item.price !== null && (
//                             <div className="price-container">
//                                 <p className="price-text">
//                                     <strong>Total Price:</strong> {item.price}
//                                 </p>
//                             </div>
//                         )}

//                         {items.length > 1 && (
//                             <button onClick={() => deleteItem(index)} className='delete-btn'>Delete</button>
//                         )}
//                     </div>
//                 ))} 
            
//                 {/* Add More Button */}
//                 <button onClick={addItem} className="button add-button">
//                     Add More
//                 </button>

//                 {/* Next Button */}
//                 {items?.some((item) => item.price !== null) && (
//                     <button onClick={() => { 
//                         goToAddon();
//                         handleNext();
//                     }} className="button generate-button">
//                         Next
//                     </button>
//                 )}
//                 </>
//             )} 

//             {/* Quotation Table */}
//             {showQuotation && (
//                 <div className="table-container">
//                     <h2 className="table-title">Quotation</h2>
//                     <h2>Quotation No #{customer?.quotationNumber}</h2>
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th className="th">Item</th>
//                                 <th className="th">System</th>
//                                 <th className="th">Sharing Type</th>
//                                 <th className="th">Dimension</th>
//                                 <th className="th">Quantity</th>
//                                 <th className="th">Price</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {items.map((item, index) => item.price !== null && (
//                                 <tr key={index}>
//                                     <td className="td">{index + 1}</td>
//                                     <td className="td">{item.selectedSystem}</td>
//                                     <td className="td">{item.selectedSharing}</td>
//                                     <td className="td">{item.selectedDimension}</td>
//                                     <td className="td">
//                                         <input
//                                             type="number"
//                                             value={item.quantity}
//                                             onChange={(e) => updateQuantity(index, e.target.value)}
//                                             className="input"
//                                             min="1"
//                                         />
//                                     </td>
//                                     <td className="td">{item.price}</td>
//                                 </tr>
//                             ))}
//                             {/* Total Price */}
//                             <tr className="total-row">
//                                 <td className="td" colSpan="5">Total:</td>
//                                 <td className="td">
//                                     {items.reduce((total, item) => total + (item.price || 0), 0)}
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                     <button onClick={exportToExcel}>Export</button>
//                     {!showQuotation && (
//                         <button onClick={() => setShowQuotation(false)}>Back</button>
//                     )}
//                     <button onClick={() => navigate('/system')}>Edit</button>
//                     <button onClick={() => navigate('/')}>Home</button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default System;
