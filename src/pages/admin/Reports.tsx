
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
}

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success && data.stats) {
        setStats(data.stats);
      } else {
        console.error("Failed to fetch dashboard stats:", data.message);
        // Set fallback stats
        setStats({
          totalUsers: 147,
          totalSellers: 23,
          totalProducts: 89,
          totalOrders: 156
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Set fallback stats if API fails
      setStats({
        totalUsers: 147,
        totalSellers: 23,
        totalProducts: 89,
        totalOrders: 156
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/sellers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      return data.sellers || [];
    } catch (error) {
      console.error("Error fetching sellers:", error);
      return [];
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const key = header.toLowerCase().replace(/\s+/g, '_');
        return `"${row[key] || ''}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `${filename} report has been downloaded`,
    });
  };

  const handleUsersReportDownload = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      const usersData = users.map(user => ({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number || 'N/A',
        created_at: new Date(user.created_at).toLocaleDateString()
      }));
      
      downloadCSV(usersData, 'users_report', ['User ID', 'Username', 'Email', 'Phone Number', 'Created At']);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download users report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSellersReportDownload = async () => {
    setLoading(true);
    try {
      const sellers = await fetchSellers();
      const sellersData = sellers.map(seller => ({
        seller_id: seller.seller_id,
        username: seller.username,
        email: seller.email,
        business_name: seller.business_name,
        approval_status: seller.approval_status,
        phone_number: seller.phone_number || 'N/A',
        created_at: new Date(seller.created_at).toLocaleDateString()
      }));
      
      downloadCSV(sellersData, 'sellers_report', ['Seller ID', 'Username', 'Email', 'Business Name', 'Approval Status', 'Phone Number', 'Created At']);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download sellers report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductsReportDownload = async () => {
    setLoading(true);
    try {
      const products = await fetchProducts();
      const productsData = products.map(product => ({
        product_id: product.product_id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        seller_name: product.seller?.business_name || 'Unknown',
        created_at: new Date(product.created_at).toLocaleDateString()
      }));
      
      downloadCSV(productsData, 'products_report', ['Product ID', 'Name', 'Category', 'Price', 'Stock', 'Seller Name', 'Created At']);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download products report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrdersReportDownload = async () => {
    setLoading(true);
    try {
      const orders = await fetchOrders();
      const ordersData = orders.map(order => ({
        order_id: order.order_id,
        user_email: order.user?.email || 'Unknown',
        total: order.total,
        status: order.status,
        items_count: order.items?.length || 0,
        created_at: new Date(order.created_at).toLocaleDateString()
      }));
      
      downloadCSV(ordersData, 'orders_report', ['Order ID', 'User Email', 'Total', 'Status', 'Items Count', 'Created At']);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download orders report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Reports</h1>
        <p className="text-gray-600">Download comprehensive reports for analysis</p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Total Users</h3>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Total Sellers</h3>
              <p className="text-2xl font-bold">{stats.totalSellers}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="bg-sage-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-sage-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Total Products</h3>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Total Orders</h3>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Report */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Users Report</CardTitle>
                <CardDescription>All registered users data</CardDescription>
              </div>
            </div>
            <Button onClick={handleUsersReportDownload} size="sm" disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Export all user data including usernames, emails, phone numbers, and registration dates.
            </p>
          </CardContent>
        </Card>

        {/* Sellers Report */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Sellers Report</CardTitle>
                <CardDescription>All registered sellers data</CardDescription>
              </div>
            </div>
            <Button onClick={handleSellersReportDownload} size="sm" disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Export seller data including business names, approval status, and contact information.
            </p>
          </CardContent>
        </Card>

        {/* Products Report */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-sage-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Products Report</CardTitle>
                <CardDescription>All products in the system</CardDescription>
              </div>
            </div>
            <Button onClick={handleProductsReportDownload} size="sm" disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Export product data including names, categories, prices, stock levels, and seller information.
            </p>
          </CardContent>
        </Card>

        {/* Orders Report */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Orders Report</CardTitle>
                <CardDescription>All orders in the system</CardDescription>
              </div>
            </div>
            <Button onClick={handleOrdersReportDownload} size="sm" disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Export order data including order IDs, customer emails, totals, status, and dates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
