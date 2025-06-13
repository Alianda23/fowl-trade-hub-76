
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, TrendingUp, Users, Package, ShoppingCart, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  salesReport: {
    totalSales: number;
    totalOrders: number;
    avgOrderValue: number;
    monthlySales: Array<{ month: string; sales: number; orders: number }>;
  };
  userReport: {
    totalUsers: number;
    totalSellers: number;
    newUsersThisMonth: number;
    userGrowth: Array<{ month: string; users: number; sellers: number }>;
  };
  productReport: {
    totalProducts: number;
    topCategories: Array<{ category: string; count: number; percentage: number }>;
    lowStockProducts: Array<{ name: string; stock: number; category: string }>;
  };
  sellerReport: {
    activeSellers: number;
    pendingSellers: number;
    topSellers: Array<{ name: string; sales: number; products: number }>;
  };
  systemReport: {
    totalMessages: number;
    unreadMessages: number;
    systemUptime: string;
    storageUsed: string;
  };
  recentActivity: Array<{ description: string; time: string }>;
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/reports/data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const result = await response.json();
      console.log("Report data response:", result);
      
      if (result.success) {
        setReportData(result.data);
      } else {
        console.error("Failed to fetch report data:", result.message);
        toast({
          title: "Error",
          description: "Failed to load report data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const key = header.toLowerCase().replace(/\s+/g, '');
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

  const handleSalesReportDownload = () => {
    if (!reportData) return;
    
    const salesData = reportData.salesReport.monthlySales.map(item => ({
      month: item.month,
      sales: item.sales,
      orders: item.orders
    }));
    
    downloadCSV(salesData, 'sales_report', ['Month', 'Sales', 'Orders']);
  };

  const handleUsersReportDownload = () => {
    if (!reportData) return;
    
    const userData = reportData.userReport.userGrowth.map(item => ({
      month: item.month,
      users: item.users,
      sellers: item.sellers
    }));
    
    downloadCSV(userData, 'users_report', ['Month', 'Users', 'Sellers']);
  };

  const handleProductsReportDownload = () => {
    if (!reportData) return;
    
    const productData = [
      ...reportData.productReport.topCategories.map(item => ({
        type: 'Category',
        name: item.category,
        count: item.count,
        percentage: `${item.percentage}%`
      })),
      ...reportData.productReport.lowStockProducts.map(item => ({
        type: 'Low Stock',
        name: item.name,
        count: item.stock,
        percentage: item.category
      }))
    ];
    
    downloadCSV(productData, 'products_report', ['Type', 'Name', 'Count', 'Percentage']);
  };

  const handleSellersReportDownload = () => {
    if (!reportData) return;
    
    const sellerData = reportData.sellerReport.topSellers.map(item => ({
      name: item.name,
      sales: item.sales,
      products: item.products
    }));
    
    downloadCSV(sellerData, 'sellers_report', ['Name', 'Sales', 'Products']);
  };

  const handleSystemReportDownload = () => {
    if (!reportData) return;
    
    const systemData = [
      {
        metric: 'Total Messages',
        value: reportData.systemReport.totalMessages
      },
      {
        metric: 'Unread Messages',
        value: reportData.systemReport.unreadMessages
      },
      {
        metric: 'System Uptime',
        value: reportData.systemReport.systemUptime
      },
      {
        metric: 'Storage Used',
        value: reportData.systemReport.storageUsed
      }
    ];
    
    downloadCSV(systemData, 'system_report', ['Metric', 'Value']);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Failed to Load Reports</h2>
          <p className="text-gray-600 mb-4">Unable to fetch report data from the server.</p>
          <Button onClick={fetchReportData}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Reports</h1>
        <p className="text-gray-600">Download comprehensive reports for analysis</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KShs {reportData.salesReport.totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{reportData.salesReport.totalOrders} orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.userReport.totalUsers}</div>
                <p className="text-xs text-muted-foreground">{reportData.userReport.totalSellers} sellers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.productReport.totalProducts}</div>
                <p className="text-xs text-muted-foreground">across categories</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.systemReport.totalMessages}</div>
                <p className="text-xs text-muted-foreground">{reportData.systemReport.unreadMessages} unread</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Download Options</CardTitle>
              <CardDescription>Download key reports quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button onClick={handleSalesReportDownload} className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Sales Report
                </Button>
                <Button onClick={handleUsersReportDownload} className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Users Report
                </Button>
                <Button onClick={handleProductsReportDownload} className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Products Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>Download detailed sales and order data</CardDescription>
              </div>
              <Button onClick={handleSalesReportDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-600">KShs {reportData.salesReport.totalSales.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{reportData.salesReport.totalOrders}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">KShs {reportData.salesReport.avgOrderValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Avg Order Value</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                The CSV export includes monthly sales data, order counts, and revenue trends for the past 6 months.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Report */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Users Report</CardTitle>
                <CardDescription>Download user registration and growth data</CardDescription>
              </div>
              <Button onClick={handleUsersReportDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{reportData.userReport.totalUsers}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-600">{reportData.userReport.totalSellers}</div>
                  <div className="text-sm text-gray-600">Total Sellers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{reportData.userReport.newUsersThisMonth}</div>
                  <div className="text-sm text-gray-600">New This Month</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                The CSV export includes monthly user registration data and seller onboarding trends.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Report */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Products Report</CardTitle>
                <CardDescription>Download product categories and inventory data</CardDescription>
              </div>
              <Button onClick={handleProductsReportDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-sage-600">{reportData.productReport.totalProducts}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                
                {reportData.productReport.lowStockProducts.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Low Stock Alert</h4>
                    <p className="text-sm text-red-600">
                      {reportData.productReport.lowStockProducts.length} products are running low on stock
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                The CSV export includes product categories, stock levels, and low inventory alerts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sellers Report */}
        <TabsContent value="sellers" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sellers Report</CardTitle>
                <CardDescription>Download seller performance and status data</CardDescription>
              </div>
              <Button onClick={handleSellersReportDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{reportData.sellerReport.activeSellers}</div>
                  <div className="text-sm text-gray-600">Active Sellers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{reportData.sellerReport.pendingSellers}</div>
                  <div className="text-sm text-gray-600">Pending Approval</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                The CSV export includes top-performing sellers, sales data, and product counts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Report */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Report</CardTitle>
                <CardDescription>Download system metrics and performance data</CardDescription>
              </div>
              <Button onClick={handleSystemReportDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{reportData.systemReport.totalMessages}</div>
                  <div className="text-sm text-gray-600">Total Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{reportData.systemReport.unreadMessages}</div>
                  <div className="text-sm text-gray-600">Unread Messages</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">System Health</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Uptime: <span className="font-medium">{reportData.systemReport.systemUptime}</span></div>
                  <div>Storage: <span className="font-medium">{reportData.systemReport.storageUsed}</span></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                The CSV export includes system metrics, uptime data, and storage usage information.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
