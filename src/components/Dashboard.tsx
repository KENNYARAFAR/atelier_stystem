import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, reports, getOrdersByTailor } = useData();

  if (user?.role === 'admin') {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const inProgressOrders = orders.filter(o => o.status === 'in-progress').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalReports = reports.length;

    const stats = [
      { label: 'Total Orders', value: totalOrders, icon: TrendingUp, color: 'bg-blue-500' },
      { label: 'Pending', value: pendingOrders, icon: Clock, color: 'bg-yellow-500' },
      { label: 'In Progress', value: inProgressOrders, icon: AlertCircle, color: 'bg-orange-500' },
      { label: 'Completed', value: completedOrders, icon: CheckCircle, color: 'bg-green-500' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Overview of your tailoring operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{order.garmentType} for {order.customerName}</h4>
                      <p className="text-sm text-gray-600">Assigned to {order.assignedToName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.replace('-', ' ')}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">Due: {new Date(order.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports ({totalReports})</h3>
          </div>
          <div className="p-6">
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reports submitted yet</p>
            ) : (
              <div className="space-y-4">
                {reports.slice(0, 3).map((report) => (
                  <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{report.orderTitle}</h4>
                      <span className="text-sm text-gray-500">{report.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">By: {report.userName}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${report.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{report.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tailor Dashboard
  const tailorOrders = getOrdersByTailor(user!.id);
  const myReports = reports.filter(r => r.userId === user!.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h2>
        <p className="text-gray-600">Your assigned orders and progress</p>
      </div>

      {/* My Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assigned</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{tailorOrders.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {tailorOrders.filter(o => o.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reports Submitted</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{myReports.length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* My Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">My Assigned Orders</h3>
        </div>
        <div className="p-6">
          {tailorOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders assigned yet</p>
          ) : (
            <div className="space-y-4">
              {tailorOrders.map((order) => (
                <div key={order.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.garmentType}</h4>
                      <p className="text-gray-600">Customer: {order.customerName}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Fabric:</span> {order.fabricType}</p>
                      <p><span className="font-medium">Style:</span> {order.style}</p>
                      <p><span className="font-medium">Due Date:</span> {new Date(order.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Measurements:</p>
                      <div className="text-xs space-y-1">
                        {Object.entries(order.measurements).map(([key, value]) => (
                          <p key={key}>{key}: {value}"</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {order.instructions && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm"><span className="font-medium">Instructions:</span> {order.instructions}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;