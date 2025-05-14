"use client"

import { useState, useEffect } from "react"
import { Check, Copy, Share2, MessageCircle, Phone, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

export function ReferralShare() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [referralLink, setReferralLink] = useState("")

  // Generate a unique referral link for the current user
  // In a real app, this would come from the backend
  useEffect(() => {
    // Use a fixed ID for the current user (would come from auth in a real app)
    const userId = "user123456"
    setReferralLink(`https://mlm-platform.com/ref/${userId}`)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast({
      title: t("copied"),
      description: t("referralLinkCopied"),
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("joinMlmPlatform"),
          text: t("joinMeOnMlm"),
          url: referralLink,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopy()
    }
  }

  const shareViaTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(t("joinMeOnMlm"))}`
    window.open(telegramUrl, "_blank")
  }

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(t("joinMeOnMlm") + ": " + referralLink)}`
    window.open(whatsappUrl, "_blank")
  }

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
    window.open(facebookUrl, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input value={referralLink} readOnly className="bg-secondary/10" />
        <Button size="icon" variant="outline" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button className="w-full" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          {t("shareReferralLink")}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={shareViaTelegram} className="flex-1">
            <MessageCircle className="h-4 w-4 text-blue-500" />
          </Button>
          <Button variant="outline" size="icon" onClick={shareViaWhatsApp} className="flex-1">
            <Phone className="h-4 w-4 text-green-500" />
          </Button>
          <Button variant="outline" size="icon" onClick={shareViaFacebook} className="flex-1">
            <Facebook className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">{t("referralBonusInfo")}</p>
    </div>
  )
}
