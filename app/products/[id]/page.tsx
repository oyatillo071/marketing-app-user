"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/language-provider";
import { fetchProductById, fetchProducts } from "@/lib/api";

type ProductTranslation = {
  id: number;
  product_id: number;
  language: string;
  name: string;
  description: string;
  longDescription: string;
  features: string;
  usage: string;
};

type ProductPrice = {
  id: number;
  product_id: number;
  currency: string;
  value: number;
};

type Product = {
  id: number;
  rating: number;
  rewiev: number;
  photo_url: string[];
  translations: ProductTranslation[];
  prices: ProductPrice[];
};

export default function ProductDetailPage() {
  const { t, currency, language } = useLanguage();
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Helper: get translation by language, fallback to 'en' or first
  const getTranslation = (translations: ProductTranslation[]) => {
    return (
      translations.find((t) => t.language === language) ||
      translations.find((t) => t.language === "en") ||
      translations[0] ||
      { name: "", description: "", longDescription: "", features: "", usage: "" }
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

  useEffect(() => {
    setLoading(true);
    fetchProductById(productId)
      .then((data) => {
        setProduct(data);
        setLoading(false);
        // Fetch related products (for demo, fetch all and filter by id != current)
        fetchProducts().then((all) => {
          const related = (all.products || all)
            .filter((p: Product) => p.id !== Number(productId))
            .slice(0, 4);
          setRelatedProducts(related);
        });
      })
      .catch(() => {
        setLoading(false);
        setProduct(null);
      });
  }, [productId]);

  const translation = product ? getTranslation(product.translations) : null;
  const priceObj = product ? getPrice(product.prices) : null;

  const handleAddToCart = () => {
    toast({
      title: t ? t("addedToCart") : "Added to cart",
      description: `${translation?.name} (${quantity})`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: t ? t("addedToWishlist") : "Added to wishlist",
      description: `${translation?.name}`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product || !translation) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{t ? t("productNotFound") : "Product not found"}</h1>
        <p className="mb-6 text-muted-foreground">{t ? t("productNotFoundDesc") : "The product you are looking for does not exist."}</p>
        <Button asChild>
          <Link href="/products">{t ? t("backToProducts") : "Back to products"}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            {t ? t("home") : "Home"}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/products" className="hover:text-foreground">
            {t ? t("products") : "Products"}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>{translation.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div data-aos="fade-right">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
            <Image
              src={product.photo_url[activeImageIndex] || "/placeholder.svg"}
              alt={translation.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(product.photo_url.length > 0 ? product.photo_url : ["/placeholder.svg"]).map(
              (image: string, index: number) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                    activeImageIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${translation.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div data-aos="fade-left">
          <h1 className="text-3xl font-bold mb-2">{translation.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{product.rating}</span>
              <span className="ml-1 text-muted-foreground">
                ({product.rewiev} {t ? t("reviews") : "reviews"})
              </span>
            </div>
            {/* Category field yo‘q, kerak bo‘lsa qo‘shing */}
          </div>

          <p className="text-3xl font-bold mb-6">
            {priceObj && priceObj.value !== undefined && priceObj.currency !== undefined
              ? `${priceObj.value} ${priceObj.currency}`
              : ""}
          </p>

          <p className="mb-6 text-muted-foreground">{translation.description}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {t ? t("quantity") : "Quantity"}
            </label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="mx-4 font-medium w-8 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t ? t("addToCart") : "Add to cart"}
            </Button>
            <Button variant="outline" onClick={handleAddToWishlist}>
              <Heart className="mr-2 h-4 w-4" />
              {t ? t("addToWishlist") : "Add to wishlist"}
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="description">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="description">
                    {t ? t("description") : "Description"}
                  </TabsTrigger>
                  <TabsTrigger value="features">{t ? t("features") : "Features"}</TabsTrigger>
                  <TabsTrigger value="usage">{t ? t("usage") : "Usage"}</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-0">
                  <p>{translation.longDescription}</p>
                </TabsContent>
                <TabsContent value="features" className="mt-0">
                  <ul className="list-disc pl-5 space-y-1">
                    {translation.features
                      ? translation.features.split("\n").map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))
                      : null}
                  </ul>
                </TabsContent>
                <TabsContent value="usage" className="mt-0">
                  <p>{translation.usage}</p>
                  {/* Ingredients field yo‘q, kerak bo‘lsa qo‘shing */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t ? t("relatedProducts") : "Related products"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => {
              const relTranslation = getTranslation(relatedProduct.translations);
              const relPrice = getPrice(relatedProduct.prices);
              return (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden"
                  data-aos="fade-up"
                >
                  <div className="relative h-64">
                    <Image
                      src={relatedProduct.photo_url[0] || "/placeholder.svg"}
                      alt={relTranslation.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {relTranslation.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-primary">
                        {relPrice.value} {relPrice.currency}
                      </p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm">
                          {relatedProduct.rating}
                        </span>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4">
                      <Link href={`/products/${relatedProduct.id}`}>
                        {t ? t("viewDetails") : "View details"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}