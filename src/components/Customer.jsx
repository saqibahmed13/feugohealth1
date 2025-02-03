import { useForm } from "react-hook-form"

export default function Customer() {
  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => console.log(data)

  return (
    <div className="flex flex-col items-center h-screen bg-gray-50">
      <h2 className="text-2xl font-bold my-4">Customer Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 p-6 max-w-lg w-full bg-white rounded shadow-md">
        <input 
          {...register("customerName", { required: true, maxLength: 50 })} 
          placeholder="Customer Name" 
          className="p-2 border border-gray-300 rounded"
        />
        <input 
          type="date" 
          {...register("date", { required: true })} 
          placeholder="Date" 
          className="p-2 border border-gray-300 rounded"
        />
        <input 
          type="tel" 
          {...register("phoneNumber", { required: true, pattern: /^[0-9]{10}$/ })} 
          placeholder="Phone Number" 
          className="p-2 border border-gray-300 rounded"
        />
        <input 
          {...register("location", { required: true })} 
          placeholder="Location" 
          className="p-2 border border-gray-300 rounded"
        />
        <input 
          type="email" 
          {...register("email", { required: true })} 
          placeholder="Email" 
          className="p-2 border border-gray-300 rounded"
        />
        <input 
          type="submit" 
          value="Next"
          className="p-2 bg-yellow-500 text-white rounded cursor-pointer hover:bg-yellow-400"
        />
      </form>
    </div>
  )
}