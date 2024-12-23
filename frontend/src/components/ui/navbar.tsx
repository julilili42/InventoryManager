import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/articles" },
  { name: "Orders", href: "/orders" },
  { name: "Customers", href: "/customers" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 border-b backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 gap-8 px-10 md:justify-start">
        {/* Markenname */}
        <div className="text-xl font-bold">React Inventory</div>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 text-muted-foreground md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-primary">
              {item.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menü</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col mt-4 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="hover:text-primary"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
