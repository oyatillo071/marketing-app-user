"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navigation = [
    { name: t("dashboard"), href: "/dashboard" },
    { name: t("products"), href: "/products" },
    { name: t("tariffs"), href: "/tariffs" },
    { name: t("about"), href: "/about" },
  ];

  // Foydalanuvchilar sonini olish uchun API chaqiruv
  useEffect(() => {
    const fetchUserCount = async () => {
      // try {
      //   //   const response = await fetch("/api/users/count"); // API endpoint
      //   //   if (!response.ok) {
      //   //     throw new Error("Failed to fetch user count");
      //   //   }
      //   //   const data = await response.json();
      //   //   setUserCount(data.count); // API dan kelgan foydalanuvchilar soni
      // } catch (error) {
      //   console.error("Error fetching user count:", error);
      //   setUserCount(null); // Xatolik yuz bersa, null qilib qo'yamiz
      // }
      setUserCount(156); // API dan kelgan foydalanuvchilar soni
    };

    fetchUserCount();

    // Real vaqt rejimida ma'lumotni yangilash uchun interval
    const interval = setInterval(fetchUserCount, 10000); // Har 10 soniyada yangilanadi
    return () => clearInterval(interval); // Komponent unmount bo'lganda intervalni tozalash
  }, []);

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">MLM Platform</h1>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 gap-4">
              {/* Foydalanuvchilar sonini ko'rsatish */}
              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                {userCount !== null ? (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                    <span>{`${t("active_users")}: ${userCount}`}</span>
                  </>
                ) : (
                  <span>{t("loading_users")}</span>
                )}
              </div>
              <LanguageSwitcher />
              <ThemeToggle />
              {pathname === "/" || pathname === "/register" ? (
                <Button asChild size="sm">
                  <Link href="/login">{t("login")}</Link>
                </Button>
              ) : pathname === "/login" ? (
                <Button asChild size="sm">
                  <Link href="/register">{t("register")}</Link>
                </Button>
              ) : (
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    {t("profile")}
                  </Link>
                </Button>
              )}
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" data-aos="fade-down">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 pb-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
