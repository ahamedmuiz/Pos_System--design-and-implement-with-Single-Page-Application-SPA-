import { customer_array, item_array, order_array } from "../db/DB.js";
import Order from "../model/Order.js";

export function loadCustomerIds() {
  $("#orderCustomer").empty();
  customer_array.forEach((c) => {
    $("#orderCustomer").append(`<option value="${c.id}">${c.name}</option>`);
  });
}

export function loadItemCodes() {
  $("#orderItem").empty();
  item_array.forEach((i) => {
    $("#orderItem").append(`<option value="${i.code}">${i.name}</option>`);
  });
}

export function addToCart() {
  let code = $("#orderItem").val();
  let qty = parseInt($("#orderQty").val());
  let item = item_array.find((i) => i.code === code);

  if (!item) return alert("Item not found!");
  if (qty > item.qty) return alert("Not enough stock!");

  let total = item.price * qty;
  let row = `<tr>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${qty}</td>
      <td>${total}</td>
    </tr>`;

  $("#cartTable").append(row);
  calculateTotal();
}

export function placeOrder() {
  let orderId = "O" + String(order_array.length + 1).padStart(3, "0");
  let customerId = $("#orderCustomer").val();
  let items = [];

  $("#cartTable tr").each(function () {
    let tds = $(this).find("td");
    items.push({
      code: $(tds[0]).text(),
      name: $(tds[1]).text(),
      price: parseFloat($(tds[2]).text()),
      qty: parseInt($(tds[3]).text()),
      total: parseFloat($(tds[4]).text()),
    });
  });

  let total = $("#orderTotal").text();
  if (items.length === 0) return alert("No items in cart!");

  let order = new Order(orderId, customerId, items, total);
  order_array.push(order);

  alert("Order placed successfully!");
  clearOrder();
  loadOrderHistory();
}

function calculateTotal() {
  let total = 0;
  $("#cartTable tr").each(function () {
    total += parseFloat($(this).find("td:last").text());
  });
  $("#orderTotal").text(total.toFixed(2));
}

function clearOrder() {
  $("#cartTable").empty();
  $("#orderTotal").text("0.00");
}

export function loadOrderHistory() {
  $("#orderHistory").empty();
  order_array.forEach((o) => {
    let row = `<tr>
      <td>${o.orderId}</td>
      <td>${o.customerId}</td>
      <td>${o.total}</td>
      <td>${o.date}</td>
    </tr>`;
    $("#orderHistory").append(row);
  });
}
