import React, { useEffect, useState } from 'react';
import { Building2, Plus, Trash2, ExternalLink, AlertCircle } from 'lucide-react';

const BankIntegration = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    apiKey: '',
    apiEndpoint: '',
    description: '',
    accountNumber: '',
  });
  const baseURL = 'https://ziggycom-backend.onrender.com'

  const getBanks = async () => {
    try {
      setLoading(true);
      console.log('Loading state:', true); // Debug loading state

      const response = await fetch(`${baseURL}/bankIntegrationAPI`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch banks: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Validate response data
      if (!data || !Array.isArray(data.banks)) {
        throw new Error('Invalid data format received from server');
      }
  
      console.log('Raw bank data:', data.banks);
  
      // Process and format bank data
      const formattedBanks = data.banks.map(bank => ({
        id: bank.id,
        bankName: bank.bank_name,
        accountNumber: bank.account_number,
        currency: bank.currency || 'RWF',
        apiEndpoint: bank.api_endpoint,
        createdAt: new Date(bank.created_at).toLocaleDateString()
      }));
  
      console.log('Formatted banks:', formattedBanks);
      setBanks(formattedBanks);
  
    } catch (error) {
      console.error("Error fetching banks:", error);
      throw error;
    }
    finally{
      setLoading(false)
    }
  };
  useEffect(()=>{
    getBanks();
  },[])
  console.log(`all banks ${banks}`)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanks([...banks, { ...formData, id: Date.now() }]);
    setFormData({ bankName: '', apiKey: '', apiEndpoint: '', description: '' });
    setShowForm(false);

    try {
      const response = await fetch(`${baseURL}/bankIntegrationAPI`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save bank details');
      }
    }
    catch(error){
      console.log(`an error was encountered while posting bank info ${error}`);
    }
  };

  const handleDelete = (bankId) => {
    setBanks(banks.filter(bank => bank.id !== bankId));
  };

  console.log(formData);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Bank Integrations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Bank
        </button>
      </div>

      {/* Add Bank Form */}
      {showForm && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          {loading &&(
            <div>
              ...
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                f  type="text"
                  required
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  required
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Endpoint
                </label>
                <input
                  type="url"
                  required
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  account number
                </label>
                <input
                  type="number"
                  required
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber : e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Save Bank
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banks List */}
      {banks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No banks connected</h3>
          <p className="text-gray-500">Add your first bank integration to start processing payments</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {banks.map((bank) => (
            <div 
              key={bank.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{bank.bankName}</h3>
                  <p className="text-sm text-gray-500">{bank.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => window.open(bank.apiEndpoint, '_blank')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Open API endpoint"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(bank.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                  title="Remove bank"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning Notice */}
      {banks.length > 0 && (
        <div className="mt-6 flex items-start space-x-3 p-4 bg-amber-50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Ensure your API keys are kept secure and never share them publicly. 
            Regular testing of bank connections is recommended to maintain reliable payment processing.
          </p>
        </div>
      )}
    </div>
  );
};

export default BankIntegration;