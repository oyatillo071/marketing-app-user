"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

export default function EmailRegisterPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call to send verification code to email
    setTimeout(() => {
      setIsLoading(false)
      setIsVerifying(true)
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      })
    }, 1500)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call to verify code and register user
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
      toast({
        title: "Registration successful",
        description: "You have been registered successfully.",
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <Card className="w-full max-w-md mx-auto" data-aos="fade-up">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t("register")}</CardTitle>
          <CardDescription className="text-center">{isVerifying ? t("verify") : t("register")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isVerifying ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-secondary/10"
                  data-aos="fade-up"
                  data-aos-delay="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/10"
                  data-aos="fade-up"
                  data-aos-delay="150"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")} (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-secondary/10"
                  data-aos="fade-up"
                  data-aos-delay="200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-secondary/10"
                  data-aos="fade-up"
                  data-aos-delay="250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm {t("password")}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-secondary/10"
                  data-aos="fade-up"
                  data-aos-delay="300"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading} data-aos="zoom-in" data-aos-delay="350">
                {isLoading ? "Sending code..." : "Send Verification Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">{t("verify")}</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="bg-secondary/10"
                  data-aos="fade-up"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading} data-aos="zoom-in" data-aos-delay="100">
                {isLoading ? "Verifying..." : "Complete Registration"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {t("login")}?{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("login")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
