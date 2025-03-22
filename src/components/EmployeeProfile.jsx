import {React} from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Building2, Briefcase, GraduationCap, Calendar, DollarSign, Clock,Pen } from 'lucide-react';
import WhyExistModal from './SingleInputForm';
import { useState } from 'react';

const EmployeeProfilePreview = ({ isOpen, onClose, employee, handleEmployeeModal }) => {

  // declare navigation function for better experience
  const navigate = useNavigate();

  // oriented with single input form for departure
  const [openStatus,setOpenStatus] = useState(false)
  function onclose(){
    setOpenStatus(false)
  }
  if (!isOpen) return null;

  let handleModal = ()=>{
    setOpenStatus(true)
  }

  const EditEmployeeProfile = () => {
    navigate('/employee/edit', { 
      state: {
              employee : [
                employee?.id,
                employee?.fname,
                employee?.lname,
                employee?.natinal_id,
                employee?.email,
                employee?.job_title,
                employee?.department,
                employee?.contract_type,
                employee?.basic_salary,
                employee?.city,
                employee?.country

              ]
            }
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative z-50 w-full max-w-4xl rounded-lg bg-white shadow-xl">

        <div className="relative">
          <div className="h-32 w-full rounded-t-lg bg-gradient-to-r from-gray-700 to-gray-900" />          
          <div className="absolute -bottom-16 left-8">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
              <h1 className='text-3xl capitalize font-bold'>{employee?.fname[0] || 'N/A'} {employee?.lname[0] || ''}</h1>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-20 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {employee?.fname || 'N/A'} {employee?.lname || ''}
            </h2>
            <p className="text-lg text-gray-600">{employee?.job_title || 'No Job Title'}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">DOB: {employee?.date_of_birth || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {employee?.city || 'No city'}, {employee?.country || 'No country'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{employee?.l_educatin || 'Not specified'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{employee?.email || 'Not specified'}</span>
                </div>

              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Employment Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Department ID: {employee?.department || 'Not assigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">contact type: {employee?.contract_type || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Salary: ${employee?.basic_salary || '0'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Hire Date: {employee?.hire_date || 'Not set'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Identification</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">National ID:</span> {employee?.natinal_id || 'Not provided'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Employee ID:</span> {employee?.id || 'Pending'}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Employment Status</h3>
              <div className="flex items-center gap-2">
                <span className={employee?.status === "Inactive" ? "inline-flex h-2.5 w-2.5 rounded-full bg-red-500" :"inline-flex h-2.5 w-2.5 rounded-full bg-green-500"}></span>
                <span className={`text-sm font-medium text-gray-600`}>{employee?.status || "pending"}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={EditEmployeeProfile}
              className="rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 flex items-center space-x-2"
            >
              <Pen size={16} />
              <span>edit</span>
            </button>
            <button
              onClick={handleModal}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              deactive
            </button>
            <WhyExistModal 
              openStatus = {openStatus} 
              onclose = {onclose}
              employee = {employee}
              closeProfile = {onClose}
              refreshEmployDir = {handleEmployeeModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePreview;