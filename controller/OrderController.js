import { customer_array, item_array, order_array } from "../db/DB.js";
import Order from "../model/Order.js";
import { loadAllItems } from "../../controller/ItemController.js"; 

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
  let qtyInput = $("#orderQty").val();
  let qty = parseInt(qtyInput);
  let item = item_array.find((i) => i.code === code);

  if (!item) return alert("Item not found!");
  if (isNaN(qty) || qty <= 0) return alert("Please enter a valid quantity!");

  let existingRow = $(`#cartTable tr td:first-child:contains(${code})`).closest("tr");
  
  if (existingRow.length > 0) {
    // Item already in cart: Merge quantities
    let oldQty = parseInt($(existingRow).find("td:nth-child(4)").text());
    let newQty = oldQty + qty;

    if (newQty > item.qty) return alert(`Adding ${qty} exceeds available stock! Available: ${item.qty - oldQty}`);

    let newTotal = item.price * newQty;
    $(existingRow).find("td:nth-child(4)").text(newQty); // Update Qty (4th column)
    $(existingRow).find("td:nth-child(5)").text(newTotal.toFixed(2)); // Update Total (5th column)

  } else {
    // New item: Add new row
    if (qty > item.qty) return alert("Not enough stock! Available: " + item.qty);
    
    let total = item.price * qty;
    let row = `<tr>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${qty}</td>
      <td>${total.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm btn-remove-item">Remove</button></td>
    </tr>`;
    $("#cartTable").append(row);
  }
  
  // Clear the quantity input after successful addition
  $("#orderQty").val(""); 
  
  calculateTotal();
}

// *** EXPORTED FUNCTION for use in app.js after item removal ***
export function calculateTotal() {
  let total = 0;
  $("#cartTable tr").each(function () {
    // CRITICAL FIX: Total is now in the 5th column (index 4)
    total += parseFloat($(this).find("td:nth-child(5)").text()); 
  });
  $("#orderTotal").text(total.toFixed(2));
}

export function placeOrder() {
  let orderId = "O" + String(order_array.length + 1).padStart(3, "0");
  let customerId = $("#orderCustomer").val();
  let items = [];

  $("#cartTable tr").each(function () {
    let tds = $(this).find("td");
    const itemData = {
      // Data is extracted from the first 5 columns
      code: $(tds[0]).text(),
      name: $(tds[1]).text(),
      price: parseFloat($(tds[2]).text()),
      qty: parseInt($(tds[3]).text()),
      total: parseFloat($(tds[4]).text()), // 5th column
    };
    items.push(itemData);

    // Update Item Stock
    let stockItem = item_array.find((i) => i.code === itemData.code);
    if (stockItem) {
      stockItem.qty -= itemData.qty;
    }
  });

  let total = $("#orderTotal").text();
  if (items.length === 0 || total === "0.00") return alert("No items in cart to place an order!");

  let order = new Order(orderId, customerId, items, total);
  order_array.push(order);

  loadAllItems(); 
  alert("Order placed successfully! Order ID: " + orderId);
  clearOrder();
  loadOrderHistory();
}

function clearOrder() {
  $("#cartTable").empty();
  $("#orderTotal").text("0.00");
}

export function loadOrderHistory() {
  $("#orderHistory").empty();
  order_array.forEach((o) => {
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