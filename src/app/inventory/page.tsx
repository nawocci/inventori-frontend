"use client";

import { useState, useEffect } from "react";
import { getItems, getCategories, getSuppliers, deleteItem, type Item, type Category, type Supplier } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  // Load data
  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsData, categoriesData, suppliersData] = await Promise.all([
          getItems(),
          getCategories(),
          getSuppliers()
        ]);
        
        setItems(itemsData);
        setFilteredItems(itemsData);
        setCategories(categoriesData);
        setSuppliers(suppliersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter items when category or supplier changes
  useEffect(() => {
    let result = [...items];
    
    // Apply category filter
    if (selectedCategory !== null) {
      result = result.filter(item => item.category_id === selectedCategory);
    }
    
    // Apply supplier filter
    if (selectedSupplier !== null) {
      result = result.filter(item => item.supplier_id === selectedSupplier);
    }
    
    setFilteredItems(result);
  }, [selectedCategory, selectedSupplier, items]);

  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value === "" ? null : Number(value));
  };
  
  // Handle supplier filter change
  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSupplier(value === "" ? null : Number(value));
  };

  // Open delete confirmation modal
  const openDeleteModal = (item: Item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
    setDeleteError("");
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
    setDeleteError("");
  };

  // Handle item deletion
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    setDeleteError("");
    
    try {
      await deleteItem(itemToDelete.id);
      
      // Remove the item from state
      const updatedItems = items.filter(item => item.id !== itemToDelete.id);
      setItems(updatedItems);
      setFilteredItems(updatedItems.filter(item => 
        (selectedCategory === null || item.category_id === selectedCategory) &&
        (selectedSupplier === null || item.supplier_id === selectedSupplier)
      ));
      
      closeDeleteModal();
    } catch (error: any) {
      setDeleteError(error.message || "Failed to delete item. Please try again.");
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-0">
          <h2 className="text-lg font-semibold">Total Items: {filteredItems.length}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center">
              <label htmlFor="categoryFilter" className="mr-2 text-sm font-medium text-gray-700">
                Category:
              </label>
              <select
                id="categoryFilter"
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onChange={handleCategoryChange}
                value={selectedCategory === null ? "" : selectedCategory}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="supplierFilter" className="mr-2 text-sm font-medium text-gray-700">
                Supplier:
              </label>
              <select
                id="supplierFilter"
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onChange={handleSupplierChange}
                value={selectedSupplier === null ? "" : selectedSupplier}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {isAdmin && (
          <div>
            <a 
              href="/inventory/add" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Add New Item
            </a>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              {isAdmin && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {item.category_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.supplier_name ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.supplier_name}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not specified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`${item.stock <= 10 ? 'text-red-600 font-medium' : ''}`}>
                      {item.stock}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href={`/inventory/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer">
                        Edit
                      </a>
                      <button 
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        onClick={() => openDeleteModal(item)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No inventory items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete <span className="font-semibold">{itemToDelete.name}</span>? 
              This action cannot be undone.
            </p>
            
            {deleteError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {deleteError}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 cursor-pointer"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer"
                onClick={handleDeleteItem}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}