import axios from "axios";
import { API_CONFIG } from "@/constants/api";
import mockData from "../data/mock.json";

// Create axios instance
export const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  // timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("mlm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("mlm_token");
        localStorage.removeItem("mlm_user");
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Helper to determine if we should use mock data or real API
export const useMockData = () => {
  return API_CONFIG.useMockData;
};

// ==================== AUTH API ====================

export const loginUser = async (email, password) => {
  // if (useMockData()) {
  //   // Simulate API delay
  //   await new Promise((resolve) => setTimeout(resolve, 800));

  //   const user = mockData.users.find(
  //     (u) => u.email === email && u.password === password
  //   );

  //   if (!user) {
  //     throw new Error("Invalid credentials");
  //   }

  //   // Generate a mock token
  //   const token = `mock-token-${Date.now()}`;

  //   // Store in localStorage
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("mlm_token", token);
  //     localStorage.setItem(
  //       "mlm_user",
  //       JSON.stringify({
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         role: user.role,
  //       })
  //     );
  //   }

  //   return {
  //     user: {
  //       id: user.id,
  //       name: user.name,
  //       email: user.email,
  //       role: user.role,
  //     },
  //     token,
  //   };
  // }

  const response = await api.post("/authorization/login", { email, password });

  // console.log(response, response.data, "92qator");

  // Store in localStorage;
  if (typeof window !== "undefined") {
    localStorage.setItem("mlm_token", response.data.token);
    localStorage.setItem("mlm_user", JSON.stringify(response.data.data.user));
  }

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/authorization/register", userData);

  console.log(response, response.data, "142qator");

  return response.data;
};

export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("mlm_token");
    localStorage.removeItem("mlm_user");
  }
};

export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const userJson = localStorage.getItem("mlm_user");
    if (userJson) {
      return JSON.parse(userJson);
    }
  }
  return null;
};

export const verifyEmail = async (token) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.post("/auth/verify-email", { token });
  return response.data;
};

export const requestPasswordReset = async (email) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.post("/auth/reset-password", { token, password });
  return response.data;
};

// ==================== PRODUCTS API ====================

export const fetchProducts = async (filters = {}) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = [...mockData.products];

    // Apply filters if any
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredProducts;
  }

  const response = await api.get("/products", { params: filters });
  return response.data;
};

export const fetchProductById = async (id) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const product = mockData.products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  const response = await api.get(`/products/${id}`);
  return response.data;
};

// ==================== TARIFFS API ====================

export const fetchTariffs = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockData.tariffs;
  }

  try {
    const response = await api.get("/tariff");
    return response.data;
  } catch (error) {
    console.error("Error fetching tariffs:", error);
    throw error;
  }
};

export const fetchTariffById = async (id) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const tariff = mockData.tariffs.find((t) => t.id === id);
    if (!tariff) {
      throw new Error("Tariff not found");
    }

    return tariff;
  }

  const response = await api.get(`/tariff/${id}`);
  return response.data;
};

// ==================== PAYMENT API ====================

export const initiatePayment = async (tariffId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const tariff = mockData.tariffs.find((t) => t.id === tariffId);
    if (!tariff) {
      throw new Error("Tariff not found");
    }

    return {
      paymentId: `payment-${Date.now()}`,
      tariffId,
      amount: tariff.price,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + API_CONFIG.paymentTimeouts.adminCardSelection
      ).toISOString(),
    };
  }

  const response = await api.post("/payments/initiate", { tariffId });
  return response.data;
};

export const getPaymentDetails = async (paymentId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const payment = mockData.payments.find((p) => p.id === paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};

export const uploadPaymentReceipt = async (paymentId, receiptFile) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      paymentId,
      receiptUrl: "https://example.com/mock-receipt.jpg",
      uploadedAt: new Date().toISOString(),
      status: "pending_approval",
    };
  }

  const formData = new FormData();
  formData.append("receipt", receiptFile);

  const response = await api.post(`/payments/${paymentId}/receipt`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const cancelPayment = async (paymentId, reason) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      paymentId,
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
      reason,
    };
  }

  const response = await api.post(`/payments/${paymentId}/cancel`, { reason });
  return response.data;
};

// ==================== USER PROFILE API ====================

export const fetchUserProfile = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const user = mockData.users.find((u) => u.id === currentUser.id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      ...user,
      password: undefined, // Don't return password
    };
  }

  const response = await api.get("/users/profile");
  return response.data;
};

