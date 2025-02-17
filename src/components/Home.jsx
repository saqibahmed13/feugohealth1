import { Link, useNavigate } from "react-router-dom";

function Home({ setActiveCustomerIndex, customers, setEditingQuotation }) {
  const navigate = useNavigate();

  const handleNewQuotation = () => {
    setActiveCustomerIndex(null); // Reset active customer index
    setEditingQuotation(false); // Indicate we're creating a new quotation
    navigate("/customer", { state: { showQuotation: false } });
  };

  const handleManageQuotations = () => {
    navigate("/manage-quotations");
  };

  return (
    <div className="flex justify-around items-center h-screen">
      <button
        onClick={handleNewQuotation}
        className="bg-orange-400 m-2 p-4 rounded cursor-pointer hover:bg-orange-300 text-white text-xl"

      >
        New Quotation
      </button>
      <button
        onClick={handleManageQuotations}
        className="bg-orange-500 m-2 p-4 rounded cursor-pointer hover:bg-orange-400 text-white text-xl"
      >
        Manage Quotations
      </button>
    </div>
  );
}

export default Home;
