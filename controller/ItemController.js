import { item_array } from "../db/DB.js";
import Item from "../model/Item.js";

export function loadAllItems() {
  $("#itemTable").empty();
  item_array.forEach((i) => {
    let row = `<tr><td>${i.code}</td><td>${i.name}</td><td>${i.price}</td><td>${i.qty}</td></tr>`;
    $("#itemTable").append(row);
  });
}

export function addItem() {
  let code = $("#itemCode").val();
  let name = $("#itemName").val();
  let price = $("#itemPrice").val();
  let qty = $("#itemQty").val();

  if (!code || !name || !price || !qty) {
    alert("Please fill all fields!");
    return;
  }

  let item = new Item(code, name, price, qty);
  item_array.push(item);
  loadAllItems();
  clearForm();
}

export function updateItem() {
  let code = $("#itemCode").val();
  let item = item_array.find((i) => i.code === code);
  if (item) {
    item.name = $("#itemName").val();
    item.price = $("#itemPrice").val();
    item.qty = $("#itemQty").val();
    loadAllItems();
    clearForm();
  } else {
    alert("Item not found!");
  }
}

export function deleteItem() {
  let code = $("#itemCode").val();
  let index = item_array.findIndex((i) => i.code === code);
  if (index > -1) {
    item_array.splice(index, 1);
    loadAllItems();
    clearForm();
  } else {
    alert("Item not found!");
  }
}

function clearForm() {
  $("#itemForm")[0].reset();
}
