import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Customer({
  setCustomers,
  customers,
  activeCustomerIndex,
  setActiveCustomerIndex,
  editingQuotation,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    date: "",
    phoneNumber: "",
    location: "",
    email: "",
  });

  useEffect(() => {
    if (editingQuotation && activeCustomerIndex !== null) {
      // Load existing customer details
      const existingDetails = customers[activeCustomerIndex].customerDetails;
      setCustomerDetails(existingDetails);
    } else {
      // Reset details for new quotation
      setCustomerDetails({
        customerName: "",
        date: "",
        phoneNumber: "",
        location: "",
        email: "",
      });
    }
  }, [activeCustomerIndex, editingQuotation, customers]);

  const navigateNext = () => {
    if (location?.state?.showQuotation) {
      navigate("/addon", { state: { showQuotation: true } });
    } else {
      navigate("/system"); // Default navigation to System
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const updatedCustomer = {
      ...customers[activeCustomerIndex],
      customerDetails,
    };

    if (editingQuotation) {
      // Update existing customer
      setCustomers(
        customers.map((cust, idx) =>
          idx === activeCustomerIndex ? updatedCustomer : cust
        )
      );
    } else {
      // Add new customer
      const newCustomer = {
        customerDetails,
        systemItems: [
          {
            selectedSystem: "",
            selectedSharing: "",
            selectedDimension: "",
            quantity: 1,
            price: 0,
          },
        ],
        addOnItems: [
          {
            selectedCategory: "",
            selectedItem: "",
            quantity: 1,
            price: 0,
          },
        ],
        quotationNumber: null,
      };
      setCustomers([...customers, newCustomer]);
      setActiveCustomerIndex(customers.length); // Set new customer as active
    }
    navigateNext(); // Use the new navigation function
  };

  const handleChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-50">
      <h2 className="text-2xl font-bold my-4">Customer Details</h2>
      <form
        onSubmit={onSubmit}
        className="flex flex-col space-y-4 p-6 max-w-lg w-full bg-white rounded shadow-md"
      >
        <div className="flex items-center space-x-2">
          <label className="w-32">Customer Name:</label>
          <input
            name="customerName"
            value={customerDetails.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            className="p-2 border border-gray-300 rounded flex-1"
            required
            maxLength="50"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-32">Date:</label>
          <input
            name="date"
            type="date"
            value={customerDetails.date}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded flex-1"
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-32">Phone Number:</label>
          <input
            name="phoneNumber"
            type="number"
            value={customerDetails.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-2 border border-gray-300 rounded flex-1"
            required
            pattern="^[0-9]{10}$"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-32">Location:</label>
          <input
            name="location"
            value={customerDetails.location}
            onChange={handleChange}
            placeholder="Location"
            className="p-2 border border-gray-300 rounded flex-1"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-32">Email:</label>
          <input
            name="email"
            type="email"
            value={customerDetails.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 border border-gray-300 rounded flex-1"
            required
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-yellow-500 text-white rounded cursor-pointer hover:bg-yellow-400"
        >
          Next
        </button>
      </form>
    </div>
  );
}

export default Customer;
