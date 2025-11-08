import { loadAllCustomers, addCustomer, updateCustomer, deleteCustomer } from "../../controller/CustomerController.js";

$(document).ready(function () {
  // SPA Navigation
  $(".nav-link").click(function () {
    const target = $(this).data("target");
    $(".page-section").hide();
    $("#" + target).show();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
  });

  // Load initial data
  loadAllCustomers();

  // Customer Events
  $("#btnAddCustomer").click(addCustomer);
  $("#btnUpdateCustomer").click(updateCustomer);
  $("#btnDeleteCustomer").click(deleteCustomer);

  // Table click → fill form
  $("#customerTable").on("click", "tr", function () {
    let data = $(this).children("td").map(function () {
      return $(this).text();
    }).get();

    $("#customerId").val(data[0]);
    $("#customerName").val(data[1]);
    $("#customerAddress").val(data[2]);
    $("#customerSalary").val(data[3]);
  });
});
