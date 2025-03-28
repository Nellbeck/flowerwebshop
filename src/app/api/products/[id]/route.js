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

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await sql.connect(config);
    const request = new sql.Request();

    request.input("Id", sql.Int, id);
    if (name || price || imageUrl || description) {
      if (!name || !price || !imageUrl) {
        return NextResponse.json({ error: "Name, price, and imageUrl are required for a full update" }, { status: 400 });
      }

      request.input("Name", sql.NVarChar, name);
      request.input("Price", sql.Decimal, price);
      request.input("Stock", sql.Int, stock);
      request.input("ImageUrl", sql.NVarChar, imageUrl);
      request.input("Description", sql.NVarChar, description);

      const result = await request.query(`
        UPDATE dbo.Products 
        SET Name=@Name, Price=@Price, Stock=@Stock, ImageUrl=@ImageUrl, Description=@Description
        WHERE Id=@Id
      `);

      if (result.rowsAffected[0] === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
    } else if (typeof stock === "number") {
      request.input("Stock", sql.Int, stock);
      const result = await request.query(`
        UPDATE dbo.Products SET Stock=@Stock WHERE Id=@Id
      `);

      if (result.rowsAffected[0] === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to update product or stock" }, { status: 500 });
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
        const request = new sql.Request();
    
        request.input("Id", sql.Int, id);
    
        // Fetch the image URL before deleting the product
        const imageResult = await request.query(`SELECT ImageUrl FROM dbo.Products WHERE Id=@Id`);
        if (imageResult.recordset.length === 0) {
          return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
    
        const imageUrl = imageResult.recordset[0].ImageUrl;
    
        // Delete the product
        const deleteResult = await request.query(`DELETE FROM dbo.Products WHERE Id=@Id`);
        if (deleteResult.rowsAffected[0] === 0) {
          return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
    
        // Delete image from Azure Blob Storage
        if (imageUrl) {
          const url = new URL(imageUrl);
          const fileName = url.pathname.split("/").pop();
          await deleteBlob(fileName);
        }
    
        return NextResponse.json({ success: true });
    
      } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
      }
    }
    
    
    // ✅ GET: Fetch a single product
    export async function GET(req, context) {
      const params = await context.params;
    
      if (!params?.id) {
        return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
      }
    
      try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input("Id", sql.Int, params.id);
    
        const result = await request.query(`SELECT * FROM dbo.Products WHERE Id=@Id`);
        
        if (result.recordset.length === 0) {
          return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
    
        return NextResponse.json(result.recordset[0]);
      } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
      }
    }
    