import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react';
import EmployeeProfilePreview from './EmployeeProfile';
import { useNavigate } from 'react-router';
import Toast from "./Toast";


export default function NewEmployee() {
  const navigation = useNavigate();
  const [allDepartments, setAllDepartment] = useState([])
  const [contracts, setContracts] = useState([]);
  const [educationRevel, setEducationRevel] = useState([])
  const [jobTitles, setjobTitles] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentsWarning,setDeprtmentsWarning] = useState({warning: ""})
  const [jobTitlesWarning,SetjobTitlesWarning] = useState({warning : ""})


  const [allData, setAllData] = useState({
    fname: "",
    lname: "",
    l_educatin: "",
    natinal_id: "",
    city: "",
    country: "",
    department: "",
    job_title: "",
    contract_type: "",
    basic_salary: "",
    date_of_birth : "",
    hire_date : "",
    email : "",
    status : "active"
    
  })

  const [newErrors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validation function
  const validateForm = () => {
    let tempErrorObject = {
      fnameError : "",
      lnameError : "",
      cityError : "",
      countryError : "",
      departmentError : "",
      job_title_Error : "",
      contract_type_Error : "",
      basic_salary_Error : "",
      date_of_birth_Error : "",
      hire_date_Error : "",
      email_Error : "",
      l_educatin_error : "",
      natinal_id_error : ""
    };
    // First Name Validation
    if (!allData.fname || !allData.fname.trim()) {
      tempErrorObject.fnameError = "First name is required";
    }
    if (!allData.lname.trim()) tempErrorObject.lnameError = 'Last name is required';
    if (!allData.city.trim()) tempErrorObject.cityError = 'city is required';
    if (!allData.country.trim()) tempErrorObject.countryError = 'country is required';
    if (!allData.department.trim()) tempErrorObject.departmentError = 'department is required';
    if (!allData.job_title.trim()) tempErrorObject.job_title_Error = 'role is required';
    if (!allData.contract_type.trim()) tempErrorObject.contract_type_Error = 'role is required';
    if (!allData.basic_salary.trim()) tempErrorObject.basic_salary_Error = 'salary is mandatory';
    if (!allData.date_of_birth.trim()) tempErrorObject.date_of_birth_Error = 'date of birth is required';
    if (!allData.hire_date.trim()) tempErrorObject.hire_date_Error = 'date of hiring is required';
    if (!allData.email.trim()) tempErrorObject.email_Error = 'email field is required';
    if (!allData.l_educatin.trim()) tempErrorObject.l_educatin_error = 'level of education is mandatory';
    if (!allData.natinal_id.trim()) tempErrorObject.natinal_id_error = 'national id is mandatory';

    setErrors(tempErrorObject);

    return Object.values(tempErrorObject).every(error => error === "");
  }
  console.log(newErrors)
  const handleInputChange = (field, value) => {
    setAllData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
console.log(allData);
  const handleSelectedDepartment = (event) => {
    const selectedValue = event.target.value;
    handleInputChange('department', selectedValue);
    setSelectedDepartment(selectedValue);
  };

  useEffect(() => {
    console.log("Selected department updated:", selectedDepartment);
    getContracts();
  }, [selectedDepartment]);

  const getDepartments = async () => {
    const response = await fetch('http://localhost:8080/departments', {
      method: "GET",
      credentials: 'include'
    })
    if (!response.ok) {
      console.error("error during department get from newEmployee component", response.status);
    }
    const dataResponse = await response.json();
    
    setAllDepartment(dataResponse.departments);
    if (dataResponse.departments.length === 0){
      setDeprtmentsWarning({warning: "please create departments first!"})
    }
    console.log(dataResponse)
    return (dataResponse);
  }

  const getContracts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/employee/${selectedDepartment}`, {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) {
        console.error("error during type of contract get!", response.status)
      }
      const employeeSettings = await response.json();
      setContracts(employeeSettings.contractType)
      setEducationRevel(employeeSettings.educationRevel)
      console.log("--------------",employeeSettings.jobTitles)
      employeeSettings.jobTitles.length === 0 ? SetjobTitlesWarning({warning : "0 roles found in selected department" }): SetjobTitlesWarning({warning : `${employeeSettings.jobTitles.length } role(s) found in selected department` });
      setjobTitles(employeeSettings.jobTitles)
    }
    catch (error) {
      console.log("error while getting contracts from backend", error)
    }
  }

  const handleEmploySubmit = async (event) => {
    event.preventDefault();
    validateForm()
    try {
      console.log("Preparing to submit employee data:", allData);
      console.log("Selected department ID:", selectedDepartment);

        const submitResponse = await fetch(`http://localhost:8080/new-employee/${selectedDepartment}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allData), // Ensure allData contains all necessary fields
        });
    
        if (!submitResponse.ok) {
          const errorResponse = await submitResponse.json();
          console.error("Server responded with an error:", errorResponse);
          throw new Error("Failed to submit employee data");
        }
    
        const responseData = await submitResponse.json();
        setIsModalOpen(true)      
        console.log("Employee data submitted successfully:", responseData);
        setSubmitSuccess(true)
        clearError()
    } catch (error) {
      console.error("Error submitting employee data:", error);
    }
  };

  // clear a toast message
  const clearError = () => {
    setErrors({});
    setSubmitSuccess(false)
  };
  
  useEffect(() => {
    getDepartments();
    getContracts();
  }, []);
  

  return (
    <form onSubmit={handleEmploySubmit}>
      {/* ---toast message ------*/}
      {Object.keys(newErrors).length >0 && <Toast message={"failure! did you fill all forms correctly? "} duration={100000} type="error" onClose={clearError} />}
      {submitSuccess && <Toast message={"new employee added to the data base!"} duration={5000} type="success" onClose={clearError} />}

      {/* controll employee preview profile component */}
      <EmployeeProfilePreview isOpen={isModalOpen} onClose={() => {
          console.log("Closing modal");
          setIsModalOpen(false);
          navigation('/user/dashboard/show-employees')
        }}
        employee={allData}
      />

      <div className="space-y-12 my-10 bg-white shadow-lg container mx-auto w-md max-w-2xl px-4 py-8" >
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Setting Profile For new employee</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            This information will be used to identify and manage employee so make sure it is clear.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="fname" className="block text-sm/6 font-medium text-gray-900">
                first name
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">first name/</div>
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    value={allData.fname}
                    onChange={(e) => handleInputChange('fname', e.target.value)}
                    placeholder={`waiting for input... `}
                    className={`block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6
                    ${newErrors.fnameError ? "border-red-500 border-2 border-radius-10" : ''} `}/>
                    
                </div>
                <p className='text-red-500 font-sm my-2'>{newErrors.fnameError ? newErrors.fnameError : ''}</p>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="lname" className="block text-sm/6 font-medium text-gray-900">
                last name
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">last name/</div>
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    value={allData.lname}
                    onChange={(e) => handleInputChange('lname', e.target.value)}
                    placeholder="waiting for input..."
                    className={`block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6
                    ${newErrors.lnameError ? "border-red-500 border-2 border-radius-10" : ''} `}
                  />
                </div>
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.lnameError ? newErrors.lnameError : ''}</p>

            </div>

            <div className="sm:col-span-4">
              <label htmlFor="date_of_birth" className="block text-sm/6 font-medium text-gray-900">
                date of birth
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">date_of_birth: </div>
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={allData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    placeholder="waiting for input..."
                    className={`block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6
                        ${newErrors.date_of_birth_Error ? "border-red-500 border-2 border-radius-10" : ''}
                    `}
                  />
                </div>
                <p className='text-red-500 font-sm my-2'>{newErrors.date_of_birth_Error ? newErrors.date_of_birth_Error : ''}</p>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                email address
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">email/</div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={allData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="waiting for input..."
                    className={`
                      block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6
                      ${newErrors.email_Error ? "border-red-500 border-2 border-radius-10" : ''}
                    `}
                  />
                </div>
                <p className='text-red-500 font-sm my-2'>{newErrors.email_Error ? newErrors.email_Error : ''}</p>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="l_educatin" className="block text-sm/6 font-medium text-gray-900">
                level of education
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="l_educatin"
                  name="l_educatin"
                  value={allData.l_educatin}
                  onChange={(e) => handleInputChange('l_educatin', e.target.value)}
                  className={`
                    col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                      ${newErrors.l_educatin_error ? "border-red-500 border-2 border-radius-10" : ''}
                  `}
                >
                  <option value="" disabled>choose degree</option>
                  {educationRevel.map(revel => (
                    <option key={revel} value={revel}>{revel}</option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.l_educatin_error ? newErrors.l_educatin_error : ''}</p>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="natinal_id" className="block text-sm/6 font-medium text-gray-900">
                national id
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">national id/</div>
                  <input
                    id="natinal_id"
                    name="natinal_id"
                    type="text"
                    value={allData.natinal_id}
                    onChange={(e) => handleInputChange('natinal_id', e.target.value)}
                    placeholder="waiting for input..."
                    className={`
                      block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6
                      ${newErrors.natinal_id_error ? "border-red-500 border-2 border-radius-10" : ''}
                    `}
                  />
                </div>
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.natinal_id_error ? newErrors.natinal_id_error : ''}</p>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                City
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={allData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`
                      block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                      ${newErrors.cityError ? "border-red-500 border-2 border-radius-10" : ''}
                    `}
                />
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.cityError ? newErrors.cityError : ''}</p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                State /country
              </label>
              <div className="mt-2">
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={allData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className={`
                      block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                      ${newErrors.countryError ? "border-red-500 border-2 border-radius-10" : ''}
                  `}
                />
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.countryError ? newErrors.countryError : ''}</p>
            </div>
          </div>

        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Job Information</h2>
          <p className="mt-1 text-sm/6 text-gray-600">Setting contract information is essential to manage employee.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="department" className="block text-sm/6 font-medium text-gray-900">
                
              Departments: <small className='text-red-500'>{departmentsWarning.warning? departmentsWarning.warning : ""}</small>
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="department"
                  name="department"
                  value={allData.department}
                  onChange={handleSelectedDepartment}
                  className={`${
                  departmentsWarning.warning?"col-start-1 row-start-1 border-red-500 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-red-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6" : 
                  "col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  }
                  ${newErrors.departmentError ? "border-red-500 border-2 border-radius-10" : ''}
                  `
                }
                >
                  <option value="">
                    {departmentsWarning.warning? departmentsWarning.warning : "Choose department"}
                  </option>
                  {allDepartments.map(department => (
                    <option key={department.department_id} value={department.department_id}>
                      {department.department_name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.departmentError ? newErrors.departmentError : ''}</p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="job_title" className="block text-sm/6 font-medium text-gray-900">
                job title
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="job_title"
                  name="job_title"
                  value={allData.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  className={`
                    col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                    ${newErrors.job_title_Error ? "border-red-500 border-2 border-radius-10" : ''}
                  `}
                >
                  <option value="" disabled>{jobTitlesWarning.warning? jobTitlesWarning.warning : "choose job title"}</option>
                  {jobTitles.map(title => (
                    <option key={title.job_title} value={title.job_title}>
                      {title.job_title}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.job_title_Error ? newErrors.job_title_Error : ''}</p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="contract_type" className="block text-sm/6 font-medium text-gray-900">
                contract type
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="contract_type"
                  name="contract_type"
                  value={allData.contract_type}
                  onChange={(e) => handleInputChange('contract_type', e.target.value)}
                  className={`
                    col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                    ${newErrors.contract_type_Error ? "border-red-500 border-2 border-radius-10" : ''}
                  `}
                >
                  <option value="" disabled>choose contract type</option>
                  {contracts.map(contractItem => (
                    <option key={contractItem} value={contractItem}>{contractItem}</option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.contract_type_Error ? newErrors.contract_type_Error : ''}</p>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="salary" className="block text-sm/6 font-medium text-gray-900">
                basic salary
              </label>
              <div className="mt-2">
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  autoComplete="salary"
                  onChange={(e) => handleInputChange('basic_salary', e.target.value)}
                  className={`
                    block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                    ${newErrors.basic_salary_Error ? "border-red-500 border-2 border-radius-10" : ''}
                  `}
                />
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.basic_salary_Error ? newErrors.basic_salary_Error : ''}</p>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="hire_date" className="block text-sm/6 font-medium text-gray-900">
                hiring date
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">hiring date/</div>
                  <input
                    id="hire_date"
                    name="hire_date"
                    type="date"
                    value={allData.hire_date}
                    onChange={(e) => handleInputChange('hire_date', e.target.value)}
                    placeholder="waiting for input..."
                    className= {`
                      block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6
                      ${newErrors.hire_date_Error ? "border-red-500 border-2 border-radius-10" : ''}
                    `}
                  />
                </div>
              </div>
              <p className='text-red-500 font-sm my-2'>{newErrors.hire_date_Error ? newErrors.hire_date_Error : ''}</p>
            </div>
            
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">other benifits or deductions</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            this is all  about setting extra benifits or deductions for a new employee if selected it will be applied.
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">fringe benifits</legend>
              <div className="mt-6 space-y-6">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        defaultChecked
                        id="comments"
                        name="comments"
                        type="checkbox"
                        aria-describedby="comments-description"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:checked]:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm/6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                      lunch
                    </label>
                    <p id="comments-description" className="text-gray-500">
                      Whether an employee will be offered a free lunch.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="candidates"
                        name="candidates"
                        type="checkbox"
                        aria-describedby="candidates-description"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:checked]:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm/6">
                    <label htmlFor="candidates" className="font-medium text-gray-900">
                      transport
                    </label>
                    <p id="candidates-description" className="text-gray-500">
                      An emplyee will be receiving salary a part from salary.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="offers"
                        name="offers"
                        type="checkbox"
                        aria-describedby="offers-description"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:checked]:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm/6">
                    <label htmlFor="offers" className="font-medium text-gray-900">
                      scholarship or training
                    </label>
                    <p id="offers-description" className="text-gray-500">
                      Employee will receive a scholarship or training.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
      </div>
    </form>
  )
}
