import { Category, Supplier } from "@/utils/api";

interface FilterPanelProps {
  filteredItemsCount: number;
  categories: Category[];
  suppliers: Supplier[];
  selectedCategory: number | null;
  selectedSupplier: number | null;
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSupplierChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function FilterPanel({ 
  filteredItemsCount, 
  categories, 
  suppliers, 
  selectedCategory, 
  selectedSupplier,
  handleCategoryChange, 
  handleSupplierChange 
}: FilterPanelProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-0">
      <h2 className="text-lg font-semibold">Total Items: {filteredItemsCount}</h2>
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
  );
}