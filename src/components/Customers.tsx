import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Users, UserPlus, Edit, Phone, Mail, MapPin, Ruler } from 'lucide-react';

const MEASUREMENT_FIELDS = [
  { key: 'chest',    label: 'Chest' },
  { key: 'waist',   label: 'Waist' },
  { key: 'hips',    label: 'Hips' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'inseam',  label: 'Inseam' },
  { key: 'neck',    label: 'Neck' },
  { key: 'sleeve',  label: 'Sleeve Length' },
  { key: 'thigh',   label: 'Thigh' },
];

type MeasurementMap = Record<string, { inches: string; cm: string }>;

const emptyMeasurements = (): MeasurementMap =>
  Object.fromEntries(MEASUREMENT_FIELDS.map(f => [f.key, { inches: '', cm: '' }]));

const customerToMeasurementMap = (
  measurements: Record<string, { inches?: number; cm?: number } | undefined> = {}
): MeasurementMap =>
  Object.fromEntries(
    MEASUREMENT_FIELDS.map(f => [
      f.key,
      {
        inches: measurements[f.key]?.inches?.toString() ?? '',
        cm:     measurements[f.key]?.cm?.toString()     ?? '',
      },
    ])
  );

const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [showMeasurements, setShowMeasurements] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [measurements, setMeasurements] = useState<MeasurementMap>(emptyMeasurements());

  /* ─── helpers ─────────────────────────────────────────────────── */

  const handleMeasurementChange = (
    key: string,
    unit: 'inches' | 'cm',
    value: string
  ) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: { ...prev[key], [unit]: value },
    }));
  };

  const buildMeasurementsPayload = () => {
    const result: Record<string, { inches?: number; cm?: number }> = {};
    for (const { key } of MEASUREMENT_FIELDS) {
      const { inches, cm } = measurements[key];
      if (inches || cm) {
        result[key] = {
          ...(inches ? { inches: Number(inches) } : {}),
          ...(cm     ? { cm:     Number(cm)     } : {}),
        };
      }
    }
    return result;
  };

  /* ─── form handlers ────────────────────────────────────────────── */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, measurements: buildMeasurementsPayload() };
    if (editingCustomer) {
      updateCustomer(editingCustomer, payload);
      setEditingCustomer(null);
    } else {
      addCustomer(payload);
    }
    setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
    setMeasurements(emptyMeasurements());
    setShowAddForm(false);
  };

  const handleEdit = (customer: any) => {
    setFormData({
      name:    customer.name,
      email:   customer.email,
      phone:   customer.phone,
      address: customer.address,
      notes:   customer.notes,
    });
    setMeasurements(customerToMeasurementMap(customer.measurements));
    setEditingCustomer(customer.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
    setMeasurements(emptyMeasurements());
    setEditingCustomer(null);
    setShowAddForm(false);
  };

  /* ─── render ───────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage your customer database and body measurements</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{customers.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {customers.filter(c => {
                  const d = new Date(c.createdAt);
                  return d.getMonth() === new Date().getMonth();
                }).length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With Measurements</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {customers.filter(c => c.measurements && Object.keys(c.measurements).length > 0).length}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Ruler className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* ── Basic Info ── */}
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Customer preferences, special requirements, etc."
                />
              </div>
            </div>

            {/* ── Measurements ── */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-4">
                <Ruler className="h-5 w-5 text-indigo-600 mr-2" />
                <h4 className="text-base font-medium text-gray-900">Body Measurements</h4>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Enter measurements in inches, centimetres, or both. Leave blank if not yet measured.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MEASUREMENT_FIELDS.map(field => (
                  <div key={field.key} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">{field.label}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Inches</label>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          value={measurements[field.key]?.inches ?? ''}
                          onChange={e => handleMeasurementChange(field.key, 'inches', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Centimeters</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="0.0"
                          value={measurements[field.key]?.cm ?? ''}
                          onChange={e => handleMeasurementChange(field.key, 'cm', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Measurements saved here will be available when creating orders for this customer.
                </p>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex justify-end space-x-4 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                {editingCustomer ? 'Update Customer' : 'Add Customer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">All Customers ({customers.length})</h3>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No customers added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {customers.map(customer => {
              const hasMeasurements =
                customer.measurements && Object.keys(customer.measurements).length > 0;
              const isExpanded = showMeasurements === customer.id;

              return (
                <div key={customer.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{customer.name}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Edit customer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-2 text-sm">
                    {customer.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {customer.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{customer.notes}</p>
                    </div>
                  )}

                  {/* Measurements toggle */}
                  {hasMeasurements && (
                    <div className="mt-3">
                      <button
                        onClick={() => setShowMeasurements(isExpanded ? null : customer.id)}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                      >
                        <Ruler className="h-4 w-4 mr-1" />
                        {isExpanded ? 'Hide Measurements' : 'View Measurements'}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 p-3 bg-indigo-50 rounded-lg space-y-1">
                          {MEASUREMENT_FIELDS.filter(f => customer.measurements[f.key]).map(f => {
                            const m = customer.measurements[f.key];
                            return (
                              <div key={f.key} className="flex justify-between text-xs text-indigo-800">
                                <span className="font-medium">{f.label}:</span>
                                <span>
                                  {m?.inches ? `${m.inches}"` : ''}
                                  {m?.inches && m?.cm ? ' / ' : ''}
                                  {m?.cm ? `${m.cm} cm` : ''}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {!hasMeasurements && (
                    <div className="mt-3 flex items-center text-xs text-gray-400">
                      <Ruler className="h-3 w-3 mr-1" />
                      <span>No measurements recorded</span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Customer since {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;