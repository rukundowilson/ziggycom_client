
import React, { useEffect, useState } from 'react';
import { UserIcon } from 'lucide-react';

// Sample user data
const baseURL = 'https://ziggycom-backend.onrender.com'
const [employees, setEmployees] = useState();
const sampleUsers = [
  { 
    id: 1,
    name: 'Kumaran Rao', 
    email: 'kumaran.rao@example.com', 
    status: 'online' 
  },
  { 
    id: 2,
    name: 'Udhaya Chetty', 
    email: 'udhaya.chetty@example.com', 
    status: 'online' 
  },
  { 
    id: 3,
    name: 'Josh Menu', 
    email: 'josh.menu@example.com', 
    status: null 
  },
  { 
    id: 4,
    name: 'Niranjan', 
    email: 'niranjan@example.com', 
    status: null 
  }
];

// get all recent hired employees
const hired = async () => {
  try {
    const response = await fetch(`${baseURL}/all/employees`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.error || 'Unknown error');
      return;
    }

    const data = await response.json();
    const employeesData = data.result || [];
    console.log('Raw employee data:', employeesData); // Debug log

    const formattedEmployees = employeesData.map(item => ({
      id: item.employee_id,
      name: item.first_name,
      role: item.job_title || '',
      department: item.department_name || '',
      email: item.email || '',
      status: item.status || ''
    }));

    console.log('Formatted employees:', formattedEmployees); // Debug log
    setEmployees(formattedEmployees);
  } catch (error) {
    console.error("Failed to fetch employees:", error.message);
  }
};
useEffect(()=>{
  // hired();
},[])

const RecentAddedEmployees_ = ({ users = employees }) => {
  return (
    <div className="w-full space-y-3">
      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No users to display
        </div>
      ) : (
        users.map((user) => (
          <div 
          
            key={user.id} 
            className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 text-green-600 rounded-full p-2">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.name || 'Unnamed User'}</p>
                <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
              </div>
            </div>
            {user.status && (
              <div className="flex items-center space-x-2">
                {user.status === 'online' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
                {user.status === 'away' && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RecentAddedEmployees_;