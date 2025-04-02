import React from 'react';
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
    John: 6000,
    Sarah: 3500,
    Mike: 2800,
    Emily: 3200,
    David: 2900
  },
  {
    month: 'Feb 2024',
    John: 3100,
    Sarah: 3600,
    Mike: 2900,
    Emily: 3300,
    David: 3000
  },
  {
    month: 'Mar 2024',
    John: 3250,
    Sarah: 3750,
    Mike: 3050,
    Emily: 3450,
    David: 3150
  },
  {
    month: 'Apr 2024',
    John: 3400,
    Sarah: 3900,
    Mike: 3200,
    Emily: 3600,
    David: 3300
  },
  {
    month: 'May 2024',
    John: 3550,
    Sarah: 4050,
    Mike: 3350,
    Emily: 3750,
    David: 3450
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
    employeePaymentData.length > 0 && (
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
            <Line type="monotone" dataKey="John" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Sarah" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Mike" stroke="#ffc658" />
            <Line type="monotone" dataKey="Emily" stroke="#ff7300" />
            <Line type="monotone" dataKey="David" stroke="#0088fe" />
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

    )
    (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 text-lg">Loading employee payment trends...</div>
          <div className="block mx-auto animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <div className="text-gray-700 mt-4">Loading...</div>
        </div>
      </div>
    )
  );
};

export default EmployeePaymentTrends;