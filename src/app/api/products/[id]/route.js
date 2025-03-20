import { deleteBlob } from "@/lib/azure";
import sql from "mssql";
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

// ✅ PUT: Update a product
export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const { name, price, stock, imageUrl, description } = await req.json();

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
    export async function DELETE(req, { params }) {
        try {
        const id = params.id;
    
        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }
    
        await sql.connect(config);
    
        // 1️⃣ Fetch the image URL before deleting the product
        const imageResult = await sql.query`SELECT ImageUrl FROM dbo.Products WHERE Id=${id}`;
        if (imageResult.recordset.length === 0) {
            await sql.close();
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
    
        const imageUrl = imageResult.recordset[0].ImageUrl;
    
        // 2️⃣ Delete the product from the database
        const deleteResult = await sql.query`DELETE FROM dbo.Products WHERE Id=${id}`;
    
        if (deleteResult.rowsAffected[0] === 0) {
            await sql.close();
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
    
        await sql.close();
    
        // 3️⃣ Delete the associated image from Azure Blob Storage
        if (imageUrl) {
            const url = new URL(imageUrl);
            const fileName = url.pathname.split("/").pop(); // Extract filename correctly
            await deleteBlob(fileName);
        }
    
        return NextResponse.json({ success: true });
    
        } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
        }
    }
