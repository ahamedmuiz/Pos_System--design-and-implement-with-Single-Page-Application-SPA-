import { loadAllCustomers, addCustomer, updateCustomer, deleteCustomer } from "../../controller/CustomerController.js";
import { loadAllItems, addItem, updateItem, deleteItem } from "../../controller/ItemController.js";
// IMPORTANT: loadAllItems is now also imported here so it can be used in OrderController
// NOTE: We also import calculateTotal for the cart removal feature
import { loadCustomerIds, loadItemCodes, addToCart, placeOrder, loadOrderHistory, calculateTotal } from "../../controller/OrderController.js"; 

// --- Authentication (simple) ---
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin";

// Utility: show one section, hide others
function showPage(pageId) {
  $(".page-section").hide();
  $("#" + pageId).show();
}

$(document).ready(function () {
  // Show login first
  showPage("login-page");
  $("#mainNavbar").hide();

  // === LOGIN ===
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    const username = $("#loginUsername").val().trim();
    const password = $("#loginPassword").val().trim();

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      alert("Login successful!");
      $("#login-page").fadeOut(400);
      $("#mainNavbar").fadeIn(400);
      showPage("home-page");

      // Load initial data
      loadAllCustomers();
      loadAllItems();
      loadCustomerIds();
      loadItemCodes();
      loadOrderHistory();
    } else {
      alert("Invalid username or password!");
    }
  });

  // === LOGOUT ===
  $("#btnLogout").click(function () {
    const confirmed = confirm("Are you sure you want to log out?");
    if (!confirmed) return; // Cancel logout if user clicks 'Cancel'

    $("#mainNavbar").fadeOut(300);
    showPage("login-page");
    $("#loginForm")[0].reset();
    $("#login-page").fadeIn(300);
  });

  // === NAVIGATION ===
  $(".nav-link").click(function () {
    const target = $(this).data("target");
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    showPage(target);
  });

  // === CUSTOMER EVENTS ===
  $("#btnAddCustomer").click(addCustomer);
  $("#btnUpdateCustomer").click(updateCustomer);
  $("#btnDeleteCustomer").click(deleteCustomer);

  $("#customerTable").on("click", "tr", function () {
    const data = $(this).children("td").map(function () {
      return $(this).text();
    }).get();
    $("#customerId").val(data[0]);
    $("#customerName").val(data[1]);
    $("#customerAddress").val(data[2]);
    $("#customerSalary").val(data[3]);
  });

  // === ITEM EVENTS ===
  $("#btnAddItem").click(addItem);
  $("#btnUpdateItem").click(updateItem);
  $("#btnDeleteItem").click(deleteItem);

  $("#itemTable").on("click", "tr", function () {
    const data = $(this).children("td").map(function () {
      return $(this).text();
    }).get();
    $("#itemCode").val(data[0]);
    $("#itemName").val(data[1]);
    $("#itemPrice").val(data[2]);
    $("#itemQty").val(data[3]);
  });

  // === ORDER EVENTS ===
  $("#btnAddToCart").click(addToCart);
  $("#btnPlaceOrder").click(placeOrder);
  
  // === NEW: CART ITEM REMOVAL EVENT ===
  $("#cartTable").on("click", ".btn-remove-item", function() {
    const rowToRemove = $(this).closest("tr"); 
    const itemCode = $(rowToRemove).find("td:first-child").text();
    
    rowToRemove.remove();
    calculateTotal();
    
    alert(`Item ${itemCode} removed from cart.`);
  });
});