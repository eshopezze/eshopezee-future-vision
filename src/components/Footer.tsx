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
    <footer className="relative border-t border-border/30 pt-24 pb-12 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-heading font-bold text-primary-foreground text-lg group-hover:shadow-[0_0_20px_hsla(175,100%,50%,0.5)] transition-all duration-300">
                E
              </div>
              <span className="font-heading font-bold text-xl tracking-wider">
                <span className="text-primary group-hover:text-glow-subtle transition-all">ESHOP</span>
                <span className="text-secondary ml-1">EZEE</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm">
              The future of online shopping. Experience AI-powered recommendations,
              seamless checkout, and unbeatable deals.
            </p>
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Join our newsletter</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing!");
                }}
                className="flex gap-2 p-1 rounded-2xl bg-muted/50 border border-border/50 focus-within:border-primary/50 transition-all max-w-md"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                />
                <Button type="submit" variant="hero" className="rounded-xl px-5 hover:transform-none transition-none text-sm">Subscribe</Button>
              </form>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-heading font-bold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-heading font-bold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information Column */}
          <div>
            <h4 className="font-heading font-bold text-foreground mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">info@eshopezee.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Eshopezee. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
