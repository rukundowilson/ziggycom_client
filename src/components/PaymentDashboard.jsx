import React, { useState } from 'react';
import { DollarSign, User, Calendar, MessageSquare, Search, Plus } from 'lucide-react';

const PaymentDashboard_ = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState('form');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    amount: '',
    date: '',
    notes: ''
  });

  // Sample payment history data
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, employeeName: 'John Doe', amount: 2500, date: '2025-02-18', status: 'Completed', notes: 'February Salary' },
    { id: 2, employeeName: 'Jane Smith', amount: 3000, date: '2025-02-18', status: 'Completed', notes: 'Monthly Bonus' },
    { id: 3, employeeName: 'Mike Johnson', amount: 1800, date: '2025-02-17', status: 'Completed', notes: 'Overtime Pay' },
    { id: 4, employeeName: 'Sarah Wilson', amount: 2200, date: '2025-02-17', status: 'Completed', notes: 'Regular Salary' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('confirmation');
  };

  const handleConfirm = () => {
    const newPayment = {
      id: paymentHistory.length + 1,
      employeeName: formData.employeeName,
      amount: parseFloat(formData.amount),
      date: formData.date,
      status: 'Completed',
      notes: formData.notes
    };
    
    setPaymentHistory(prev => [newPayment, ...prev]);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setStep('form');
      setIsModalOpen(false);
      setFormData({
        employeeName: '',
        amount: '',
        date: '',
        notes: ''
      });
    }, 2000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStep('form');
    setFormData({
      employeeName: '',
      amount: '',
      date: '',
      notes: ''
    });
  };

  const filteredHistory = paymentHistory.filter(payment =>
    payment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal Component
  const PaymentModal = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isModalOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-md w-full max-w-lg m-4 p-6">
        {step === 'form' ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Send Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  placeholder="Employee Name"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Payment Notes"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={closeModal}
                  type="button"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Continue
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Confirm Payment</h2>
            {showSuccess ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Payment sent successfully!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="font-medium">Employee:</span>
                    <span>{formData.employeeName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span>${parseFloat(formData.amount).toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{formData.date}</span>
                  </p>
                  {formData.notes && (
                    <div className="mt-4">
                      <p className="font-medium">Notes:</p>
                      <p className="mt-1 text-gray-600">{formData.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep('form')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Send Payment
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 flex items-center justify-between border-b">
          <h2 className="text-2xl font-bold">Payment History</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Plus className="h-4 w-4" /> New Payment
          </button>
        </div>
        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Employee</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="py-2">{payment.employeeName}</td>
                    <td className="py-2 text-right">${payment.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600">{payment.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <PaymentModal />
    </div>
  );
};

export default PaymentDashboard_;