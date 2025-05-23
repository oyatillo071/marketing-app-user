"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { formatCurrency } from "@/lib/utils";
import { CardDescription } from "@/components/ui/card";
import { fetchTariffs } from "@/lib/api";
import mockData from "../../data/mock.json";

interface Tariff {
  id: string;
  name: string;
  price: number;
  duration: number;
  dailyProfit: number;
  description: string;
  features: string[];
  images: string[];
}

// export default function TariffsPage() {
//   const { t, currency } = useLanguage() as {
//     t: (key: string) => string;
//     currency: string;
//   };
//   const [activeSlides, setActiveSlides] = useState<Record<string, number>>({});
//   const [tariffs, setTariffs] = useState<Tariff[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getTariffs = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchTariffs();
//         setTariffs(data);

//         const initialActiveSlides: Record<string, number> = {};
//         data.forEach((tariff: any) => {
//           initialActiveSlides[tariff.id] = 0;
//         });
//         setActiveSlides(initialActiveSlides);
//       } catch (error) {
//         console.error("Error fetching tariffs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getTariffs();
//   }, [currency]);

//   // Auto-scroll carousel every 5 seconds
//   useEffect(() => {
//     if (tariffs.length === 0) return;

//     const interval = setInterval(() => {
//       setActiveSlides((prev) => {
//         const newActiveSlides = { ...prev };
//         tariffs.forEach((tariff) => {
//           const currentSlide = prev[tariff.id] || 0;
//           newActiveSlides[tariff.id] =
//             (currentSlide + 1) % tariff.images.length;
//         });
//         return newActiveSlides;
//       });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [tariffs]);

//   const handlePrevSlide = (tariffId: string) => {
//     setActiveSlides((prev) => {
//       const currentSlide = prev[tariffId] || 0;
//       const imagesLength =
//         tariffs.find((t) => t.id === tariffId)?.images.length || 1;
//       return {
//         ...prev,
//         [tariffId]: (currentSlide - 1 + imagesLength) % imagesLength,
//       };
//     });
//   };

//   const handleNextSlide = (tariffId: string) => {
//     setActiveSlides((prev) => {
//       const currentSlide = prev[tariffId] || 0;
//       const imagesLength =
//         tariffs.find((t) => t.id === tariffId)?.images.length || 1;
//       return {
//         ...prev,
//         [tariffId]: (currentSlide + 1) % imagesLength,
//       };
//     });
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[60vh]">
//         <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 md:p-8">
//       <div className="text-center mb-12" data-aos="fade-up">
//         <h1 className="text-3xl font-bold mb-4">{t("tariffs")}</h1>
//         <p className="text-muted-foreground max-w-2xl mx-auto">
//           {t("chooseTariffDesc")}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {tariffs.map((tariff, index) => (
//           <Card
//             key={tariff.id}
//             className="overflow-hidden flex flex-col justify-between hover:cursor-pointer hover:scale-105 transition-all  hover:shadow-2xl"
//             data-aos="fade-up"
//             data-aos-delay={index * 100}
//           >
//             <div className="relative h-56">
//               <div
//                 className="carousel-inner  flex transition-transform duration-500 h-72"
//                 style={{
//                   transform: `translateX(-${activeSlides[tariff.id] * 100}%)`,
//                 }}
//               >
//                 {tariff.images.map((image, imgIndex) => (
//                   <div
//                     key={imgIndex}
//                     className="carousel-item min-w-full h-full relative"
//                   >
//                     <Image
//                       src={image || "/placeholder.svg"}
//                       alt={`${t(tariff.name)} image ${imgIndex + 1}`}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>

//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 z-10"
//                 onClick={() => handlePrevSlide(tariff.id)}
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </Button>

//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 z-10"
//                 onClick={() => handleNextSlide(tariff.id)}
//               >
//                 <ArrowRight className="h-4 w-4" />
//               </Button>

//               <div className="absolute -bottom-10 right-2 flex justify-center space-x-2">
//                 {tariff.images.map((_, dotIndex) => (
//                   <div
//                     key={dotIndex}
//                     className={`w-2 h-2 rounded-full ${
//                       activeSlides[tariff.id] === dotIndex
//                         ? "bg-primary"
//                         : "bg-background/80"
//                     }`}
//                     onClick={() =>
//                       setActiveSlides((prev) => ({
//                         ...prev,
//                         [tariff.id]: dotIndex,
//                       }))
//                     }
//                   />
//                 ))}
//               </div>
//             </div>

