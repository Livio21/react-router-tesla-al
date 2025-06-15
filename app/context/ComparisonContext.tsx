import React, { createContext, useContext, useState, useEffect } from 'react';

interface Car {
  _id: string;
  name: string;
  slug?: { current: string };
  model?: string;
  brand: string;
  year?: number;
  description?: string;
  range?: number;
  currentPrice: string;
  previousPrice?: string;
  mileage?: number;
  gallery?: any[];
  availability?: boolean;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  location?: string;
  color?: string;
  new?: boolean;
  features?: string[];
}

interface ComparisonContextType {
  cars: Car[];
  addCar: (car: Car) => void;
  removeCar: (carId: string) => void;
  clearCars: () => void;
  isInComparison: (carId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<Car[]>([]);

  // Load cars from localStorage only on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('comparisonCars');
      if (saved) {
        setCars(JSON.parse(saved));
      }
    }
  }, []);

  // Save to localStorage only on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('comparisonCars', JSON.stringify(cars));
    }
  }, [cars]);

  const addCar = (car: Car) => {
    if (cars.length >= 5) return;
    if (!cars.some(c => c._id === car._id)) {
      setCars(prev => [...prev, car]);
    }
  };

  const removeCar = (carId: string) => {
    setCars(prev => prev.filter(car => car._id !== carId));
  };

  const clearCars = () => {
    setCars([]);
  };

  const isInComparison = (carId: string) => {
    return cars.some(car => car._id === carId);
  };

  return (
    <ComparisonContext.Provider value={{ cars, addCar, removeCar, clearCars, isInComparison }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
} 