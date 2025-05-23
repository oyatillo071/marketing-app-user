"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/lib/api";

type ProductTranslation = {
  id: number;
  product_id: number;
  language: string;
  name: string;
  description: string;
};

type ProductPrice = {
  id: number;
  product_id: number;
  currency: string;
  value: number;
};

type ProductPhoto = {
  id: number;
  productId: number;
  photo_url: string;
};

type Product = {
  id: number;
  rating: number;
  rewiev: number;
  photo_url: ProductPhoto[];
  translations: ProductTranslation[];
  prices: ProductPrice[];
};

const categories = ["all", "skincare", "supplements", "wellness"];

export default function ProductsPage() {
  const { currency, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { push } = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((data) => {
        setProducts(data.products || data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  // Helper: get translation by language, fallback to 'en' or first
  const getTranslation = (translations: ProductTranslation[]) => {
    return (
      translations.find((t) => t.language === language) ||
      translations.find((t) => t.language === "en") ||
      translations[0] ||
      { name: "", description: "" }
    );
  };

  // Helper: get price by currency, fallback to first
  const getPrice = (prices: ProductPrice[]) => {
    return (
      prices.find((p) => p.currency === currency) ||
      prices[0] ||
      { value: 0, currency: "" }
    );
  };

  const filteredProducts = products.filter((product) => {
    const translation = getTranslation(product.translations || []);
    const matchesSearch =
      translation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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

      {loading ? (
        <div className="text-center py-12" data-aos="fade-up">
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12" data-aos="fade-up">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const translation = getTranslation(product.translations || []);
            const priceObj = getPrice(product.prices || []);
            // Rasm manzilini to'g'ri olish
            const imageUrl =
              product.photo_url && product.photo_url.length > 0
                ? product.photo_url[0].photo_url
                : "/placeholder.svg";
            return (
              <Card
                key={product.id}
                className="hover:cursor-pointer flex flex-col justify-between hover:scale-105 transition-transform hover:shadow-lg"
                data-aos="fade-up"
                onClick={() => push(`/products/${product.id}`)}
              >
                <div className="relative h-64 overflow-hidden ">
                  <Image
                    src={imageUrl}
                    alt={translation.name || "Product Image"}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{translation.name}</CardTitle>
                  <CardDescription>{translation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-primary">
                      {priceObj.value} {priceObj.currency}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-muted-foreground text-sm ml-1">
                        ({product.rewiev})
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
            );
          })}
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
