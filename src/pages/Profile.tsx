import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Package,
    MapPin,
    Settings,
    LogOut,
    ChevronRight,
    Clock,
    CreditCard,
    ExternalLink,
    ShieldCheck,
    Plus,
    Loader2,
    AlertCircle,
    X,
    Truck,
    Trash2,
    Edit3
} from "lucide-react";
import {
    type ShopifyOrder,
    type ShopifyAddress,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress
} from "@/lib/shopifyClient";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
];

const Profile = () => {
    const { user, token, logout, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<ShopifyAddress | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const handleAddressSubmit = async (formData: any) => {
        if (!token) return;
        setIsActionLoading(true);
        try {
            if (editingAddress) {
                await updateCustomerAddress(token, editingAddress.id, formData);
                toast.success("Address updated successfully");
            } else {
                await createCustomerAddress(token, formData);
                toast.success("New address added");
            }
            setIsAddressModalOpen(false);
            setEditingAddress(null);
            // We should ideally refresh the user data here, but for now we assume the session handles it or user manually refreshes.
            // In a real app, you'd use a state management library or re-fetch from useAuth.
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || "Failed to save address");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!token || !confirm("Are you sure you want to delete this address?")) return;
        setIsActionLoading(true);
        try {
            await deleteCustomerAddress(token, addressId);
            toast.success("Address deleted");
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete address");
        } finally {
            setIsActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col pt-32 items-center justify-center p-6">
                <Navbar />
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-muted-foreground animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col pt-24 items-center justify-center p-6">
                <Navbar />
                <div className="text-center space-y-4 glass p-12 rounded-3xl max-w-md">
                    <ShieldCheck className="w-16 h-16 text-primary mx-auto opacity-50" />
                    <h1 className="text-2xl font-black">Authentication Required</h1>
                    <p className="text-muted-foreground font-medium">Please log in to view your profile and orders.</p>
                    <Button variant="hero" onClick={() => window.location.href = '/login'}>Log In</Button>
                </div>
            </div>
        );
    }

    const orders = user.orders?.edges.map(e => e.node) || [];
    const addresses = user.addresses?.edges.map(e => e.node) || [];

    const getOrderHeader = (order: ShopifyOrder) => {
        const items = order.lineItems.edges;
        if (items.length === 0) return `Order #${order.orderNumber}`;
        const firstItem = items[0].node.title;
        if (items.length === 1) return firstItem;
        return `${firstItem} & ${items.length - 1} other item${items.length > 2 ? 's' : ''}`;
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-20 bg-gradient-to-b from-background to-primary/5">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar Navigation */}
                        <aside className="lg:w-1/4 space-y-8">
                            <div className="glass p-6 rounded-3xl space-y-6">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-20 h-20 rounded-[1.75rem] bg-primary/10 text-primary flex items-center justify-center font-black text-3xl border border-primary/20 shadow-sm capitalize">
                                        {user.firstName[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-xl font-black text-foreground truncate tracking-tighter">{user.firstName} {user.lastName}</h2>
                                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] truncate">Privilege Member</p>
                                    </div>
                                </div>

                                <nav className="flex flex-col gap-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all duration-300",
                                                activeTab === tab.id
                                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                                    : "text-muted-foreground/70 hover:bg-primary/5 hover:text-primary"
                                            )}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all mt-4"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Log Out
                                    </button>
                                </nav>
                            </div>

                            <div className="glass p-6 rounded-3xl bg-primary/5 border-primary/10">
                                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Account Status</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm font-bold text-foreground">Verified Customer</span>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="flex-1 min-h-[500px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    {activeTab === "overview" && (
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h1 className="text-4xl font-black tracking-tight">Overview</h1>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-white p-8 rounded-[2rem] space-y-3 border border-border/50 shadow-sm relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12" />
                                                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Total Orders</p>
                                                    <p className="text-5xl font-black text-primary tracking-tighter">{orders.length}</p>
                                                </div>
                                                <div className="bg-white p-8 rounded-[2rem] space-y-3 border border-border/50 shadow-sm relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -mr-12 -mt-12" />
                                                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Saved Addresses</p>
                                                    <p className="text-5xl font-black text-secondary tracking-tighter">{addresses.length}</p>
                                                </div>
                                                <div className="bg-white p-8 rounded-[2rem] space-y-3 border border-border/50 shadow-sm relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -mr-12 -mt-12" />
                                                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Membership Tier</p>
                                                    <p className="text-2xl font-black text-accent tracking-tighter flex items-center gap-2">Privilege Elite <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /></p>
                                                </div>
                                            </div>

                                            <div className="glass p-8 rounded-3xl space-y-6">
                                                <h3 className="text-xl font-bold">Personal Information</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Full Name</p>
                                                        <p className="font-bold">{user.firstName} {user.lastName}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Email Address</p>
                                                        <p className="font-bold">{user.email}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Phone</p>
                                                        <p className="font-bold">{user.phone || "Not provided"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "orders" && (
                                        <div className="space-y-8">
                                            <h1 className="text-4xl font-black tracking-tight">Order History</h1>
                                            {orders.length > 0 ? (
                                                <div className="space-y-4">
                                                    {orders.map((order) => {
                                                        const isExpanded = expandedOrderId === order.id;
                                                        return (
                                                            <div key={order.id} className={cn(
                                                                "bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden",
                                                                isExpanded ? "border-primary/30 shadow-xl shadow-primary/5 bg-gradient-to-br from-primary/[0.02] to-transparent" : "border-border/50 hover:border-primary/20 shadow-sm"
                                                            )}>
                                                                {/* Accordion Header */}
                                                                <button
                                                                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                                                    className="w-full text-left p-6 flex flex-col md:flex-row items-center gap-6"
                                                                >
                                                                    <div className="flex-1 flex items-center gap-6 min-w-0 w-full">
                                                                        <div className="relative w-16 h-16 shrink-0 group/image">
                                                                            {(() => {
                                                                                const uniqueImages = Array.from(new Set(
                                                                                    order.lineItems.edges
                                                                                        .map(e => e.node.variant?.image?.url || e.node.variant?.product?.featuredImage?.url)
                                                                                        .filter(Boolean)
                                                                                )).slice(0, 3);

                                                                                if (uniqueImages.length === 0) {
                                                                                    return (
                                                                                        <div className={cn(
                                                                                            "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300",
                                                                                            isExpanded ? "bg-primary text-primary-foreground" : "bg-secondary/20 text-secondary"
                                                                                        )}>
                                                                                            <Package className="w-8 h-8" />
                                                                                        </div>
                                                                                    );
                                                                                }

                                                                                return (
                                                                                    <div className="relative w-full h-full">
                                                                                        {uniqueImages.map((img, idx) => (
                                                                                            <motion.div
                                                                                                key={img}
                                                                                                initial={false}
                                                                                                animate={{
                                                                                                    x: isExpanded ? idx * 6 : idx * 8,
                                                                                                    y: isExpanded ? -idx * 4 : -idx * 6,
                                                                                                    rotate: isExpanded ? (idx - 1) * 3 : (idx - 1) * 6,
                                                                                                    scale: 1 - (idx * 0.05)
                                                                                                }}
                                                                                                style={{ zIndex: 10 - idx }}
                                                                                                className="absolute inset-0 rounded-2xl border-2 border-background overflow-hidden shadow-lg bg-secondary/10"
                                                                                            >
                                                                                                <img
                                                                                                    src={img}
                                                                                                    alt=""
                                                                                                    className="w-full h-full object-cover"
                                                                                                />
                                                                                            </motion.div>
                                                                                        ))}
                                                                                    </div>
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <h4 className={cn(
                                                                                "font-black text-lg truncate transition-colors duration-300",
                                                                                isExpanded ? "text-primary" : "text-foreground"
                                                                            )}>
                                                                                {getOrderHeader(order)}
                                                                            </h4>
                                                                            <p className="text-xs text-muted-foreground font-medium">
                                                                                Order #{order.orderNumber} • {new Date(order.processedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
                                                                        <div className="text-right">
                                                                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/50">Total Paid</p>
                                                                            <p className="font-black text-foreground text-base tracking-tight">{order.totalPrice.amount} {order.totalPrice.currencyCode}</p>
                                                                        </div>
                                                                        <span className={cn(
                                                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                                            order.fulfillmentStatus === 'FULFILLED' ? "bg-primary/10 text-primary border border-primary/10" : "bg-accent/10 text-accent border border-accent/10"
                                                                        )}>
                                                                            {order.fulfillmentStatus.replace('_', ' ')}
                                                                        </span>
                                                                        <div className={cn(
                                                                            "p-2.5 rounded-xl transition-all duration-500",
                                                                            isExpanded ? "bg-primary text-white rotate-90 shadow-lg shadow-primary/30 scale-110" : "bg-primary/5 text-primary border border-primary/10"
                                                                        )}>
                                                                            <ChevronRight className="w-4 h-4" />
                                                                        </div>
                                                                    </div>
                                                                </button>

                                                                {/* Accordion Content */}
                                                                <AnimatePresence>
                                                                    {isExpanded && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                                                        >
                                                                            <div className="px-6 pb-8 border-t border-primary/10 space-y-10 pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                                                                {/* Status Grid */}
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                                                                    <div className="glass p-4 rounded-2xl space-y-1 bg-background/50">
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Date</p>
                                                                                        <p className="font-bold text-sm">{new Date(order.processedAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                                                    </div>
                                                                                    <div className="glass p-4 rounded-2xl space-y-1 bg-background/50">
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Status</p>
                                                                                        <p className="font-bold text-sm capitalize">{order.financialStatus.toLowerCase()}</p>
                                                                                    </div>
                                                                                    <div className="glass p-4 rounded-2xl space-y-1 bg-background/50">
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Shipping Status</p>
                                                                                        <p className="font-bold text-sm text-primary capitalize">{order.fulfillmentStatus.replace('_', ' ').toLowerCase()}</p>
                                                                                    </div>
                                                                                    <div className="glass p-4 rounded-2xl space-y-1 bg-background/50">
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Paid</p>
                                                                                        <p className="font-bold text-sm text-secondary">{order.totalPrice.amount} {order.totalPrice.currencyCode}</p>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Shipment Tracking */}
                                                                                {order.successfulFulfillments && order.successfulFulfillments.length > 0 && (
                                                                                    <div className="space-y-4">
                                                                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                                                            <Truck className="w-3 h-3" />
                                                                                            Shipment Tracking
                                                                                        </h3>
                                                                                        <div className="space-y-3">
                                                                                            {order.successfulFulfillments.map((fulfillment, fIdx) => (
                                                                                                fulfillment.trackingInfo.map((info, tIdx) => (
                                                                                                    <div key={`${fIdx}-${tIdx}`} className="glass p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 border-primary/10">
                                                                                                        <div className="flex items-center gap-4">
                                                                                                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                                                                                                <Truck className="w-6 h-6 text-primary" />
                                                                                                            </div>
                                                                                                            <div>
                                                                                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Carrier: {fulfillment.trackingCompany || 'Standard Shipping'}</p>
                                                                                                                <p className="font-bold text-base">Tracking: {info.number}</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {info.url && (
                                                                                                            <Button
                                                                                                                variant="hero"
                                                                                                                size="sm"
                                                                                                                onClick={(e) => {
                                                                                                                    e.stopPropagation();
                                                                                                                    window.open(info.url, '_blank');
                                                                                                                }}
                                                                                                                className="w-full md:w-auto px-8"
                                                                                                            >
                                                                                                                Track Shipment
                                                                                                                <ExternalLink className="w-4 h-4 ml-2" />
                                                                                                            </Button>
                                                                                                        )}
                                                                                                    </div>
                                                                                                ))
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                                                    {/* Item List */}
                                                                                    <div className="space-y-4">
                                                                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                                                            <Package className="w-3 h-3" />
                                                                                            Items In This Order
                                                                                        </h3>
                                                                                        <div className="space-y-3">
                                                                                            {order.lineItems.edges.map((edge, idx) => (
                                                                                                <div key={idx} className="flex gap-4 p-4 rounded-2xl glass bg-background/30 border-transparent hover:border-primary/20 transition-all group">
                                                                                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-border/20">
                                                                                                        {edge.node.variant?.image?.url || edge.node.variant?.product?.featuredImage?.url ? (
                                                                                                            <img
                                                                                                                src={edge.node.variant?.image?.url || edge.node.variant?.product?.featuredImage?.url}
                                                                                                                alt={edge.node.title}
                                                                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                                                            />
                                                                                                        ) : (
                                                                                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-bold">No Image</div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                                                                                                        <p className="font-black text-sm group-hover:text-primary transition-colors duration-300">{edge.node.title}</p>
                                                                                                        <div className="flex items-center gap-3 mt-1">
                                                                                                            <p className="text-xs text-muted-foreground font-bold">Qty: {edge.node.quantity}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Summary & Shipping */}
                                                                                    <div className="space-y-8">
                                                                                        {order.shippingAddress && (
                                                                                            <div className="space-y-4">
                                                                                                <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                                                                    <MapPin className="w-3 h-3" />
                                                                                                    Shipping Details
                                                                                                </h3>
                                                                                                <div className="glass p-6 rounded-3xl space-y-1 font-medium text-sm bg-background/30 border-primary/5">
                                                                                                    <p className="font-black text-foreground text-base mb-1">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                                                                                    <p>{order.shippingAddress.address1}</p>
                                                                                                    {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                                                                                                    <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}</p>
                                                                                                    <p>{order.shippingAddress.country}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}

                                                                                        <div className="space-y-4">
                                                                                            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                                                                <CreditCard className="w-3 h-3" />
                                                                                                Payment Summary
                                                                                            </h3>
                                                                                            <div className="glass p-6 rounded-3xl space-y-4 bg-background/30 border-primary/5">
                                                                                                <div className="flex justify-between text-sm font-bold">
                                                                                                    <span className="text-muted-foreground">Subtotal</span>
                                                                                                    <span>{order.subtotalPrice?.amount} {order.subtotalPrice?.currencyCode}</span>
                                                                                                </div>
                                                                                                <div className="flex justify-between text-sm font-bold">
                                                                                                    <span className="text-muted-foreground">Shipping Cost</span>
                                                                                                    <span>{order.totalShippingPrice?.amount} {order.totalShippingPrice?.currencyCode}</span>
                                                                                                </div>
                                                                                                <div className="flex justify-between text-sm font-bold">
                                                                                                    <span className="text-muted-foreground">Calculated Tax</span>
                                                                                                    <span>{order.totalTax?.amount} {order.totalTax?.currencyCode}</span>
                                                                                                </div>
                                                                                                <div className="pt-4 border-t border-primary/10 flex justify-between font-black text-xl text-primary">
                                                                                                    <span>Grand Total</span>
                                                                                                    <span>{order.totalPrice.amount} {order.totalPrice.currencyCode}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-20 glass rounded-3xl">
                                                    <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                    <p className="text-muted-foreground font-bold italic">No orders found yet.</p>
                                                    <Button variant="link" onClick={() => window.location.href = '/products'}>Start Shopping</Button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "addresses" && (
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h1 className="text-4xl font-black tracking-tight">Addresses</h1>
                                                <Button
                                                    variant="hero"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingAddress(null);
                                                        setIsAddressModalOpen(true);
                                                    }}
                                                    className="rounded-2xl"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add New
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {addresses.length > 0 ? (
                                                    addresses.map((addr) => (
                                                        <div key={addr.id} className="glass p-8 rounded-3xl space-y-4 hover:border-primary/40 transition-all group relative overflow-hidden">
                                                            <div className="flex items-center gap-2 text-primary">
                                                                <MapPin className="w-4 h-4" />
                                                                <span className="text-xs font-black uppercase tracking-widest">Saved Address</span>
                                                            </div>
                                                            <div className="space-y-1 font-medium">
                                                                <p className="text-lg font-black group-hover:text-primary transition-colors">{addr.firstName} {addr.lastName}</p>
                                                                <p className="text-muted-foreground">{addr.address1}</p>
                                                                {addr.address2 && <p className="text-muted-foreground">{addr.address2}</p>}
                                                                <p className="text-muted-foreground">{addr.city}, {addr.province} {addr.zip}</p>
                                                                <p className="text-muted-foreground font-bold">{addr.country}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingAddress(addr);
                                                                        setIsAddressModalOpen(true);
                                                                    }}
                                                                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                                                                >
                                                                    <Edit3 className="w-3 h-3" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                                    className="flex items-center gap-2 text-xs font-bold text-destructive hover:opacity-80 transition-opacity"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-2 text-center py-20 glass rounded-3xl">
                                                        <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                        <p className="text-muted-foreground font-bold italic">No addresses saved.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Address Modal */}
            <AnimatePresence>
                {isAddressModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddressModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 relative z-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />

                            <div className="relative flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black">{editingAddress ? "Edit Address" : "Add New Address"}</h2>
                                    <p className="text-muted-foreground font-medium mt-1">Manage your shipping destination</p>
                                </div>
                                <button
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="p-3 rounded-2xl hover:bg-white/5 transition-colors border border-white/5"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                handleAddressSubmit(Object.fromEntries(formData.entries()));
                            }} className="relative space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                                        <input
                                            name="firstName"
                                            defaultValue={editingAddress?.firstName}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                                        <input
                                            name="lastName"
                                            defaultValue={editingAddress?.lastName}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Address Line 1</label>
                                    <input
                                        name="address1"
                                        defaultValue={editingAddress?.address1}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold transition-all"
                                        placeholder="123 Luxury Ave"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Address Line 2 (Optional)</label>
                                    <input
                                        name="address2"
                                        defaultValue={editingAddress?.address2 || ""}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold transition-all"
                                        placeholder="Suite 450"
                                    />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
                                        <input
                                            name="city"
                                            defaultValue={editingAddress?.city}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold transition-all"
                                            placeholder="Beverly Hills"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Province/State</label>
                                        <input
                                            name="province"
                                            defaultValue={editingAddress?.province}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold transition-all"
                                            placeholder="CA"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">ZIP Code</label>
                                        <input
                                            name="zip"
                                            defaultValue={editingAddress?.zip}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold transition-all"
                                            placeholder="90210"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Country</label>
                                        <input
                                            name="country"
                                            defaultValue={editingAddress?.country}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold transition-all"
                                            placeholder="United States"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone</label>
                                        <input
                                            name="phone"
                                            defaultValue={editingAddress?.phone || ""}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="hero"
                                    className="w-full py-8 text-lg rounded-2xl mt-8 shadow-neon relative overflow-hidden group"
                                    disabled={isActionLoading}
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        {isActionLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : editingAddress ? "Update Address" : "Save Address"}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity" />
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
