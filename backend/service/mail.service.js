const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: {
        name: "Ecommerce App",
        address: process.env.MAIL_ID,
      },
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Mail error:", error);
    throw error;
  }
};

/* ================= INVOICE TEMPLATE ================= */

const createInvoiceMessage = ({ order, orderId }) => {
  const itemsHTML = order.items
    .map((item) => {
      const discountedPrice = Math.floor(
        ((100 - item.product.discountPercentage) / 100) *
          item.product.price
      );

      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">
            <strong>${item.product.title}</strong><br/>
            <span style="font-size:13px;color:#666">
              Size: ${item.size} | Color: ${item.color}
            </span>
          </td>
          <td align="center" style="padding:12px;border-bottom:1px solid #eee;">
            ${item.quantity}
          </td>
          <td align="right" style="padding:12px;border-bottom:1px solid #eee;">
            $${discountedPrice * item.quantity}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Order Invoice</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;margin:40px 0;border-radius:6px;overflow:hidden;">

<!-- HEADER -->
<tr>
<td style="padding:24px;background:#4338CA;color:#ffffff;">
<h2 style="margin:0;">Thank you for your order!</h2>
<p style="margin:4px 0 0;font-size:14px;">Order #${orderId}</p>
</td>
</tr>

<!-- SUMMARY -->
<tr>
<td style="padding:24px;">
<p style="margin:0 0 12px;">
Here is a summary of your recent purchase.
</p>

<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
<tr style="background:#f8f8f8;">
<th align="left" style="padding:12px;">Product</th>
<th align="center" style="padding:12px;">Qty</th>
<th align="right" style="padding:12px;">Price</th>
</tr>

${itemsHTML}

<tr>
<td style="padding:12px;font-weight:bold;">Total</td>
<td align="center" style="padding:12px;font-weight:bold;">
${order.totalItems}
</td>
<td align="right" style="padding:12px;font-weight:bold;">
$${order.totalAmount}
</td>
</tr>
</table>
</td>
</tr>

<!-- ADDRESS -->
<tr>
<td style="padding:24px;background:#fafafa;">
<h4 style="margin:0 0 8px;">Delivery Address</h4>
<p style="margin:0;font-size:14px;line-height:20px;">
${order.billingName}<br/>
${order.address.street}<br/>
${order.address.city}, ${order.address.state} - ${order.address.pinCode}<br/>
Phone: ${order.phoneNumber}
</p>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding:16px;text-align:center;font-size:12px;color:#777;">
<p style="margin:0;">
If you have any questions, reply to this email.
</p>
<p style="margin:4px 0 0;">
© ${new Date().getFullYear()} Ecommerce App
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
</html>
`;
};

module.exports = {
  sendMail,
  createInvoiceMessage,
};
