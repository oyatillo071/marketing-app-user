import { useEffect, useState } from "react";

export function TariffCountdown({
  startDate,
  endDate,
}: {
  startDate: string | Date;
  endDate: string | Date;
}) {
  const [remaining, setRemaining] = useState(
    new Date(endDate).getTime() - Date.now()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(new Date(endDate).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (remaining <= 0) {
    return (
      <span className="text-red-500 font-semibold text-xs">
        Tarif muddati tugadi
      </span>
    );
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <span className="text-xs text-muted-foreground font-mono">
      Tarif tugashiga: {days} kun {hours} soat {minutes} min {seconds} sek
    </span>
  );
}
