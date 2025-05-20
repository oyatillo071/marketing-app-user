"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/language-provider";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  longDescription: string;
  features: string[];
  ingredients: string;
  usage: string;
  images: string[];
  category: string;
  relatedProducts: string[];
}

const mockProducts: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Rejuvenating Face Cream",
    price: 450000,
    rating: 4.8,
    reviews: 124,
    description:
      "Advanced anti-aging formula with natural ingredients that helps reduce fine lines and wrinkles. This premium face cream is enriched with vitamins and antioxidants to nourish your skin and restore its youthful appearance.",
    longDescription:
      "Our Rejuvenating Face Cream is a revolutionary skincare product designed to combat the signs of aging. Formulated with a unique blend of natural ingredients, this cream penetrates deep into the skin to stimulate collagen production and improve elasticity. The powerful antioxidants protect your skin from environmental damage while the hydrating components ensure your skin stays moisturized throughout the day. Regular use will result in visibly reduced fine lines, improved skin texture, and a radiant complexion.",
    features: [
      "Contains natural ingredients",
      "Reduces fine lines and wrinkles",
      "Improves skin elasticity",
      "Provides 24-hour hydration",
      "Suitable for all skin types",
      "Dermatologically tested",
    ],
    ingredients:
      "Aqua, Glycerin, Butylene Glycol, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Ceteareth-20, Glyceryl Stearate, Dimethicone, Phenoxyethanol, Tocopheryl Acetate, Parfum, Carbomer, Disodium EDTA, Sodium Hydroxide, Citric Acid, Ethylhexylglycerin, Retinyl Palmitate, Tocopherol, Helianthus Annuus Seed Oil.",
    usage:
      "Apply a small amount to clean, dry skin every morning and evening. Gently massage in circular motions until fully absorbed. For best results, use consistently as part of your daily skincare routine.",
    images: [
      "https://picsum.photos/id/21/800/800",
      "https://picsum.photos/id/22/800/800",
      "https://picsum.photos/id/23/800/800",
      "https://picsum.photos/id/24/800/800",
    ],
    category: "skincare",
    relatedProducts: ["2", "4", "5"],
  },
  "2": {
    id: "2",
    name: "Vitamin C Serum",
    price: 350000,
    rating: 4.7,
    reviews: 98,
    description:
      "Brightening serum for radiant skin with high concentration of Vitamin C to even skin tone and reduce dark spots.",
    longDescription:
      "Our Vitamin C Serum is a powerful formula designed to brighten your complexion and combat hyperpigmentation. The high concentration of stabilized Vitamin C works to neutralize free radicals, stimulate collagen production, and inhibit melanin production. This results in a more even skin tone, reduced dark spots, and a radiant glow. The lightweight formula absorbs quickly without leaving any greasy residue, making it perfect for layering under moisturizer and sunscreen.",
    features: [
      "20% Vitamin C concentration",
      "Brightens skin tone",
      "Reduces dark spots and hyperpigmentation",
      "Boosts collagen production",
      "Lightweight, non-greasy formula",
      "Suitable for daily use",
    ],
    ingredients:
      "Aqua, Ascorbic Acid, Ethoxydiglycol, Propylene Glycol, Glycerin, Laureth-23, Tocopherol, Ferulic Acid, Panthenol, Hyaluronic Acid, Sodium Hydroxide, Phenoxyethanol, Ethylhexylglycerin.",
    usage:
      "Apply 3-4 drops to clean, dry skin in the morning before moisturizer and sunscreen. Allow to fully absorb before applying other products. Store in a cool, dark place to maintain potency.",
    images: [
      "https://picsum.photos/id/25/800/800",
      "https://picsum.photos/id/26/800/800",
      "https://picsum.photos/id/27/800/800",
    ],
    category: "skincare",
    relatedProducts: ["1", "4", "5"],
  },
  "3": {
    id: "3",
    name: "Collagen Supplement",
    price: 290000,
    rating: 4.5,
    reviews: 76,
    description:
      "Support skin elasticity and joint health with our premium collagen peptides supplement.",
    longDescription:
      "Our Collagen Supplement contains high-quality collagen peptides that are easily absorbed by the body to support skin elasticity, joint health, and hair strength. As we age, our natural collagen production decreases, leading to visible signs of aging. This supplement helps replenish your body's collagen levels, resulting in firmer skin, reduced joint pain, and stronger hair and nails. The unflavored formula dissolves easily in hot or cold beverages without affecting the taste.",
    features: [
      "Type I & III collagen peptides",
      "Supports skin elasticity",
      "Promotes joint health",
      "Strengthens hair and nails",
      "Unflavored and easy to mix",
      "No artificial additives",
    ],
    ingredients: "Hydrolyzed Bovine Collagen Peptides (Type I & III).",
    usage:
      "Mix one scoop (10g) with water, coffee, tea, or your favorite beverage once daily. Can be taken at any time of day, with or without food.",
    images: [
      "https://picsum.photos/id/28/800/800",
      "https://picsum.photos/id/29/800/800",
      "https://picsum.photos/id/30/800/800",
    ],
    category: "supplements",
    relatedProducts: ["6", "2", "4"],
  },
  "4": {
    id: "4",
    name: "Hydrating Mask",
    price: 250000,
    rating: 4.6,
    reviews: 62,
    description:
      "Deep hydration for dry and sensitive skin with our intensive overnight mask.",
    longDescription:
      "Our Hydrating Mask is an intensive treatment designed to provide deep hydration for dry and sensitive skin. The gel-cream formula creates a moisture-locking barrier that allows the active ingredients to penetrate deeply while you sleep. Enriched with hyaluronic acid, ceramides, and soothing botanical extracts, this mask replenishes moisture levels, strengthens the skin barrier, and reduces redness and irritation. Wake up to plump, soft, and revitalized skin.",
    features: [
      "Intensive overnight hydration",
      "Contains hyaluronic acid and ceramides",
      "Soothes redness and irritation",
      "Strengthens skin barrier",
      "Non-comedogenic",
      "Suitable for sensitive skin",
    ],
    ingredients:
      "Aqua, Glycerin, Butylene Glycol, Sodium Hyaluronate, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Aloe Barbadensis Leaf Juice, Panthenol, Allantoin, Camellia Sinensis Leaf Extract, Tocopheryl Acetate, Carbomer, Xanthan Gum, Sodium Hydroxide, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin.",
    usage:
      "Apply a generous layer to clean, dry skin as the final step in your evening skincare routine. Leave on overnight and rinse off in the morning. Use 2-3 times per week or as needed for intense hydration.",
    images: [
      "https://picsum.photos/id/31/800/800",
      "https://picsum.photos/id/32/800/800",
      "https://picsum.photos/id/33/800/800",
    ],
    category: "skincare",
    relatedProducts: ["1", "2", "5"],
  },
  "5": {
    id: "5",
    name: "Detox Tea",
    price: 180000,
    rating: 4.4,
    reviews: 53,
    description:
      "Natural cleansing blend of herbs to support your body's detoxification process.",
    longDescription:
      "Our Detox Tea is a carefully crafted blend of organic herbs designed to support your body's natural detoxification processes. The combination of dandelion root, burdock root, and milk thistle helps cleanse the liver, while ginger and peppermint aid digestion and reduce bloating. Green tea provides a gentle energy boost and additional antioxidants. This refreshing tea has a pleasant taste with subtle notes of mint and citrus, making it easy to incorporate into your daily wellness routine.",
    features: [
      "Organic herbal blend",
      "Supports liver detoxification",
      "Aids digestion",
      "Reduces bloating",
      "Provides antioxidants",
      "No artificial flavors or additives",
    ],
    ingredients:
      "Organic Dandelion Root, Organic Burdock Root, Organic Milk Thistle Seed, Organic Green Tea Leaf, Organic Ginger Root, Organic Peppermint Leaf, Organic Lemon Peel, Organic Licorice Root.",
    usage:
      "Steep one tea bag in 8 oz of hot water for 5-7 minutes. Enjoy 1-2 cups daily, preferably between meals. For a stronger detox effect, drink consistently for 2-4 weeks.",
    images: [
      "https://picsum.photos/id/34/800/800",
      "https://picsum.photos/id/35/800/800",
      "https://picsum.photos/id/36/800/800",
    ],
    category: "wellness",
    relatedProducts: ["6", "3", "2"],
  },
  "6": {
    id: "6",
    name: "Protein Shake",
    price: 320000,
    rating: 4.3,
    reviews: 47,
    description:
      "Plant-based protein for muscle recovery and overall nutrition with 20g of protein per serving.",
    longDescription:
      "Our Plant-Based Protein Shake provides 20g of complete protein per serving to support muscle recovery and overall nutrition. The unique blend of pea, rice, and hemp proteins delivers all essential amino acids in an easily digestible form. Enhanced with a comprehensive vitamin and mineral blend, digestive enzymes, and probiotics, this shake supports not just muscle health but overall wellbeing. The smooth, creamy texture and delicious vanilla flavor make it a satisfying addition to your daily routine.",
    features: [
      "20g complete plant protein per serving",
      "Blend of pea, rice, and hemp proteins",
      "Contains all essential amino acids",
      "Added vitamins, minerals, and probiotics",
      "Easy to digest",
      "No artificial sweeteners or flavors",
    ],
    ingredients:
      "Pea Protein Isolate, Brown Rice Protein, Hemp Protein, Coconut Milk Powder, Natural Vanilla Flavor, Stevia Leaf Extract, MCT Oil Powder, Vitamin and Mineral Blend (Vitamin A, Vitamin C, Vitamin D, Vitamin E, B Vitamins, Calcium, Iron, Magnesium, Zinc), Digestive Enzyme Blend, Probiotic Blend (2 billion CFU).",
    usage:
      "Mix one scoop (30g) with 8-10 oz of water or plant-based milk. Shake well. Consume post-workout or as a nutritious snack between meals.",
    images: [
      "https://picsum.photos/id/37/800/800",
      "https://picsum.photos/id/38/800/800",
      "https://picsum.photos/id/39/800/800",
    ],
    category: "supplements",
    relatedProducts: ["3", "5", "2"],
  },
};

