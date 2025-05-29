import React, { useState } from 'react';
import { FaCalendar, FaChartLine, FaCertificate, FaTint } from 'react-icons/fa';

const MemberHistory = () => {
  const [history] = useState({
    totalDonations: 15,
    totalVolume: '6.75L',
    lastDonation: '2024-02-15',
    achievements: [
      { title: 'First Time Donor', date: '2022-01-15', icon: FaTint },
      { title: '5 Donations Milestone', date: '2022-12-20', icon: FaCertificate },
      { title: '10 Donations Milestone', date: '2023-08-10', icon: FaCertificate },
    ],
    donationHistory: [
      {
        id: 1,
        date: '2024-02-15',
        type: 'Whole Blood',
        volume: '450ml',
        location: 'Central Blood Bank',
        status: 'Completed',
        notes: 'Regular donation',
        hemoglobin: '14.5 g/dL',
        bloodPressure: '120/80',
      },
      {
        id: 2,
        date: '2023-10-15',
        type: 'Plasma',
        volume: '600ml',
        location: 'Mobile Drive - District 3',
        status: 'Completed',
        notes: 'Special plasma donation drive',
        hemoglobin: '14.2 g/dL',
        bloodPressure: '118/78',
      },
    ],
  });

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-3 mb-2">
        <Icon className="w-5 h-5 text-red-500" />
        <h3 className="text-gray-600 font-medium">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Donation History</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FaTint}
          title="Total Donations"
          value={history.totalDonations}
        />
        <StatCard
          icon={FaChartLine}
          title="Total Volume Donated"
          value={history.totalVolume}
        />
        <StatCard
          icon={FaCalendar}
          title="Last Donation"
          value={history.lastDonation}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg"
            >
              <achievement.icon className="w-8 h-8 text-red-500" />
              <div>
                <p className="font-medium text-gray-800">{achievement.title}</p>
                <p className="text-sm text-gray-500">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Detailed History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Metrics
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.donationHistory.map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.volume}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <p>Hb: {donation.hemoglobin}</p>
                      <p>BP: {donation.bloodPressure}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberHistory; 