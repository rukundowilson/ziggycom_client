import React,{useState} from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';


// Sample employee payment data
const employeePaymentData = [
  {
    month: 'Jan 2024',
    null: 0,
    null: 0,
    null: 0,
    null: 0,
    null: 0
  },
  {
    month: 'Feb 2024',
    null: 0,
    null: 0,
    null: 0,
    null: 0,
    null: 0
  },
  {
    month: 'Mar 2024',
    null: 0,
    null: 0,
    null: 0,
    null: 0,
    null: 0
  },
  {
    month: 'Apr 2024',
    null: 0,
    null: 0,
    null: 0,
    null: 0,
    null: 0
  },
  {
    null: 'May 2024',
    null: 0,
    null: 0,
    null: 0,
    null: 0,
    null: 0
  }
];

const EmployeePaymentTrends = ({ data = employeePaymentData }) => {
  // Calculate overall trend statistics
  const calculateTrends = (data) => {
    const trends = {};
    const employees = Object.keys(data[0]).filter(key => key !== 'month');
    
    employees.forEach(employee => {
      const salaries = data.map(entry => entry[employee]);
      const startSalary = salaries[0];
      const endSalary = salaries[salaries.length - 1];
      const percentageIncrease = ((endSalary - startSalary) / startSalary * 100).toFixed(2);
      
      trends[employee] = {
        totalGrowth: percentageIncrease,
        latestSalary: endSalary
      };
    });
    
    return trends;
  };

  const trends = calculateTrends(data);

  return (
    <Card className="w-full z-10 mt-16 mx-auto">
      <CardHeader>
        <CardTitle>Employee Payment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Salary ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="no data" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="un defined" stroke="#82ca9d" />
            <Line type="monotone" dataKey="un defined" stroke="#ffc658" />
            <Line type="monotone" dataKey="un defined" stroke="#ff7300" />
            <Line type="monotone" dataKey="un defined" stroke="#0088fe" />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(trends).map(([employee, trend]) => (
            <div 
              key={employee} 
              className="bg-gray-100 p-4 rounded-lg text-center"
            >
              <h3 className="font-semibold">{employee}</h3>
              <p className="text-sm text-gray-600">Latest Salary: ${trend.latestSalary}</p>
              <p 
                className={`font-bold ${
                  parseFloat(trend.totalGrowth) > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}
              >
                Growth: {trend.totalGrowth}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeePaymentTrends;