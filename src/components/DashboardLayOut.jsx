import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Landmark, Home, Users, DollarSign, Building2, UserPlus, Bell, Menu, X,UserCog,Settings } from 'lucide-react';

export default function DashboardLayOut() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseURL = "https://ziggycom.cleverapps.io"

  useEffect(() => {
    setCurrentView(location.pathname);
  }, [location.pathname]);

  const [client, setClient] = useState({
    name: '',
    email: '',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });
  const [currentView, setCurrentView] = useState('/user/dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulated authentication check
    const checkAuthentication = () => {
      // In a real app, this would be an actual API call
      fetch(`${baseURL}/isloggedin`, {
        method: 'GET',
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        console.log("Response:", data);
        const { loggedIn, user } = data;
        if (loggedIn) {
          setClient(prev => ({
            ...prev,
            name: user.username,
            email: user.email
          }));
          setIsAuthenticated(true);
          console.log(`autherntication success ${user}`)
        }
        else{
          console.log("not loggedin",data)
        }
      })
      .catch(error => {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      });
    };
    checkAuthentication();
  }, []);

  
  const handleLogout = () => {
    // Simulated logout
    fetch(`${baseURL}/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    .then(() => {
      // Redirect to login page after logout
      window.location.href = '/login';
    })
    .catch((error) => {
      console.error('Logout error:', error);
    });
  };

  const navigation = [
    { name: 'Dashboard', icon: Home, view: '/user/dashboard' },
    { name: 'New Employee', icon: UserPlus, view: '/user/dashboard/new-employee' },
    { name: 'Employees', icon: Users, view: '/user/dashboard/show-employees' },
    { name: 'Payments', icon: DollarSign, view: '/user/dashboard/payments' },
    { name: 'Departments', icon: Building2, view: '/user/dashboard/departments' },
    { name: 'banks', icon: Landmark, view: '/user/dashboard/BankIntegration' },
    { name: 'profile', icon: UserCog, view: '/user/dashboard/profile' },
    { name: 'settings', icon: Settings, view: '/user/dashboard/settings' }


  ];
    
  return (
    <div className="bg-gray-100 flex">
      {/* Navbar */}
      <div className="fixed z-40 top-0 left-0 shadow-md right-0 bg-white h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="text-gray-900 text-2xl font-bold tracking-wider"> The Hr</h1>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="ml-4 md:hidden text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isAuthenticated && (
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-900 hover:text-blue-200 mr-4">
              <Bell size={24} />
            </button>
            <div className="flex items-center">
            <div className="mx-3 h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {client?.name ? client.name[0].toUpperCase() : 'U'}
              </span>
            </div>
              <div className="text-gray-900">
                <div className="text-sm font-semibold">{client.name}</div>
                <div className="text-xs opacity-75">{client.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="fixed top-16 left-0 right-0 bg-white shadow-lg md:hidden z-40">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.view);
                setCurrentView(item.view);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </button>
          ))}
        </div>
      )}

      {/*================ Sidebar ============== */}

      {isAuthenticated && (
        <div className="fixed z-50 top-0 z-1000 bottom-0 left-0 w-64 bg-gray-900 shadow-lg pt-6 hidden md:block">

          <nav className="space-y-2 px-4">
            <h3 className='text-white font-bold text-xl my-4'>The Office of Hr</h3>
            <hr/>
            <br/>
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() =>{
                  navigate(item.view);
                  setCurrentView(item.view);
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-lg transition-all duration-300 
                  flex items-center 
                  ${currentView === item.view 
                    ? 'bg-gray-500 text-white' 
                    : 'text-white hover:bg-gray-700 hover:text-blue-600'}
                `}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </button>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button 
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
