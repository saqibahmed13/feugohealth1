import { useState, useEffect } from "react";
import Excel from "./components/excel";
import Addon from "./components/addon";
// import Home from "./components/Home"

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
      {step === 1 && (
        <Excel
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
    </>
  )
}

export default App;