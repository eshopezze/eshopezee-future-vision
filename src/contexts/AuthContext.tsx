import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    createCustomerAccessToken,
    createCustomer,
    getCustomer,
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
