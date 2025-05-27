import { useQuery, useQueryClient } from "@tanstack/react-query"

// Mock API functions
const fetchTariffs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      id: "1",
      name: "Starter",
      price: 99,
      duration: 30,
      features: ["Basic support", "5 products", "Email notifications"],
      popular: false,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      name: "Professional",
      price: 299,
      duration: 30,
      features: ["Priority support", "Unlimited products", "SMS notifications", "Analytics"],
      popular: true,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "3",
      name: "Enterprise",
      price: 599,
      duration: 30,
      features: ["24/7 support", "Custom integrations", "Advanced analytics", "White-label"],
      popular: false,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]
}

export function useTariffs() {
  const queryClient = useQueryClient()

  const {
    data: tariffs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tariffs"],
    queryFn: fetchTariffs,
  })

  return {
    tariffs,
    isLoading,
    error,
  }
}
