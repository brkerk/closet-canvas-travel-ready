import { useState, useEffect } from 'react';
import { GarmentData } from '@/components/GarmentCard';

// Simple garment store hook for demo purposes
// In a real app, this would connect to a backend or database
export const useGarmentStore = () => {
  const [garments, setGarments] = useState<GarmentData[]>([
    {
      id: "1",
      name: "Navy Blue Blazer",
      brand: "J.Crew",
      color: "Navy",
      type: "Outerwear",
      tags: ["formal", "work", "versatile"],
      isFavorite: true,
    },
    {
      id: "2", 
      name: "White Cotton Shirt",
      brand: "Uniqlo",
      color: "White",
      type: "Tops",
      tags: ["casual", "basic", "everyday"],
      isFavorite: false,
    },
    {
      id: "3",
      name: "Black Leather Boots",
      brand: "Dr. Martens", 
      color: "Black",
      type: "Shoes",
      tags: ["casual", "durable", "fall"],
      isFavorite: true,
    },
    {
      id: "4",
      name: "Denim Jeans",
      brand: "Levi's",
      color: "Blue", 
      type: "Bottoms",
      tags: ["casual", "everyday", "denim"],
      isFavorite: false,
    },
    {
      id: "5",
      name: "Red Evening Dress",
      brand: "Zara",
      color: "Red",
      type: "Dresses", 
      tags: ["formal", "evening", "elegant"],
      isFavorite: true,
    },
    {
      id: "6",
      name: "Silk Blouse",
      brand: "Ann Taylor",
      color: "White",
      type: "Tops",
      tags: ["formal", "work", "silk", "delicate"],
      isFavorite: false,
    },
    {
      id: "7",
      name: "Wool Sweater",
      brand: "Banana Republic", 
      color: "Gray",
      type: "Tops",
      tags: ["casual", "winter", "warm"],
      isFavorite: false,
    },
    {
      id: "8",
      name: "Brown Leather Belt",
      brand: "Coach",
      color: "Brown",
      type: "Accessories",
      tags: ["formal", "leather", "belt"],
      isFavorite: false,
    }
  ]);

  const addGarment = (garment: Omit<GarmentData, 'id'>) => {
    const newGarment: GarmentData = {
      ...garment,
      id: Date.now().toString(),
    };
    setGarments(prev => [...prev, newGarment]);
    return newGarment;
  };

  const updateGarment = (id: string, updates: Partial<GarmentData>) => {
    setGarments(prev => prev.map(garment => 
      garment.id === id ? { ...garment, ...updates } : garment
    ));
  };

  const deleteGarment = (id: string) => {
    setGarments(prev => prev.filter(garment => garment.id !== id));
  };

  const getGarment = (id: string) => {
    return garments.find(garment => garment.id === id);
  };

  return {
    garments,
    addGarment,
    updateGarment,
    deleteGarment,
    getGarment,
  };
};