import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Customer({ setCustomerDetails }) {
  const navigate = useNavigate();

  // Define state for each form field
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');

  const onSubmit = (e) => {
    e.preventDefault(); 
    const data = { customerName, date, phoneNumber, location, email };
    setCustomerDetails(data);
    navigate("/system");
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-50">
      <h2 className="text-2xl font-bold my-4">Customer Details</h2>
      <form
        onSubmit={onSubmit}
        className="flex flex-col space-y-4 p-6 max-w-lg w-full bg-white rounded shadow-md"
      >
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
          className="p-2 border border-gray-300 rounded"
          required
          maxLength="50"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          className="p-2 border border-gray-300 rounded"
          required
          pattern="^[0-9]{10}$"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded"
          required
        />
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
