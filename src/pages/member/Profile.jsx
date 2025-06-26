import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Droplets, Calendar } from 'lucide-react';

const MemberProfile = () => {
  const [member] = useState({
    name: 'Nguyen Van A',
    email: 'nguyenvana@email.com',
    phone: '+84 123 456 789',
    address: '123 Le Loi Street, District 1, Ho Chi Minh City',
    bloodType: 'A+',
    dateOfBirth: '1990-05-15',
    lastDonation: '2024-02-15',
    totalDonations: 8,
    nextEligibleDate: '2024-06-15',
    donationHistory: [
      { date: '2024-02-15', location: 'Central Blood Bank', type: 'Whole Blood', status: 'Completed' },
      { date: '2023-10-15', location: 'Mobile Drive - District 3', type: 'Plasma', status: 'Completed' },
      { date: '2023-06-15', location: 'Central Blood Bank', type: 'Whole Blood', status: 'Completed' },
    ],
  });

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="p-3 bg-red-50 rounded-full">
        <Icon className="w-5 h-5 text-red-500" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-gray-400" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{member.name}</h1>
            <p className="text-gray-500">Member ID: #123456</p>
            <div className="mt-2 flex items-center justify-center md:justify-start space-x-2">
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                Blood Type: {member.bloodType}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                Active Donor
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <InfoItem icon={Mail} label="Email" value={member.email} />
        <InfoItem icon={Phone} label="Phone" value={member.phone} />
        <InfoItem icon={MapPin} label="Address" value={member.address} />
        <InfoItem icon={Calendar} label="Date of Birth" value={member.dateOfBirth} />
        <InfoItem icon={Droplets} label="Total Donations" value={member.totalDonations} />
        <InfoItem icon={Calendar} label="Next Eligible Date" value={member.nextEligibleDate} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {member.donationHistory.map((donation, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {donation.status}
                    </span>
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

export default MemberProfile;
