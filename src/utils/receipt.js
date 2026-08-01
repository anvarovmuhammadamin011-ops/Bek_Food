export function printReceipt(order, settings = {}) {
  const name = settings?.name || 'BEK FOOD';
  const phone = settings?.phone || '';
  const address = settings?.address || '';
  const now = new Date();
  const itemsHtml = (order.items || [])
    .map(
      (i) => `
      <tr>
        <td>${i.quantity}x ${(i.food?.name || 'Mahsulot').replace(/</g, '&lt;')}</td>
        <td style="text-align:right">${(i.price * i.quantity).toLocaleString('uz-UZ')} so'm</td>
      </tr>`
    )
    .join('');

  const win = window.open('', '_blank', 'width=320,height=600');
  if (!win) return;
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Chek #${order.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; width: 300px; margin: 0 auto; padding: 16px; color: #111; font-size: 12px; }
    .center { text-align: center; }
    h1 { font-size: 18px; letter-spacing: 2px; }
    .divider { border-top: 1px dashed #111; margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 2px 0; vertical-align: top; }
    .total { font-size: 16px; font-weight: bold; }
    .meta { margin: 2px 0; }
    @media print { body { width: 100%; } }
  </style>
</head>
<body>
  <div class="center">
    <h1>${name.replace(/</g, '&lt;')}</h1>
    <p class="meta">${phone.replace(/</g, '&lt;')}</p>
    <p class="meta">${address.replace(/</g, '&lt;')}</p>
  </div>
  <div class="divider"></div>
  <p>Chek: #${order.id}</p>
  <p>Vaqt: ${now.toLocaleString('uz-UZ')}</p>
  <p>Mijoz: ${(order.customerName || 'Mijoz').replace(/</g, '&lt;')}</p>
  <p>Tel: ${(order.customerPhone || '').replace(/</g, '&lt;')}</p>
  <p>To'lov: ${order.paymentMethod === 'card' ? 'Karta' : 'Naqd'}</p>
  <p>Yetkazish: ${order.deliveryType === 'pickup' ? 'Olib ketish' : 'Yetkazib berish'}</p>
  <div class="divider"></div>
  <table>${itemsHtml}</table>
  <div class="divider"></div>
  <table>
    <tr><td>Jami</td><td class="total" style="text-align:right">${(order.total || 0).toLocaleString('uz-UZ')} so'm</td></tr>
  </table>
  <div class="divider"></div>
  <div class="center">
    <p>Xizmatingiz uchun rahmat!</p>
    <p>${name.replace(/</g, '&lt;')}</p>
  </div>
  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`);
  win.document.close();
}
