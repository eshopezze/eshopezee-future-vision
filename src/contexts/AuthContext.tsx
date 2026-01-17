import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    createCustomerAccessToken,
    createCustomer,
    getCustomer,
    recoverCustomerPassword,
    type ShopifyCustomer
} from "@/lib/shopifyClient";
import { toast } from "sonner";

interface AuthContextType {
    user: ShopifyCustomer | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (input: Parameters<typeof createCustomer>[0]) => Promise<void>;
    logout: () => void;
    recoverPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<ShopifyCustomer | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("shopify_customer_token"));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (token && !user) {
                setLoading(true);
                try {
                    const userData = await getCustomer(token);
                    if (userData) {
                        setUser(userData);
                    } else {
                        // Token expired or invalid
                        logout();
                    }
                } catch (error) {
                    console.error("Auth initialization error:", error);
                    logout();
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUser();
    }, [token, user]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const accessToken = await createCustomerAccessToken(email, password);
            setToken(accessToken);
            localStorage.setItem("shopify_customer_token", accessToken);
            const userData = await getCustomer(accessToken);
            setUser(userData);
            toast.success(`Welcome back, ${userData?.firstName || "Customer"}!`);
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error instanceof Error ? error.message : "Invalid email or password");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (input: Parameters<typeof createCustomer>[0]) => {
        setLoading(true);
        try {
            await createCustomer(input);
            // Automatically login after registration
            await login(input.email, input.password);
            toast.success("Account created successfully!");
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create account");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const recoverPassword = async (email: string) => {
        setLoading(true);
        try {
            await recoverCustomerPassword(email);
            toast.success("If an account exists with this email/phone, you will receive a reset link.");
        } catch (error) {
            console.error("Recovery error:", error);
            // Don't reveal if user exists or not for security, but usually Shopify errs if not found.
            // But good practice is to always show success. 
            // However shopify throws error so we might show it if meaningful.
            toast.error(error instanceof Error ? error.message : "Failed to send reset email");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("shopify_customer_token");
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                recoverPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
