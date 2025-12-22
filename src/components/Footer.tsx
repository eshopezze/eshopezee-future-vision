import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  shop: [
    { name: "All Products", href: "#" },
    { name: "Trending", href: "#" },
    { name: "On Sale", href: "#" },
    { name: "New Arrivals", href: "#" },
  ],
  support: [
    { name: "Contact Us", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Shipping Info", href: "#" },
    { name: "Returns", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
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
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-heading font-bold text-primary-foreground text-lg group-hover:shadow-[0_0_20px_hsla(175,100%,50%,0.5)] transition-all duration-300">
                E
              </div>
              <span className="font-heading font-bold text-xl tracking-wider">
                <span className="text-primary group-hover:text-glow-subtle transition-all">ESHOP</span>
                <span className="text-secondary ml-1">EZEE</span>
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              The future of online shopping. Experience AI-powered recommendations,
              seamless checkout, and unbeatable deals.
            </p>
            {/* Newsletter */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Join our futuristic newsletter</p>
              <div className="flex gap-2 p-1 rounded-2xl bg-muted/50 border border-border/50 focus-within:border-primary/50 transition-all max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                />
                <Button variant="hero" className="rounded-xl px-6">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-heading font-bold text-foreground mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">info@eshopezee.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">Mumbai, Maharashtra, India</span>
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
