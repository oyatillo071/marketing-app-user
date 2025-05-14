"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Clock, DollarSign, Upload, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { formatCurrency } from "@/lib/utils"
import { ReferralShare } from "@/components/referral-share"

// Mock data
const mockUserData = {
  name: "John Doe",
  phone: "+1234567890",
  activeTariff: "Gold",
  daysRemaining: 25,
  dailyEarnings: 15,
  monthlyEarnings: 450,
  referrals: [
    { id: 1, name: "Alice Smith", status: "paid", date: "2023-05-10" },
    { id: 2, name: "Bob Johnson", status: "pending", date: "2023-05-15" },
    { id: 3, name: "Charlie Brown", status: "paid", date: "2023-05-20" },
    { id: 4, name: "David Wilson", status: "paid", date: "2023-05-25" },
  ],
  tariffs: [
    {
      id: 1,
      name: "start",
      price: 250000,
      duration: 30,
      dailyProfit: 10,
      description: "Basic tariff for beginners",
      images: [
        "https://picsum.photos/id/1/400/300",
        "https://picsum.photos/id/2/400/300",
        "https://picsum.photos/id/3/400/300",
      ],
    },
    {
      id: 2,
      name: "silver",
      price: 500000,
      duration: 60,
      dailyProfit: 20,
      description: "Medium tariff for regular users",
      images: [
        "https://picsum.photos/id/4/400/300",
        "https://picsum.photos/id/5/400/300",
        "https://picsum.photos/id/6/400/300",
      ],
    },
    {
      id: 3,
      name: "gold",
      price: 1000000,
      duration: 90,
      dailyProfit: 40,
      description: "Premium tariff for professionals",
      images: [
        "https://picsum.photos/id/7/400/300",
        "https://picsum.photos/id/8/400/300",
        "https://picsum.photos/id/9/400/300",
      ],
    },
  ],
}

export default function DashboardPage() {
  const { t, currency } = useLanguage()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [showPaymentTimer, setShowPaymentTimer] = useState(false)
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [showUploadTimer, setShowUploadTimer] = useState(false)
  const [selectedTariff, setSelectedTariff] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handlePayClick = (tariff: any) => {
    setSelectedTariff(tariff)
    setShowPaymentTimer(true)
    setShowCardNumber(false)
    setShowUploadTimer(false)

    // Simulate 2-minute timer
    setTimeout(() => {
      setShowPaymentTimer(false)
      setShowCardNumber(true)

      // Simulate 10-minute timer for upload
      setTimeout(() => {
        setShowCardNumber(false)
        setShowUploadTimer(true)
      }, 10000) // Reduced for demo purposes, should be 10 * 60 * 1000 for 10 minutes
    }, 2000) // Reduced for demo purposes, should be 2 * 60 * 1000 for 2 minutes
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = () => {
    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Receipt uploaded successfully",
    })

    setUploadedFile(null)
    setShowUploadTimer(false)
    setSelectedTariff(null)
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="profile" data-aos="fade-up" data-aos-delay="100">
            {t("profile")}
          </TabsTrigger>
          <TabsTrigger value="earnings" data-aos="fade-up" data-aos-delay="200">
            {t("earnings")}
          </TabsTrigger>
          <TabsTrigger value="referrals" data-aos="fade-up" data-aos-delay="300">
            {t("referrals")}
          </TabsTrigger>
          <TabsTrigger value="tariffs" data-aos="fade-up" data-aos-delay="400">
            {t("tariffs")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle>{t("profile")}</CardTitle>
              <CardDescription>
                {t("name")}: {mockUserData.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("phone")}</p>
                  <p className="font-medium">{mockUserData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <DollarSign className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("activeTariff")}</p>
                  <p className="font-medium">{t(mockUserData.activeTariff.toLowerCase())}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("daysRemaining")}</span>
                  <span>
                    {mockUserData.daysRemaining} {t("days")}
                  </span>
                </div>
                <Progress value={(mockUserData.daysRemaining / 90) * 100} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card data-aos="fade-up">
              <CardHeader>
                <CardTitle>{t("dailyEarnings")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(mockUserData.dailyEarnings, currency)}
                </div>
              </CardContent>
            </Card>
            <Card data-aos="fade-up" data-aos-delay="100">
              <CardHeader>
                <CardTitle>{t("monthlyEarnings")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(mockUserData.monthlyEarnings, currency)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle>{t("referrals")}</CardTitle>
              <CardDescription>{t("invitedFriends")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUserData.referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{referral.name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(referral.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        referral.status === "paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {t(referral.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <ReferralShare />
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tariffs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockUserData.tariffs.map((tariff) => (
              <Card key={tariff.id} data-aos="fade-up">
                <CardHeader>
                  <CardTitle>{t(tariff.name)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-48 overflow-hidden rounded-md">
                    <div className="carousel">
                      <div className="carousel-inner">
                        {tariff.images.map((image, index) => (
                          <div key={index} className="carousel-item">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`${tariff.name} image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t("productPrice")}:</p>
                      <p className="font-medium">{formatCurrency(tariff.price, currency)}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t("dailyIncome")}:</p>
                      <p className="font-medium">{formatCurrency(tariff.dailyProfit, currency)}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t("incomeDuration")}:</p>
                      <p className="font-medium">
                        {tariff.duration} {t("days")}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t("totalIncome")}:</p>
                      <p className="font-medium">{formatCurrency(tariff.dailyProfit * tariff.duration, currency)}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t("tariffPrice")}:</p>
                      <p className="font-medium">{formatCurrency(tariff.price, currency)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handlePayClick(tariff)} data-aos="zoom-in">
                    {t("pay")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Payment Process UI */}
          {selectedTariff && (
            <Card className="mt-8" data-aos="fade-up">
              <CardHeader>
                <CardTitle>
                  {t(selectedTariff.name)} - {t("payment")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {showPaymentTimer && (
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
                    <Clock className="h-8 w-8 text-primary animate-pulse" />
                    <p>{t("waitPayment")}</p>
                  </div>
                )}

                {showCardNumber && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-medium mb-2">Card Number:</p>
                      <p className="text-xl font-mono">4242 4242 4242 4242</p>
                      <p className="mt-4 text-sm text-muted-foreground">{t("completePayment")}</p>
                    </div>
                  </div>
                )}

                {showUploadTimer && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-medium mb-2">{t("uploadReceipt")}</p>
                      <div
                        className={`border-2 border-dashed rounded-md p-8 text-center ${
                          isDragging ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Upload className="h-10 w-10 mx-auto mb-4 text-primary" />
                        <p className="mb-2">{uploadedFile ? uploadedFile.name : "Drag and drop your receipt here"}</p>
                        <p className="text-sm text-muted-foreground mb-4">PDF, JPG, PNG (max 5MB)</p>
                        <input
                          type="file"
                          id="receipt"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                        <Button asChild variant="outline" size="sm">
                          <label htmlFor="receipt">Browse Files</label>
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleUpload} disabled={!uploadedFile}>
                      {t("submit")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
