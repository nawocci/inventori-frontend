"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getItem, updateItem, getCategories, getSuppliers, type Category, type Supplier, type Item } from "@/utils/api";

export default function EditItem({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const itemId = parseInt(resolvedParams.id, 10);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    stock: 0,
    supplier_id: ""
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/inventory');
    }
  }, [user, isAdmin, router]);
  
  // Fetch item, categories and suppliers
  useEffect(() => {
    async function fetchData() {
      try {
        const [itemData, categoriesData, suppliersData] = await Promise.all([
          getItem(itemId),
          getCategories(),
          getSuppliers()
        ]);
        
        setFormData({
          name: itemData.name,
          category_id: itemData.category_id.toString(),
          stock: itemData.stock,
          supplier_id: itemData.supplier_id ? itemData.supplier_id.toString() : ""
        });
        
        setCategories(categoriesData);
        setSuppliers(suppliersData);
      } catch (error) {
        setError("Failed to load item data. Please try again.");
        console.error("Error loading item data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [itemId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (name === 'stock') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseInt(value, 10)
      }));
    } else if (name === 'category_id' || name === 'supplier_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Item name is required");
      }
      
      if (!formData.category_id) {
        throw new Error("Category is required");
      }
      
      // Update item
      await updateItem(itemId, {
        name: formData.name.trim(),
        category_id: parseInt(formData.category_id, 10),
        stock: formData.stock,
        supplier_id: formData.supplier_id ? parseInt(formData.supplier_id, 10) : null
      });
      
      setSuccess("Item updated successfully!");
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/inventory');
      }, 1500);
      
    } catch (error: any) {
      setError(error.message || "Failed to update item. Please try again.");
      console.error("Error updating item:", error);
    } finally {
      setIsSubmitting(false);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Item</h1>
        <button
          onClick={() => router.push('/inventory')}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer"
        >
          Back to Inventory
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <select
                id="supplier_id"
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/inventory')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}