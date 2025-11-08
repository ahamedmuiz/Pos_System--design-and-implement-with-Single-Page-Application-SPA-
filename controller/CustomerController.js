import { customer_array } from "../db/DB.js";
import Customer from "../model/Customer.js";

export function loadAllCustomers() {
  $("#customerTable").empty();
  customer_array.forEach((c) => {
    let row = `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.address}</td><td>${c.salary}</td></tr>`;
    $("#customerTable").append(row);
  });
}

export function addCustomer() {
  let id = $("#customerId").val();
  let name = $("#customerName").val();
  let address = $("#customerAddress").val();
  let salary = $("#customerSalary").val();

  if (!id || !name || !address || !salary) {
    alert("Please fill all fields!");
    return;
  }

  let customer = new Customer(id, name, address, salary);
  customer_array.push(customer);
  loadAllCustomers();
  clearForm();
}

export function updateCustomer() {
  let id = $("#customerId").val();
  let customer = customer_array.find((c) => c.id === id);
  if (customer) {
    customer.name = $("#customerName").val();
    customer.address = $("#customerAddress").val();
    customer.salary = $("#customerSalary").val();
    loadAllCustomers();
    clearForm();
  } else {
    alert("Customer not found!");
  }
}

export function deleteCustomer() {
  let id = $("#customerId").val();
  let index = customer_array.findIndex((c) => c.id === id);
  if (index > -1) {
    customer_array.splice(index, 1);
    loadAllCustomers();
    clearForm();
  } else {
    alert("Customer not found!");
  }
}

function clearForm() {
  $("#customerForm")[0].reset();
}
