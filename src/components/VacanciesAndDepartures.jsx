import React, { useState, useEffect } from 'react';
import { Users, UserMinus, Briefcase, Calendar, AlertCircle,LucideArrowDown10, LucideArrowUp10 } from 'lucide-react';
import RecentAddedEmployees_ from "./RecentAddedEmployees";

const VacancyAndDepartures = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPositions, setOpenPositions] = useState([]);
  const [recentDepartures, setRecentDepartures] = useState([]);
  const [currentPageDepartures, setCurrentPageDepartures] = useState(1);
  const [currentPageVacancies, setCurrentPageVacancies] = useState(1);
  const itemsPerPage = 2;
  const baseURL = "https://ziggycom-backend.onrender.com"

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleVacanciesAndDepartures = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/vacanciesAndDeparturesAPI`, {
        credentials: 'include',
        method: "GET"
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error("Unauthorized");
      }

      const result = await response.json();
      setRecentDepartures(result.departures);
      setOpenPositions(result.vacancies);
    } catch (err) {
      if (err.message === "Unauthorized") {
        history.push("/login");
      } else {
        console.error("Fetch error:", err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  console.log("departuring as last day ",recentDepartures)
  useEffect(() => {
    handleVacanciesAndDepartures();
  }, []);

  const paginate = (items, pageNumber) => {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPagesDepartures = Math.ceil(recentDepartures.length / itemsPerPage);
  const totalPagesVacancies = Math.ceil(openPositions.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-6 w-full">
      <div className="bg-white rounded-lg border p-6">
        {recentDepartures.length === 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Departures</h2>
              <UserMinus className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex bg-gray-50 flex-col items-center justify-center p-4 text-center">
              <span className="text-3xl mb-4">🚪</span>
              <h3 className="text-xl font-semibold text-gray-700">No Recent Departures</h3>
              <p className="text-gray-500 mt-2">No employees have recently left the organization</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex bg-gray-50 items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Departures</h2>
              <UserMinus className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-4">
              {paginate(recentDepartures, currentPageDepartures).map(departure => (
                <div
                  key={departure.employee_id}
                  className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{departure.first_name}</h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(departure.update_time)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {departure.job_title} • {departure.department_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Reason: {departure.if_leaving_why}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPageDepartures(prev => Math.max(prev - 1, 1))}
                disabled={currentPageDepartures === 1}
                className="px-4 py-2 rounded disabled:opacity-50"
              >
            <LucideArrowUp10></LucideArrowUp10>
            </button>
              <button
                onClick={() => setCurrentPageDepartures(prev => Math.min(prev + 1, totalPagesDepartures))}
                disabled={currentPageDepartures === totalPagesDepartures}
                className="px-4 py-2 rounded disabled:opacity-50"
              >
            <LucideArrowDown10 ></LucideArrowDown10>
            </button>
            </div>
          </>
        )}
      </div>

      {/* Open Positions Section */}
      <div className="bg-white border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Open Positions</h2>
          <Briefcase className="h-5 w-5 text-blue-500" />
        </div>
        <div className="space-y-4">
          {openPositions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
              <span className="text-3xl mb-4">💼</span>
              <h3 className="text-xl font-semibold text-gray-700">No Open Positions</h3>
              <p className="text-gray-500 mt-2">Currently there are no job openings available</p>
            </div>
          ) : (
            <div>
              {paginate(openPositions, currentPageVacancies).map(position => (
                <div
                  key={position.job_id}
                  className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{position.job_title}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      position.priority === 'high'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {position.priority.charAt(0).toUpperCase() + position.priority.slice(1)} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{position.department_name}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Posted: {formatDate(position.updated_at)}</span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {position.number_of_workers} applications
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPageVacancies(prev => Math.max(prev - 1, 1))}
            disabled={currentPageVacancies === 1}
            className="px-4 py-2 rounded disabled:opacity-50"
          >
            <LucideArrowUp10></LucideArrowUp10>
          </button>
          <button
            onClick={() => setCurrentPageVacancies(prev => Math.min(prev + 1, totalPagesVacancies))}
            disabled={currentPageVacancies === totalPagesVacancies}
            className="px-4 py-2 bg-gray-50 hover:text-green-500 rounded disabled:opacity-50"
          >
            <LucideArrowDown10 ></LucideArrowDown10>
          </button>
        </div>
      </div>
      
      {/* recent added employees */}
      <RecentAddedEmployees_/>

    </div>
  );
};

export default VacancyAndDepartures;
