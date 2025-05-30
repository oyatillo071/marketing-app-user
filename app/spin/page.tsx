"use client"

import { useState, useEffect } from "react"
import { Gift, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useSpin } from "@/hooks/query-hooks/use-spin"
import SpinWheel from "@/components/spin/spinWeel"

export default function SpinPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const userId = 1

  const [prize, setPrize] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  // Spin uchun hook
  const {
    spinData,
    isLoading,
    isFetching,
    error,
    refreshSpin,
  } = useSpin(userId)

  useEffect(() => {
    setSecondsLeft(spinData?.secondsLeft ?? 0)
  }, [spinData?.secondsLeft])

  useEffect(() => {
    if (!secondsLeft || secondsLeft <= 0) return
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  // Taymerni formatlash
  const formatTimer = (s: number) => {
    if (!s || s <= 0) return t("Available now") || "Available now"
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h}h ${m}m ${sec}s`
  }

  // Spin tugmasi bosilganda
  const handleSpin = async () => {
    setPrize(null)
    setSpinning(true)
    const data = await refreshSpin()
    if (!data?.allowed) {
      setSpinning(false)
      toast({
        title: t("No spins left"),
        description: data?.secondsLeft
          ? `${formatTimer(data.secondsLeft)}`
          : t("Wait for your next free spin."),
        variant: "destructive",
      })
      return
    }
    if (!data.prizes || data.prizes.length === 0) {
      setSpinning(false)
      toast({
        title: t("No prizes"),
        description: t("No prizes available right now."),
        variant: "destructive",
      })
      return
    }
    // SpinWheel ichida spin boshlanadi
    // (button SpinWheel ichida bo'ladi)
  }

  // Ruletka uchun data tayyorlash
  const wheelPrizes =
    spinData?.prizes?.map((p: any) => ({
      name: p.name,
      color: p.color,
    })) || []

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("spin")}</h1>
          <p className="text-muted-foreground">
            Spin the wheel to win prizes! You get 1 free spin every 24 hours. Only registered users can spin the wheel.
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
                {isLoading
                  ? "..."
                  : formatTimer(secondsLeft)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Last Prize")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">{prize || t("None yet")}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center justify-center">
          <SpinWheel
            prizes={wheelPrizes}
            onFinish={(selected, idx) => {
              setPrize(selected.name)
              setSpinning(false)
              toast({
                title: "Congratulations!",
                description: `You won ${selected.name}!`,
              })
              refreshSpin()
            }}
            // targetIndex={backenddanKeganIndex} // agar kerak bo‘lsa
          />
          {/* SpinWheel ichidagi tugma ishlatiladi, tashqi tugma kerak emas */}
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
    </div>
  )
}