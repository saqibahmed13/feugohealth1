import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import System from "./components/System";
import Home from "./components/Home";
import Customer from "./components/Customer";
import Addon from "./components/addon";

function App() {
  const [systemItems, setSystemItems] = useState([{
    selectedSystem: '',
    selectedSharing: '',
    dimensions: [],
    selectedDimension: '',
    quantity: 1,
    unitPrice: null,
    price: null,
    quotationNumber: null,
  }]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [activeButton, setActiveButton] = useState('/customer');
  const [addOnItems, setAddOnItems] = useState([
    {
      selectedComponent: '',
      selectedSize: '',
      quantity: 1,
      price: null,
      quotationNumber: null,
    },
  ]);

  const handleSystemItemsUpdate = (items) => {
    setSystemItems(items);
    localStorage.setItem("systemItems", JSON.stringify(items));
  };

  const handleAddOnItemsUpdate = (items) => {
    setAddOnItems(items);
    localStorage.setItem("addOnItems", JSON.stringify(items));
  };

  return (
    <Router>
      <div className="fuedohealth">
        <Routes>
          <Route path="/" element={<Home setActiveButton={setActiveButton} />} />
          <Route path="/customer" element={<Customer setCustomerDetails={setCustomerDetails} customerDetails={customerDetails} />} />
          <Route 
            path="/system" 
            element={
              <System 
                systemItems={systemItems} 
                setSystemItems={handleSystemItemsUpdate} 
                customerDetails={customerDetails}
              />
            } 
          />
          <Route 
            path="/addon" 
            element={
              <Addon 
                setSystemItems={setSystemItems}
                systemItems={systemItems} 
                addOnItems={addOnItems} 
                setAddOnItems={handleAddOnItemsUpdate} 
                customerDetails={customerDetails}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
