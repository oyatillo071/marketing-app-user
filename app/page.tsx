"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { formatCurrency } from "@/lib/utils"
import { Star, ShoppingCart } from "lucide-react"

// Mock products data
const products = [
  {
    id: 1,
    name: "Natural Face Cream",
    price: 45,
    rating: 4.8,
    image: "https://picsum.photos/id/21/400/400",
    category: "skincare",
  },
  {
    id: 2,
    name: "Vitamin Complex",
    price: 35,
    rating: 4.6,
    image: "https://picsum.photos/id/22/400/400",
    category: "health",
  },
  {
    id: 3,
    name: "Anti-Aging Serum",
    price: 65,
    rating: 4.9,
    image: "https://picsum.photos/id/23/400/400",
    category: "skincare",
  },
  {
    id: 4,
    name: "Immune Booster",
    price: 28,
    rating: 4.7,
    image: "https://picsum.photos/id/24/400/400",
    category: "health",
  },
  {
    id: 5,
    name: "Hydrating Mask",
    price: 22,
    rating: 4.5,
    image: "https://picsum.photos/id/25/400/400",
    category: "skincare",
  },
  {
    id: 6,
    name: "Collagen Supplement",
    price: 38,
    rating: 4.4,
    image: "https://picsum.photos/id/26/400/400",
    category: "health",
  },
]

export default function Home() {
  const { t, currency } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter((product) => product.category === selectedCategory))
    } else {
      setFilteredProducts(products)
    }
  }, [selectedCategory])

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="bg-muted py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2" data-aos="fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Modern MLM Platform</h1>
              <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                Join our international community and start earning with our cosmetics and health-enhancing products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" data-aos="zoom-in" data-aos-delay="100">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" data-aos="zoom-in" data-aos-delay="200">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2" data-aos="fade-left">
              <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
                <Image src="https://picsum.photos/id/20/800/600" alt="MLM Platform" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center" data-aos="fade-up">
            Our Products
          </h2>

          <div className="flex justify-center mb-8 gap-4" data-aos="fade-up">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "skincare" ? "default" : "outline"}
              onClick={() => setSelectedCategory("skincare")}
            >
              Skincare
            </Button>
            <Button
              variant={selectedCategory === "health" ? "default" : "outline"}
              onClick={() => setSelectedCategory("health")}
            >
              Health
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className="overflow-hidden" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="relative h-64">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <p className="mt-2 font-bold text-primary text-lg">{formatCurrency(product.price, currency)}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
