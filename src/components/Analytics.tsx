import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart3, TrendingUp, Calendar, Clock, DollarSign, Users } from 'lucide-react';

const Analytics: React.FC = () => {
  const { orders, reports, customers, inventory } = useData();

  // Calculate analytics data
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const inProgressOrders = orders.filter(o => o.status === 'in-progress').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0;
  
  // Monthly data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  }).length;

  const monthlyReports = reports.filter(r => {
    const reportDate = new Date(r.createdAt);
    return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
  }).length;

  // Average progress
  const avgProgress = reports.length > 0 
    ? (reports.reduce((sum, r) => sum + r.progress, 0) / reports.length).toFixed(1)
    : 0;

  // Inventory value
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  // Order distribution by garment type
  const garmentTypes = orders.reduce((acc, order) => {
    acc[order.garmentType] = (acc[order.garmentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Tailor performance
  const tailorPerformance = orders.reduce((acc, order) => {
    if (!acc[order.assignedToName]) {
      acc[order.assignedToName] = { total: 0, completed: 0 };
    }
    acc[order.assignedToName].total++;
    if (order.status === 'completed') {
      acc[order.assignedToName].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Comprehensive insights into your tailoring business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{completionRate}%</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{monthlyOrders}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{avgProgress}%</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${totalInventoryValue.toFixed(0)}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Order Status Distribution
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-yellow-800">{pendingOrders}</span>
              </div>
              <h4 className="font-medium text-gray-900">Pending</h4>
              <p className="text-sm text-gray-500">
                {totalOrders > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-orange-800">{inProgressOrders}</span>
              </div>
              <h4 className="font-medium text-gray-900">In Progress</h4>
              <p className="text-sm text-gray-500">
                {totalOrders > 0 ? ((inProgressOrders / totalOrders) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-800">{completedOrders}</span>
              </div>
              <h4 className="font-medium text-gray-900">Completed</h4>
              <p className="text-sm text-gray-500">
                {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Garment Types */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Popular Garment Types</h3>
        </div>
        <div className="p-6">
          {Object.keys(garmentTypes).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders data available</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(garmentTypes)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{type}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${(count / totalOrders) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Tailor Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Tailor Performance
          </h3>
        </div>
        <div className="p-6">
          {Object.keys(tailorPerformance).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No performance data available</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(tailorPerformance).map(([name, performance]) => {
                const completionRate = performance.total > 0 
                  ? (performance.completed / performance.total * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{name}</h4>
                      <p className="text-sm text-gray-600">
                        {performance.completed} of {performance.total} orders completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
                      <div className="text-sm text-gray-500">completion rate</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">This Month's Activity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">New Orders:</span>
                  <span className="font-medium">{monthlyOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reports Submitted:</span>
                  <span className="font-medium">{monthlyReports}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Customers:</span>
                  <span className="font-medium">
                    {customers.filter(c => {
                      const customerDate = new Date(c.createdAt);
                      return customerDate.getMonth() === currentMonth && customerDate.getFullYear() === currentYear;
                    }).length}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Business Health</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Orders:</span>
                  <span className="font-medium">{inProgressOrders + pendingOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Base:</span>
                  <span className="font-medium">{customers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inventory Items:</span>
                  <span className="font-medium">{inventory.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;