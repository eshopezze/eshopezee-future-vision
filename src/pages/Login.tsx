import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Mail, Lock } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            const redirect = searchParams.get("redirect");
            if (redirect === 'checkout') {
                // Redirect to home with cart open, user can then proceed to checkout
                navigate('/?cart=open');
            } else if (redirect) {
                window.location.href = redirect;
            } else {
                navigate(-1); // Go back to previous page or home
            }
        } catch (err) {
            // Error handled in AuthContext with toast
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-6 pt-24 bg-gradient-to-b from-background to-secondary/10">
                <div className="w-full max-w-md space-y-8 bg-white border border-border/50 p-10 rounded-[2.5rem] shadow-xl shadow-primary/5 animate-scale-in relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                    <div className="text-center space-y-3 relative z-10">
                        <h1 className="font-heading text-4xl lg:text-5xl font-black tracking-tighter text-foreground">Welcome Back</h1>
                        <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">Privilege Collection ID</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl border border-border/50 bg-secondary/5 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-foreground placeholder:text-muted-foreground/30"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full py-8 text-base font-black tracking-[0.2em] uppercase rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all border-b-4 border-primary/30 active:border-b-0 active:translate-y-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                "Authenticate"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm font-bold text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:underline underline-offset-4">
                            Create one
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
