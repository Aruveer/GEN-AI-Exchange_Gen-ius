import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Package, Truck, CheckCircle, Clock, User } from "lucide-react";
import { sampleOrders, Order } from "@/data/sampleData";
import Chatbot from "@/components/Chatbot";

const Orders = () => {
  const [orders] = useState<Order[]>(sampleOrders);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "in_progress":
        return "bg-saffron/20 text-saffron border-saffron/30";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pending Approval";
      case "accepted":
        return "Artisan Accepted";
      case "in_progress":
        return "In Progress";
      case "shipped":
        return "Shipped";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const OrderTimeline = ({ order }: { order: Order }) => {
    const steps = [
      { key: "pending", label: "Request Sent", icon: <CalendarDays className="w-4 h-4" /> },
      { key: "accepted", label: "Artisan Accepted", icon: <User className="w-4 h-4" /> },
      { key: "in_progress", label: "In Progress", icon: <Package className="w-4 h-4" /> },
      { key: "shipped", label: "Shipped", icon: <Truck className="w-4 h-4" /> },
      { key: "completed", label: "Delivered", icon: <CheckCircle className="w-4 h-4" /> },
    ];

    const statusIndex = steps.findIndex(step => step.key === order.status);

    return (
      <div className="flex items-center justify-between w-full overflow-x-auto pb-4">
        {steps.map((step, index) => {
          const isCompleted = index <= statusIndex;
          const isCurrent = index === statusIndex;

          return (
            <div key={step.key} className="flex flex-col items-center min-w-0 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isCompleted 
                  ? isCurrent 
                    ? "bg-gradient-accent border-gold text-accent-foreground animate-glow-pulse"
                    : "bg-primary border-primary text-primary-foreground"
                  : "bg-muted border-border text-muted-foreground"
              }`}>
                {step.icon}
              </div>
              <span className={`mt-2 text-xs font-medium text-center ${
                isCompleted ? "text-foreground" : "text-muted-foreground"
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${
                  isCompleted && index < statusIndex ? "bg-primary" : "bg-border"
                }`} style={{ transform: `translateX(${50 / steps.length}%)`, width: `${100 / steps.length}%` }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="artisan-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Product Image */}
          <div className="w-full lg:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={order.product.image}
              alt={order.product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Order Details */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-serif font-semibold text-lg text-foreground">
                  {order.customDescription || order.product.name}
                </h3>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{getStatusText(order.status)}</span>
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Artisan: {order.product.artisan.name}</span>
                <span>•</span>
                <span>Order #{order.id}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative py-4">
              <OrderTimeline order={order} />
            </div>

            {/* Dates */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <CalendarDays className="w-4 h-4" />
                <span>Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              {order.estimatedDelivery && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  <span>Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ongoingOrders = orders.filter(order => order.status !== "completed");
  const pastOrders = orders.filter(order => order.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Orders
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your custom creations from concept to completion
          </p>
        </div>

        {/* Orders Tabs */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="ongoing" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="ongoing" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Ongoing Orders ({ongoingOrders.length})</span>
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Past Orders ({pastOrders.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ongoing" className="space-y-6">
              {ongoingOrders.length > 0 ? (
                ongoingOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <Card className="artisan-card">
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                      No ongoing orders
                    </h3>
                    <p className="text-muted-foreground">
                      Start creating your dream product with our AI co-creation tool!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastOrders.length > 0 ? (
                pastOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <Card className="artisan-card">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                      No completed orders yet
                    </h3>
                    <p className="text-muted-foreground">
                      Your completed orders will appear here once delivered.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Orders;