/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        PORT: process.env.PORT || 8080, // Ensure the app picks up Azure's port
      },
  };
  
  export default nextConfig;
  
