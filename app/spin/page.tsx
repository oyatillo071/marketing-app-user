"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { Gift, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/utils";

// Mock API response structure (replace with actual API response structure)
interface Bonus {
  id: number;
  reward: string;
  date: string;
  status: string;
}

// Mock data for initial testing
const mockBonuses: Bonus[] = [
  {
    id: 1,
    reward: "10 Coins",
    date: "2025-06-04T10:00:00Z",
    status: "claimed",
  },
  { id: 2, reward: "5 USD", date: "2025-06-03T15:30:00Z", status: "claimed" },
  {
    id: 3,
    reward: "Free Spin",
    date: "2025-06-02T12:15:00Z",
    status: "claimed",
  },
];

export default function DailyBonus() {
  const { t, currency } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [currentBonus, setCurrentBonus] = useState<Bonus | null>(null);
  const [bonusHistory, setBonusHistory] = useState<Bonus[]>(mockBonuses);
  const [error, setError] = useState<string | null>(null);

  // Fetch daily bonus from API
  const fetchDailyBonus = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentBonus(null);

    try {
      const response = await fetch("https://mlm-backend.pixl.uz/bonus/daily", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("mlm_token")}`,
        },
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to fetch daily bonus");
      }

      const data: Bonus = await response.json();
      setCurrentBonus(data);
      setBonusHistory((prev) => [
        data,
        ...prev.slice(0, 4), // Keep latest 5 bonuses
      ]);
      toast.success(`Bonus Claimed: ${data.reward}`);
    } catch (err) {
      setError("Failed to claim daily bonus. Please try again.");
      toast.error("Error claiming bonus");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(bonusHistory);
  console.log(currentBonus);

  // Format date for display with validation and locale support
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return t("invalidDate");
      }
      return new Intl.DateTimeFormat(t("locale") || "default", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // Use UTC to avoid timezone issues
      }).format(date);
    } catch {
      return t("invalidDate");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Bonus Claim Section */}
        <Card className="bg-white dark:bg-[#111827] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
              <Gift className="h-6 w-6" />
              {t("dailyBonus")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="relative flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center transition-all duration-500">
                <div className="w-56 h-56 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : currentBonus ? (
                    <div>
                      <p className="text-2xl font-bold text-black dark:text-white">
                        {currentBonus.reward}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(currentBonus.date)}
                      </p>
                    </div>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {t("claimYourBonus")}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={fetchDailyBonus}
              disabled={isLoading}
              className="bg-[#00FF99] text-white hover:bg-[#00FF99]/90 px-8 py-3 text-lg rounded-full shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Gift className="mr-2 h-5 w-5" />
              )}
              {isLoading ? t("claiming") : t("claimBonus")}
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("dailyBonusDescription")}
            </p>
          </CardContent>
        </Card>

        {/* Bonus History Section */}
        <Card className="bg-white dark:bg-[#111827] shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black dark:text-white">
              {t("bonusHistory")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bonusHistory.length > 0 ? (
              <div className="space-y-4">
                {bonusHistory.map((bonus, idx) => (
                  <div
                    key={`${bonus.id}-${bonus.date}-${idx}`}
                    className="flex justify-between items-center border-b pb-2 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-black dark:text-white">
                        {bonus.reward}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(bonus.date)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {t("status")}: {t(bonus.status)}
                      </p>
                    </div>
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                ))}

            )}
          </div>
        </TabsContent>
        <TabsContent value="bonus">
          <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-green-100 via-green-50 to-green-200 rounded-2xl shadow-2xl max-w-md mx-auto border border-green-200">
            <div className="flex flex-col items-center gap-2">
              <Gift className="w-12 h-12 text-green-500 mb-2 drop-shadow-lg" />
              <h2 className="text-3xl font-extrabold text-green-900 mb-1 text-center drop-shadow-sm">
                {t("Kunlik bonusingizni oling!")}
              </h2>
              <p className="text-green-800 text-center mb-2 max-w-xs text-base font-medium">
                {t(
                  "Har куни бонус олиш имкониятидан фойдаланинг ва ўз даромадингизни оширинг."
                )}
              </p>
            </div>
            <button
              className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg tracking-wide"
              onClick={handleGetBonus}
              disabled={dailyEarnings.isPending}
            >
              {dailyEarnings.isPending
                ? (
                  <span className="flex items-center justify-center gap-2">
                    <RotateCw className="animate-spin w-5 h-5" />
                    {t("Yuklanmoqda...")}
                  </span>
                )
                : t("Bonusni olish")}
            </button>
            {dailyEarnings.isSuccess && (
              <div className="mt-2 px-4 py-2 rounded-lg bg-green-100 text-green-800 font-semibold text-center border border-green-300 shadow">
                {t("Bonus muvaffaqiyatli olindi!")}
              </div>
            )}
            {dailyEarnings.isError && (
              <div className="mt-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold text-center border border-red-300 shadow">
                {t("Bonus olishda xatolik yuz berdi. Qayta urinib ko‘ring.")}

              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                {t("noBonusHistory")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
