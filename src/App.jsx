import { useState, useEffect } from 'react';
import { Route,Routes } from 'react-router';
import axios from 'axios';
import './index.css';
import './App.css';
import Register from './components/Register';
import NavBar from "./components/navbar"
import DashboardLayOut from './components/DashboardLayOut';
import Login from "./components/Login";
import NewEmployee from './components/Hire';
import Dashboard from './components/Dashboard';
import DepartmentNavigation from './components/Departments';
import EmployeeList from './components/ListEmployees';
import LandingPage from "./components/main";
import PageNotFound from './components/404';
import BankIntegration from './components/BankIntegration';
import EmployeeProfileEdit from './components/EmployeeEdit';
import CompanyProfile from './components/CompanyProfile';
import PaymentDashboard_ from './components/PaymentDashboard';




function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://ziggycom.cleverapps.io/ ")
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Woof! You've got a new error:", error);
        setError(error?.response?.data?.message || error.message);
      });
  }, []);
  

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={
            <>
            <NavBar/>
            <LandingPage/>
            </>
          } />
          <Route path="/register" element = {
            <>
              <div className='bg-gray-100 h-screen'>
                <Register/>
              </div>
              
            </>
          }/>
          <Route path="/user/dashboard" element={
            <>
              <Dashboard/>
            </>
          } />
          <Route path='/login' element={
          <>
            <Login/>
          </>
        }/>
        <Route path='/user/dashboard/BankIntegration' element ={
          <>
            <DashboardLayOut/>
            <main className="ml-0 md:ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
            <BankIntegration/>
            </div>
          </main>
            
          </>
        }/>
        <Route path='/user/dashboard/profile' element ={
          <>
            <DashboardLayOut/>
            <main className="ml-0 md:ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
            <CompanyProfile/>
            </div>
          </main>
            
          </>
        }/>
        <Route path='*' element ={
          <>
            <NavBar/>
            <PageNotFound/>
          </>
        }/>
        {/* -------new employee ------ */}
        <Route path='/user/dashboard/new-employee' element={
          <>
            <DashboardLayOut/>
            <main className="ml-0 md:ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <NewEmployee/>
            </div>
          </main>
          </>
        }/>

        {/* ------- department management -------- */}
        <Route path='/user/dashboard/departments' element={
          <>
            <DashboardLayOut/>
            <main className="ml-0 md:ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <DepartmentNavigation/>
            </div>
          </main>
          </>
        }/>
        {/* ------- display all  employees -------- */}
        <Route path='/user/dashboard/show-employees' element={
          <>
            <DashboardLayOut/>
            <main className="ml-0 md:ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <EmployeeList/>
            </div>
          </main>
          </>
        }/>
        {/* ------- display all  employees -------- */}
        <Route path='/employee/edit' element={
          <>
          <DashboardLayOut/>
            <main className="ml-0 md:ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
            <EmployeeProfileEdit/>
            </div>
          </main>
          </>
        }/>

        <Route path='/user/dashboard/settings' element={
          <>
          <DashboardLayOut/>
            <main className="ml-0 md:ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
              cooking something for u!
            </div>
          </main>
          </>
        }/>

        <Route path='/user/dashboard/payments' element={
          <>
            <DashboardLayOut/>
              <main className="ml-0 md:ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
              <div className="max-w-7xl mx-auto">
                <PaymentDashboard_/>
              </div>
            </main>
          </>
        }/>


        </Routes>
      </div>
    </>
  );
}

export default App;
