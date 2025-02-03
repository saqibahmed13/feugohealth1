import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-around items-center h-screen">
      <h2
        className="bg-orange-400 ml-20 p-20 rounded cursor-pointer hover:bg-orange-300"
        onClick={() => navigate("/customer")}
      >
        New Quotation
      </h2>
      <h2 className="bg-orange-400 mr-20 p-20 rounded">Manage Quotation</h2>
    </div>
  );
}
