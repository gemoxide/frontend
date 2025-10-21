// Environment Configuration
// You can override these values by setting environment variables

export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
  API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || "http://127.0.0.1:8000",

  // App Configuration
  APP_ENV: import.meta.env.VITE_APP_ENV || "development",

  // Debug Configuration
  DEBUG: import.meta.env.VITE_DEBUG === "true" || false,
} as const;

// Helper to log configuration in development
if (ENV_CONFIG.APP_ENV === "development" && ENV_CONFIG.DEBUG) {
  console.log("🔧 Environment Configuration:", ENV_CONFIG);
}
