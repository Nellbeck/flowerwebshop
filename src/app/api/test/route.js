import sql from "mssql";

export async function GET() {
  try {
    await sql.connect({
      server: "notificationserversecondserver.database.windows.net",
      database: "FlowerShopDB",
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
    });

    return new Response(JSON.stringify({ success: "Connected successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
