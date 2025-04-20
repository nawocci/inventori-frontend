import { useState, useEffect } from "react";
import { getItems, getCategories, getSuppliers, type Item, type Category, type Supplier } from "@/utils/api";

export function useInventoryData() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsData, categoriesData, suppliersData] = await Promise.all([
          getItems(),
          getCategories(),
          getSuppliers()
        ]);
        
        setItems(itemsData);
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

  return { 
    items, 
    setItems, 
    categories, 
    suppliers, 
    isLoading 
  };
}