export async function GET(req) {
    const secretKey = process.env.SECRET_API_KEY; 

    const headerSecretKey = req.headers.get("x-secret-key");
  
    if (!headerSecretKey || headerSecretKey !== secretKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  
    return new Response(JSON.stringify({ password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD }), { status: 200 });
  }
  
  