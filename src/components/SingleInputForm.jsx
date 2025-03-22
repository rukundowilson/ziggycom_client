import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import Toast from './Toast';

const WhyExistModal = ({openStatus,onclose,employee,closeProfile,refreshEmployDir}) => {
  
  const [reason, setReason] = useState('');
  const [err,setError] = useState("")
  if (!openStatus) return null;
  const updateEmployeeStatus = async () => {
    try {
      const response = await fetch("http://localhost:8080/manageDeparturesApi", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employee: employee,
          reason: reason
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData.message);
        return;
      }  
      const responseData = await response.json();
      console.log("Success response:", responseData.message);
      setError("")
  
      // Update state or perform any other actions after successful submission
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reason for exit:", reason);
    if(reason.length !== 0){
      updateEmployeeStatus();
      closeProfile();
      window.location.href ="/user/dashboard/show-employees"
    }
    setError("reason for employee departure is required")
    

    setReason("")
    console.log("test error",err)
  };
  

  return (
    <>

      <form onSubmit={handleSubmit} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
          <h2 className="text-lg font-semibold mb-4">Reason for Job Exit</h2>
          <h2 className="text-sm text-red-500 mb-4">Are you sure you want terminate this Employee? </h2>
          <button
            onClick={onclose}
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
          <div>
            <hr />
            <br />
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex-grow border p-2 rounded"
                placeholder="Enter your reason"
              />
              <button
                onClick={handleSubmit}
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          <small className='font-bold text-red-500 my-4'>{err}</small>
        </div>
      </form>
    </>
  );
};

export default WhyExistModal;