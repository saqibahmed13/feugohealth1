import React from "react";
import { Link } from "react-router-dom";

export default function Home({ setActiveButton }) {
  return (
    <div className="flex justify-around items-center h-screen">
      <Link to="/customer" onClick={() => setActiveButton('/customer')}>
        <h2 className="bg-orange-400 ml-20 p-20 rounded cursor-pointer hover:bg-orange-300">
          New Quotation
        </h2>
      </Link>
      <Link to="/quotations" onClick={() => navigate("/quotation")}>
  <h2 className="bg-orange-400 mr-20 p-20 rounded cursor-pointer hover:bg-orange-300">
    Manage Quotation
  </h2>
</Link>
    </div>
  );
}
