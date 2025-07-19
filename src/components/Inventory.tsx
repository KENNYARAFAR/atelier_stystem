import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Package, Plus, Edit, Trash2, AlertTriangle, TrendingDown } from 'lucide-react';

const Inventory: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'fabric' as 'fabric' | 'thread' | 'button' | 'zipper' | 'other',
    quantity: '',
    unit: '',
    minStock: '',
    supplier: '',
    cost: '',
  });

  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      ...formData,
      quantity: Number(formData.quantity),
      minStock: Number(formData.minStock),
      cost: Number(formData.cost),
    };

    if (editingItem) {
      updateInventoryItem(editingItem, itemData);
      setEditingItem(null);
    } else {
      addInventoryItem(itemData);
    }
    
    setFormData({
      itemName: '',
      category: 'fabric',
      quantity: '',
      unit: '',
      minStock: '',
      supplier: '',
      cost: '',
    });
    setShowAddForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      minStock: item.minStock.toString(),
      supplier: item.supplier,
      cost: item.cost.toString(),
    });
    setEditingItem(item.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData({
      itemName: '',
      category: 'fabric',
      quantity: '',
      unit: '',
      minStock: '',
      supplier: '',
      cost: '',
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fabric': return 'bg-blue-100 text-blue-800';
      case 'thread': return 'bg-green-100 text-green-800';
      case 'button': return 'bg-yellow-100 text-yellow-800';
      case 'zipper': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Track materials, supplies, and stock levels</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{inventory.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{lowStockItems.length}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {new Set(inventory.map(item => item.category)).size}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
          </div>
          <div className="mt-2 text-sm text-red-700">
            {lowStockItems.length} item(s) are running low on stock: {' '}
            {lowStockItems.map(item => item.itemName).join(', ')}
          </div>
        </div>
      )}

      {/* Add/Edit Item Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="fabric">Fabric</option>
                  <option value="thread">Thread</option>
                  <option value="button">Button</option>
                  <option value="zipper">Zipper</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., yards, pieces, spools"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stock Level *
                </label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per Unit ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
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
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Inventory Items</h3>
        </div>
        
        {inventory.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No inventory items added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${item.quantity <= item.minStock ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                          {item.quantity <= item.minStock && (
                            <div className="flex items-center text-red-600 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low Stock
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item.quantity} {item.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {item.minStock} {item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${item.cost.toFixed(2)} / {item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.supplier || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;