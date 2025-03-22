 export default function DashboardHighlights({
  numberOfDeps,
  numberOfEmployees,
  numberActiveEmployees,
  numberInactiveEmployees,
  expectedPayments
}){

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 transition-colors duration-300 hover:text-blue-600">Total Employees</h2>
          <div className="text-4xl my-2 font-bold text-blue-600 transition-colors duration-300 hover:text-blue-700">{numberOfEmployees}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-center group">
            <div className="text-4xl font-bold text-green-600 transition-colors duration-300 group-hover:text-green-700">{numberActiveEmployees}</div>
            <div className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">Active</div>
          </div>
          <div className="h-12 w-0.5 bg-gray-300"></div>
          <div className="text-center group">
            <div className="text-3xl font-bold text-red-600 transition-colors duration-300 group-hover:text-red-700">{numberInactiveEmployees}</div>
            <div className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">Inactive</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 transition-colors duration-300 hover:text-green-600">Active Payments</h2>
        <div className="text-4xl font-bold text-green-600 transition-colors duration-300 hover:text-green-700">$ {expectedPayments}</div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 transition-colors duration-300 hover:text-purple-600">Departments</h2>
        <div className="text-4xl font-bold text-purple-600 transition-colors duration-300 hover:text-purple-700">{numberOfDeps}</div>
      </div>
    </div>

    )
    
}