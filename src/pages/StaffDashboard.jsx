import React, { useState } from 'react';
import { FaUsers, FaCalendarAlt, FaChartLine, FaHospital } from 'react-icons/fa';
import { BiDonateBlood } from 'react-icons/bi';

const StaffDashboard = () => {
  const [stats] = useState({
    totalDonors: 1250,
    monthlyDonations: 85,
    upcomingAppointments: 32,
    bloodStock: {
      'A+': 50,
      'A-': 30,
      'B+': 45,
      'B-': 25,
      'O+': 60,
      'O-': 35,
      'AB+': 20,
      'AB-': 15,
    },
  });

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  const BloodStockCard = ({ type, amount }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-red-600">{type}</span>
        <span className="text-gray-600">{amount} units</span>
      </div>
      <div className="mt-2 bg-gray-200 h-2 rounded-full">
        <div
          className="bg-red-500 h-2 rounded-full"
          style={{ width: `${(amount / 100) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Staff Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaUsers}
          title="Total Donors"
          value={stats.totalDonors}
          color="bg-blue-500"
        />
        <StatCard
          icon={BiDonateBlood}
          title="Monthly Donations"
          value={stats.monthlyDonations}
          color="bg-red-500"
        />
        <StatCard
          icon={FaCalendarAlt}
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          color="bg-green-500"
        />
        <StatCard
          icon={FaChartLine}
          title="Success Rate"
          value="95%"
          color="bg-purple-500"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blood Stock Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats.bloodStock).map(([type, amount]) => (
            <BloodStockCard key={type} type={type} amount={amount} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-gray-800">New donation completed</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex flex-col items-center">
              <FaCalendarAlt className="w-6 h-6 mb-2" />
              <span>Schedule Appointment</span>
            </button>
            <button className="p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex flex-col items-center">
              <BiDonateBlood className="w-6 h-6 mb-2" />
              <span>Record Donation</span>
            </button>
            <button className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex flex-col items-center">
              <FaUsers className="w-6 h-6 mb-2" />
              <span>Manage Donors</span>
            </button>
            <button className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex flex-col items-center">
              <FaHospital className="w-6 h-6 mb-2" />
              <span>Blood Requests</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard; 