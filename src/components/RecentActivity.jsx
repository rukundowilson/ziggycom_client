import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { useState } from 'react';

const SalaryTransactions = () => {
  const[transactions,setTransactions] = useState([])
  // const transactions = [
  //   {
  //     id: 1,
  //     employeeName: "Sarah Johnson",
  //     department: "Engineering",
  //     amount: 5200.00,
  //     date: "2025-01-15",
  //     status: "completed",
  //     type: "salary"
  //   },
  //   {
  //     id: 2,
  //     employeeName: "Michael Chen",
  //     department: "Marketing",
  //     amount: 4800.00,
  //     date: "2025-01-15",
  //     status: "completed",
  //     type: "salary"
  //   },
  //   {
  //     id: 3,
  //     employeeName: "Emma Davis",
  //     department: "HR",
  //     amount: 4500.00,
  //     date: "2025-01-15",
  //     status: "pending",
  //     type: "bonus"
  //   },
  //   {
  //     id: 4,
  //     employeeName: "James Wilson",
  //     department: "Sales",
  //     amount: 5100.00,
  //     date: "2025-01-14",
  //     status: "completed",
  //     type: "salary"
  //   }
  // ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (

    <div className="rounded-lg mt-10">
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recent Salary Transactions</h2>
        <DollarSign className="h-5 w-5 text-gray-500" />
      </div>
      {transactions.length === 0? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50  border rounded-lg">
        <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-xl text-gray-600 font-medium">No transactions to show</p>
      </div>
      ) :
      <div className="p-6">
        <div className="space-y-4">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {transaction.status === 'completed' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.employeeName}</h3>
                  <p className="text-sm text-gray-500">
                    {transaction.department} • {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatAmount(transaction.amount)}</p>
                <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    }
    </div>
  );
};

export default SalaryTransactions;