//             <CardHeader>
//               <CardTitle>{t(tariff.name)}</CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <p className="text-sm text-muted-foreground">
//                     {t("productPrice")} :{" "}
//                   </p>
//                   <p className="font-medium">
//                     {formatCurrency(tariff.price, currency)}
//                   </p>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-sm text-muted-foreground">
//                     {t("dailyIncome")} :{" "}
//                   </p>
//                   <p className="font-medium">
//                     {formatCurrency(tariff.dailyProfit, currency)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-1 ">
//                   <p className="text-sm text-muted-foreground">
//                     {t("incomeDuration")} :{" "}
//                   </p>
//                   <p className="font-medium">
//                     {tariff.duration} {t("days")}
//                   </p>
//                 </div>

//                 <div className="space-y-1 ">
//                   <p className="text-sm text-muted-foreground">
//                     {t("totalIncome")}:
//                   </p>
//                   <p className="font-medium">
//                     {formatCurrency(
//                       tariff.dailyProfit * tariff.duration,
//                       currency
//                     )}
//                   </p>
//                 </div>
//               </div>
//               <CardDescription>
//                 <p className="font-medium ">{tariff.description}</p>
//               </CardDescription>

//               <div className="space-y-1">
//                 <p className="text-sm text-muted-foreground">
//                   {t("tariffPrice")}:
//                 </p>
//                 <p className="font-medium">
//                   {formatCurrency(tariff.price, currency)}
//                 </p>
//               </div>
//             </CardContent>

//             <CardFooter>
//               <Button className="w-full" data-aos="zoom-in">
//                 {t("purchase")}
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

export default function TariffsPage() {
  const { t, currency, lang } = useLanguage() as any;
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTariffs = async () => {
      setLoading(true);
      try {
        const data = await fetchTariffs();
        setTariffs(data);
      } catch (error) {
        console.error("Error fetching tariffs:", error);
      } finally {
        setLoading(false);
      }
    };
    getTariffs();
  }, [currency]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!tariffs.length) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">
          {t("noTariffs") || "Tariflar topilmadi"}
        </h2>
        <p className="text-muted-foreground">
          {t("noTariffsDesc") || "Hozircha tariflar mavjud emas."}
        </p>
      </div>
    );
  }

  // Tariff uchun til va valyutani tanlash yordamchi funksiyasi
  const getTranslation = (tariff: any) =>
    Array.isArray(tariff.translations) && tariff.translations.length
      ? tariff.translations.find((tr: any) => tr.language === lang) ||
        tariff.translations[0]
      : {
          title: t("noTitle") || "Nomi yo'q",
          body: t("noDescription") || "Tavsifi yo'q",
        };

  const getPrice = (tariff: any) =>
    Array.isArray(tariff.prices) && tariff.prices.length
      ? tariff.prices.find((p: any) => p.currency === currency) ||
        tariff.prices[0]
      : { value: 0, currency: currency };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-3xl font-bold mb-4">{t("tariffs")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("chooseTariffDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tariffs.map((tariff, index) => {
          const translation = getTranslation(tariff);
          const price = getPrice(tariff);

          return (
            <Card
              key={tariff.id}
              className="overflow-hidden flex flex-col justify-between hover:cursor-pointer hover:scale-105 transition-all hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-56">
                <Image
                  src={tariff.photo_url || "/placeholder.svg"}
                  alt={translation?.title || "Tariff image"}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{translation?.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("productPrice")}:
                    </p>
                    <p className="font-medium">
                      {price.value
                        ? `${price.value} ${price.currency}`
                        : t("noPrice") || "Narxi yo'q"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("incomeDuration")}:
                    </p>
                    <p className="font-medium">
                      {tariff.term
                        ? `${tariff.term} ${t("days")}`
                        : t("noDuration") || "Muddat yo'q"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("referralBonus")}:
                  </p>
                  <p className="font-medium">
                    {tariff.referral_bonus !== undefined
                      ? `${tariff.referral_bonus}%`
                      : t("noReferralBonus") || "-"}
                  </p>
                </div>
                <CardDescription>
                  <p className="font-medium">{translation.body}</p>
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  data-aos="zoom-in"
                  disabled={!price.value}
                >
                  {t("purchase")}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
