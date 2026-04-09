// utils/invoicePrint.js
import { Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export async function printInvoice({
  invoiceNumber,
  invoiceDate,
  customerName,
  customerPhone,
  customerAddress,
  collectorName,
  collectorId,
  items,
  totalAmount,
  totalWeight,
  paymentMode,
  paymentStatus,
}) {
  const html = `
  <html>
    <head>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #f0f0f0; }
      </style>
    </head>
    <body>
      <h1>INVOICE</h1>

      <p><b>Invoice Number:</b> ${invoiceNumber}</p>
      <p><b>Date:</b> ${invoiceDate}</p>

      <h3>Customer Details</h3>
      <p>${customerName}</p>
      <p>${customerPhone}</p>
      <p>${customerAddress}</p>

      <h3>Collected By</h3>
      <p>${collectorName} (${collectorId})</p>

      <h3>Items</h3>
      <table>
        <tr>
          <th>Category</th>
          <th>Weight (kg)</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
        ${items
          .map(
            (i) => `
          <tr>
            <td>${i.category}</td>
            <td>${Number(i.weight || 0).toFixed(2)}</td>
            <td>${Number(i.price || i.rate || 0).toFixed(2)}</td>
            <td>${Number(i.total || 0).toFixed(2)}</td>
          </tr>`
          )
          .join("")}
      </table>

      <h3>Total Weight: ${Number(totalWeight).toFixed(2)} kg</h3>
      <h3>Total Amount: ₹${Number(totalAmount).toFixed(2)}</h3>

      <p><b>Payment Mode:</b> ${paymentMode}</p>
      <p><b>Status:</b> ${paymentStatus}</p>
    </body>
  </html>
  `;

  // 🌐 EXPO WEB
  if (Platform.OS === "web") {
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
    return;
  }

  // 📱 ANDROID / IOS
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}
