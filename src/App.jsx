import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import System from "./components/System";
import Addon from "./components/Addon";
import Home from "./components/Home";
import Customer from "./components/Customer";

function App() {
  const [step, setStep] = useState(1);
  const [systemItems, setSystemItems] = useState([]);
  const [addOnItems, setAddOnItems] = useState([
    {
      selectedComponent: '',
      selectedSize: '',
      quantity: 1,
      price: null,
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
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<Customer />} />
          <Route 
            path="/system" 
            element={
              <System 
                systemItems={systemItems} 
                setSystemItems={handleSystemItemsUpdate} 
                handleNext={() => setStep(2)} 
              />
            } 
          />
          <Route 
            path="/addon" 
            element={
              <Addon 
                systemItems={systemItems} 
                addOnItems={addOnItems} 
                setAddOnItems={handleAddOnItemsUpdate} 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
