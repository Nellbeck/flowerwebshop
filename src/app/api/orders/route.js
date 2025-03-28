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
    const { customerName, customerEmail, customerPhone, address, city, postalCode, totalAmount, deliveryMethod, orderStatus, isHomeDelivery, items } = await req.json();

    if (!items || !items.length) {
        return NextResponse.json({ message: "Order must contain at least one product" }, { status: 400 });
    }

    console.log(items);

    try {
        const pool = await sql.connect(config);

        // Insert order into Orders table
        const orderResult = await pool
            .request()
            .input("CustomerName", sql.NVarChar, customerName)
            .input("CustomerEmail", sql.NVarChar, customerEmail)
            .input("CustomerPhone", sql.NVarChar, customerPhone)
            .input("Address", sql.NVarChar, address)
            .input("City", sql.NVarChar, city)
            .input("PostalCode", sql.NVarChar, postalCode)
            .input("TotalAmount", sql.Decimal, totalAmount)
            .input("OrderStatus", sql.NVarChar, orderStatus)
            .input("DeliveryMethod", sql.NVarChar, deliveryMethod)
            .input("IsHomeDelivery", sql.Bit, isHomeDelivery)
            .query(`
                INSERT INTO Orders (CustomerName, CustomerEmail, CustomerPhone, Address, City, PostalCode, TotalAmount, OrderStatus, DeliveryMethod, IsHomeDelivery)
                OUTPUT INSERTED.OrderId
                VALUES (@CustomerName, @CustomerEmail, @CustomerPhone, @Address, @City, @PostalCode, @TotalAmount, @OrderStatus, @DeliveryMethod, @IsHomeDelivery);
            `);

        const orderId = orderResult.recordset[0].OrderId;

        // Insert order items into OrderItems table
        for (const item of items) {
            await pool
                .request()
                .input("OrderId", sql.Int, orderId)
                .input("ProductId", sql.Int, item.Id)
                .input("Quantity", sql.Int, item.quantity)
                .input("PriceAtPurchase", sql.Decimal, item.Price)
                .query(`
                    INSERT INTO OrderItems (OrderId, ProductId, Quantity, PriceAtPurchase)
                    VALUES (@OrderId, @ProductId, @Quantity, @PriceAtPurchase);
                `);
        }

        return NextResponse.json({ message: 'Order placed successfully', orderId }); 
    } catch (error) {
        console.error('Error placing order:', error);
        return NextResponse.json({ message: 'Error placing order', error: error.message }, { status: 500 });    
    }
}

export async function GET() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM dbo.Orders");
        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
