export const API_CONFIG = {
  // Set to true to use mock data from data.json
  // Set to false to use real API endpoints
  useMockData: false,

  // Base URL for API requests when useMockData is false

  // baseUrl: "http://192.168.54.196:3000",
  baseUrl: "http://164.68.120.136:2255",
  // baseUrl: "https://tarmoqli-marketing.onrender.com",
  // WebSocket URL for real-time updates
  wsUrl: "wss://api.mlm-platform.com/ws",

  // Timeout in milliseconds
  // timeout: 10000,

  // Payment processing timeouts (in milliseconds)
  paymentTimeouts: {
    adminCardSelection: 2 * 60 * 1000, // 2 minutes
    userPaymentUpload: 10 * 60 * 1000, // 10 minutes
  },
};
