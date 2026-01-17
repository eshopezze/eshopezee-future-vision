import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const footerLinks = {
  quickLinks: [
    { name: "Privacy Policy", href: "/policies/privacy-policy" },
    { name: "Refund Policy", href: "/policies/refund-policy" },
    { name: "Shipping Policy", href: "/policies/shipping-policy" },
    { name: "Order Tracking", href: "/profile" },
    { name: "Terms of Service", href: "/policies/terms-of-service" },
  ],
  shop: [
    { name: "All Products", href: "/products" },
    { name: "Trending", href: "/collection/trending-product" },
    { name: "On Sale", href: "/products" },
    { name: "New Arrivals", href: "/collection/electronics" },
  ]
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export const Footer = () => {
  return (
    <footer className="relative bg-card pt-24 pb-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -mr-64 -mt-64" />
      <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10 text-foreground">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-heading font-bold text-primary-foreground text-lg group-hover:scale-105 transition-all duration-300">
                E
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground uppercase">
                ESHOP<span className="text-primary">EZEE</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed font-medium">
              Curating the finest artisanal experiences for the modern privilege lifestyle.
              Timeless quality, meticulous textures, and dedicated craftsmanship.
            </p>
            {/* Newsletter */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] pl-1">Join the Privilege List</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Welcome to the Heritage Collection!");
                }}
                className="flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-primary/50 transition-all max-w-md"
              >
                <input
                  type="email"
                  placeholder="Your privilege email"
                  required
                  className="flex-1 px-4 py-2 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none text-sm font-bold"
                />
                <Button type="submit" size="sm" className="rounded-xl px-6 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">Sign Up</Button>
              </form>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-heading font-bold text-foreground text-xs uppercase tracking-widest mb-6 px-1">Shop</h4>
            <ul className="space-y-3 px-1">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-heading font-bold text-foreground text-xs uppercase tracking-widest mb-6 px-1">Quick Links</h4>
            <ul className="space-y-3 px-1">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information Column */}
          <div>
            <h4 className="font-heading font-bold text-foreground text-xs uppercase tracking-widest mb-6 px-1">Contact</h4>
            <ul className="space-y-4 px-1">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm font-medium">hello@eshopezee.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm font-medium">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm font-medium leading-tight">Corporate Office, BKC,<br />Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Eshopezee. Premium Privilege.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground/60 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
