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

        // Perform LEFT JOIN with OrderItems and Products to get product name
        const result = await pool.request().query(`
            SELECT 
                O.OrderId,
                O.CustomerName,
                O.CustomerEmail,
                O.CustomerPhone,
                O.Address,
                O.City,
                O.PostalCode,
                O.TotalAmount,
                O.DeliveryMethod,
                O.OrderStatus,
                O.CreatedAt,
                O.IsHomeDelivery,
                -- Aggregate the order items with product name into a JSON array
                (SELECT 
                    I.ProductId,
                    P.Name,  -- Add the product name here
                    I.Quantity,
                    I.PriceAtPurchase
                 FROM dbo.OrderItems I 
                 INNER JOIN dbo.Products P ON I.ProductId = P.Id  -- JOIN with Products table
                 WHERE I.OrderId = O.OrderId
                 FOR JSON PATH) AS OrderItems
            FROM dbo.Orders O
        `);

        // Parse the JSON string for the OrderItems column
        const orders = result.recordset.map(order => ({
            ...order,
            OrderItems: JSON.parse(order.OrderItems || '[]')
        }));

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
