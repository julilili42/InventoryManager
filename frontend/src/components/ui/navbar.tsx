import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/articles" },
  { name: "Customers", href: "/customers" },
  { name: "Orders", href: "/orders" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 gap-8 px-10 md:justify-start">
        {/* Markenname */}
        <div className="text-2xl font-semibold">React Inventory</div>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 text-muted-foreground md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:ml-auto md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <figure className="cursor-pointer">
                <img src={`/images/1.png`} className="w-10 h-10" alt="..." />
              </figure>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col mt-4 space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `hover:text-primary ${
                        isActive ? "text-primary font-semibold" : ""
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
