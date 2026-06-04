import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Clock, CheckCircle, AlertCircle, TrendingUp, ChevronDown } from 'lucide-react';

const STATUS_CYCLE: Record<string, string> = {
  'pending':     'in-progress',
  'in-progress': 'completed',
  'completed':   'completed',
};

const STATUS_LABELS: Record<string, string> = {
  'pending':     'Pending',
  'in-progress': 'In Progress',
  'completed':   'Completed',
};

const STATUS_COLORS: Record<string, string> = {
  'pending':     'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-orange-100 text-orange-800',
  'completed':   'bg-green-100 text-green-800',
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, reports, getOrdersByTailor, updateOrderStatus } = useData();

  /* ─── Admin Dashboard ─────────────────────────────────────────── */
  if (user?.role === 'admin') {
    const totalOrders     = orders.length;
    const pendingOrders   = orders.filter(o => o.status === 'pending').length;
    const inProgressOrders= orders.filter(o => o.status === 'in-progress').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalReports    = reports.length;

    const stats = [
      { label: 'Total Orders',   value: totalOrders,      icon: TrendingUp,  color: 'bg-blue-500' },
      { label: 'Pending',        value: pendingOrders,    icon: Clock,       color: 'bg-yellow-500' },
      { label: 'In Progress',    value: inProgressOrders, icon: AlertCircle, color: 'bg-orange-500' },
      { label: 'Completed',      value: completedOrders,  icon: CheckCircle, color: 'bg-green-500' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Overview of your tailoring operations</p>
        </div>

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
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{order.garmentType} for {order.customerName}</h4>
                      <p className="text-sm text-gray-600">Assigned to {order.assignedToName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
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
                {reports.slice(0, 3).map(report => (
                  <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{report.orderTitle}</h4>
                      <span className="text-sm text-gray-500">{report.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">By: {report.userName}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${report.progress}%` }} />
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

  /* ─── Tailor Dashboard ────────────────────────────────────────── */
  const tailorOrders = getOrdersByTailor(user!.id);
  const myReports    = reports.filter(r => r.userId === user!.id);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusAdvance = async (orderId: string, currentStatus: string) => {
    const nextStatus = STATUS_CYCLE[currentStatus];
    if (nextStatus === currentStatus) return; // already completed
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, nextStatus as 'pending' | 'in-progress' | 'completed');
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user!.name} 👋</h2>
        <p className="text-gray-600">Your assigned orders and personal progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Assigned',  value: tailorOrders.length,                                              color: 'bg-blue-500',   Icon: TrendingUp  },
          { label: 'Pending',         value: tailorOrders.filter(o => o.status === 'pending').length,          color: 'bg-yellow-500', Icon: Clock       },
          { label: 'In Progress',     value: tailorOrders.filter(o => o.status === 'in-progress').length,      color: 'bg-orange-500', Icon: AlertCircle },
          { label: 'Completed',       value: tailorOrders.filter(o => o.status === 'completed').length,        color: 'bg-green-500',  Icon: CheckCircle },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* My Orders with status control */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">My Assigned Orders</h3>
        </div>
        <div className="p-6">
          {tailorOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders assigned yet</p>
          ) : (
            <div className="space-y-4">
              {tailorOrders.map(order => {
                const isExpanded  = expandedId === order.id;
                const isUpdating  = updatingId === order.id;
                const canAdvance  = order.status !== 'completed';

                return (
                  <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Card header */}
                    <div className="flex justify-between items-start p-4 bg-gray-50">
                      <div>
                        <h4 className="font-semibold text-gray-900">{order.garmentType}</h4>
                        <p className="text-sm text-gray-600">Customer: <span className="font-medium">{order.customerName}</span></p>
                        <p className="text-sm text-gray-500 mt-1">Due: {new Date(order.dueDate).toLocaleDateString()}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {/* Status badge */}
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>

                        {/* Advance status button */}
                        {canAdvance && (
                          <button
                            onClick={() => handleStatusAdvance(order.id, order.status)}
                            disabled={isUpdating}
                            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                          >
                            {isUpdating
                              ? 'Updating...'
                              : order.status === 'pending'
                                ? '▶ Start Work'
                                : '✓ Mark Complete'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expand/collapse details */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide details' : 'View full details & measurements'}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-gray-100 space-y-4">
                        {/* Order details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <p><span className="font-medium">Fabric:</span> {order.fabricType}</p>
                            <p><span className="font-medium">Style:</span> {order.style}</p>
                          </div>
                          {/* Measurements */}
                          {Object.keys(order.measurements).length > 0 && (
                            <div>
                              <p className="font-medium text-gray-700 mb-2">Garment Measurements:</p>
                              <div className="grid grid-cols-2 gap-1 text-xs bg-indigo-50 rounded-lg p-3">
                                {Object.entries(order.measurements).map(([key, value]) => (
                                  <p key={key} className="text-indigo-800">
                                    <span className="font-medium uppercase">{key}:</span>{' '}
                                    {value?.inches ? `${value.inches}"` : ''}
                                    {value?.inches && value?.cm ? ' / ' : ''}
                                    {value?.cm ? `${value.cm}cm` : ''}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Instructions */}
                        {order.instructions && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm font-medium text-amber-800 mb-1">📋 Special Instructions:</p>
                            <p className="text-sm text-amber-700">{order.instructions}</p>
                          </div>
                        )}

                        {/* Reports for this order */}
                        {(() => {
                          const orderReports = myReports.filter(r => r.orderId === order.id);
                          return orderReports.length > 0 ? (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">My Progress Reports ({orderReports.length}):</p>
                              <div className="space-y-2">
                                {orderReports.slice(-3).reverse().map(r => (
                                  <div key={r.id} className="bg-gray-50 rounded-lg p-3 text-xs">
                                    <div className="flex justify-between mb-1">
                                      <span className="font-medium text-gray-700">{r.date}</span>
                                      <span className="font-bold text-indigo-600">{r.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${r.progress}%` }} />
                                    </div>
                                    <p className="text-gray-600">{r.workDone}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;