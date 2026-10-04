import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductControls from './components/ProductControls';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';
import { fetchProducts, checkBackendHealth } from './services/api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Cart State (Persisted in localStorage for convenience)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('grafanashop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Backend connection status
  const [backendOnline, setBackendOnline] = useState(true);

  // Ref for smooth scrolling to catalog
  const productsSectionRef = useRef(null);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('grafanashop_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Load products on mount
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchProducts();
    if (result.success) {
      setProducts(result.products);
      setBackendOnline(true);
    } else {
      setError(result.error);
      setBackendOnline(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();

    // Check backend health periodically every 15s
    const interval = setInterval(async () => {
      const health = await checkBackendHealth();
      setBackendOnline(health.online);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Compute available categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // 'featured': preserve original catalog order
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Simulate Checkout
  const handleSimulateCheckout = () => {
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalINR = Math.round(subtotalUSD * 83 * 1.08); // with 8% tax

    const order = {
      orderId: `GF-${Math.floor(10000 + Math.random() * 90000)}`,
      totalItems,
      totalINR,
      date: new Date().toLocaleTimeString(),
    };

    setOrderDetails(order);
    setCartItems([]);
    setIsCartOpen(false);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToProducts = () => {
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onScrollToProducts={scrollToProducts}
        backendOnline={backendOnline}
      />

      <main className="main-content">
        {/* Hero Banner */}
        <Hero onExploreClick={scrollToProducts} />

        {/* Catalog Section */}
        <section className="catalog-section" ref={productsSectionRef}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Developer Hardware</h2>
              <p className="section-desc">
                High-performance developer gear instrumented with live Prometheus metrics.
              </p>
            </div>
          </div>

          {/* Controls: Search, Categories, Sort */}
          <ProductControls
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalCount={filteredProducts.length}
          />

          {/* Product Grid / Loading / Error */}
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            onRetry={loadProducts}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        </section>
      </main>

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onSimulateCheckout={handleSimulateCheckout}
      />

      {/* Simulated Order Confirmation */}
      <OrderConfirmationModal
        isOpen={!!orderDetails}
        onClose={() => setOrderDetails(null)}
        orderDetails={orderDetails}
      />

      {/* About Architecture Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenAbout={() => setIsAboutOpen(true)} />
    </div>
  );
}
