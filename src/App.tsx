import { useState } from 'react';
import { CartProvider } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import VehicleCheckup from '@/components/VehicleCheckup';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleFitment, setVehicleFitment] = useState<{ make: string; model: string } | null>(null);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setVehicleFitment(null);
  };

  return (
    <CartProvider>
      <div className="bg-slate-950 min-h-screen">
        <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <main>
          <Hero searchQuery={searchQuery} onSearchChange={handleSearchChange} />
          <VehicleCheckup
            onSearchParts={(query, vehicle) => {
              setSearchQuery(query);
              setVehicleFitment(vehicle);
            }}
          />
          <ProductGrid
            searchQuery={searchQuery}
            vehicleFitment={vehicleFitment}
            onClearFilters={() => {
              setSearchQuery('');
              setVehicleFitment(null);
            }}
          />
          <Features />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
