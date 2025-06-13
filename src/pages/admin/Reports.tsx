
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    const salesData = [
      { month: 'January', sales: 45000, orders: 23 },
      { month: 'February', sales: 52000, orders: 28 },
      { month: 'March', sales: 38000, orders: 19 },
      { month: 'April', sales: 67000, orders: 34 },
      { month: 'May', sales: 58000, orders: 31 },
      { month: 'June', sales: 71000, orders: 37 }
    ];
    
    downloadCSV(salesData, 'sales_report', ['Month', 'Sales', 'Orders']);
  };

  const handleUsersReportDownload = () => {
    const userData = [
      { month: 'January', users: 12, sellers: 3 },
      { month: 'February', users: 8, sellers: 2 },
      { month: 'March', users: 15, sellers: 4 },
      { month: 'April', users: 21, sellers: 6 },
      { month: 'May', users: 18, sellers: 5 },
      { month: 'June', users: 25, sellers: 8 }
    ];
    
    downloadCSV(userData, 'users_report', ['Month', 'Users', 'Sellers']);
  };

  const handleProductsReportDownload = () => {
    const productData = [
      { category: 'Live Poultry', count: 45, percentage: '35%' },
      { category: 'Poultry Feed', count: 32, percentage: '25%' },
      { category: 'Equipment', count: 28, percentage: '22%' },
      { category: 'Supplements', count: 23, percentage: '18%' }
    ];
    
    downloadCSV(productData, 'products_report', ['Category', 'Count', 'Percentage']);
  };

  const handleOrdersReportDownload = () => {
    const orderData = [
      { month: 'January', orders: 23, value: 45000, status: 'Completed' },
      { month: 'February', orders: 28, value: 52000, status: 'Completed' },
      { month: 'March', orders: 19, value: 38000, status: 'Completed' },
      { month: 'April', orders: 34, value: 67000, status: 'Completed' },
      { month: 'May', orders: 31, value: 58000, status: 'Completed' },
      { month: 'June', orders: 37, value: 71000, status: 'Completed' }
    ];
    
    downloadCSV(orderData, 'orders_report', ['Month', 'Orders', 'Value', 'Status']);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Reports</h1>
        <p className="text-gray-600">Download comprehensive reports for analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Report */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-sage-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Sales Report</CardTitle>
                <CardDescription>Monthly sales and revenue data</CardDescription>
              </div>
            </div>
            <Button onClick={handleSalesReportDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Export sales data including monthly revenue, order counts, and performance trends.
            </p>
          </CardContent>
        </Card>

        {/* Users Report */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Users Report</CardTitle>
                <CardDescription>User registration and growth data</CardDescription>
              </div>
            </div>
            <Button onClick={handleUsersReportDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Export user registration data including new signups and seller onboarding.
            </p>
          </CardContent>
        </Card>

        {/* Products Report */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Products Report</CardTitle>
                <CardDescription>Product categories and inventory</CardDescription>
              </div>
            </div>
            <Button onClick={handleProductsReportDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Export product data including categories, stock levels, and distribution.
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
                <CardDescription>Order history and transaction data</CardDescription>
              </div>
            </div>
            <Button onClick={handleOrdersReportDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Export order data including transaction history, order values, and status tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
