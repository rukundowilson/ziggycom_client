import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown } from "lucide-react";
import EmployeeProfilePreview from './EmployeeProfile';
import { useLocation } from 'react-router';
import Toast from './Toast';

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const baseURL = 'https://ziggycom-backend.onrender.com'

  // get data from navigations
  const location = useLocation();
  const locationMessage = location.state?.message;

  useEffect(() => {
    if (locationMessage) {
      setToastMessage(locationMessage);
      setShowToast(true);
    }
  }, [locationMessage]);

  const fetchAllEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/all/employees`, {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error:', data.error);
        return;
      }
  
      const employeesData = data.result;
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
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const handleModal = async (event) => {
    setIsModalOpen(true);
    const employeeId = event.currentTarget.getAttribute('value');
    try {
      const response = await fetch(`${baseURL}/employee-profile/${employeeId}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error:', data.error);
        return;
      }
      console.log("gotch ya", data);
  
      const employeeData = {
        id: data.employee_id,
        fname: data.first_name,
        lname: data.last_name,
        natinal_id: data.national_id,
        date_of_birth: data.date_of_birth,
        hire_date: data.hire_date,
        contract_type: data.contract_type,
        basic_salary: data.basic_salary,
        status: data.status,
        l_educatin: data.education_revel,
        country: data.country,
        city: data.city,
        department: data.department_name,
        job_title: data.job_title,
        email: data.email
      };
  
      setSelectedEmployee(employeeData);
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800";
      case "Remote":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedAndFilteredEmployees = employees
    .filter(employee =>
      Object.values(employee).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  return (
    <div className="w-full my-17 max-w-6xl bg-white rounded-xl shadow-lg">
      {showToast && (
        <Toast 
          message={toastMessage}
          duration={8000}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      <EmployeeProfilePreview 
        isOpen={isModalOpen} 
        employee={selectedEmployee}
        handleEmployeeModal={fetchAllEmployees}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
      />
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {["Name", "Role", "Department", "Email", "Status"].map((header, index) => (
                    <th 
                      key={index}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => handleSort(header.toLowerCase())}
                    >
                      <div className="flex items-center gap-2">
                        {header}
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                ) : (
                  sortedAndFilteredEmployees.map((employee) => (
                    <tr 
                      key={employee.id} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td 
                        value={employee.id} 
                        onClick={handleModal}
                        className="px-6 py-4 cursor-pointer"
                      >
                        <div className="px-3 py-1.5 text-white hover:text-white font-medium text-sm rounded border bg-gray-700 hover:border-gray-400 hover:shadow-sm transition-all duration-200 ease-in-out cursor-pointer transform hover:-translate-y-0.5">
                          {employee.name}
                        </div>  
                      </td>
                      <td className="px-6 py-4 text-gray-600">{employee.role}</td>
                      <td className="px-6 py-4 text-gray-600">{employee.department}</td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${employee.email}`} className="text-blue-600 hover:text-blue-800">
                          {employee.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {sortedAndFilteredEmployees.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-600">No employees found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;