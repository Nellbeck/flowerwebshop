import sgMail from "@sendgrid/mail";

// Set your SendGrid API Key (use ENV variables for security)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { email, name, cart, totalSum } = await req.json();

    // Format cart items for email
    const orderItems = cart.map(
      (item) => `${item.Name} (x${item.quantity}): ${(item.Price * item.quantity).toFixed(2)} SEK`
    ).join("\n");

    const msg = {
      to: email, // Customer's email
      from: "nellbeckfredrik@gmail.com", // Your sender email (must be verified in SendGrid)
      subject: "Order Bekräftelse - Blåklinten",
      text: `Hej ${name}!\n\nTack för din beställning.\n\nDina produkter:\n${orderItems}\n\nTotal: ${totalSum.toFixed(2)} SEK\n\nVi hör av oss när din order är redo!\n\nHälsningar,\nBlåklinten 🌸`,
    };

    await sgMail.send(msg);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
