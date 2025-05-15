"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/language-provider";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Rejuvenating Face Cream",
    price: 45 * 12000, // 540,000 UZS
    rating: 4.8,
    reviews: 124,
    image: "https://picsum.photos/id/21/400/400",
    description: "Advanced anti-aging formula with natural ingredients",
    category: "skincare",
  },
  {
    id: 2,
    name: "Vitamin C Serum",
    price: 35 * 12000, // 420,000 UZS
    rating: 4.7,
    reviews: 98,
    image: "https://picsum.photos/id/22/400/400",
    description: "Brightening serum for radiant skin",
    category: "skincare",
  },
  {
    id: 3,
    name: "Collagen Supplement",
    price: 29 * 12000, // 348,000 UZS
    rating: 4.5,
    reviews: 76,
    image: "https://picsum.photos/id/23/400/400",
    description: "Support skin elasticity and joint health",
    category: "supplements",
  },
  {
    id: 4,
    name: "Hydrating Mask",
    price: 25 * 12000, // 300,000 UZS
    rating: 4.6,
    reviews: 62,
    image: "https://picsum.photos/id/24/400/400",
    description: "Deep hydration for dry and sensitive skin",
    category: "skincare",
  },
  {
    id: 5,
    name: "Detox Tea",
    price: 18 * 12000, // 216,000 UZS
    rating: 4.4,
    reviews: 53,
    image: "https://picsum.photos/id/25/400/400",
    description: "Natural cleansing blend of herbs",
    category: "wellness",
  },
  {
    id: 6,
    name: "Protein Shake",
    price: 32 * 12000, // 384,000 UZS
    rating: 4.3,
    reviews: 47,
    image: "https://picsum.photos/id/26/400/400",
    description: "Plant-based protein for muscle recovery",
    category: "supplements",
  },
];

const categories = ["all", "skincare", "supplements", "wellness"];

export default function ProductsPage() {
  const { currency } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  const { push } = useRouter();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8" data-aos="fade-up">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our premium range of cosmetics and health-enhancing products
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8" data-aos="fade-up">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary/10"
          />
        </div>
        <div className="w-full md:w-1/3 flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize flex-1"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover:cursor-pointer flex flex-col justify-between hover:scale-105 transition-transform hover:shadow-lg"
              data-aos="fade-up"
              onClick={() => push(`/products/${product.id}`)}
            >
              <div className="relative h-64 overflow-hidden ">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(product.price, currency)}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" data-aos="zoom-in">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12" data-aos="fade-up">
          <p className="text-lg text-muted-foreground">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
