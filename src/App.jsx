import { useState, useEffect } from "react";
import System from "./components/System";
import Addon from "./components/Addon";
import Home from "./components/Home";
import Customer from "./components/Customer";
import { Router,Routes, Route } from "react-router-dom";


function App() {
  // const [setButton, setActiveButton] = useState('');
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
    localStorage.setItem('systemItems', JSON.stringify(items));
  };

  const handleAddOnItemsUpdate = (items) => {
    setAddOnItems(items);
    localStorage.setItem('addOnItems', JSON.stringify(items));
  };

  const handleNextFromExcel = () => {
    setStep(2);
  };

  const handleBackToExcel = () => {
    setStep(1);
  };

  return (
    <>
    <div className="fuedohealth">
    {/* <Router>
      <Routes>
        <Route path="/" element={<Home setActiveButton={setActiveButton} />} />
        <Route path="/customer" element={<Customer />} />
      </Routes>
    </Router> */}
    {step === 1 && (
        <System
          systemItems={systemItems}
          setSystemItems={handleSystemItemsUpdate}
          handleNext={handleNextFromExcel}
        />
      )}
      {step === 2 && (
        <Addon
          systemItems={systemItems}
          addOnItems={addOnItems}
          setAddOnItems={handleAddOnItemsUpdate}
          handleBack={handleBackToExcel}
          setSystemItems={handleSystemItemsUpdate}
        />
      )}
    </div>
      
    </>
  )
}

export default App;