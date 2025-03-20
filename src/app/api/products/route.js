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
    const result = await sql.query("SELECT * FROM dbo.Products");
    await sql.close();
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
    await sql.query`INSERT INTO dbo.Products (Name, Price, Stock, ImageUrl, CreatedAt, Description) 
                    VALUES (${name}, ${price}, ${stock}, ${imageUrl}, GETDATE()), ${description}`;
    await sql.close();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

// ✅ PUT: Update a product (Fixing your 404 error)
export async function PUT(req) {
  try {
    const { id, name, price, stock, imageUrl, description } = await req.json();
    if (!id || !name || !price || !stock || !imageUrl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await sql.connect(config);
    const result = await sql.query`UPDATE dbo.Products 
                                   SET Name=${name}, Price=${price}, Stock=${stock}, ImageUrl=${imageUrl}, Description=${description} 
                                   WHERE Id=${id}`;
    await sql.close();

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// ✅ DELETE: Remove a product
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await sql.connect(config);
    const result = await sql.query`DELETE FROM dbo.Products WHERE Id=${id}`;
    await sql.close();

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
