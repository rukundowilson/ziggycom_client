import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Toast from './Toast';

const EmployeeEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeDataPassed = location.state?.employee;

  const [jobTitles, setjobTitles] = useState([])
  console.log(employeeDataPassed)
  const [jobTitlesWarning, setJobTitlesWarning] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [formData, setFormData] = useState({})
  const RealformData = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    national_id: formData.nationalId,
    date_of_birth: formData.date_date_of_birth,
    department_id: formData.department,
    job_title: formData.jobTitle,
    contract_type: formData.contractType,
    basic_salary: formData.basic_salary,
    education_revel: formData.education_revel,
    country: formData.country,
    city: formData.city,
    email: formData.email,
  }

  // check if we have an employee
  if (!employeeDataPassed) {
    return (
      <div className="flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Cannot edit profile for anonymous employee. Please select an employee from the dashboard.
          </p>
          <button
            onClick={() => navigate('/user/dashboard/show-employees')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            employee directory
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:8080/departments", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }

        const data = await response.json();
        setDepartments(data.departments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const getAllRoles = async () => {
    try {
      if (!selectedDepartment) return;
      
      const response = await fetch(`http://localhost:8080/department/${selectedDepartment}/all-jobs`, {
        method: 'GET',
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const employeeSettings = await response.json();
      console.log("Jobs fetched:", employeeSettings.jobs);
      
      if (employeeSettings.jobs.length === 0) {
        setJobTitlesWarning("No roles found in selected department");
      } else {
        setJobTitlesWarning(`${employeeSettings.jobs.length} role(s) found`);
      }
  
      setjobTitles(employeeSettings.jobs);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setJobTitlesWarning("Failed to fetch roles");
    }
  };

  // track department
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    console.log("Selected department:", departmentId);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation for department and job title
    if (RealformData.department_id && !RealformData.job_title) {
      setErrors(prev => ({
        ...prev,
        job_title_error: "Please select a job title for the selected department"
      }));
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/employee/update/${employeeDataPassed[0]}}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(RealformData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
  
      navigate('/user/dashboard/show-employees',{
        state : {
          message : `update success for employee with ID : ${employeeDataPassed[0]} select the name to see changes`
        }
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      setErrors({ submit: 'Failed to update employee' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  console.log(formData)
  useEffect(() => {
    if (selectedDepartment) {
      getAllRoles();
    }
  }, [selectedDepartment]);
  
  console.log( "got ya",RealformData)
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
    {errors && Object.keys(errors).length > 0 && (
      <Toast 
        message="Please fill all required fields correctly"
        duration={15000}
        type="error"
        onClose={()=> setErrors({})}
      />
    )}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-sm p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Edit Employee Profile
          </h2>
          <h2 className="text-lg mb-6 text-gray-900">
            Employee ID : {employeeDataPassed[0]}
          </h2>
          <hr />
          <br /> <br />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={employeeDataPassed[1] || 'Enter first name'}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={employeeDataPassed[2] || 'Enter last name'}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  dob
                </label>
                <input
                  type="date"
                  name="date_date_of_birth"
                  value={formData.date_date_of_birth}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.date_date_of_birth ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.date_date_of_birth && <p className="mt-1 text-sm text-red-500">{errors.date_date_of_birth}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  country/state
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder={employeeDataPassed[10] || 'Enter your country'}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  city
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={employeeDataPassed[9] || 'Enter your city'}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  National ID
                </label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder={employeeDataPassed[3] || 'Enter national ID'}
                  className={`w-full px-3 py-2 border ${
                    errors.nationalId ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.nationalId && <p className="mt-1 text-sm text-red-500">{errors.nationalId}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  education level
                </label>
                <select
                  name="education_revel"
                  value={formData.education_revel}
                  onChange={(e) => {
                    handleChange(e);
                    handleDepartmentChange(e);
                  }}
                
                  className={`w-full px-3 py-2 border ${
                    errors.education_revel ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select degree</option>
                  {["bachelors","masters","professor","high school"].map(degree => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
                {errors.education_revel && <p className="mt-1 text-sm text-red-500">{errors.education_revel}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={(e) => {
                    handleChange(e);
                    handleDepartmentChange(e);
                  }}
                
                  className={`w-full px-3 py-2 border ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  job title
                </label>
                <select
                  name="jobTitle"
                  value={formData?.jobTitle}
                  onChange={(e) => handleChange(e)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${errors.job_title_error ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}                >
                  <option value="">Select role</option>
                  {jobTitles.map(title => (
                    <option key={title.job_id} value={title.job_id}>
                      {title.job_title}
                    </option>
                  ))}
                </select>
                {errors.job_title_error && <p className="mt-1 text-sm text-red-500">{errors.job_title_error}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Type
                </label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.contractType ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Contract Type</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
                {errors.contractType && <p className="mt-1 text-sm text-red-500">{errors.contractType}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  basic salary
                </label>
                <input
                  type="text"
                  name="basic_salary"
                  value={formData.basic_salary}
                  onChange={handleChange}
                  placeholder={employeeDataPassed[8] || 'Enter national ID'}
                  className={`w-full px-3 py-2 border ${
                    errors.basic_salary ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.basic_salary && <p className="mt-1 text-sm text-red-500">{errors.basic_salary}</p>}
              </div>

            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEdit;