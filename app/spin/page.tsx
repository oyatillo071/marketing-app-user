"use client"

import { useState, useEffect, useRef } from "react"
import { Gift, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

// Mock data
const mockSpinData = {
  spinCount: 1, // Changed to 1 as per requirement
  lastSpin: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
  prizes: [
    { id: 1, name: "5 USD", color: "#FF6B6B" },
    { id: 2, name: "10 USD", color: "#4ECDC4" },
    { id: 3, name: "Free Spin", color: "#FFE66D" },
    { id: 4, name: "15 USD", color: "#1A535C" },
    { id: 5, name: "No Prize", color: "#F7FFF7" },
    { id: 6, name: "20 USD", color: "#FF6B6B" },
    { id: 7, name: "2 USD", color: "#4ECDC4" },
    { id: 8, name: "50 USD", color: "#FFE66D" },
  ],
}

export default function SpinPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [spinCount, setSpinCount] = useState(mockSpinData.spinCount)
  const [isSpinning, setIsSpinning] = useState(false)
  const [prize, setPrize] = useState<string | null>(null)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Mock authentication state
  const selectedPrizeRef = useRef<number | null>(null)

  // Calculate time until next free spin
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const lastSpin = new Date(mockSpinData.lastSpin)
      const nextSpin = new Date(lastSpin.getTime() + 24 * 60 * 60 * 1000) // 24 hours after last spin
      const now = new Date()

      if (now > nextSpin) {
        setTimeUntilNextSpin("Available now")
        return
      }

      const diff = nextSpin.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      setTimeUntilNextSpin(`${hours}h ${minutes}m`)
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleSpin = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in or register to spin the wheel",
        variant: "destructive",
      })
      return
    }

    if (spinCount <= 0) {
      toast({
        title: "No spins left",
        description: "You don't have any spins left. Wait for your next free spin.",
        variant: "destructive",
      })
      return
    }

    setIsSpinning(true)
    setPrize(null)

    // Random number of full rotations (3-5) plus the prize position
    const prizeIndex = Math.floor(Math.random() * mockSpinData.prizes.length)
    selectedPrizeRef.current = prizeIndex // Store the selected prize index
    const fullRotations = 3 + Math.floor(Math.random() * 3) // 3-5 full rotations
    const prizeRotation = (prizeIndex / mockSpinData.prizes.length) * 360
    const totalRotation = fullRotations * 360 + prizeRotation

    setWheelRotation(totalRotation)

    // After animation completes
    setTimeout(() => {
      setIsSpinning(false)
      if (selectedPrizeRef.current !== null) {
        setPrize(mockSpinData.prizes[selectedPrizeRef.current].name)
        toast({
          title: "Congratulations!",
          description: `You won ${mockSpinData.prizes[selectedPrizeRef.current].name}!`,
        })
      }
      setSpinCount((prev) => prev - 1)
    }, 5000) // Match this with the CSS transition duration
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8" data-aos="fade-up">
          <h1 className="text-3xl font-bold mb-4">{t("spin")}</h1>
          <p className="text-muted-foreground">
            Spin the wheel to win prizes! You get 1 free spin every 24 hours. Only registered users can spin the wheel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-aos="fade-up" data-aos-delay="100">
            <CardHeader>
              <CardTitle>{t("spinCount")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{spinCount}</div>
            </CardContent>
          </Card>

          <Card data-aos="fade-up" data-aos-delay="200">
            <CardHeader>
              <CardTitle>{t("freeSpin")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">{timeUntilNextSpin}</div>
            </CardContent>
          </Card>

          <Card data-aos="fade-up" data-aos-delay="300">
            <CardHeader>
              <CardTitle>Last Prize</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">{prize || "None yet"}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center justify-center" data-aos="fade-up" data-aos-delay="400">
          <div className="relative mb-8">
            <div
              className="spin-wheel"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transition: isSpinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)" : "none",
              }}
            >
              {mockSpinData.prizes.map((prize, index) => {
                const rotation = (index / mockSpinData.prizes.length) * 360
                return (
                  <div
                    key={prize.id}
                    className="spin-wheel-section"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      backgroundColor: prize.color,
                      clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                    }}
                  >
                    <div
                      style={{
                        transform: `rotate(${45}deg)`,
                        marginLeft: "25%",
                        fontSize: "0.8rem",
                      }}
                    >
                      {prize.name}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="spin-wheel-pointer" />
          </div>

          <Button
            size="lg"
            onClick={handleSpin}
            disabled={isSpinning || spinCount <= 0 || !isAuthenticated}
            className="gap-2"
            data-aos="zoom-in"
          >
            <RotateCw className={`h-5 w-5 ${isSpinning ? "animate-spin" : ""}`} />
            {isSpinning ? "Spinning..." : "Spin Now"}
          </Button>

          {prize && (
            <div className="mt-6 text-center" data-aos="fade-up">
              <div className="text-xl font-bold mb-2">You won:</div>
              <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                <Gift className="h-6 w-6" />
                {prize}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
