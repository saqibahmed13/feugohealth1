import { Link, useNavigate } from "react-router-dom";

export default function Home({ setActiveButton }) {
  const navigate = useNavigate();

  const handleManageQuotationClick = () => {
    setActiveButton('/addon');
    navigate('/customer', { state: { showQuotation: true } });
  };

  return (
    <div className="flex justify-around items-center h-screen">
      <Link to="/customer" onClick={() => setActiveButton('/customer')}>
        <h2 className="bg-orange-400 ml-20 p-20 rounded cursor-pointer hover:bg-orange-300">
          New Quotation
        </h2>
      </Link>
      <h2 className="bg-orange-400 mr-20 p-20 rounded cursor-pointer hover:bg-orange-300" onClick={handleManageQuotationClick}>
        Manage Quotation
      </h2>
    </div>
  );
}
