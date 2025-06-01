"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Gift, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { useSpin } from "@/hooks/query-hooks/use-spin";
import { useDailyEarnings } from "@/hooks/query-hooks/use-daily-earnings";
import SpinWheel from "@/components/spin/spinWeel";

export default function SpinPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const userId = 1;

  // Spin uchun
  const [prize, setPrize] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const { spinData, isLoading, isFetching, error, refreshSpin } =
    useSpin(userId);

  // Daily earnings uchun
  const dailyEarnings = useDailyEarnings();

  // Timer
  useEffect(() => {
    setSecondsLeft(spinData?.secondsLeft ?? 0);
  }, [spinData?.secondsLeft]);
  useEffect(() => {
    if (!secondsLeft || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Bonus olish handler
  const handleGetBonus = async () => {
    dailyEarnings.mutate(userId, {
      onSuccess: (data) => {
        toast({
          title: t("Bonus olindi!"),
          description: t("Sizning kunlik bonusingiz: ") + (data?.amount ?? 0),
        });
      },
      onError: (err: any) => {
        toast({
          title: t("Xatolik"),
          description: err?.message || t("Bonus olishda xatolik"),
          variant: "destructive",
        });
      },
    });
  };

  // Taymerni formatlash
  const formatTimer = (s: number) => {
    if (!s || s <= 0) return t("Available now") || "Available now";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  // Spin tugmasi bosilganda
  const handleSpin = async () => {
    setPrize(null);
    setSpinning(true);
    const data = await refreshSpin();
    if (!data?.allowed) {
      setSpinning(false);
      toast({
        title: t("No spins left"),
        description: data?.secondsLeft
          ? `${formatTimer(data.secondsLeft)}`
          : t("Wait for your next free spin."),
        variant: "destructive",
      });
      return;
    }
    if (!data.prizes || data.prizes.length === 0) {
      setSpinning(false);
      toast({
        title: t("No prizes"),
        description: t("No prizes available right now."),
        variant: "destructive",
      });
      return;
    }
    // SpinWheel ichida spin boshlanadi
    // (button SpinWheel ichida bo'ladi)
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Tabs defaultValue="spin" className="w-full">
        <TabsList className="mb-8  w-3/12 grid grid-cols-2 mx-auto">
          <TabsTrigger value="spin">{t("Spin")}</TabsTrigger>
          <TabsTrigger value="bonus">{t("Kunlik bonus")}</TabsTrigger>
        </TabsList>
        <TabsContent value="spin">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">{t("spin")}</h1>
              <p className="text-muted-foreground">
                Spin the wheel to win prizes! You get 1 free spin every 24
                hours. Only registered users can spin the wheel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t("spinCount")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {isLoading ? "..." : spinData?.spinCount ?? 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("freeSpin")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">
                    {isLoading ? "..." : formatTimer(secondsLeft)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Last Prize")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">
                    {prize || t("None yet")}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col items-center justify-center">
              <SpinWheel
                prizes={spinData?.prizes || []}
                onFinish={(selected, idx) => {
                  setPrize(selected.name);
                  setSpinning(false);
                  toast({
                    title: t("Congratulations!"),
                    description: `You won ${selected.name}!`,
                  });
                  refreshSpin();
                }}
              />
            </div>

            {prize && (
              <div className="mt-6 text-center">
                <div className="text-xl font-bold mb-2">{t("You won:")}</div>
                <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                  <Gift className="h-6 w-6" />
                  {prize}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="bonus">
          <div className="flex flex-col items-center gap-8 p-8 bg-gradient-to-b from-green-50 to-green-100 rounded-xl shadow-lg max-w-sm mx-auto">
            <h2 className="text-3xl font-extrabold text-green-900 mb-2 text-center">
              {t("Kunlik bonusingizni oling!")}
            </h2>
            <p className="text-green-800 text-center mb-4 max-w-xs">
              {t(
                "Har куни бонус олиш имкониятидан фойдаланинг ва ўз даромадингизни оширинг."
              )}
            </p>
            <button
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGetBonus}
              disabled={dailyEarnings.isPending}
            >
              {dailyEarnings.isPending
                ? t("Yuklanmoqda...")
                : t("Bonusni olish")}
            </button>
            {dailyEarnings.isSuccess && (
              <div className="mt-4 text-green-700 font-semibold text-center">
                {t("Bonus muvaffaqiyatli olindi!")}
              </div>
            )}
            {dailyEarnings.isError && (
              <div className="mt-4 text-red-600 font-semibold text-center">
                {t("Bonus olishda xatolik yuz berdi. Qayta urinib ko‘ring.")}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
