import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Edit, Trash2, Eye, Calendar, User } from 'lucide-react';

const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, tailors } = useData();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    updateOrderStatus(orderId, newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">Manage and track all tailoring orders</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">All Orders ({orders.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.garmentType} for {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.fabricType} • {order.style}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{order.assignedToName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(order.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {selectedOrder === order.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Measurements</h4>
                              <div className="space-y-1 text-sm">
                                {Object.entries(order.measurements).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="capitalize text-gray-600">{key}:</span>
                                    <span className="font-medium">{value}"</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                              <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                                {order.instructions || 'No special instructions'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                              Created: {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              Last Updated: {new Date(order.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;