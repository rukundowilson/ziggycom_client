import DashboardLayOut from "./DashboardLayOut";
import DashboardHighlights from "./Highlights";
import { useState,useEffect } from "react";
import SalaryTransactions from "./RecentActivity";
import VacancyAndDepartures from "./VacanciesAndDepartures";
import Toast from "./Toast";
import EmployeePaymentTrends from "./Statistics";


import { useLocation } from "react-router";
export default function Dashboard(){
    const [numberOfDeps,setnumberOfDeps] = useState(0)
    const [numberOfEmployees,setNumberOfEmployees] = useState(0)
    const [numberActiveEmployees,setNumberActiveEmployees] = useState(0)
    const [numberInactiveEmployees,setNumberInactiveEmployees] = useState(0)
    const [expectedPayments,setExpectedPayments] = useState(0);
    const [toastElements,setToastEl] = useState({});
    const base_url = "https://ziggycom.cleverapps.io";

    const use_location = useLocation();
    useEffect(()=>{
        setToastEl({
          message: use_location?.state?.message,
          email : use_location?.state?.email

        })    
       const numberDepartments = async () => {
          try {
            const response = await fetch(`${base_url}/departments`, {
              method: 'GET',
              credentials: 'include',
            });
        
            if (response.status === 401) {
              window.location.href = '/';
              throw new Error("Unauthorized");
            }
        
            if (!response.ok) {
              console.error(`Server responded with status: ${response.status}`);
              return;
            }
        
            const data = await response.json();
            console.log("Server Response:", data);
            setnumberOfDeps(data.numberOfDeps || 0);
          } catch (error) {
            console.error('Error fetching number of departments:', error);
          }
        };
        
        const numberOfEmployees = async () => {
          try {
            const response = await fetch(`${base_url}/all/employees`, {
              method: "GET",
              credentials: "include",
            });
        
            if (response.status === 401) {
              window.location.href = '/';
              throw new Error("Unauthorized");

    }
    console.log(toastElements)
    return (
        <>
            <main className="ml-0 md:ml-64 min-h-screen border flex-1 p-8 bg-gray-100">
                <DashboardLayOut />
                {toastElements?.message && (
                    <Toast type="success"
                        message={toastElements?.message + " " + toastElements.email}
                        onClose={onClose}
                        duration={10000}
                    />
                )}

                <div className="max-w-7xl mx-auto pt-16">
                    <DashboardHighlights numberOfDeps={numberOfDeps}
                        numberOfEmployees={numberOfEmployees}
                        numberActiveEmployees={numberActiveEmployees}
                        numberInactiveEmployees={numberInactiveEmployees}
                        expectedPayments={expectedPayments}
                    />
                    <div className="w-full mt-16 px-2 rounded-lg border-t flex items-center gap-10 wrap justify-center">
                        <VacancyAndDepartures />
                    </div>
                    <EmployeePaymentTrends />
                </div>
            </main>
        </>
    )
}
