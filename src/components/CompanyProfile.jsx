import React, { useEffect,useState } from 'react';
import { Building2, MapPin, Users, Phone, Calendar, DollarSign, Edit, X,User, UserCircle, MailIcon,BookPlus, Settings } from 'lucide-react';

const CompanyProfile = () => {
  const [CompanyProfile,SetCompanyProfile] = useState({})
  const getCompanyInfo = async()=>{
    try{
      const response = await fetch("http://localhost:8080/company/profile",{
        method : "GET",
        headers : {
          'Content-Type' : 'application/json'
        },
        credentials : "include"
      })
      if (!response.ok){
        console.log(response.error)
      }
      const data = await response.json();
      console.log(data)
      SetCompanyProfile(data)
    }
    catch(error){
      console.log(error)
    }
    return
  }

  useEffect(()=>{
    getCompanyInfo();
  },[])
  console.log("about company: ",CompanyProfile)
  return (
    <div className="bg-white rounded-sm overflow-hidden w-full max-w-2xl mx-auto border border-gray-200">
      {/* Header */}

      <div className="bg-gray-700 text-white p-4">
      <div className="flex items-center space-x-4">
          <img 
            src='' 
            alt= "" 
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold">{CompanyProfile?.company?.company_name}</h2>
            <p className="text-sm text-blue-100">{CompanyProfile?.company?.industry|| "industy N/A"}</p>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="p-6 space-y-4">
        <p className="text-gray-600 italic text-center">{CompanyProfile?.company?.slogan || "slogan N/A"}</p>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 border-b pb-3">
            <Building2 className="text-gray-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Company ID: </p>
              <p className="font-semibold">{CompanyProfile?.company?.company_id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 border-b pb-3">
            <MapPin className="text-gray-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Headquarters</p>
              <p className="font-semibold">{CompanyProfile?.company?.country}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 border-b pb-3">
            <Users className="text-gray-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Employees</p>
              <p className="font-semibold"></p>
            </div>
          </div>

          <div className="flex items-center space-x-3 border-b pb-3">
            <MailIcon className="text-gray-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">company email</p>
              <p className="font-semibold">{CompanyProfile?.company?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 border-b pb-3">
            <Phone className="text-gray-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-semibold">{}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 border-b pb-3">
            <MailIcon className="text-gray-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">manager email</p>
              <p className="font-semibold">{CompanyProfile?.user?.email}</p>
            </div>
          </div>
          

          <div className="flex items-center space-x-3 border-b pb-3">
            <Calendar className="text-gray-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Founded</p>
              <p className="font-semibold">{CompanyProfile?.company?.registration_date}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="text-gray-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Annual Revenue</p>
              <p className="font-semibold">{}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="bg-gray-50 p-4 flex justify-end space-x-3">
        <button 
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          <Edit size={18} />
          <span>Edit</span>
        </button>
        <button 
          
          className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
        >
          <X size={18} />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default CompanyProfile;