export const updateUserProfile = async (userData) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Update user in localStorage
    const updatedUser = {
      ...currentUser,
      ...userData,
    };

    localStorage.setItem("mlm_user", JSON.stringify(updatedUser));

    return updatedUser;
  }

  const response = await api.put("/users/profile", userData);

  // Update user in localStorage
  if (typeof window !== "undefined") {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...response.data,
      };
      localStorage.setItem("mlm_user", JSON.stringify(updatedUser));
    }
  }

  return response.data;
};

export const uploadAvatar = async (file) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      avatarUrl: URL.createObjectURL(file),
    };
  }

  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.post("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// export const changePassword = async (currentPassword, newPassword) => {
//   if (useMockData()) {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 800));
//     return { success: true };
//   }

//   const response = await api.post("/users/change-password", {
//     currentPassword,
//     newPassword,
//   });

//   return response.data;
// };

/**
 * Parolni o‘zgartirish
 * @param {string|number} userId
 * @param {string} oldPassword
 * @param {string} newPassword
 */
export const changeUserPassword = async (userId, oldPassword, newPassword) => {
  return api.patch(`/users/${userId}`, {
    oldPassword,
    newPassword,
  });
};

// ==================== REFERRALS API ====================

export const fetchReferrals = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Generate mock referrals
    const referrals = [];
    for (let i = 0; i < 5; i++) {
      referrals.push({
        id: `referral-${i}`,
        name: `Referral User ${i + 1}`,
        email: `referral${i + 1}@example.com`,
        status: i % 2 === 0 ? "active" : "pending",
        joinedAt: new Date(Date.now() - i * 86400000).toISOString(),
        earnings: Math.floor(Math.random() * 500) + 100,
      });
    }

    return referrals;
  }

  const response = await api.get("/referrals");
  return response.data;
};

export const getReferralLink = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    return {
      referralCode: `REF${currentUser.id}`,
      referralLink: `https://mlm-platform.com/ref/REF${currentUser.id}`,
    };
  }

  const response = await api.get("/referrals/link");
  return response.data;
};

// ==================== EARNINGS API ====================

export const fetchEarnings = async (period = "monthly") => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock earnings data
    const data = [];

    if (period === "daily") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split("T")[0],
          amount: Math.floor(Math.random() * 50) + 10,
        });
      }
    } else if (period === "weekly") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i * 7);
        data.push({
          week: `Week ${4 - i}`,
          amount: Math.floor(Math.random() * 300) + 100,
        });
      }
    } else if (period === "monthly") {
      // Last 6 months
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentMonth = new Date().getMonth();

      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        data.push({
          month: months[monthIndex],
          amount: Math.floor(Math.random() * 1000) + 300,
        });
      }
    }

    return {
      period,
      data,
      total: data.reduce((sum, item) => sum + item.amount, 0),
    };
  }

  const response = await api.get("/earnings", { params: { period } });
  return response.data;
};

export const fetchWithdrawalHistory = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock withdrawal history
    const withdrawals = [];
    for (let i = 0; i < 5; i++) {
      withdrawals.push({
        id: `withdrawal-${i}`,
        amount: Math.floor(Math.random() * 500) + 100,
        status: ["processed", "pending", "processed", "processed", "pending"][
          i
        ],
        date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
        card: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }

    return withdrawals;
  }

  const response = await api.get("/withdrawals/history");
  return response.data;
};

export const requestWithdrawal = async (amount, cardId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: `withdrawal-${Date.now()}`,
      amount,
      cardId,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };
  }

  const response = await api.post("/withdrawals/request", { amount, cardId });
  return response.data;
};

// ==================== CARDS API ====================

export const fetchUserCards = async () => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock cards
    return [
      {
        id: "card-1",
        number: "4242 4242 4242 4242",
        type: "Visa",
        expiryDate: "12/25",
        isDefault: true,
      },
      {
        id: "card-2",
        number: "5555 5555 5555 4444",
        type: "Mastercard",
        expiryDate: "10/24",
        isDefault: false,
      },
    ];
  }

  const response = await api.get("/cards");
  return response.data;
};

export const addCard = async (cardData) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: `card-${Date.now()}`,
      number: cardData.number,
      type: cardData.number.startsWith("4") ? "Visa" : "Mastercard",
      expiryDate: cardData.expiryDate,
      isDefault: cardData.isDefault || false,
    };
  }

  const response = await api.post("/cards", cardData);
  return response.data;
};

export const updateCard = async (cardId, cardData) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: cardId,
      ...cardData,
    };
  }

  const response = await api.put(`/cards/${cardId}`, cardData);
  return response.data;
};

export const deleteCard = async (cardId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.delete(`/cards/${cardId}`);
  return response.data;
};

export const setDefaultCard = async (cardId) => {
  if (useMockData()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }

  const response = await api.post(`/cards/${cardId}/default`);
  return response.data;
};
