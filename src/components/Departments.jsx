import React, { useEffect, useState } from "react";
import { Plus, Briefcase, Trash2, X } from "lucide-react";
import Toast from "./Toast";

const DepartmentNavigation = () => {
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // New state for job form
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [priority,setPriority] = useState("");
  const [jobs,setJobs] = useState([])
  const [numberOfWorkers,setNumberOfWorkers] = useState("")
  const baseURL = "https://ziggycom-backend.onrender.com"

  // Add clear message functions
  const clearError = () => setError('');
  const clearSuccess = () => setSuccess('');

  const getAllDepartment = async () => { 
    try {
      const response = await fetch(`${baseURL}/departments`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }

      const data = await response.json();
      const { departments: fetchedDepartments } = data;
  
      console.log("Departments fetched:", fetchedDepartments);
  
      const colors = [
        "bg-blue-100",
        "bg-green-100",
        "bg-purple-100",
        "bg-pink-100",
        "bg-yellow-100",
        "bg-indigo-100",
      ];
  
      const mappedDepartments = fetchedDepartments.map((department, index) => ({
        id: department.department_id,
        name: department.department_name,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
  
      setDepartments(mappedDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert("Failed to fetch departments");
    }
  };
  const fetchDepartmentJobs = async () => {
    try {
      const response = await fetch(`${baseURL}/department/${selectedDepartment.id}/all-jobs`,{
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (!response.ok) {
        throw new Error('Failed to fetch department jobs');
      }

      const data = await response.json();
      const { jobs } = data;
      
      
      console.log("Jobs for department:", data);
      setJobs(jobs)
    } catch (error) {
      console.error("Error fetching department jobs:", error);
      alert("Failed to fetch jobs for this department.");
    }
  };

  const handleAddJob = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError("Please enter both job title and description.");
      return;
    }
  
    try {
      const response = await fetch(`${baseURL}/department/${selectedDepartment.id}/jobs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_title: jobTitle,
          job_description: jobDescription,
          department_id: selectedDepartment,
          priority : priority,
          numberOfWorkers: parseInt(numberOfWorkers, 10)
        })
      });
    
      if (!response.ok) {
        throw new Error('Failed to add job',response.error);
      }

      const data = await response.json();
      console.log("Job added:", data);

      // Refresh jobs list
      await fetchDepartmentJobs(selectedDepartment.id);

      // Reset job form
      setJobTitle("");
      setJobDescription("");
      setNumberOfWorkers("");
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const handleOpenJobModal = (department) => {
    setSelectedDepartment(department);
    setJobModalOpen(true);
  };
  console.log(priority)
  useEffect(() => {
    if (selectedDepartment) {
      fetchDepartmentJobs();
    }
  }, [selectedDepartment]);
  

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) {
      setError("Please enter a valid department name.")
      return;
    }
  
    try {
      const response = await fetch(`${baseURL}/new/department`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newDepartment })
      });

      if (!response.ok) {
        throw new Error('Failed to add department');
      }

      const resp = await response.json();
      console.log("Backend response:", resp);
      setSuccess(resp.message)
  
      const { newDepartment: createdDepartment, error} = resp;

      // show message if alreay exist
      if (error){
        console.log(error)
        setError(error)
      }
  
      if (createdDepartment) {
        setDepartments((prevDepartments) => [
          ...prevDepartments,
          {
            id: createdDepartment.department_id,
            name: createdDepartment.department_name,
            color: "bg-blue-100",
          },,
        ]);
      }
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Failed to add the department. Check the console for details.");
    }
  };

  const handleCloseAdd = ()=>{
    handleAddDepartment();
    setOpen(false);
    setNewDepartment("");
    getAllDepartment();
  }

  useEffect(() => {
    getAllDepartment();
  }, [newDepartment,open,!open]);  

  return (
    <div className="max-w-2xl my-20 mx-auto bg-white shadow-lg rounded-md p-6 space-y-6">
      {/* Toast Messages */}
      {error && <Toast message={error} type="error" onClose={clearError} duration={7000} />}
      {success && <Toast message={success} type="success" onClose={clearSuccess} duration={7000} />}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Briefcase className="mr-3 text-gray-600" size={24} />
          Departments
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-700 text-white rounded-full p-2 hover:bg-gray-500 transition-colors"
          disabled={loading}
        >
          {loading ? <Spinner /> : <Plus size={20} />}
        </button>
      </div>

        <div className="space-y-3">
          {departments.length ===  0? (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
              <span className="text-3xl mb-4">📁</span>
              <h3 className="text-xl font-semibold text-gray-700">No Departments Found</h3>
              <p className="text-gray-500 mt-2">Start by creating your first department</p>
            </div>
          ):(
            <div>
              {departments.map((dept,index) => (
            <div
              key={dept.id}
              className={`flex items-center my-3 justify-between p-3 rounded-lg ${dept.color} hover:shadow-md transition-shadow`}
            >
              <span className="font-medium text-gray-800">{index+1}: {dept.name}</span>
              <div className="flex items-center space-x-2">
                <button title="add or view work tittles"
                  onClick={() => handleOpenJobModal(dept)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Briefcase size={18} />
                </button>
                <button
          
                  // handleDeleteDepartment(dept.id)}
                  title="delete department"
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
            </div>
          )}
        
      </div>

      {/* Department Add Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Department
            </h3>
            <input
              name="department"
              id="department"
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="Enter department name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseAdd}
                className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Modal */}
      {jobModalOpen && (
        <div id={selectedDepartment.id} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Jobs in {selectedDepartment?.name}
              </h3>
              <button
                onClick={() => setJobModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            {/* Job Form */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="number of applicants"
                value={numberOfWorkers}
                onChange={(e) => setNumberOfWorkers(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <textarea
                placeholder="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />

              <div className="flex gap-2 my-2 ">
              <input
                type="radio"
                id="priority-high"
                name="priority"
                value="high"
                checked={priority === "high"}
                onChange={() => setPriority("high")}
              />
              <label htmlFor="priority-high">High</label>

              <input
                type="radio"
                id="priority-low"
                name="priority"
                value="low"
                checked={priority === "low"}
                onChange={() => setPriority("low")}
              />
              <label htmlFor="priority-low">Low</label>

              </div>

              <button
                onClick={handleAddJob}
                className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add Job
              </button>
            </div>

            {/* Available J
            obs Section */}
            <hr className="my-4"/>
            {!jobs ? (
                <p className="text-gray-500 text-center">No job titles were found in this department</p>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div
                      key={job.job_id}
                      className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{job.job_title}</div>
                      <div className="text-sm text-gray-600">{job.job_description}</div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentNavigation;
