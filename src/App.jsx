import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import System from "./components/System";
import Home from "./components/Home";
import Customer from "./components/Customer";
import Addon from "./components/Addon";
import ManageQuotations from "./components/ManageQuotations";

function App() {
  const [customers, setCustomers] = useState(() => {
    const localData = localStorage.getItem('customers');
    return localData ? JSON.parse(localData) : [{
      customerDetails: {},
      systemItems: [
        { id: 1, selectedSystem: '', selectedSharing: '', selectedDimension: '', quantity: 1, price: 0 }
      ],
      addOnItems: [
        { id: 1, selectedCategory: '', selectedItem: '', quantity: 1, price: 0 }
      ],
      quotationNumber: null, 
    }];
  });
  const [activeCustomerIndex, setActiveCustomerIndex] = useState(null); 
  const [editingQuotation, setEditingQuotation] = useState(false); 
  
  const handleCustomerUpdate = (index, updatedCustomer) => {
    const newCustomers = [...customers];
    newCustomers[index] = updatedCustomer;
    setCustomers(newCustomers);
  };

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  return (
    <Router>
      <div className="fuedohealth">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setActiveCustomerIndex={setActiveCustomerIndex}
                customers={customers}
                setEditingQuotation={setEditingQuotation}
              />
            }
          />
          <Route
            path="/customer"
            element={
              <Customer
                setCustomers={setCustomers}
                customers={customers}
                activeCustomerIndex={activeCustomerIndex}
                setActiveCustomerIndex={setActiveCustomerIndex}
                editingQuotation={editingQuotation}
              />
            }
          />
          <Route
            path="/system"
            element={
              <System
                customer={customers[activeCustomerIndex]}
                handleCustomerUpdate={(updatedCustomer) =>
                  handleCustomerUpdate(activeCustomerIndex, updatedCustomer)
                }
              />
            }
          />
          <Route
            path="/addon"
            element={
              <Addon
                customer={customers[activeCustomerIndex]}
                handleCustomerUpdate={(updatedCustomer) =>
                  handleCustomerUpdate(activeCustomerIndex, updatedCustomer)
                }
              />
            }
          />
          <Route
            path="/manage-quotations"
            element={
              <ManageQuotations
                customers={customers}
                setCustomers={setCustomers}
                setActiveCustomerIndex={setActiveCustomerIndex}
                setEditingQuotation={setEditingQuotation}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
