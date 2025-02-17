import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function ManageQuotations({
  customers,
  setCustomers,
  setActiveCustomerIndex,
  setEditingQuotation,
}) {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);
  

  const handleQuotationSelect = (index) => {
    setActiveCustomerIndex(index);
    setEditingQuotation(true);
    navigate("/customer", { state: { showQuotation: true } });
  };

  const handleDeleteClick = (index) => {
    setQuotationToDelete(index);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    const updatedCustomers = customers.filter(
      (_, idx) => idx !== quotationToDelete
    );
    setCustomers(updatedCustomers);
    setShowConfirmation(false);
    setQuotationToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setQuotationToDelete(null);
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-50">
      <h2 className="text-2xl font-bold my-4">Manage Quotations</h2>
      {customers.length > 0 ? (
        customers.map((customer, index) => (
          <div
            key={index}
            style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px', width: '40%', maxWidth: 'md', marginBottom: '10px'}}
          >
            <h5 style={{fontSize: '16px', fontWeight: 'bold',textTransform: 'capitalize'}}>Quotation No</h5>
            <button
              onClick={() => handleQuotationSelect(index)}
              className="text-blue-500 flex-grow text-left cursor-pointer pl-2 hover:underline"
            >
               #{customer.quotationNumber || index + 1}
            </button>
            <h5 style={{ fontSize: '16px', fontWeight: 'bold',textTransform: 'capitalize'}}>{customer.customerDetails.customerName || `Customer ${index + 1}`}</h5>
            <button
              onClick={() => handleDeleteClick(index)}
              className="text-red-500 ml-4"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <h2>No customer quotations found.</h2>
      )}
      <button type="button" style={{backgroundColor: 'black', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '20px'}} onClick={() => navigate("/")}>Home</button>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p>Are you sure you want to delete this quotation?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 mr-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageQuotations; 