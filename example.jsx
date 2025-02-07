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