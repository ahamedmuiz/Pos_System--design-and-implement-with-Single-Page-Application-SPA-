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
  if (isNaN(qty) || qty <= 0) return alert("Please enter a valid quantity!");
  if (qty > item.qty) return alert("Not enough stock! Available: " + item.qty);

  // Check if item is already in cart
  let existingRow = $(`#cartTable tr td:first-child:contains(${code})`).closest("tr");

  if (existingRow.length > 0) {
    let oldQty = parseInt($(existingRow).find("td:nth-child(4)").text());
    let newQty = oldQty + qty;

    if (newQty > item.qty) return alert("Adding this quantity exceeds available stock!");

    let newTotal = item.price * newQty;
    $(existingRow).find("td:nth-child(4)").text(newQty); // Update Qty
    $(existingRow).find("td:nth-child(5)").text(newTotal.toFixed(2)); // Update Total
  } else {
    // Add new item to cart
    let total = item.price * qty;
    let row = `<tr>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${qty}</td>
      <td>${total.toFixed(2)}</td>
    </tr>`;
    $("#cartTable").append(row);
  }

  calculateTotal();
}

export function placeOrder() {
  let orderId = "O" + String(order_array.length + 1).padStart(3, "0");
  let customerId = $("#orderCustomer").val();
  let items = [];

  $("#cartTable tr").each(function () {
    let tds = $(this).find("td");
    const itemData = {
      code: $(tds[0]).text(),
      name: $(tds[1]).text(),
      price: parseFloat($(tds[2]).text()),
      qty: parseInt($(tds[3]).text()),
      total: parseFloat($(tds[4]).text()),
    };
    items.push(itemData);

    // --- CRITICAL FIX: Update Item Stock ---
    let stockItem = item_array.find((i) => i.code === itemData.code);
    if (stockItem) {
      stockItem.qty -= itemData.qty;
    }
    // ----------------------------------------
  });

  let total = $("#orderTotal").text();
  if (items.length === 0 || total === "0.00") return alert("No items in cart!");

  let order = new Order(orderId, customerId, items, total);
  order_array.push(order);

  // After placing order, reload item data (to show updated stock) and clear the order UI
  loadAllItems(); 
  alert("Order placed successfully! Order ID: " + orderId);
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
  $("#orderQty").val(""); // Clear the quantity input
}

export function loadOrderHistory() {
  $("#orderHistory").empty();
  order_array.forEach((o) => {
    // Use a cleaner date format
    let dateObj = new Date(o.date);
    let dateString = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let row = `<tr>
      <td>${o.orderId}</td>
      <td>${o.customerId}</td>
      <td>Rs. ${o.total}</td>
      <td>${dateString}</td>
    </tr>`;
    $("#orderHistory").append(row);
  });
}

// NOTE: Add loadAllItems to use in placeOrder (requires importing from ItemController)
// This requires a minor update to app.js and ItemController.js imports/exports to handle circular dependencies, but for this self-contained example, we'll assume it's available or use the original ItemController structure.

// Since the item stock is updated in the item_array, you need to import and call loadAllItems to update the Item Table after an order is placed.
import { loadAllItems } from "../../controller/ItemController.js";