export default function ProductDetailPage() {
  const { t, currency } = useLanguage();
  const { toast } = useToast();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);

    setTimeout(() => {
      if (productId && mockProducts[productId]) {
        setProduct(mockProducts[productId]);

        // Get related products
        const related = mockProducts[productId].relatedProducts
          .map((id) => mockProducts[id])
          .filter(Boolean);

        setRelatedProducts(related);
      }
      setLoading(false);
    }, 500);
  }, [productId]);

  const handleAddToCart = () => {
    toast({
      title: t("addedToCart"),
      description: `${product?.name} (${quantity}) ${t("addedToCartDesc")}`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: t("addedToWishlist"),
      description: `${product?.name} ${t("addedToWishlistDesc")}`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{t("productNotFound")}</h1>
        <p className="mb-6 text-muted-foreground">{t("productNotFoundDesc")}</p>
        <Button asChild>
          <Link href="/products">{t("backToProducts")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            {t("home")}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/products" className="hover:text-foreground">
            {t("products")}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div data-aos="fade-right">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
            <Image
              src={product.images[activeImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image: string, index: number) => (
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
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div data-aos="fade-left">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{product.rating}</span>
              <span className="ml-1 text-muted-foreground">
                ({product.reviews} {t("reviews")})
              </span>
            </div>
            <span className="text-muted-foreground">
              {t("category")}: {t(product.category)}
            </span>
          </div>

          <p className="text-3xl font-bold mb-6">
            {formatCurrency(product.price, currency)}
          </p>

          <p className="mb-6 text-muted-foreground">{product.description}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {t("quantity")}
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
              {t("addToCart")}
            </Button>
            <Button variant="outline" onClick={handleAddToWishlist}>
              <Heart className="mr-2 h-4 w-4" />
              {t("addToWishlist")}
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="description">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="description">
                    {t("description")}
                  </TabsTrigger>
                  <TabsTrigger value="features">{t("features")}</TabsTrigger>
                  <TabsTrigger value="usage">{t("usage")}</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-0">
                  <p>{product.longDescription}</p>
                </TabsContent>
                <TabsContent value="features" className="mt-0">
                  <ul className="list-disc pl-5 space-y-1">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="usage" className="mt-0">
                  <p>{product.usage}</p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">{t("ingredients")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.ingredients}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("relatedProducts")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="overflow-hidden"
                data-aos="fade-up"
              >
                <div className="relative h-64">
                  <Image
                    src={relatedProduct.images[0] || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-primary">
                      {formatCurrency(relatedProduct.price, currency)}
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
                      {t("viewDetails")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
