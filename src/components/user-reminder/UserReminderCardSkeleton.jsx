import React from 'react'

const UserReminderCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="w-24 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
);

export default UserReminderCardSkeleton