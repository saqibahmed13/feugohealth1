import { useEffect, useState } from 'react';
import excelData from '../assets/data.xlsx';
import readXlsxFile from 'read-excel-file';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import 'react-select-search/style.css';
import SelectSearch from 'react-select-search';
import { useLocation, useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default function Addon({ customer, handleCustomerUpdate }) {
  const [components, setComponents] = useState({});
  const [showQuotation, setShowQuotation] = useState(false);
  console.log("showQuotation", showQuotation)
  const navigate = useNavigate();
  const location = useLocation();
  const [addOnItems, setAddOnItems] = useState(customer?.addOnItems || [{
    selectedCategory: '',
    selectedSubCategory: '',
    selectedItem: '',
    selectedSize: '',
    selectedOption: '',
    selectedDiameter: '',
    quantity: 1,
    price: null,
  }]);

  const handleBack = () => {
    navigate("/system");
  };

  const handleHome = () =>{
    navigate("/");
  }

  // Fetch and parse the Excel data
  async function fetchData() {
    try {
      const response = await fetch(excelData);
      const blob = await response.blob();

      // List of sheets to read
      const sheets = [
        'System-Components',
        'Switch-Access-Gormet-Hole',
        'Storage-Prelam-Pedastal',
        'CRCA-Metal-Pedastal',
        'Partition-High-Storage',
        'Prelam',
        'Credenza',
        'Locker-Units',
        'Meeting-Table-Without-Flip-lid',
        'Accessory-Name-Plate',
        'Accessory-Planter-Box',
        'Accessory-Ladder-Graphics',
      ];

      // Category and subcategory mapping
      const categoryMapping = {
        'System-Components': 'System Components',
        'Switch-Access-Gormet-Hole': { category: 'Switch Access', subcategory: 'Gormet Hole' },
        'Storage-Prelam-Pedastal': { category: 'Storage', subcategory: 'Prelam Pedastal' },
        'CRCA-Metal-Pedastal': { category: 'Storage', subcategory: 'CRCA Metal Pedastal' },
        'Partition-High-Storage': { category: 'Storage', subcategory: 'Partition High Storage' },
        'Prelam': { category: 'Storage', subcategory: 'Prelam' },
        'Credenza': { category: 'Storage', subcategory: 'Credenza' },
        'Locker-Units': { category: 'Storage', subcategory: 'Locker Units' },
        'Accessory-Name-Plate': { category: 'Accessory', subcategory: 'Name Plate' },
        'Accessory-Planter-Box': { category: 'Accessory', subcategory: 'Planter Box' },
        'Accessory-Ladder-Graphics': { category: 'Accessory', subcategory: 'Ladder Graphics' },
        'Meeting-Table-Without-Flip-lid': 'Meeting Table Without Flip Lid',
      };

      const tempComponents = {};

      for (const sheet of sheets) {
        const data = await readXlsxFile(blob, { sheet });
        if (!data || !data.length) continue;

        // Filter out empty rows
        const filteredData = data.filter((row) => row.some((cell) => cell != null && cell !== ''));

        if (!filteredData.length) continue;

        const mapping = categoryMapping[sheet];
        if (!mapping) continue;

        // Handle Switch Access → Gormet Hole separately
        if (sheet === 'Switch-Access-Gormet-Hole') {
          const firstHeaderRow = filteredData[0];
          const secondHeaderRow = filteredData[1];

          // Check if 'Gormet Hole' is present
          if (firstHeaderRow[0] === 'Gormet Hole') {
            // Headings are in the second row after 'Diameter' labels
            const diameters = secondHeaderRow.slice(1);

            const items = filteredData.slice(2).map((row) => {
              return {
                componentName: row[0],
                prices: row.slice(1),
              };
            });

            if (!tempComponents['Switch Access']) {
              tempComponents['Switch Access'] = { subcategories: {} };
            }

            tempComponents['Switch Access'].subcategories['Gormet Hole'] = {
              heading: 'Gormet Hole',
              diameters,
              items,
            };
          }
          continue;
        }

        // If mapping is a string, it's a top-level category without subcategories
        if (typeof mapping === 'string') {
          // For 'System Components', extract sizes and items
          if (sheet === 'System-Components') {
            const headerRow = filteredData[0];
            const sizes = headerRow.slice(1).map((size) => size.toString());

            const items = filteredData.slice(1).map((row) => ({
              componentName: row[0],
              prices: row.slice(1),
            }));

            tempComponents[mapping] = {
              heading: mapping,
              sizes,
              items,
            };
          } else {
            // Handle other categories without subcategories
            const headerRow = filteredData[0];
            const items = filteredData.slice(1).map((row) => {
              const item = {};
              headerRow.forEach((colName, idx) => {
                const key = colName || `Column${idx}`;
                item[key] = row[idx];
              });
              return item;
            });

            tempComponents[mapping] = {
              heading: mapping,
              header: headerRow,
              items,
            };
          }
        } else {
          // Categories with subcategories
          const { category, subcategory } = mapping;

          if (!tempComponents[category]) {
            tempComponents[category] = { subcategories: {} };
          }

          const headerRow = filteredData[0];
          const items = filteredData.slice(1).map((row) => {
            const item = {};
            headerRow.forEach((colName, idx) => {
              const key = colName || `Column${idx}`;
              item[key] = row[idx];
            });
            return item;
          });

          tempComponents[category].subcategories[subcategory] = {
            heading: subcategory,
            header: headerRow,
            items,
          };
        }
      }

      setComponents(tempComponents);
    } catch (error) {
      console.error('Error reading Excel data:', error);
    }
  }

  useEffect(() => {
    // Check if navigation state has showQuotation
    if (location.state?.showQuotation) {
      setShowQuotation(true);
    }
    fetchData();
  }, [location.state]);

  useEffect(() => {
    setAddOnItems(customer?.addOnItems || [{
      selectedCategory: '',
      selectedSubCategory: '',
      selectedItem: '',
      selectedSize: '',
      selectedOption: '',
      selectedDiameter: '',
      quantity: 1,
      price: null,
    }]);
  }, []);

  // Recalculate price logic
  const calculatePriceForAddon = (item) => {
    const {
      selectedCategory,
      selectedSubCategory,
      selectedItem,
      selectedSize,
      selectedOption,
      selectedDiameter,
      quantity,
    } = item;

    if (!selectedCategory || !selectedItem || !quantity) {
      return null;
    }

    let categoryData = components[selectedCategory];
    if (!categoryData) return null;

    // If we have subcategories
    if (selectedSubCategory) {
      categoryData = categoryData.subcategories && categoryData.subcategories[selectedSubCategory];
      if (!categoryData) return null;
    }

    // 1) System Components
    if (selectedCategory === 'System Components') {
      if (!selectedSize) return null;
      const comp = categoryData.items.find((i) => i.componentName === selectedItem);
      if (!comp) return null;
      const sizeIndex = categoryData.sizes.indexOf(selectedSize);
      if (sizeIndex === -1) return null;
      const priceVal = comp.prices[sizeIndex];
      return parseFloat(priceVal || 0) * quantity;
    }

    // 2) Switch Access → Gormet Hole
    //    We stored "items" + "diameters" array.
    //    selectedItem => "Vertebrae Std WS High" or "Vertebrae High table"
    //    selectedDiameter => e.g. "25 mm"
    if (selectedCategory === 'Switch Access' && selectedSubCategory === 'Gormet Hole') {
      if (!selectedDiameter) return null;
      // items: [ { componentName: "Vertebrae Std WS High", prices: [2950, 3054, ...] }, ... ]
      // diameters: [ "25 mm","60 mm","75 mm","100 mm" ]
      const foundItem = categoryData.items.find(
        (row) => row.componentName === selectedItem
      );
      if (!foundItem) return null;
      const diamIndex = categoryData.diameters.indexOf(selectedDiameter);
      if (diamIndex === -1) return null;

      const priceVal = foundItem.prices[diamIndex];
      return parseFloat(priceVal || 0) * quantity;
    }

    // 3) Meeting Table Without Flip Lid (if it has diameters or options)
    if (selectedCategory === 'Meeting Table Without Flip Lid') {
      const firstHeader = categoryData.header?.[0];
      const foundRow = categoryData.items.find((row) => row[firstHeader] === selectedItem);
      if (!foundRow) return null;
      if (selectedDiameter) {
        const priceVal = foundRow[selectedDiameter];
        return parseFloat(priceVal || 0) * quantity;
      }
      if (selectedOption) {
        const priceVal = foundRow[selectedOption];
        return parseFloat(priceVal || 0) * quantity;
      }
      return null;
    }

    // 4) For other subcategories (e.g. Storage, Accessory, etc.),
    //    we might have multiple columns (basic price, shelves, locks, etc.)
    if (categoryData.header && categoryData.header.length > 1) {
      const nameKey = categoryData.header[0];
      const foundRow = categoryData.items.find((row) => {
        return row[nameKey] === selectedItem || row.componentName === selectedItem;
      });
      if (!foundRow) return null;

      if (selectedOption) {
        const val = foundRow[selectedOption];
        return parseFloat(val || 0) * quantity;
      }
    }

    if (selectedCategory === 'Storage') {
      if (selectedSubCategory === 'Partition High Storage' || selectedSubCategory === 'Prelam Pedestal' || selectedSubCategory === 'Storage' || selectedSubCategory === 'Prelam') {
        // Assuming 'items' contains the different storage options
        const foundItem = categoryData.items.find(
          (item) => item.description === selectedItem
        );
        if (!foundItem) return null;
        if (selectedOption) {
          const priceVal = foundItem[selectedOption];
          return parseFloat(priceVal || 0) * quantity;
        }
      }
      // Add similar blocks for other specific subcategories within Storage
    }

    return null;
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...addOnItems];
    updated[index][field] = value;

    // reset dependent fields if certain fields change
    if (field === 'selectedCategory') {
      updated[index].selectedSubCategory = '';
      updated[index].selectedItem = '';
      updated[index].selectedSize = '';
      updated[index].selectedOption = '';
      updated[index].selectedDiameter = '';
      updated[index].price = null;
    }
    if (field === 'selectedSubCategory') {
      updated[index].selectedItem = '';
      updated[index].selectedSize = '';
      updated[index].selectedOption = '';
      updated[index].selectedDiameter = '';
      updated[index].price = null;
      const selectedCategory = updated[index].selectedCategory;
      // Ensure that the items are reset when changing subcategories
      if (value === 'Partition High Storage' || value === 'Prelam Pedestal' || value === 'Storage') {
        updated[index].items = components[selectedCategory].subcategories[value].items;
      }
    }
    if (field === 'selectedItem') {
      updated[index].selectedSize = '';
      updated[index].selectedOption = '';
      updated[index].selectedDiameter = '';
      updated[index].price = null;
    }
    if (field === 'quantity') {
      const qty = parseInt(value, 10) || 1;
      updated[index].quantity = qty < 1 ? 1 : qty;
    }

    // recalc price
    const newPrice = calculatePriceForAddon(updated[index]);
    updated[index].price = newPrice;

    setAddOnItems(updated);
  };

  // For system items
  const updateQuantity = (index, value, type) => {
    const validQty = parseInt(value, 10) || 1;
    if (type === 'system') {
      const sysCopy = [...customer.systemItems];
      sysCopy[index].quantity = validQty;
      if (sysCopy[index].unitPrice) {
        sysCopy[index].price = sysCopy[index].unitPrice * validQty;
      }
      handleCustomerUpdate({ ...customer, systemItems: sysCopy });
    } else {
      const addOnCopy = [...addOnItems];
      addOnCopy[index].quantity = validQty;
      const newPrice = calculatePriceForAddon(addOnCopy[index]);
      addOnCopy[index].price = newPrice;
      setAddOnItems(addOnCopy);
    }
  };

  const addItem = () => {
    if (addOnItems.length === 0) {
      // Allow adding the first item without validation
      setAddOnItems([
        ...addOnItems,
        {
          selectedCategory: '',
          selectedSubCategory: '',
          selectedItem: '',
          selectedSize: '',
          selectedOption: '',
          selectedDiameter: '',
          quantity: 1,
          price: null,
        },
      ]);
    } else {
      // Check if the last item is fully completed before adding a new one
      const lastItem = addOnItems[addOnItems.length - 1];
      if (lastItem.selectedCategory && lastItem.selectedItem && lastItem.quantity && lastItem.price !== null) {
        setAddOnItems([
          ...addOnItems,
          {
            selectedCategory: '',
            selectedSubCategory: '',
            selectedItem: '',
            selectedSize: '',
            selectedOption: '',
            selectedDiameter: '',
            quantity: 1,
            price: null,
          },
        ]);
      } else {
        alert(`Please add Item ${addOnItems.length} before adding Item ${addOnItems.length + 1}`);
      }
    }
  };
  
  const generateUniqueNumber = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  };

  const handleGenerateQuotation = () => {
    const uniqueNumber = generateUniqueNumber();
    if (!customer?.quotationNumber) {
      const updatedCustomer = {
        ...customer,
        quotationNumber: uniqueNumber, // Assign a new quotation number
      };
      handleCustomerUpdate(updatedCustomer); // This will trigger the useEffect in App to save to localStorage
    }
    setShowQuotation(true);
  };

  const exportToExcel = () => {
   
    const data = [];

    data.push(['QUOTATION NUMBER:', customer?.quotationNumber ?? 'N/A']); 
    data.push([]); // Empty row for spacing

    // Add Customer Details Header
    data.push(['CUSTOMER DETAILS']);
    data.push(['Customer Name:', customer?.customerDetails?.customerName || '']);
    data.push(['Date:', customer?.customerDetails?.date || '']);
    data.push(['Phone Number:', customer?.customerDetails?.phoneNumber || '']);
    data.push(['Location:', customer?.customerDetails?.location || '']);
    data.push(['Email:', customer?.customerDetails?.email || '']);
    data.push([]); 

    // Combined header for System Items and Add-Ons
    data.push(['ITEM DETAILS']);
    data.push(['Type', 'Component/System', 'Size/Option/Diameter', 'Sharing Type', 'Quantity', 'Price']);

    // system items and addOn items in a single table
    customer?.systemItems?.forEach((item) => {
      if (item.selectedSystem && item.selectedDimension && item.quantity) {
        data.push([
          'System',
          item.selectedSystem,
          item.selectedDimension,
          item.selectedSharing || '', // Adding Sharing Type for system items
          item.quantity,
          item.price || 0,
          item.sharingType || '',
        ]);
      }
    });

    addOnItems.forEach((item) => {
      if (item.selectedCategory && item.selectedItem && item.quantity && item.price != null) {
        data.push([
          'Add-On',
          item.selectedSubCategory
            ? `${item.selectedCategory} - ${item.selectedSubCategory} - ${item.selectedItem}`
            : `${item.selectedCategory} - ${item.selectedItem}`,
          getDisplayValue(item),
          '', // Sharing Type is not applicable for add-ons
          item.quantity,
          item.price || 0,
        ]);
      }
    });

    // grand total
    const grandTotal =
      customer.systemItems.reduce((acc, cur) => acc + (cur.price || 0), 0) +
      addOnItems.reduce((acc, cur) => acc + (cur.price || 0), 0);

    data.push(['', '', '', '', 'Grand Total', grandTotal]);

    // create worksheet/book
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quotation');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'quotation.xlsx');
  };

 
  // Inline styling
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
      backgroundColor: '#dc3545',
    },
    addButton: {
      backgroundColor: '#007BFF',
    },
    generateButton: {
      backgroundColor: '#28A745',
    },
    exportButton: {
      backgroundColor: '#17A2B8',
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

  // Function to extract option labels from category data
  const getOptionLabels = (categoryData) => {
    // Check if the first item's keys can be used directly as labels (e.g., "Basic Price", "CAM LOCK")
    if (categoryData.items && categoryData.items.length > 0) {
      const optionLabels = [];
      const firstItem = categoryData.items[0];
      Object.keys(firstItem).forEach((key, index) => {
        if (index > 0) { // Skip the first key which is usually the item name
          const label = typeof firstItem[key] === 'string' ? firstItem[key] : key;
          optionLabels.push({ key, label });
        }
      });
      return optionLabels;
    }
    return [];
  };

  // New helper function to get the display value for Size/Option/Diameter
  const getDisplayValue = (item) => {
    if (item.selectedSize) return item.selectedSize;
    if (item.selectedDiameter) return item.selectedDiameter;
    if (item.selectedOption) {
      const catData = item.selectedSubCategory
        ? components[item.selectedCategory]?.subcategories[item.selectedSubCategory]
        : components[item.selectedCategory];
      if (catData) {
        const options = getOptionLabels(catData);
        const found = options.find((o) => o.key === item.selectedOption);
        if (found) return found.label;
      }
      return item.selectedOption; // fallback to stored key if not found
    }
    return "";
  };

  const deleteAddonItem = (index) => {
    if (addOnItems.length > 1) {
      const updatedItems = addOnItems.filter((_, idx) => idx !== index);
      setAddOnItems(updatedItems);
    } else {
      alert('Cannot delete the default add-on item.');
    }
  };

  useEffect(() => {
    // When addOnItems state changes, update the customer's add-on items in the main state
    handleCustomerUpdate({ ...customer, addOnItems });
  }, [addOnItems]);

  return (
  
    <div style={styles.container}>
      <h1 style={styles.title} >Add-On Items</h1>

 
      {!showQuotation && (
  <>
    {addOnItems.map((item, index) => {
      const categoryData = components[item.selectedCategory];
      const hasSubcategories = categoryData?.subcategories;
      let subcatData = null;
      if (item.selectedSubCategory && hasSubcategories) {
        subcatData = categoryData.subcategories[item.selectedSubCategory];
      }

      return (
        <div key={index} style={styles.itemContainer}>
          <h2 style={styles.itemTitle}>Item {index + 1}</h2>

          {/* Category Select */}
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Select Category:</label>
            <SelectSearch
              options={Object.keys(components).map((catKey) => ({
                value: catKey,
                name: catKey,
              }))}
              value={item.selectedCategory}
              onChange={(value) => handleItemChange(index, 'selectedCategory', value)}
              search
              placeholder="-- Select Category --"
            />
          </div>

          {/* Subcategory Select */}
          {item?.selectedCategory && hasSubcategories && (
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Select Subcategory:</label>
              <SelectSearch
                options={Object.keys(categoryData?.subcategories || {}).map((subKey) => ({
                  value: subKey,
                  name: subKey,
                }))}
                value={item?.selectedSubCategory}
                onChange={(value) => handleItemChange(index, 'selectedSubCategory', value)}
                search
                placeholder="-- Select Subcategory --"
              />
            </div>
          )}

          {/* Component/Item Select */}
          {((item?.selectedCategory && !hasSubcategories && categoryData?.items) ||
            (item?.selectedSubCategory && subcatData?.items)) ? (
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Select Component:</label>
              <SelectSearch
                options={(subcatData ? subcatData.items : categoryData.items)
                  .filter(row => {
                    const headingToExclude = subcatData ? subcatData.heading : categoryData.heading;
                    const firstColumn = row.componentName ||
                      row[(subcatData ? subcatData.header : categoryData.header)[0]];
                    return (
                      !headingToExclude ||
                      !firstColumn ||
                      firstColumn.toLowerCase().trim() !== headingToExclude.toLowerCase().trim()
                    );
                  })
                  .map((comp) => {
                    const firstColKey = subcatData
                      ? subcatData.header?.[0]
                      : categoryData.header?.[0];
                    const displayName = comp.componentName || comp[firstColKey] || '';
                    return {
                      value: displayName,
                      name: displayName,
                    };
                  })}
                value={item.selectedItem}
                onChange={(value) => handleItemChange(index, 'selectedItem', value)}
                search
                placeholder="-- Select Component --"
              />
            </div>
          ) : null}

          {/* Switch Access -> Gormet Hole: Diameter Select */}
          {item.selectedCategory === 'Switch Access' &&
            item.selectedSubCategory === 'Gormet Hole' &&
            item.selectedItem &&
            subcatData && (
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Select Diameter:</label>
                <SelectSearch
                  options={subcatData.diameters.map((diam) => ({
                    value: diam,
                    name: diam,
                  }))}
                  value={item.selectedDiameter}
                  onChange={(value) => handleItemChange(index, 'selectedDiameter', value)}
                  search
                  placeholder="-- Select Diameter --"
                />
              </div>
            )}

          {/* Options Dropdown for other subcategories */}
          {item.selectedItem &&
            ((categoryData?.header?.length > 1 && !subcatData) ||
              (subcatData?.header?.length > 1 && (!subcatData.diameters))) && (
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Select Option:</label>
                <SelectSearch
                  options={getOptionLabels(subcatData || categoryData).map(({ key, label }) => ({
                    value: key,
                    name: label,
                  }))}
                  value={item.selectedOption}
                  onChange={(value) => handleItemChange(index, 'selectedOption', value)}
                  search
                  placeholder="-- Select Option --"
                />
              </div>
            )}

          {/* Size Select for System Components */}
          {item.selectedCategory === 'System Components' && item.selectedItem && (
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Select Size:</label>
              <SelectSearch
                options={components['System Components']?.sizes?.map((sizeVal) => ({
                  value: sizeVal,
                  name: sizeVal,
                }))}
                value={item.selectedSize}
                onChange={(value) => handleItemChange(index, 'selectedSize', value)}
                search
                placeholder="-- Select Size --"
              />
            </div>
          )}

          {/* Quantity Input */}
          {item.selectedCategory && item.selectedItem && (
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Quantity:</label>
              <input
                type="number"
                style={styles.input}
                value={item.quantity}
                min={1}
                onChange={(e) => updateQuantity(index, e.target.value, 'addon')}
              />
            </div>
          )}

          {/* Display Price */}
          {item.price != null && (
            <div style={styles.priceContainer}>
              <p style={styles.priceText}>
                <strong>Total Price:</strong> {item.price}
              </p>
            </div>
          )}

          {addOnItems.length > 1 && (
            <button onClick={() => deleteAddonItem(index)} style={{...styles.button,  background:"orange"}} >Delete</button>
          )}
        </div>
      );
    })}

    {/* Add More Button and Navigation Buttons */}
    <button   style={{ ...styles.button, ...styles.addButton, background:"orange" }} onClick={addItem}>
      Add More
    </button>
    <div style={{ marginTop: '16px' }}>
      <button style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={handleBack}>
        Back
      </button>
      {addOnItems.length > 0 && (
        <button style={{ ...styles.button, ...styles.generateButton }} onClick={handleGenerateQuotation}>
          Generate Quotation
        </button>
      )}
    </div>
  </>
)}

      {/* Quotation Table */}
      {showQuotation && (
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>Quotation No #{customer.quotationNumber}</h2>
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
              {customer.systemItems.filter(item => item.selectedSystem && item.selectedDimension && item.quantity).map((item, idx) => (
                <tr key={`system-${idx}`}>
                  <td style={styles.td}>System</td>
                  <td style={styles.td}>{item.selectedSystem}</td>
                  <td style={styles.td}>{item.selectedDimension} - {item.selectedSharing}</td>
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
                  {customer.systemItems.reduce((sum, i) => sum + (i.price || 0), 0) +
                    addOnItems.reduce((sum, i) => sum + (i.price || 0), 0)}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            style={{ ...styles.button, ...styles.exportButton, marginTop: '10px' }}
            onClick={exportToExcel}
          >
            Export
          </button>
          {!showQuotation && (
          <button
            style={{ ...styles.button, ...styles.exportButton }}
            onClick={() => setShowQuotation(false)}
          >
            Back
          </button>
          )}
          <button
            style={{ ...styles.button, ...styles.exportButton }}
            onClick={() => navigate('/system')}
          >
            Edit
          </button>
          <button
          style={{ ...styles.button, ...styles.exportButton }}
          onClick={() => handleHome()}>
            Home
          </button>
        </div>
)} 
    </div>
  );
}
  
