import sql from 'mssql';
import { NextResponse } from 'next/server';

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

export async function POST(req) {
    const { customerName, customerEmail, customerPhone, address, city, postalCode, totalAmount, deliveryMethod, orderStatus, isHomeDelivery } = await req.json();

    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('CustomerName', sql.NVarChar, customerName)
        .input('CustomerEmail', sql.NVarChar, customerEmail)
        .input('CustomerPhone', sql.NVarChar, customerPhone)
        .input('Address', sql.NVarChar, address)
        .input('City', sql.NVarChar, city)
        .input('PostalCode', sql.NVarChar, postalCode)
        .input('TotalAmount', sql.Decimal, totalAmount)
        .input('DeliveryMethod', sql.NVarChar, deliveryMethod)
        .input('OrderStatus', sql.NVarChar, orderStatus)
        .input('IsHomeDelivery', sql.Bit, isHomeDelivery)
        .query(`
          INSERT INTO Orders 
          (     CustomerName,
                CustomerEmail,
                CustomerPhone,
                Address,
                City,
                PostalCode,
                TotalAmount,
                DeliveryMethod,
                OrderStatus,
                CreatedAt,
                UpdatedAt,
                IsHomeDelivery) 
          VALUES 
          (     @CustomerName,
                @CustomerEmail,
                @CustomerPhone,
                @Address,
                @City,
                @PostalCode,
                @TotalAmount,
                @DeliveryMethod,
                @OrderStatus,
                GETDATE(),
                GETDATE(),
                @IsHomeDelivery)
          SELECT SCOPE_IDENTITY() AS OrderId;
        `);

        const orderId = result.recordset[0].OrderId;
        return NextResponse.json({ message: 'Order placed successfully', orderId }); // Use NextResponse
      } catch (error) {
        console.error('Error placing order:', error);
        return NextResponse.json({ message: 'Error placing order' }, { status: 500 }); // Use NextResponse
      }
}

export async function GET() {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM dbo.Orders");
    await sql.close();
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}