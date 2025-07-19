import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserPlus, Eye, Check, X, Calendar, Phone, Mail, User } from 'lucide-react';

const RegistrationManagement: React.FC = () => {
  const { user } = useAuth();
  const { registrationRequests, updateRegistrationStatus } = useData();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const pendingRequests = registrationRequests.filter(r => r.status === 'pending');
  const reviewedRequests = registrationRequests.filter(r => r.status !== 'pending');

  const handleApprove = (requestId: string) => {
    updateRegistrationStatus(requestId, 'approved', user.name);
  };

  const handleReject = (requestId: string) => {
    updateRegistrationStatus(requestId, 'rejected', user.name);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSpecializationDisplay = (specialization: string) => {
    const specializations: Record<string, string> = {
      'mens-formal': "Men's Formal Wear",
      'womens-formal': "Women's Formal Wear",
      'wedding-dresses': 'Wedding Dresses',
      'casual-wear': 'Casual Wear',
      'alterations': 'Alterations & Repairs',
      'suits': 'Business Suits',
      'evening-wear': 'Evening Wear',
      'general': 'General Tailoring',
    };
    return specializations[specialization] || specialization;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Management</h2>
        <p className="text-gray-600">Review and manage tailor registration applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{registrationRequests.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{pendingRequests.length}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {registrationRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {registrationRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <X className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Applications */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Applications ({pendingRequests.length})
            </h3>
          </div>
          <div className="p-6 space-y-6">
            {pendingRequests.map((request) => (
              <React.Fragment key={request.id}>
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{request.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {request.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {request.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Experience:</span>
                      <span className="ml-2 text-gray-600">{request.experience}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Specialization:</span>
                      <span className="ml-2 text-gray-600">{getSpecializationDisplay(request.specialization)}</span>
                    </div>
                  </div>

                  {selectedRequest === request.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">About the Applicant</h5>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {request.message || 'No additional information provided.'}
                      </p>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Reviewed Applications ({reviewedRequests.length})
          </h3>
        </div>
        
        {reviewedRequests.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reviewed applications yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviewedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.name}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {request.experience}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getSpecializationDisplay(request.specialization)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div>By: {request.reviewedBy}</div>
                        <div className="text-xs text-gray-500">
                          {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Empty State for Pending */}
      {pendingRequests.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-center py-12">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Applications</h3>
            <p className="text-gray-500">All registration applications have been reviewed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationManagement;