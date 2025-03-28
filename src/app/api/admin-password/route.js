export async function POST(req) {
    // Get the password sent from the frontend
    const { password } = await req.json();
  
    // Get the correct admin password from environment variables
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  
    // Check if the password is correct
    if (password === correctPassword) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Incorrect password" }),
        { status: 401 }
      );
    }
  }
  
  
  