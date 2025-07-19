import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Save } from 'lucide-react';

const AddOrder: React.FC = () => {
  const { addOrder, tailors } = useData();
  const [formData, setFormData] = useState({
    customerName: '',
    garmentType: '',
    fabricType: '',
    style: '',
    instructions: '',
    assignedTo: '',
    dueDate: '',
    measurements: {
      chest: '',
      waist: '',
      length: '',
      sleeve: '',
    },
  });

  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignedTailor = tailors.find(t => t.id === formData.assignedTo);
    if (!assignedTailor) return;

    const orderData = {
      ...formData,
      assignedToName: assignedTailor.name,
      status: 'pending' as const,
      measurements: {
        chest: formData.measurements.chest ? Number(formData.measurements.chest) : undefined,
        waist: formData.measurements.waist ? Number(formData.measurements.waist) : undefined,
        length: formData.measurements.length ? Number(formData.measurements.length) : undefined,
        sleeve: formData.measurements.sleeve ? Number(formData.measurements.sleeve) : undefined,
      },
    };

    addOrder(orderData);
    setSuccess(true);
    
    // Reset form
    setFormData({
      customerName: '',
      garmentType: '',
      fabricType: '',
      style: '',
      instructions: '',
      assignedTo: '',
      dueDate: '',
      measurements: {
        chest: '',
        waist: '',
        length: '',
        sleeve: '',
      },
    });

    setTimeout(() => setSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('measurements.')) {
      const measurementKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [measurementKey]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Order</h2>
        <p className="text-gray-600">Create a new tailoring order and assign it to a tailor</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Order created successfully and assigned to tailor!
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Order Details
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="garmentType" className="block text-sm font-medium text-gray-700 mb-2">
                Garment Type *
              </label>
              <select
                id="garmentType"
                name="garmentType"
                value={formData.garmentType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select garment type</option>
                <option value="Business Suit">Business Suit</option>
                <option value="Evening Dress">Evening Dress</option>
                <option value="Casual Shirt">Casual Shirt</option>
                <option value="Formal Shirt">Formal Shirt</option>
                <option value="Trousers">Trousers</option>
                <option value="Blazer">Blazer</option>
                <option value="Wedding Dress">Wedding Dress</option>
                <option value="Cocktail Dress">Cocktail Dress</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fabricType" className="block text-sm font-medium text-gray-700 mb-2">
                Fabric Type *
              </label>
              <input
                type="text"
                id="fabricType"
                name="fabricType"
                value={formData.fabricType}
                onChange={handleInputChange}
                placeholder="e.g., Wool Blend, Cotton, Silk"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Tailor *
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select tailor</option>
                {tailors.map((tailor) => (
                  <option key={tailor.id} value={tailor.id}>
                    {tailor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
                Style Description *
              </label>
              <input
                type="text"
                id="style"
                name="style"
                value={formData.style}
                onChange={handleInputChange}
                placeholder="e.g., Classic fit with notched lapels"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Measurements */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Measurements (inches)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="measurements.chest" className="block text-sm font-medium text-gray-700 mb-1">
                  Chest
                </label>
                <input
                  type="number"
                  id="measurements.chest"
                  name="measurements.chest"
                  value={formData.measurements.chest}
                  onChange={handleInputChange}
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="measurements.waist" className="block text-sm font-medium text-gray-700 mb-1">
                  Waist
                </label>
                <input
                  type="number"
                  id="measurements.waist"
                  name="measurements.waist"
                  value={formData.measurements.waist}
                  onChange={handleInputChange}
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="measurements.length" className="block text-sm font-medium text-gray-700 mb-1">
                  Length
                </label>
                <input
                  type="number"
                  id="measurements.length"
                  name="measurements.length"
                  value={formData.measurements.length}
                  onChange={handleInputChange}
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="measurements.sleeve" className="block text-sm font-medium text-gray-700 mb-1">
                  Sleeve
                </label>
                <input
                  type="number"
                  id="measurements.sleeve"
                  name="measurements.sleeve"
                  value={formData.measurements.sleeve}
                  onChange={handleInputChange}
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              rows={4}
              placeholder="Any special requirements, preferences, or notes for the tailor..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Create Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;