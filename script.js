let order = [];
let totalAmount = 0;
let isBillPaid = true; // Default to bill paid

function addToOrder(item, price) {
  const existingItem = order.find((orderItem) => orderItem.item === item);
  if (existingItem) {
    existingItem.quantity++;
    existingItem.subtotal = existingItem.quantity * existingItem.price;
  } else {
    order.push({ item, price, quantity: 1, subtotal: price });
  }
  updateOrderSummary();
}

function increaseQuantity(index) {
  order[index].quantity++;
  order[index].subtotal = order[index].quantity * order[index].price;
  updateOrderSummary();
}

function decreaseQuantity(index) {
  if (order[index].quantity > 1) {
    order[index].quantity--;
    order[index].subtotal = order[index].quantity * order[index].price;
  } else {
    order.splice(index, 1);
  }
  updateOrderSummary();
}

function updateOrderSummary() {
  totalAmount = order.reduce((sum, item) => sum + item.subtotal, 0);

  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "";
  order.forEach(({ item, price, quantity, subtotal }, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item} - ₹${price.toFixed(2)} x ${quantity} = ₹${subtotal.toFixed(2)}
      <div class="quantity-controls">
        <button onclick="decreaseQuantity(${index})">−</button>
        <button onclick="increaseQuantity(${index})">+</button>
      </div>
    `;
    orderList.appendChild(li);
  });
  document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);
}

function toggleBillStatus(status) {
  isBillPaid = status === "paid";
}

function printReceipt() {
  let printContent = `
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .receipt-header { text-align: center; font-size: 1.2em; font-weight: bold; }
      .receipt-items { width: 100%; border-collapse: collapse; }
      .receipt-items th, .receipt-items td { padding: 8px; border-bottom: 1px solid #e0e0e0; }
      .receipt-total { text-align: right; font-size: 1.1em; font-weight: bold; }
      .thank-you { text-align: center; color: #888; }
      .bill-paid-status { color: #4CAF50; text-align: center; }
      .bill-not-paid-status { color: #F44336; text-align: center; }
    </style>
    <div class="receipt-header">Restaurant POS</div>
    <div class="receipt-items">
      <table>
        <thead><tr><th>Item</th><th>Qty</th><th>Subtotal</th></tr></thead>
        <tbody>
  `;
  order.forEach(({ item, quantity, subtotal }) => {
    printContent += `<tr><td>${item}</td><td>${quantity}</td><td>₹${subtotal.toFixed(
      2
    )}</td></tr>`;
  });
  printContent += `
        </tbody>
      </table>
    </div>
    <p class="receipt-total">Total: ₹${totalAmount.toFixed(2)}</p>
    <p class="${isBillPaid ? "bill-paid-status" : "bill-not-paid-status"}">${
    isBillPaid ? "Bill Paid" : "Not Paid"
  }</p>
    <div class="thank-you">Thank you for dining with us!</div>
  `;

  const printWindow = window.open("", "_blank", "width=600,height=400");
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
}
