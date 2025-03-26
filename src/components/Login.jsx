import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Toast from './Toast';
export default function Login() {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState("");

  const axiosInstance = axios.create({
    baseURL: 'https://ziggycom.cleverapps.io',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const use_navigate = useNavigate();
  const navigate_with_state = ()=>{
    use_navigate("/user/dashboard",{
      state : {
        email : credentials.email,
        message : `welcome back user`
      }
    })    
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

     try {
      const response = await axios.post('/login', credentials);
      const { message, redirectPath, user } = response.data;

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate to the desired path with state
      navigate(redirectPath, { state: { user } });

      console.log(message, 'got it?');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred");
      }
      
      console.error("Login error:", error);
    }
  };

  

    // toast handlers
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      {error&&(
        <Toast type='error' message={error} />
      )}
      
      <div className="w-full max-w-2xl mx-auto pt-[100px]">
        <div className="bg-gray-700 text-white p-4">
    {/* Header */}
    <div className="flex items-center space-x-4">
        <div>
            <h1 className="text-2xl font-bold"> Ziggycom</h1>
            <p className="text-sm text-blue-100">{"a payroll management company"}</p>
        </div>
        </div>
    </div>
    </div>
      <div className='space-y-12 bg-white container mx-auto w-md max-w-2xl px-4 py-2'>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
      </div>

      <form className="pt-[10px]" onSubmit={handleSubmit}>
                    <div className="bg-white rounded-sm overflow-hidden w-full max-w-2xl mx-auto border border-gray-200 border-sm">
                        <div className="p-6 space-y-4">
                            <div className="space-y-4">
                              <div>
                                <label
                                  htmlFor="email"
                                  className="block text-sm/6 font-medium text-gray-900"
                                >
                                  Your company email address
                                </label>
                                <div className="mt-2">
                                  <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={credentials.email}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  />
                                </div>
                              </div>
                            <div className="flex items-center justify-between">
                              <label
                                htmlFor="password"
                                className="block text-sm/6 font-medium text-gray-900"
                              >
                                Password
                              </label>
                              <div className="text-sm">
                                <a
                                  href="/forgot-password"
                                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                  Forgot password?
                                </a>
                              </div>
                            </div>
                            <div className="mt-2">
                              <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={credentials.password}
                                onChange={handleInputChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              />
                            </div>

                          
                            
              </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-2 flex justify-end space-x-3">
          <a href='/' 
          className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded hover:bg-gray-150 transition-colors"
          >
          <span>Cancel</span>
          
          </a>
              <button 
              type="submit"
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
              {/* <Send size={18} /> */}
              <span>continue</span>
              
              </button>
              
          </div>
          <p className="bg-gray-50 p-4 mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <a
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              register instead
            </a>
          </p>
          </div>            
      </form>
  </div>
  );
}
