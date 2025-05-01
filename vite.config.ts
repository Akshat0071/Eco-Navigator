import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 8080,
      host: true, // This allows access from other devices on the network
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Expose all env variables to the client
    define: {
      'process.env': env,
      // Explicitly define VITE_ prefixed env variables
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'import.meta.env.VITE_OPENWEATHER_API_KEY': JSON.stringify(env.VITE_OPENWEATHER_API_KEY),
      'import.meta.env.VITE_CARBON_FOOTPRINT_API_KEY': JSON.stringify(env.VITE_CARBON_FOOTPRINT_API_KEY),
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
      'import.meta.env.VITE_GOOGLE_CLIENT_SECRET': JSON.stringify(env.VITE_GOOGLE_CLIENT_SECRET),
      'import.meta.env.VITE_GITHUB_CLIENT_ID': JSON.stringify(env.VITE_GITHUB_CLIENT_ID),
      'import.meta.env.VITE_GITHUB_CLIENT_SECRET': JSON.stringify(env.VITE_GITHUB_CLIENT_SECRET),
      'import.meta.env.VITE_MONGODB_URI': JSON.stringify(env.VITE_MONGODB_URI),
      'import.meta.env.VITE_JWT_SECRET': JSON.stringify(env.VITE_JWT_SECRET),
    }
  };
});
