import axios from "axios";
import { useState, useEffect } from "react";
import StepIndicator from "./ProgressIndicator";
import {X ,Send,StepBack, StepForward } from 'lucide-react';
import Toast from "./Toast";
import React from "react";

function Register() {
    const [step, setStep] = useState(1);
    const [showToast, setToastDisplay] = useState(false);
    // Add new state for OTP
    const [otpValue, setOtp] = useState('');
    const [isOtpVerified,setIsOtpVerified] = useState(false)
    const [otpIssuccess,setOtpIssuccess] = useState(false)
    const [allTheData, setAllTheData] = useState({
        companyName: "",
        companyEmail: "",
        country: "",
        currency: "",
        userName: "",
        role: "",
        password: "",
        phoneNumber: "",
        companyUserEmail: "",
        confirmPassword: "",
    });

    // Enhanced error state
    const [errors, setErrors] = useState({
        companyName: "",
        companyEmail: "",
        country: "",
        currency: "",
        userName: "",
        role: "",
        password: "",
        phoneNumber: "",
        companyUserEmail: "",
        confirmPassword: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleUserInput = (event) => {
        const { name, value } = event.target;
        setAllTheData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleNext = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const validateStep1 = () => {
        const newErrors = {};
        let isValid = true;
        if (!allTheData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
            isValid = false;
        }

        if (!allTheData.companyEmail) {
            newErrors.companyEmail = "Company email is required";
            isValid = false;
        } else if (!validateEmail(allTheData.companyEmail)) {
            newErrors.companyEmail = "Please enter a valid email address";
            isValid = false;
        }

        if (!allTheData.country) {
            newErrors.country = "Please select a country";
            isValid = false;
        }

        if (!allTheData.currency) {
            newErrors.currency = "Please select a currency";
            isValid = false;
        }
        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const validateStep2 = () => {
        const newErrors = {};
        let isValid = true;

        if (!allTheData.userName.trim()) {
            newErrors.userName = "Username is required";
            isValid = false;
        }

        if (!allTheData.phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
            isValid = false;
        } else if (!validatePhoneNumber(allTheData.phoneNumber)) {
            newErrors.phoneNumber = "Please enter a valid phone number";
            isValid = false;
        }

        if (!allTheData.role) {
            newErrors.role = "Please select a role";
            isValid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const validateStep3 = () => {
        const newErrors = {};
        let isValid = true;

        if (!allTheData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (!validatePassword(allTheData.password)) {
            newErrors.password = "Password must be at least 8 characters long";
            isValid = false;
        }

        if (!allTheData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (allTheData.password !== allTheData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const formIsSubmitted = (event) => {
        event.preventDefault();
        if (validateStep1()) {
            handleNext();
            sendOtp()
        }
    };
    const form2IsSubmitted = (event) => {
        event.preventDefault();
        if (validateStep2()) {
            handleNext();
        }
    };
    const finalStep = async (event) => {
        event.preventDefault();
        if (!validateStep3()) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                "http://localhost:8080/payroll/new/user",
                allTheData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.gotPasswordError) {
                setErrors(prev => ({ ...prev, password: response.data.gotPasswordError }));
            } else if (response.data.message) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error("There was an error:", error);
            setErrors(prev => ({
                ...prev,
                submit: "An error occurred while submitting the form. Please try again."
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // determine whether to display a toasts
    const errorKeys = Object.keys(errors);
    const hasErrors = errorKeys.some(error => errors[error].length > 0);
    useEffect(()=>{
        if (hasErrors) {
            setToastDisplay(true);
        } else {
            setToastDisplay(false);
        }    
    },[errors]);
    // toast on close
    let onClose = ()=>{
        setToastDisplay(false)
    }

    const sendOtp = async () => {
        try {
            const response = await fetch("http://localhost:8080/send-otp", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: allTheData.companyEmail }) // Only email needed
            });
    
            const data = await response.json();
            console.log("Send OTP Response:", data);
    
            if (!response.ok) {
                console.error("Error sending OTP:", data.error);
            }
        } catch (error) {
            console.error("Send OTP error:", error);
        }
    };
    
    const verifyOtp = async () => {
        try {
            const response = await fetch("http://localhost:8080/verify-otp", {
                method: 'POST', // Should be POST, not GET
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: otpValue, email: allTheData.companyEmail }) // OTP needed here
            });
    
            console.log("Raw response:", response);
    
            const data = await response.json();
            console.log("Response JSON:", data);
    
            if (!response.ok) {
                setErrors(prev => ({
                    ...prev,
                    otp: data.error || 'Invalid OTP'
                }));
                return false;
            }
            console.log(response)
            setIsOtpVerified(true)
            setOtpIssuccess(true)
            return true;
        } catch (error) {
            console.error('OTP verification error:', error);
            setErrors(prev => ({
                ...prev,
                otp: 'Failed to verify OTP'
            }));
            return false;
        }
    };
    
    
    // detect changes whin otp
    const handleOtpChange = (e) => {
        const { value } = e.target;
        setOtp(value);
        // Clear error when user types
        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }));
        }
        console.log(value)
    };

    useEffect(() => {
        if (otpValue.length === 6) {
            verifyOtp();
        }
    }, [otpValue]);
    return (
        <>
          
          {showToast && (
                <Toast 
                type="error" 
                message={
                    errors?.submit 
                    || errors?.companyName
                    || errors?.companyEmail
                    || errors?.country
                    || errors?.currency
                    || errors?.userName
                    || errors?.phoneNumber
                    || errors?.companyUserEmail
                    || errors?.password
                    || errors?.confirmPassword
                    || errors?.role
                    || errors?.otp
                }
                onClose = {onClose}
                duration={5000}
                />
            )}
            {/* --------=== show tost notification success after otp verification is success --------====== */}
            {otpIssuccess && (
                <Toast type="success" message={"verification succeess!"}/>
            )}
             <StepIndicator currentStep={step} />;
             {step === 1 && (
                <form onSubmit={formIsSubmitted} className="pt-[10px]">
                    <div className="bg-white rounded-sm overflow-hidden w-full max-w-2xl mx-auto border border-gray-200">
                        <div className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <label
                                    htmlFor="companyName"
                                    className="block text-sm/6 font-medium text-gray-900"
                                    >
                                    Your company name
                                    </label>
                                    <div className="mt-2">
                                    <input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        
                                        autoComplete="email"
                                        placeholder="Company Name"
                                        value={allTheData.companyName}
                                        onChange={handleUserInput}
                                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${errors?.companyName ? 'outline-red-500' : ''}`}
                                    />
                                    </div>
                              </div>
                                

                            
                            <div>
                                <label
                                  htmlFor="companyEmail"
                                  className="block text-sm/6 font-medium text-gray-900"
                                >
                                  company email address
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="email"
                                    id="companyEmail"
                                    name="companyEmail"
                                    placeholder="enter company email"
                                    value={allTheData.companyEmail}
                                    onChange={handleUserInput}
                                    className={`block w-full rounded-md bg-white px-3 
                                        py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300
                                         placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2
                                          focus:outline-indigo-600 sm:text-sm/6 ${errors.companyEmail ? 'outline-red-500' : ''}`}
                                    />
                                </div>
                            </div>

                            <div className="pb-1">
                                
                            <label
                                  htmlFor="country"
                                  className="block text-sm/6 font-medium text-gray-900 mb-2"
                                >
                                  type in country location
                            </label>
                                    <select 
                                        id="country"
                                        name="country"
                                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                                            
                                            ${errors.country? "outline-red-500" : ''}
                                            `}
                                        value={allTheData.country}
                                        onChange={handleUserInput}
                                    >
                                        <option value="">Select a Country</option>
                                        <option value="Rwanda">Rwanda</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Uganda">Uganda</option>
                                        <option value="Tanzania">Tanzania</option>
                                        <option value="Burundi">Burundi</option>
                                    </select>
                                    {/* {renderError('country')} */}
                            </div>

                            <div className=" items-center space-x-3">
                                <div>
                                <label
                                  htmlFor="currency"
                                  className="block text-sm/6 font-medium text-gray-900 mb-2"
                                >
                                  currency
                                </label>
                                    <select
                                        id="currency"
                                        name="currency"
                                        className={`
                                            block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                                            ${errors.currency? 'outline-red-500' : ''} `}
                                        value={allTheData.currency}
                                        onChange={handleUserInput}
                                    >
                                        <option value="">Choose Currency</option>
                                        <option value="frw">FRW</option>
                                        <option value="shillings">Shillings (Kenya)</option>
                                        <option value="usd">USD</option>
                                    </select>
                                </div>
                            </div>

                            
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="bg-gray-50 p-2 flex justify-end space-x-3">
                        <button 
                        onClick={()=>{window.location.href = "/"}}
                        className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded hover:bg-gray-150 transition-colors"
                        >
                        <X size={18} />
                        <span>Cancel</span>
                        
                        </button>
                            <button 
                            type="submit"
                            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                            >
                            <Send size={18} />
                            <span>continue</span>
                            
                            </button>
                        </div>
                        </div>            
                </form>
            )}

            
            {step === 2 && (
                <form onSubmit={form2IsSubmitted} className="pt-[10px]">
                    <div className="bg-white rounded-sm overflow-hidden w-full max-w-2xl mx-auto border border-gray-200">
                        {/* Company Details */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-4">
                            <div className="pb-1">
                            <label
                                htmlFor="userName"
                                className="mb-2 block text-sm/6 font-medium text-gray-900"
                                >
                                admin username
                            </label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${errors?.userName ? 'outline-red-500' : ''}`}
                                placeholder="Your Name"
                                value={allTheData.userName}
                                onChange={handleUserInput}
                            />
                            </div>
                            <div className="pb-1">
                            <label htmlFor="phoneNumber" className=" mb-2 block text-sm/6 font-medium text-gray-900"
                            >
                                Mobile Number
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${errors?.phoneNumber ? 'outline-red-500' : ''}`}
                                placeholder="Phone Number"
                                value={allTheData.phoneNumber}
                                onChange={handleUserInput}
                            />                            
                            </div>
                            <div className=" items-center space-x-3 pb-1">
                                <div>
                                <label htmlFor="role" className="mb-2 text-gray-600 text-base font-medium leading-relaxed">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${errors?.role ? 'outline-red-500' : ''}`}
                                    value={allTheData.role}
                                    onChange={handleUserInput}
                                >
                                    <option value="">Choose your role</option>
                                    <option value="HR">HR</option>
                                    <option value="employee">Employee</option>
                                </select>
                                </div>
                            </div>

                            
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="bg-gray-50 p-2 flex justify-end space-x-3">
                            <button 
                            type="button"
                            onClick={handleBack}
                            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                            >
                            <StepBack size={18} />
                            <span>back</span>
                            
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                                >
                                <StepForward size={18} />
                                <span>continue</span>
                            </button>
                        </div>
                        </div>            
                </form>
            )}
            
            {step === 3 && (
                
                <form onSubmit={finalStep} className="pt-[10px]">
                    <div className="bg-white rounded-sm overflow-hidden w-full max-w-2xl mx-auto border border-gray-200">

                        {/* --------- verify an OTP ----------- */}

                        {!isOtpVerified && (
                             <div className="p-8 space-y-6">
                             <div className="text-center">
                                
                                 <p className="text-gray-600">
                                 We sent a 6-digit code to
                                 </p>
                                 <p className="text-gray-900 font-medium">
                                 {allTheData.companyEmail}
                                 </p>
                             </div>
                             
                             <div className="max-w-sm mx-auto">
                                 <label 
                                 htmlFor="otp" 
                                 className="block text-sm font-medium text-gray-700 mb-2"
                                 >
                                 Enter verification code
                                 </label>
                                 <input
                                 type="text"
                                 id="otp"
                                 name="otp"
                                 maxLength="6"
                                 onChange={handleOtpChange}
                                 className={`
                                     w-full px-4 py-3 text-center text-lg tracking-widest
                                     border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                     ${errors.otp ? 'border-red-500 ring-red-500' : 'border-gray-300'}
                                 `}
                                 placeholder="••••••"
                                 />
                                 {errors.otp && (
                                 <p className="mt-2 text-sm text-red-600">
                                     {errors.otp}
                                 </p>
                                 )}
                                 <p className="mt-4 text-sm text-gray-600 text-center">
                                 Didn't receive the code? 
                                 <button 
                                     type="button"
                                     onClick={sendOtp}
                                     className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                                 >
                                     Resend
                                 </button>
                                 </p>
                             </div>
                             
                             </div>

                        )}
                       

                        {/* Company Details */}
                        
                        {isOtpVerified&&(
                            <div className="p-6 space-y-4">
                            <div className="space-y-4">
                            <div className="pb-1">
                            <label htmlFor="password" className="text-gray-600 text-base font-medium leading-relaxed">
                                Set Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className={`w-full px-5 py-3 border rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                                placeholder="Password"
                                value={allTheData.password}
                                onChange={handleUserInput}
                            />
                            </div>
                            <div className="pb-1">
                            <label htmlFor="confirmPassword" className="text-gray-600 text-base font-medium leading-relaxed">
                                Re-type Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`w-full px-5 py-3 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                placeholder="Confirm Password"
                                value={allTheData.confirmPassword}
                                onChange={handleUserInput}
                            />                            
                            </div>                            
                            </div>
                        </div>
                        )}
                        

                        {/* Footer Buttons */}
                        <div className="bg-gray-50 p-2 flex justify-end space-x-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                                >
                                <Send size={18} />
                                <span>continue</span>
                            </button>
                        </div>
                        </div>            
                </form>
            )}
            
        </>
    );
}


export default Register;
