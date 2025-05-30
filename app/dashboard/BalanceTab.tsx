"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import io from "socket.io-client";
import { API_CONFIG } from "@/constants/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const WS_URL = API_CONFIG.wsUrl;

const COUNTRIES = [
  { code: "UZ", name: "O‘zbekiston" },
  { code: "RU", name: "Rossiya" },
  { code: "KZ", name: "Qozog‘iston" },
];

const CARD_TYPES = [
  { type: "uzcard", label: "Uzcard" },
  { type: "humo", label: "Humo" },
  { type: "visa", label: "Visa" },
  { type: "mastercard", label: "Mastercard" },
];

export function BalanceTab({
  userId,
  currency,
  balance,
}: {
  userId: string;
  currency: string;
  balance: number;
}) {
  // Modal holatlari
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  // To‘ldirish uchun
  const [amount, setAmount] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0].code);
  const [cardType, setCardType] = useState(CARD_TYPES[0].type);
  const [step, setStep] = useState<"form" | "wait_card" | "paying" | "done">(
    "form"
  );
  const [adminCard, setAdminCard] = useState<{
    number: string;
    bank: string;
  } | null>(null);
  const [timer, setTimer] = useState(120);
  const [checkFile, setCheckFile] = useState<File | null>(null);

  // Yechish uchun
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState<
    "idle" | "waiting" | "approved" | "rejected"
  >("idle");
  const [withdrawCardNumber, setWithdrawCardNumber] = useState("");
  const [withdrawCardType, setWithdrawCardType] = useState(CARD_TYPES[0].type);

  // Tarix uchun (mock yoki WebSocket orqali to‘ldiriladi)
  const [withdrawHistory, setWithdrawHistory] = useState<
    { id: number; amount: number; status: string; date: string; card: string }[]
  >([
    {
      id: 1,
      amount: 500,
      status: "processed",
      date: "2023-05-01T14:30:45Z",
      card: "**** 4242",
    },
    {
      id: 2,
      amount: 300,
      status: "pending",
      date: "2023-05-15T09:15:22Z",
      card: "**** 4444",
    },
    {
      id: 3,
      amount: 700,
      status: "processed",
      date: "2023-04-20T16:45:10Z",
      card: "**** 4242",
    },
  ]);

  const socketRef = useRef<any>(null);

  // paymentResponse xabari uchun state
  const [paymentResponseMsg, setPaymentResponseMsg] = useState<string | null>(
    null
  );

  // WebSocket ulanishi
  useEffect(() => {
    socketRef.current = io(WS_URL, {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("mlm_token") },
    });

    // paymentResponse eventini tinglash
    socketRef.current.on("paymentResponse", (data: { message?: string }) => {
      if (data?.message) {
        setPaymentResponseMsg(data.message);
        setStep("wait_card");
        toast.info(data.message);
      }
    });

    // Admin karta yuboradi
    socketRef.current.on(
      "card_info",
      (data: { cardNumber: string; message: string }) => {
        setAdminCard({ number: data.cardNumber, bank: "Admin bank" });
        setStep("paying");
        setTimer(120);
        toast.info(data.message);
      }
    );

    // To‘lov natijasi
    socketRef.current.on(
      "payment_confirmed",
      (data: { confirmed: boolean; message: string }) => {
        if (data.confirmed) {
          setStep("done");
          toast.success(data.message || "To‘ldirish muvaffaqiyatli!");
        } else {
          toast.error(data.message || "To‘ldirishda xatolik!");
        }
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Timer
  useEffect(() => {
    if (step === "paying" && timer > 0) {
      const t = setTimeout(() => setTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  // To‘ldirish so‘rovi
  const handleDepositRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error("Summani kiriting");
    socketRef.current.emit("paymentRequest", {
      currency,
      how_much: amount,
    });
    setStep("wait_card");
  };

  // Chek yuklash
  const handleCheckUpload = () => {
    if (!checkFile) return toast.error("Chekni yuklang");
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit("upload_screenshot", {
        screenshotUrl: reader.result, // Faylni base64 ko‘rinishda yuboriladi
      });
      setStep("wait_card");
    };
    reader.readAsDataURL(checkFile);
  };

  // Pul yechish so‘rovi
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0)
      return toast.error("Summani kiriting");
    if (Number(withdrawAmount) > balance)
      return toast.error("Balansda yetarli mablag‘ yo‘q");
    if (!withdrawCardNumber || withdrawCardNumber.length < 8)
      return toast.error("Karta raqamini to‘g‘ri kiriting");
    socketRef.current.emit("withdraw_request", {
      userId,
      amount: withdrawAmount,
      cardNumber: withdrawCardNumber,
      cardType: withdrawCardType,
    });
    setWithdrawStatus("waiting");
  };

  // Tarix uchun format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div>
      <Card className="bg-white dark:bg-[#111827] shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">
            Balans:{" "}
            <span className="text-primary">
              {balance} {currency}
            </span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Pulingizni to‘ldirish yoki yechish uchun quyidagi tugmalardan
            foydalaning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              className="bg-[#00FF99] text-white hover:bg-[#00FF99]/90 flex-1"
              onClick={() => {
                setOpenDeposit(true);
                setStep("form");
                setAmount("");
                setAdminCard(null);
                setCheckFile(null);
              }}
            >
              Pul to‘ldirish
            </Button>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 flex-1"
              onClick={() => {
                setOpenWithdraw(true);
                setWithdrawAmount("");
                setWithdrawCardNumber("");
                setWithdrawCardType(CARD_TYPES[0].type);
                setWithdrawStatus("idle");
              }}
            >
              Pul yechish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pul to‘ldirish MODAL */}
      <Dialog
        open={openDeposit}
        onOpenChange={(open) => {
          setOpenDeposit(open);
          if (!open) {
            setPaymentResponseMsg(null);
            setStep("form");
            setAmount("");
            setAdminCard(null);
            setCheckFile(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pul to‘ldirish</DialogTitle>
            <DialogDescription>
              Balansingizni to‘ldirish uchun so‘rov yuboring
            </DialogDescription>
          </DialogHeader>
          {/* paymentResponse xabari */}
          {paymentResponseMsg && (
            <div className="mb-4 p-3 rounded bg-blue-50 text-blue-800 border border-blue-200 text-center">
              {paymentResponseMsg}
            </div>
          )}
          {step === "form" && (
            <form onSubmit={handleDepositRequest} className="space-y-4">
              <Label>Summani kiriting</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
                required
              />
              <Label>Davlat</Label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Label>Karta turi</Label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
              >
                {CARD_TYPES.map((c) => (
                  <option key={c.type} value={c.type}>
                    {c.label}
                  </option>
                ))}
              </select>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#00FF99] text-white hover:bg-[#00FF99]/90"
                >
                  To‘ldirish so‘rovi
                </Button>
              </DialogFooter>
            </form>
          )}
          {step === "wait_card" && (
            <div className="text-center py-8">
              <p>Admin kartani yuborishini kuting...</p>
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-4"></div>
            </div>
          )}
          {step === "paying" && adminCard && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-bold">
                  Kartaga {amount} {currency} o‘tkazing:
                </p>
                <p className="text-lg">
                  {adminCard.number} ({adminCard.bank})
                </p>
                <p className="text-sm text-red-500">
                  Chekni yuklash uchun {timer} soniya qoldi
                </p>
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCheckFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={handleCheckUpload}
                className="w-full flex gap-2 bg-[#00FF99] text-white hover:bg-[#00FF99]/90"
              >
                <Upload className="w-4 h-4" /> Chekni yuborish
              </Button>
            </div>
          )}
          {step === "done" && (
            <div className="text-center py-8">
              <p className="text-green-600 font-bold">
                To‘ldirish muvaffaqiyatli!
              </p>
              <Button
                onClick={() => {
                  setStep("form");
                  setAmount("");
                  setAdminCard(null);
                  setOpenDeposit(false);
                }}
                className="bg-[#00FF99] text-white hover:bg-[#00FF99]/90"
              >
                Yopish
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pul yechish MODAL */}
      <Dialog open={openWithdraw} onOpenChange={setOpenWithdraw}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pul yechish</DialogTitle>
            <DialogDescription>
              Balansdan pul yechish uchun so‘rov yuboring
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <Label>Summani kiriting</Label>
            <Input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min={1}
              max={balance}
              required
            />
            <Label>Karta raqami</Label>
            <Input
              type="text"
              value={withdrawCardNumber}
              onChange={(e) =>
                setWithdrawCardNumber(e.target.value.replace(/\D/g, ""))
              }
              maxLength={19}
              placeholder="XXXX XXXX XXXX XXXX"
              required
            />
            <Label>Karta turi</Label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={withdrawCardType}
              onChange={(e) => setWithdrawCardType(e.target.value)}
            >
              {CARD_TYPES.map((c) => (
                <option key={c.type} value={c.type}>
                  {c.label}
                </option>
              ))}
            </select>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                disabled={withdrawStatus === "waiting"}
              >
                {withdrawStatus === "waiting"
                  ? "So‘rov yuborildi..."
                  : "Yechish so‘rovi"}
              </Button>
            </DialogFooter>
          </form>
          {withdrawStatus === "approved" && (
            <p className="text-green-600 mt-4">Pul yechish tasdiqlandi!</p>
          )}
          {withdrawStatus === "rejected" && (
            <p className="text-red-600 mt-4">Pul yechish rad etildi!</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Tarix */}
      <Card className="bg-white dark:bg-[#111827] shadow-lg">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">
            Yechish tarixi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawHistory.length === 0 && (
              <p className="text-gray-600 dark:text-gray-300">Tarix yo‘q</p>
            )}
            {withdrawHistory.map((item) => (
              <div
                key={item.id}
                className="flex flex-col border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {item.amount} {currency}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(item.date)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {item.card}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      item.status === "processed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {item.status === "processed"
                      ? "Tasdiqlangan"
                      : "Kutilmoqda"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
