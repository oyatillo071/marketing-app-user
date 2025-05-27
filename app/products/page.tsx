"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingCart, Star, Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { useProducts } from "@/hooks/query-hooks/use-products"


type ProductTranslation = {
  id: number
  product_id: number
  language: string
  name: string
  description: string
}

type ProductPrice = {
  id: number
  product_id: number
  currency: string
  value: number
}

type ProductPhoto = {
  id: number
  productId: number
  photo_url: string
}

type Product = {
  id: number
  rating: number
  rewiev: number
  photo_url: ProductPhoto[]
  translations: ProductTranslation[]
  prices: ProductPrice[]
  category?: string
}

const categories = [
  { id: "all", name: "All Products" },
  { id: "skincare", name: "Skincare" },
  { id: "supplements", name: "Supplements" },
  { id: "wellness", name: "Wellness" },
]

export default function ProductsPage() {
  const { currency, language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [mounted, setMounted] = useState(false)
  const { push } = useRouter()
  const { products, isLoading, error } = useProducts()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950" />
  }

  // Helper functions
  const getTranslation = (translations: ProductTranslation[]) => {
    return (
      translations.find((t) => t.language === language) ||
      translations.find((t) => t.language === "en") ||
      translations[0] || { name: "", description: "" }
    )
  }

  const getPrice = (prices: ProductPrice[]) => {
    return prices.find((p) => p.currency === currency) || prices[0] || { value: 0, currency: "" }
  }

  const filteredProducts = products.filter((product:any) => {
    const translation = getTranslation(product.translations || [])
    const matchesSearch =
      translation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8" data-aos="fade-up">
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-0">
              Discover our premium range of cosmetics and health-enhancing products
            </p>
            <div className="relative w-full max-w-xs md:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 shadow h-10 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-4 md:p-8 flex gap-8">
        {/* Sidebar: Categories */}
        <aside className="hidden sm:block min-w-[180px]">
          <div className="flex flex-col gap-2 sticky top-32">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full justify-start ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                    : "bg-white border border-gray-200 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                } transition-all duration-300`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </aside>

        {/* Main products grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="text-center py-20" data-aos="fade-up">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">{t("loading")}</p>
            </div>
          ) : error ? (
            <div className="text-center py-20" data-aos="fade-up">
              <p className="text-lg text-red-500">{error.message}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product: any, index: number) => {
                const translation = getTranslation(product.translations || []);
                const priceObj = getPrice(product.prices || []);
                const imageUrl = product.photo_url?.[0]?.photo_url || "/placeholder.svg";

                return (
                  <Card
                    key={product.id}
                    className={`group overflow-hidden bg-white dark:bg-gray-900 w-full rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:scale-105 cursor-pointer mx-auto flex flex-col`}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    onClick={() => push(`/products/${product.id}`)}
                  >
                    <div className={`relative overflow-hidden w-full ${viewMode === "list" ? "h-56" : "h-72"}`}>
                      <Image
                        src={imageUrl}
                        alt={translation.name || "Product Image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.category && (
                        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full shadow">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <CardHeader className="p-0 mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
                            {translation.name}
                          </CardTitle>
                          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900 px-2 py-1 rounded-full ml-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="ml-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">{product.rating}</span>
                            <span className="text-gray-400 dark:text-gray-300 text-xs ml-1">({product.rewiev})</span>
                          </div>
                        </div>
                        <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-3">
                          {translation.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-0 mb-4">
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                          {priceObj.value} {priceObj.currency}
                        </div>
                      </CardContent>

                      <CardFooter className="p-0">
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to cart logic here
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {t("addToCart")}
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20" data-aos="fade-up">
              <p className="text-lg text-gray-600 dark:text-gray-300">{t("noResults")}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
