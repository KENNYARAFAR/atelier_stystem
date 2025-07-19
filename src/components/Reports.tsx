import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Calendar, User, TrendingUp, FileText, Send } from 'lucide-react';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { reports, addReport, getOrdersByTailor, orders } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    progress: '',
    workDone: '',
    challenges: '',
    estimatedCompletion: '',
  });

  const isAdmin = user?.role === 'admin';
  const tailorOrders = isAdmin ? [] : getOrdersByTailor(user!.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedOrder = orders.find(o => o.id === formData.orderId);
    if (!selectedOrder) return;

    const reportData = {
      userId: user!.id,
      userName: user!.name,
      orderId: formData.orderId,
      orderTitle: `${selectedOrder.garmentType} for ${selectedOrder.customerName}`,
      progress: Number(formData.progress),
      workDone: formData.workDone,
      challenges: formData.challenges,
      estimatedCompletion: formData.estimatedCompletion,
      date: new Date().toISOString().split('T')[0],
    };

    addReport(reportData);
    
    // Reset form
    setFormData({
      orderId: '',
      progress: '',
      workDone: '',
      challenges: '',
      estimatedCompletion: '',
    });
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Reports</h2>
          <p className="text-gray-600">View progress reports submitted by tailors</p>
        </div>

        {/* Reports Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{reports.length}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {reports.filter(r => {
                    const reportDate = new Date(r.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return reportDate >= weekAgo;
                  }).length}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {reports.length > 0 
                    ? Math.round(reports.reduce((sum, r) => sum + r.progress, 0) / reports.length)
                    : 0}%
                </p>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">All Reports</h3>
          </div>
          
          <div className="p-6">
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reports submitted yet</p>
            ) : (
              <div className="space-y-6">
                {reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{report.orderTitle}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {report.userName}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(report.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${report.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{report.progress}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Work Completed</h5>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {report.workDone}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Challenges</h5>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {report.challenges || 'No challenges reported'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Estimated Completion:</span> {new Date(report.estimatedCompletion).toLocaleDateString()}
                      </p>
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

  // Tailor view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submit Daily Report</h2>
          <p className="text-gray-600">Report your progress on assigned orders</p>
        </div>
        
        {!showForm && tailorOrders.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Send className="h-5 w-5" />
            <span>New Report</span>
          </button>
        )}
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Daily Progress Report</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Order *
              </label>
              <select
                id="orderId"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Choose an order to report on</option>
                {tailorOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.garmentType} for {order.customerName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
                Progress Percentage *
              </label>
              <input
                type="number"
                id="progress"
                name="progress"
                value={formData.progress}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="workDone" className="block text-sm font-medium text-gray-700 mb-2">
                Work Completed Today *
              </label>
              <textarea
                id="workDone"
                name="workDone"
                value={formData.workDone}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe what you accomplished today..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-2">
                Challenges or Issues
              </label>
              <textarea
                id="challenges"
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any difficulties or concerns encountered..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="estimatedCompletion" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Completion Date *
              </label>
              <input
                type="date"
                id="estimatedCompletion"
                name="estimatedCompletion"
                value={formData.estimatedCompletion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Send className="h-5 w-5" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Previous Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">My Previous Reports</h3>
        </div>
        
        <div className="p-6">
          {reports.filter(r => r.userId === user!.id).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reports submitted yet</p>
          ) : (
            <div className="space-y-4">
              {reports
                .filter(r => r.userId === user!.id)
                .map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">{report.orderTitle}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${report.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{report.progress}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.workDone}</p>
                    <p className="text-xs text-gray-500">
                      Submitted on {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {tailorOrders.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          No orders assigned to you yet. Please wait for the admin to assign orders.
        </div>
      )}
    </div>
  );
};

export default Reports;