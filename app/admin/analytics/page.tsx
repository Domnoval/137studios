'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    averageOrderValue: number;
    conversionRate: number;
    recentOrders: Array<{
      orderNumber: string;
      customerName: string;
      total: number;
      status: string;
      createdAt: string;
    }>;
  };
  revenue: {
    daily: Array<{ date: string; amount: number; orders: number }>;
    monthly: Array<{ month: string; amount: number; orders: number }>;
  };
  products: {
    topSelling: Array<{
      artworkTitle: string;
      productType: string;
      quantity: number;
      revenue: number;
    }>;
    categoryBreakdown: Array<{
      category: string;
      count: number;
      revenue: number;
    }>;
  };
  users: {
    registrations: Array<{ date: string; count: number }>;
    totalActive: number;
    repeatCustomers: number;
  };
  printProviders: {
    printful: { orders: number; revenue: number; avgFulfillmentTime: number };
    printify: { orders: number; revenue: number; avgFulfillmentTime: number };
  };
}

export default function AdminAnalytics() {
  const sessionResult = useSession();
  const { data: session, status } = sessionResult || { data: null, status: 'loading' };
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      redirect('/admin/login');
    }
  }, [session, status]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [session, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-cosmic-void flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cosmic-plasma border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cosmic-void flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">⚠️ {error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-cosmic-plasma rounded-lg text-white hover:bg-cosmic-plasma/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="min-h-screen bg-cosmic-void text-cosmic-glow">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-cosmic-plasma to-mystic-gold bg-clip-text text-transparent">
              📊 Admin Analytics
            </span>
          </motion.h1>

          {/* Time Range Selector */}
          <div className="flex gap-4 mb-6">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-cosmic-plasma text-white'
                    : 'border border-cosmic-aura text-cosmic-light hover:bg-cosmic-aura/20'
                }`}
              >
                {range === '7d' && 'Last 7 Days'}
                {range === '30d' && 'Last 30 Days'}
                {range === '90d' && 'Last 90 Days'}
                {range === '1y' && 'Last Year'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`$${analyticsData.overview.totalRevenue.toLocaleString()}`}
            icon="💰"
            trend="+12.5%"
          />
          <MetricCard
            title="Total Orders"
            value={analyticsData.overview.totalOrders.toLocaleString()}
            icon="📦"
            trend="+8.3%"
          />
          <MetricCard
            title="Total Users"
            value={analyticsData.overview.totalUsers.toLocaleString()}
            icon="👥"
            trend="+15.2%"
          />
          <MetricCard
            title="Avg Order Value"
            value={`$${analyticsData.overview.averageOrderValue.toFixed(2)}`}
            icon="💎"
            trend="+4.7%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-cosmic-nebula/30 backdrop-blur-sm border border-cosmic-aura rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cosmic-glow mb-4">📈 Revenue Trends</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {analyticsData.revenue.daily.slice(-7).map((day, index) => (
                <div key={day.date} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-gradient-to-t from-cosmic-plasma to-cosmic-aura rounded-t w-full transition-all hover:opacity-80"
                    style={{
                      height: `${(day.amount / Math.max(...analyticsData.revenue.daily.map(d => d.amount))) * 200}px`,
                      minHeight: '20px'
                    }}
                  />
                  <span className="text-xs text-cosmic-light mt-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-xs text-cosmic-aura">${day.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-cosmic-nebula/30 backdrop-blur-sm border border-cosmic-aura rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cosmic-glow mb-4">🏆 Top Selling Artworks</h3>
            <div className="space-y-4">
              {analyticsData.products.topSelling.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-cosmic-glow">{product.artworkTitle}</p>
                    <p className="text-sm text-cosmic-light">{product.productType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cosmic-aura font-bold">${product.revenue}</p>
                    <p className="text-sm text-cosmic-light">{product.quantity} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-cosmic-nebula/30 backdrop-blur-sm border border-cosmic-aura rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-cosmic-glow mb-4">🛍️ Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cosmic-aura/50">
                  <th className="text-left py-3 text-cosmic-light">Order #</th>
                  <th className="text-left py-3 text-cosmic-light">Customer</th>
                  <th className="text-left py-3 text-cosmic-light">Total</th>
                  <th className="text-left py-3 text-cosmic-light">Status</th>
                  <th className="text-left py-3 text-cosmic-light">Date</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.overview.recentOrders.map((order) => (
                  <tr key={order.orderNumber} className="border-b border-cosmic-aura/20">
                    <td className="py-3 text-cosmic-aura font-mono">{order.orderNumber}</td>
                    <td className="py-3 text-cosmic-glow">{order.customerName}</td>
                    <td className="py-3 text-cosmic-glow">${order.total}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'CONFIRMED' ? 'bg-cosmic-plasma/20 text-cosmic-plasma' :
                        order.status === 'SHIPPED' ? 'bg-green-500/20 text-green-400' :
                        'bg-cosmic-aura/20 text-cosmic-aura'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-cosmic-light">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Print Provider Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-cosmic-nebula/30 backdrop-blur-sm border border-cosmic-aura rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cosmic-glow mb-4">🖨️ Printful Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-cosmic-light">Orders:</span>
                <span className="text-cosmic-glow">{analyticsData.printProviders.printful.orders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cosmic-light">Revenue:</span>
                <span className="text-cosmic-aura">${analyticsData.printProviders.printful.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cosmic-light">Avg Fulfillment:</span>
                <span className="text-cosmic-glow">{analyticsData.printProviders.printful.avgFulfillmentTime} days</span>
              </div>
            </div>
          </div>

          <div className="bg-cosmic-nebula/30 backdrop-blur-sm border border-cosmic-aura rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cosmic-glow mb-4">📋 Printify Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-cosmic-light">Orders:</span>
                <span className="text-cosmic-glow">{analyticsData.printProviders.printify.orders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cosmic-light">Revenue:</span>
                <span className="text-cosmic-aura">${analyticsData.printProviders.printify.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cosmic-light">Avg Fulfillment:</span>
                <span className="text-cosmic-glow">{analyticsData.printProviders.printify.avgFulfillmentTime} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: {
  title: string;
  value: string;
  icon: string;
  trend?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-cosmic-nebula/30 backdrop-blur-sm border border-cosmic-aura rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className="text-sm text-green-400">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-cosmic-light text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-cosmic-glow">{value}</p>
    </motion.div>
  );
}