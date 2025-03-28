export async function GET(req) {
    const secretKey = req.headers.get("x-secret-key");
  
    if (!secretKey || secretKey !== process.env.SECRET_API_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  
    return new Response(JSON.stringify({ password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD }), { status: 200 });
  }
  
  