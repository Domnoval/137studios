import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Fetch analytics data in parallel
    const [
      orders,
      users,
      totalUsers,
      recentOrders
    ] = await Promise.all([
      // Orders in date range
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          items: true,
          user: true
        }
      }),

      // User registrations in date range
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          id: true,
          createdAt: true
        }
      }),

      // Total users count
      prisma.user.count(),

      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true
        }
      })
    ]);

    // Calculate overview metrics
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate conversion rate (orders vs users - simplified)
    const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;

    // Group revenue by day
    const dailyRevenue: { [key: string]: { amount: number; orders: number } } = {};

    orders.forEach((order: any) => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      if (!dailyRevenue[dateKey]) {
        dailyRevenue[dateKey] = { amount: 0, orders: 0 };
      }
      dailyRevenue[dateKey].amount += order.totalAmount;
      dailyRevenue[dateKey].orders += 1;
    });

    // Convert to array and sort
    const revenueDaily = Object.entries(dailyRevenue)
      .map(([date, data]) => ({
        date,
        amount: Math.round(data.amount * 100) / 100,
        orders: data.orders
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group revenue by month
    const monthlyRevenue: { [key: string]: { amount: number; orders: number } } = {};

    orders.forEach((order: any) => {
      const monthKey = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] = { amount: 0, orders: 0 };
      }
      monthlyRevenue[monthKey].amount += order.totalAmount;
      monthlyRevenue[monthKey].orders += 1;
    });

    const revenueMonthly = Object.entries(monthlyRevenue)
      .map(([month, data]) => ({
        month,
        amount: Math.round(data.amount * 100) / 100,
        orders: data.orders
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Analyze products (simplified - using order items)
    const productAnalysis: { [key: string]: { quantity: number; revenue: number } } = {};

    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        try {
          const productDetails = JSON.parse(item.productDetails || '{}');
          const key = `${productDetails.title || 'Unknown'}_${productDetails.productType || item.type}`;

          if (!productAnalysis[key]) {
            productAnalysis[key] = { quantity: 0, revenue: 0 };
          }

          productAnalysis[key].quantity += item.quantity;
          productAnalysis[key].revenue += item.price * item.quantity;
        } catch (error) {
          console.error('Error parsing product details:', error);
        }
      });
    });

    const topSelling = Object.entries(productAnalysis)
      .map(([key, data]) => {
        const [title, productType] = key.split('_');
        return {
          artworkTitle: title,
          productType: productType || 'Print',
          quantity: data.quantity,
          revenue: Math.round(data.revenue * 100) / 100
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Category breakdown (simplified)
    const categories = ['painting', 'digital', 'print', 'installation'];
    const categoryBreakdown = categories.map(category => {
      const categoryOrders = orders.filter((order: any) =>
        order.items.some((item: any) => {
          try {
            const details = JSON.parse(item.productDetails || '{}');
            return details.category === category;
          } catch {
            return false;
          }
        })
      );

      const revenue = categoryOrders.reduce((sum: number, order: any) =>
        sum + order.items.reduce((itemSum: number, item: any) => {
          try {
            const details = JSON.parse(item.productDetails || '{}');
            return details.category === category ? itemSum + (item.price * item.quantity) : itemSum;
          } catch {
            return itemSum;
          }
        }, 0), 0
      );

      return {
        category,
        count: categoryOrders.length,
        revenue: Math.round(revenue * 100) / 100
      };
    });

    // User registration analysis
    const registrationsByDate: { [key: string]: number } = {};
    users.forEach((user: any) => {
      const dateKey = user.createdAt.toISOString().split('T')[0];
      registrationsByDate[dateKey] = (registrationsByDate[dateKey] || 0) + 1;
    });

    const registrations = Object.entries(registrationsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate repeat customers (users with more than 1 order)
    const userOrderCounts: { [key: string]: number } = {};
    orders.forEach((order: any) => {
      userOrderCounts[order.userId] = (userOrderCounts[order.userId] || 0) + 1;
    });

    const repeatCustomers = Object.values(userOrderCounts).filter(count => count > 1).length;

    // Mock print provider data (would be real in production)
    const printfulOrders = Math.floor(totalOrders * 0.6);
    const printifyOrders = totalOrders - printfulOrders;

    const analyticsData = {
      overview: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalUsers,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        recentOrders: recentOrders.map((order: any) => ({
          orderNumber: order.orderNumber,
          customerName: order.user.name,
          total: Math.round(order.totalAmount * 100) / 100,
          status: order.status,
          createdAt: order.createdAt.toISOString()
        }))
      },
      revenue: {
        daily: revenueDaily,
        monthly: revenueMonthly
      },
      products: {
        topSelling,
        categoryBreakdown
      },
      users: {
        registrations,
        totalActive: totalUsers,
        repeatCustomers
      },
      printProviders: {
        printful: {
          orders: printfulOrders,
          revenue: Math.round(totalRevenue * 0.6 * 100) / 100,
          avgFulfillmentTime: 5
        },
        printify: {
          orders: printifyOrders,
          revenue: Math.round(totalRevenue * 0.4 * 100) / 100,
          avgFulfillmentTime: 7
        }
      }
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}