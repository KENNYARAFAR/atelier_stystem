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
    measurements: {} as Record<string, { inches: string; cm: string }>,
  });

  const [success, setSuccess] = useState(false);

  // Get measurement fields based on garment type
  const getMeasurementFields = (garmentType: string) => {
    const lowerType = garmentType.toLowerCase();
    
    if (lowerType.includes('shirt') || lowerType.includes('blouse')) {
      return [
        { key: 'CRL', label: 'Collar (CRL)' },
        { key: 'CP', label: 'Chest Point (CP)' },
        { key: 'CT', label: 'Chest Top (CT)' },
        { key: 'CH', label: 'Chest Height (CH)' },
        { key: 'LT', label: 'Length Top (LT)' },
        { key: 'LM', label: 'Length Middle (LM)' },
        { key: 'CM', label: 'Cuff Measurement (CM)' },
      ];
    } else if (lowerType.includes('pant') || lowerType.includes('trouser') || lowerType.includes('short')) {
      return [
        { key: 'T', label: 'Thigh (T)' },
        { key: 'BC', label: 'Bottom Cuff (BC)' },
        { key: 'CS', label: 'Crotch Seam (CS)' },
        { key: 'L', label: 'Length (L)' },
        { key: 'waist', label: 'Waist' },
      ];
    } else if (lowerType.includes('dress') || lowerType.includes('gown')) {
      return [
        { key: 'CRL', label: 'Collar (CRL)' },
        { key: 'P', label: 'Bust Point (P)' },
        { key: 'T', label: 'Thigh (T)' },
        { key: 'BC', label: 'Bottom Cuff (BC)' },
        { key: 'L', label: 'Length (L)' },
        { key: 'LM', label: 'Length Middle (LM)' },
        { key: 'CM', label: 'Cuff Measurement (CM)' },
        { key: 'CSG', label: 'Chest Seam Gap (CSG)' },
      ];
    } else {
      // Default measurements for other garments
      return [
        { key: 'chest', label: 'Chest' },
        { key: 'waist', label: 'Waist' },
        { key: 'L', label: 'Length (L)' },
      ];
    }
  };

  const measurementFields = getMeasurementFields(formData.garmentType);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignedTailor = tailors.find(t => t.id === formData.assignedTo);
    if (!assignedTailor) return;

    // Convert measurements to proper format
    const processedMeasurements: Record<string, { inches?: number; cm?: number }> = {};
    Object.entries(formData.measurements).forEach(([key, value]) => {
      if (value && (value.inches || value.cm)) {
        processedMeasurements[key] = {
          inches: value.inches ? Number(value.inches) : undefined,
          cm: value.cm ? Number(value.cm) : undefined,
        };
      }
    });
    const orderData = {
      ...formData,
      assignedToName: assignedTailor.name,
      status: 'pending' as const,
      measurements: processedMeasurements,
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
      measurements: {},
    });

    setTimeout(() => setSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('measurements.') && name.includes('.')) {
      const [, measurementKey, unit] = name.split('.');
      setFormData(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [measurementKey]: {
            ...prev.measurements[measurementKey],
            [unit]: value,
          },
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
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Measurements {formData.garmentType && `for ${formData.garmentType}`}
            </h4>
            
            {!formData.garmentType ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Please select a garment type first to see relevant measurement fields</p>
              </div>
            ) : (
              <div className="space-y-4">
                {measurementFields.map((field) => (
                  <div key={field.key} className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {field.label}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Inches</label>
                        <input
                          type="number"
                          name={`measurements.${field.key}.inches`}
                          value={formData.measurements[field.key]?.inches || ''}
                          onChange={handleInputChange}
                          step="0.25"
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Centimeters</label>
                        <input
                          type="number"
                          name={`measurements.${field.key}.cm`}
                          value={formData.measurements[field.key]?.cm || ''}
                          onChange={handleInputChange}
                          step="0.5"
                          placeholder="0.0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {formData.garmentType && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> You can fill in measurements in inches, centimeters, or both. 
                  At least one unit should be provided for each measurement.
                </p>
              </div>
            )}
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