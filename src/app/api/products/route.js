import sql from 'mssql';
import { NextResponse } from "next/server";

const config = { 
  server: 'notificationserversecondserver.database.windows.net',
  database: 'FlowerShopDB',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  options: { 
    encrypt: true,
    enableArithAbort: true 
  } 
}; 

// ✅ GET: Fetch all products
export async function GET() {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM dbo.Products");
    
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}


// ✅ POST: Create a new product
export async function POST(req) {
  try {
    const { name, price, stock, imageUrl, description } = await req.json();
    
    if (!name || !price || !stock || !imageUrl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await sql.connect(config);
    const request = new sql.Request();

    request.input("Name", sql.NVarChar, name);
    request.input("Price", sql.Decimal, price);
    request.input("Stock", sql.Int, stock);
    request.input("ImageUrl", sql.NVarChar, imageUrl);
    request.input("Description", sql.NVarChar, description);

    await request.query(`
      INSERT INTO dbo.Products (Name, Price, Stock, ImageUrl, CreatedAt, Description) 
      VALUES (@Name, @Price, @Stock, @ImageUrl, GETDATE(), @Description)
    `);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}


