import { useState, useEffect } from "react";
import { type Item } from "@/utils/api";

export function useInventoryFilters(items: Item[]) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  
  useEffect(() => {
    let result = [...items];
    
    if (selectedCategory !== null) {
      result = result.filter(item => item.category_id === selectedCategory);
    }
    
    if (selectedSupplier !== null) {
      result = result.filter(item => item.supplier_id === selectedSupplier);
    }
    
    setFilteredItems(result);
  }, [selectedCategory, selectedSupplier, items]);
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value === "" ? null : Number(value));
  };
  
  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSupplier(value === "" ? null : Number(value));
  };
  
  return {
    filteredItems,
    selectedCategory,
    selectedSupplier,
    handleCategoryChange,
    handleSupplierChange
  };
}