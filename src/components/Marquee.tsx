import { Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const items = [
    { icon: Truck, text: "Free Shipping on Orders Over ₹999" },
    { icon: ShieldCheck, text: "Secure Payment Processing" },
    { icon: Clock, text: "24/7 Customer Support" },
    { icon: CreditCard, text: "Easy Returns & Refunds" },
];

export const Marquee = () => {
    return (
        <div className="relative overflow-hidden bg-primary/5 border-y border-primary/10 py-6">
            <div className="flex">
                <motion.div
                    className="flex gap-16 md:gap-32 items-center whitespace-nowrap px-8"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20,
                    }}
                >
                    {/* Double the items to create seamless loop */}
                    {[...items, ...items, ...items, ...items].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                            <item.icon className="w-6 h-6 text-primary" />
                            <span className="font-heading text-lg font-medium text-foreground">{item.text}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
