import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ClipboardList, Search, Filter } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  'pending':     'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-orange-100 text-orange-800 border-orange-200',
  'completed':   'bg-green-100 text-green-800 border-green-200',
};
const STATUS_LABELS: Record<string, string> = {
  'pending':     'Pending',
  'in-progress': 'In Progress',
  'completed':   'Completed',
};
const STATUS_CYCLE: Record<string, string> = {
  'pending':     'in-progress',
  'in-progress': 'completed',
  'completed':   'completed',
};

const TailorOrders: React.FC = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useData();
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Only show orders assigned to the current tailor
  const myOrders = orders
    .filter(o => o.assignedTo === user?.id)
    .filter(o => filterStatus === 'all' || o.status === filterStatus)
    .filter(o =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.garmentType.toLowerCase().includes(search.toLowerCase())
    );

  const handleAdvance = async (orderId: string, current: string) => {
    const next = STATUS_CYCLE[current];
    if (next === current) return;
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, next as 'pending' | 'in-progress' | 'completed');
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All My Orders</h2>
        <p className="text-gray-600">All orders assigned to you — search, filter, and update status</p>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['all', 'pending', 'in-progress', 'completed'] as const).map(s => {
          const count = s === 'all'
            ? orders.filter(o => o.assignedTo === user?.id).length
            : orders.filter(o => o.assignedTo === user?.id && o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl p-4 text-left border-2 transition-all ${
                filterStatus === s
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-100 bg-white hover:border-indigo-200'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600 capitalize mt-1">{s === 'all' ? 'Total Orders' : STATUS_LABELS[s]}</p>
            </button>
          );
        })}
      </div>

      {/* Search + filter bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or garment type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={e => setFilter(e.target.value as typeof filterStatus)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Order list */}
      <div className="space-y-4">
        {myOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-16">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders match your filter</p>
          </div>
        ) : (
          myOrders.map(order => {
            const isExpanded  = expandedId === order.id;
            const isUpdating  = updatingId === order.id;
            const canAdvance  = order.status !== 'completed';

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Row header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900 text-base">{order.garmentType}</h4>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Customer:</span> {order.customerName}
                      &nbsp;&bull;&nbsp;
                      <span className="font-medium">Due:</span> {new Date(order.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      <span className="font-medium">Fabric:</span> {order.fabricType}
                      &nbsp;&bull;&nbsp;
                      <span className="font-medium">Style:</span> {order.style}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {canAdvance && (
                      <button
                        onClick={() => handleAdvance(order.id, order.status)}
                        disabled={isUpdating}
                        className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                      >
                        {isUpdating
                          ? 'Updating...'
                          : order.status === 'pending'
                            ? '▶ Start'
                            : '✓ Complete'}
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="text-sm text-indigo-600 border border-indigo-200 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      {isExpanded ? 'Less ▲' : 'Details ▼'}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50">
                    {/* Measurements */}
                    {Object.keys(order.measurements).length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">📐 Garment Measurements</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {Object.entries(order.measurements).map(([key, value]) => (
                            <div key={key} className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                              <p className="text-xs text-gray-500 uppercase font-medium">{key}</p>
                              <p className="text-sm font-bold text-indigo-700 mt-1">
                                {value?.inches ? `${value.inches}"` : ''}
                                {value?.inches && value?.cm ? ' / ' : ''}
                                {value?.cm ? `${value.cm}cm` : ''}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Instructions */}
                    {order.instructions && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-amber-800 mb-1">📋 Special Instructions</p>
                        <p className="text-sm text-amber-700">{order.instructions}</p>
                      </div>
                    )}

                    {/* Created date */}
                    <p className="text-xs text-gray-400">
                      Order created: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TailorOrders;
