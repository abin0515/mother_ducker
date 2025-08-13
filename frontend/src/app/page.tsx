'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import '@/lib/env';

import ArrowLink from '@/components/links/ArrowLink';
import Button from '@/components/buttons/Button';

// Types for our API responses
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
}

interface ServiceStatus {
  status: 'healthy' | 'error' | 'loading';
  message?: string;
}

export default function HomePage() {
  // State for API data
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userServiceStatus, setUserServiceStatus] = useState<ServiceStatus>({ status: 'loading' });
  const [productServiceStatus, setProductServiceStatus] = useState<ServiceStatus>({ status: 'loading' });
  const [loading, setLoading] = useState(false);

  // Form states for creating new items
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });

  // Health check functions
  const checkUserService = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        setUserServiceStatus({ status: 'healthy', message: 'Service is running' });
        const userData = await response.json();
        setUsers(userData);
      } else {
        setUserServiceStatus({ status: 'error', message: `HTTP ${response.status}` });
      }
    } catch (error) {
      setUserServiceStatus({ status: 'error', message: 'Service unavailable' });
    }
  };

  const checkProductService = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        setProductServiceStatus({ status: 'healthy', message: 'Service is running' });
        const productData = await response.json();
        setProducts(productData);
      } else {
        setProductServiceStatus({ status: 'error', message: `HTTP ${response.status}` });
      }
    } catch (error) {
      setProductServiceStatus({ status: 'error', message: 'Service unavailable' });
    }
  };

  // CRUD functions
  const createUser = async () => {
    if (!newUser.name || !newUser.email) return;
    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setNewUser({ name: '', email: '' });
        await checkUserService();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
    setLoading(false);
  };

  const createProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) return;
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
        }),
      });
      if (response.ok) {
        setNewProduct({ name: '', description: '', price: '' });
        await checkProductService();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
    setLoading(false);
  };

  // Load data on component mount
  useEffect(() => {
    checkUserService();
    checkProductService();
  }, []);

  const StatusBadge = ({ status, message }: ServiceStatus) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      status === 'healthy' ? 'bg-green-100 text-green-800' :
      status === 'error' ? 'bg-red-100 text-red-800' :
      'bg-yellow-100 text-yellow-800'
    }`}>
      {status === 'healthy' ? '✅ Healthy' : status === 'error' ? '❌ Error' : '⏳ Loading'}
      {message && ` - ${message}`}
    </span>
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🦆 Mother Ducker Microservices
          </h1>
          <p className="text-lg text-gray-600">
            Full-Stack React + Spring Boot + Docker + Jenkins CI/CD
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <ArrowLink href="http://localhost:8080">Jenkins Dashboard</ArrowLink>
            <ArrowLink href="/health">System Health</ArrowLink>
          </div>
        </div>

        {/* Service Status */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">👤 User Service</h2>
              <StatusBadge {...userServiceStatus} />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Create New User</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                  <Button onClick={createUser} disabled={loading} className="w-full">
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Users ({users.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">📦 Product Service</h2>
              <StatusBadge {...productServiceStatus} />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Create New Product</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                  <Button onClick={createProduct} disabled={loading} className="w-full">
                    {loading ? 'Creating...' : 'Create Product'}
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Products ({products.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product.id} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.description}</div>
                      <div className="text-sm font-medium text-green-600">${product.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔧 Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button onClick={checkUserService} variant="outline">
              Refresh User Service
            </Button>
            <Button onClick={checkProductService} variant="outline">
              Refresh Product Service
            </Button>
            <Button onClick={() => window.open('/health', '_blank')} variant="outline">
              Check System Health
            </Button>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-600">
          <p>🦆 Mother Ducker - Enterprise Microservices Platform</p>
          <p className="text-sm">React + Next.js + Spring Boot + Docker + Jenkins</p>
        </footer>
      </div>
    </main>
  );
}
