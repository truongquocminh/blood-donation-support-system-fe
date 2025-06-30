import { Loader2 } from 'lucide-react'
import React from 'react'

const HandleLoading = () => {
    return (
        <div className="fixed w-full h-full inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[999]">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-lg">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-700 font-medium">Đang xử lý...</span>
            </div>
        </div>
    )
}

export default HandleLoading