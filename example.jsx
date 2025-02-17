// import "./Addon.css";

// return (
//   <div className="container">
//     <h1 className="title">Add-On Items</h1>

//     {!showQuotation && (
//       <>
//         {addOnItems.map((item, index) => {
//           const categoryData = components[item.selectedCategory];
//           const hasSubcategories = categoryData?.subcategories;
//           let subcatData = null;
//           if (item.selectedSubCategory && hasSubcategories) {
//             subcatData = categoryData.subcategories[item.selectedSubCategory];
//           }

//           return (
//             <div key={index} className="itemContainer">
//               <h2 className="itemTitle">Item {index + 1}</h2>

//               {/* Category Select */}
//               <div>
//                 <label className="label">Select Category:</label>
//                 <SelectSearch
//                   options={Object.keys(components).map((catKey) => ({
//                     value: catKey,
//                     name: catKey,
//                   }))}
//                   value={item.selectedCategory}
//                   onChange={(value) => handleItemChange(index, 'selectedCategory', value)}
//                   search
//                   placeholder="-- Select Category --"
//                 />
//               </div>

//               {/* Subcategory Select */}
//               {item?.selectedCategory && hasSubcategories && (
//                 <div>
//                   <label className="label">Select Subcategory:</label>
//                   <SelectSearch
//                     options={Object.keys(categoryData?.subcategories || {}).map((subKey) => ({
//                       value: subKey,
//                       name: subKey,
//                     }))}
//                     value={item?.selectedSubCategory}
//                     onChange={(value) => handleItemChange(index, 'selectedSubCategory', value)}
//                     search
//                     placeholder="-- Select Subcategory --"
//                   />
//                 </div>
//               )}

//               {/* Component Select */}
//               {((item?.selectedCategory && !hasSubcategories && categoryData?.items) ||
//                 (item?.selectedSubCategory && subcatData?.items)) ? (
//                 <div>
//                   <label className="label">Select Component:</label>
//                   <SelectSearch
//                     options={(subcatData ? subcatData.items : categoryData.items)
//                       .filter(row => {
//                         const headingToExclude = subcatData ? subcatData.heading : categoryData.heading;
//                         const firstColumn = row.componentName ||
//                           row[(subcatData ? subcatData.header : categoryData.header)[0]];
//                         return (
//                           !headingToExclude ||
//                           !firstColumn ||
//                           firstColumn.toLowerCase().trim() !== headingToExclude.toLowerCase().trim()
//                         );
//                       })
//                       .map((comp) => {
//                         const firstColKey = subcatData
//                           ? subcatData.header?.[0]
//                           : categoryData.header?.[0];
//                         const displayName = comp.componentName || comp[firstColKey] || '';
//                         return {
//                           value: displayName,
//                           name: displayName,
//                         };
//                       })}
//                     value={item.selectedItem}
//                     onChange={(value) => handleItemChange(index, 'selectedItem', value)}
//                     search
//                     placeholder="-- Select Component --"
//                   />
//                 </div>
//               ) : null}

//               {/* Quantity Input */}
//               {item.selectedCategory && item.selectedItem && (
//                 <div>
//                   <label className="label">Quantity:</label>
//                   <input
//                     type="number"
//                     className="input"
//                     value={item.quantity}
//                     min={1}
//                     onChange={(e) => updateQuantity(index, e.target.value, 'addon')}
//                   />
//                 </div>
//               )}

//               {/* Display Price */}
//               {item.price != null && (
//                 <div className="priceContainer">
//                   <p className="priceText">
//                     <strong>Total Price:</strong> {item.price}
//                   </p>
//                 </div>
//               )}

//               {addOnItems.length > 1 && (
//                 <button onClick={() => deleteAddonItem(index)} className="button deleteButton">
//                   Delete
//                 </button>
//               )}
//             </div>
//           );
//         })}

//         {/* Add More Button and Navigation Buttons */}
//         <button className="button addButton" onClick={addItem}>
//           Add More
//         </button>
//         <div>
//           <button className="button backButton" onClick={handleBack}>
//             Back
//           </button>
//           {addOnItems.length > 0 && (
//             <button className="button generateButton" onClick={handleGenerateQuotation}>
//               Generate Quotation
//             </button>
//           )}
//         </div>
//       </>
//     )}

//     {/* Quotation Table */}
//     {showQuotation && (
//       <div className="tableContainer">
//         <h2 className="tableTitle">
//           Quotation No #{addOnItems[addOnItems.length - 1].quotationNumber}
//         </h2>
//         <table className="table">
//           <thead>
//             <tr>
//               <th className="th">Type</th>
//               <th className="th">Component/System</th>
//               <th className="th">Size/Option/Diameter</th>
//               <th className="th">Quantity</th>
//               <th className="th">Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Table Rows */}
//           </tbody>
//         </table>
//         <button className="button exportButton" onClick={exportToExcel}>
//           Export
//         </button>
//       </div>
//     )}
//   </div>
// );
