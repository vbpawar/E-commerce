var customerOrders = []; //all the customers orders
var customerOrderDetails = []; //for particular order id details
var orderId = null; //order id for another page reference createNewOrderPage
var mar = ''; //for load all data in view mode of a particular order
let customerData = new Map(); //data of customers like name,address
var customer_orderItemId = null; //for send orderItemid to save the orderId and measurments corresponding
var fabric_orderItemId = null; //for send orderItemid to save the orderId and fabrics corresponding
var style_orderItemId = null; //for send orderItemid to save the orderId and styles corresponding
var customerId_g = null;
var indexRow = null; //pass a parameter to get particular order id objects
var EmployeeData = new Map(); //from getmiscellaneousdata.php names only
var currencyData = []; //from getmiscellaneousdata.php using in payment link dropdown
let statusMap = new Map(); //for static status
let ParentProducts = new Map(); //from getmiscellaneousdata.php for show active products styleTitle
let confirmationStatus = new Map();
var OrderDetailsOfCustomer = []; //like orderId,expectedDeliveryDate,Amount
var ActiveProductsList = new Map(); //stored price here
var TailorData = [];
var assignSalesData = new Map();
getStatusMap();
getConfirmation();

function getStatusMap() {
    statusMap.set('0', '<span class="badge badge-pill badge-danger">Not completed</span>');
    statusMap.set('1', '<span class="badge badge-pill badge-success">Confirmed</span>');
    statusMap.set('2', '<span class="badge badge-pill badge-primary">Processing</span>');
    statusMap.set('3', '<span class="badge badge-pill badge-secondary">Sent for Trial</span>');
    statusMap.set('4', '<span class="badge badge-pill badge-warning">Completed</span>');
    statusMap.set('5', '<span class="badge badge-pill badge-info">Cancelled</span>');
    statusMap.set('6', '<span class="badge badge-pill badge-dark">For Alteration</span>');
}

function getConfirmation() {
    confirmationStatus.set('0', '<span class="badge badge-pill badge-warning">Not Confirmed</span>');
    confirmationStatus.set('1', '<span class="badge badge-pill badge-success">Confirmed</span>');
}

getMicellaneousData();

function getMicellaneousData() {
    $.ajax({
        url: api_url + 'getmiscellaneousdata.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            // console.log(response);
            if (response.Employee != null) {
                var count_EmployeeData = response.Employee.length;
                for (var i = 0; i < count_EmployeeData; i++) {
                    if (response.Employee[i].roleId == '2') {
                        TailorData.push(response.Employee[i]);
                    }
                    EmployeeData.set(response.Employee[i].employeeId, response.Employee[i].firstName + ' ' + response.Employee[i].lastName);
                }
            }
            if (response.Currency != null) {
                currencyData = [...response.Currency];
            }
            if (response.ParentProducts != null) {
                var count_ParentProducts = response.ParentProducts.length;
                for (var i = 0; i < count_ParentProducts; i++) {
                    ParentProducts.set(response.ParentProducts[i].parentId, response.ParentProducts[i].styleTitle);
                }
            }
        }
    });
}
getAllCustomers();

function getAllCustomers() {
    $.ajax({
        url: api_url + 'allcustomers.php',
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".preloader").show();
        },
        success: function(response) {
            if (response.Data != null) {
                var count = response.Data.length;
                for (var i = 0; i < count; i++) {
                    customerData.set(response.Data[i].customerId, response.Data[i]);
                }

            }
        },
        complete: function() {
            $(".preloader").hide();
            getOrdersOfCustomer();
        }
    })
}
var table;
$.fn.dataTable.ext.search.push(
    function(settings, data, dataIndex) {
        var min = $('#min').datepicker("getDate");
        var max = $('#max').datepicker("getDate");
        // console.log(min);
        var startDate = new Date(data[4]);
        if (min == null && max == null) { return true; }
        if (min == null && startDate <= max) { return true; }
        if (max == null && startDate >= min) { return true; }
        if (startDate <= max && startDate >= min) { return true; }
        return false;
    }
);

$('#min, #max').change(function() {
    table.draw();
});
//first select customer then customerOrders[] intialize to all order details of that customer
function getOrdersOfCustomer() {
    var aid = $("#aid").val();
    $('#customerOrdersDataTable').dataTable().fnDestroy();
    $("#customerOrdersData").empty();
    $.ajax({
        url: api_url + 'getallcustomerorders.php',
        type: 'POST',
        async: false,
        dataType: 'json',
        beforeSend: function() {
            $(".preloader").show();
        },
        success: function(response) {
            // console.log(response);
            if (response.Data != null) {
                var count = response.Data.length;
                const orders = response.Data;
                customerOrders = [];
                customerOrders = [...orders];
                var orderStatus = null,
                    isConfirmed = null,
                    customerExpectedDate = null,
                    FinalDeliveryDate = null,
                    amount = 0,
                    cash_amount = 0,
                    NEFT_amount = 0,
                    total_recieved_amount = 0,
                    EmpName = '-',
                    custName = '-';
                $('#customerOrdersBlock').show();
                var responseData = "";
                for (var i = 0; i < count; i++) {
                    if (aid == "1") {
                        if (response.Data[i].OrderDetails.orderStatus == 0) {
                            var cash = 0,
                                neft = 0,
                                rec_amount = 0;
                            amount = amount + parseFloat(response.Data[i].OrderDetails.amount);
                            if (response.Data[i].OrderDetails.Cash_amount != null) {
                                cash_amount = cash_amount + parseFloat(response.Data[i].OrderDetails.Cash_amount);
                                cash = parseFloat(response.Data[i].OrderDetails.Cash_amount);
                            }
                            if (response.Data[i].OrderDetails.NEFT_amount != null) {
                                NEFT_amount = NEFT_amount + parseFloat(response.Data[i].OrderDetails.NEFT_amount);
                                neft = parseFloat(response.Data[i].OrderDetails.NEFT_amount);
                            }
                            rec_amount = cash + neft;
                            orderStatus = statusMap.get(response.Data[i].OrderDetails.orderStatus);
                            isConfirmed = confirmationStatus.get(response.Data[i].OrderDetails.isConfirmed);
                            // if (response.Data[i].OrderDetails.promoCode == null) {
                            //     response.Data[i].OrderDetails.promoCode = '-';
                            // }
                            if (EmployeeData.has(response.Data[i].OrderDetails.employeeId)) {
                                EmpName = EmployeeData.get(response.Data[i].OrderDetails.employeeId);
                            }
                            if (customerData.has(response.Data[i].OrderDetails.customerId)) {
                                custName = customerData.get(response.Data[i].OrderDetails.customerId);
                            }
                            customerExpectedDate = getDate(response.Data[i].OrderDetails.customerExpectedDate);
                            FinalDeliveryDate = getDate(response.Data[i].OrderDetails.FinalDeliveryDate);
                            responseData += "<tr>";
                            responseData += "<td>" + response.Data[i].OrderDetails.orderId + "</td>";
                            responseData += "<td>" + custName.firstName + ' ' + custName.lastName + "</td>";
                            responseData += "<td>" + parseFloat(response.Data[i].OrderDetails.amount).toLocaleString() + "</td>";
                            responseData += "<td>" + rec_amount.toLocaleString() + "</td>";
                            // responseData += "<td>" + response.Data[i].OrderDetails.promoCode + "</td>";
                            responseData += "<td>" + getDate(response.Data[i].OrderDetails.purchaseDateTime) + "</td>";
                            responseData += "<td style='display:none;'>" + response.Data[i].OrderDetails.purchaseDateTime + "</td>";
                            responseData += "<td>" + orderStatus + "</td>";
                            responseData += "<td>" + isConfirmed + "</td>";
                            responseData += "<td>" + customerExpectedDate + "</td>";
                            responseData += "<td>" + FinalDeliveryDate + "</td>";
                            responseData += "<td>" + EmpName + "</td>";
                            responseData += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
                            responseData += "<button class='btn btn-success btn-sm' data-toggle='tooltip' data-placement='top' title='Edit' onclick='showData(\"" + response.Data[i].OrderDetails.orderId + "\",\"" + response.Data[i].OrderDetails.customerId + "\",\"" + (i) + "\")'><i class='fa fa-edit'></i></button>";
                            responseData += "</div></td></tr>";
                        }
                    } else if (aid == "2") {
                        if (response.Data[i].OrderDetails.orderStatus == 6) {

                            var cash = 0,
                                neft = 0,
                                rec_amount = 0;
                            amount = amount + parseFloat(response.Data[i].OrderDetails.amount);
                            if (response.Data[i].OrderDetails.Cash_amount != null) {
                                cash_amount = cash_amount + parseFloat(response.Data[i].OrderDetails.Cash_amount);
                                cash = parseFloat(response.Data[i].OrderDetails.Cash_amount);
                            }
                            if (response.Data[i].OrderDetails.NEFT_amount != null) {
                                NEFT_amount = NEFT_amount + parseFloat(response.Data[i].OrderDetails.NEFT_amount);
                                neft = parseFloat(response.Data[i].OrderDetails.NEFT_amount);
                            }
                            rec_amount = cash + neft;
                            orderStatus = statusMap.get(response.Data[i].OrderDetails.orderStatus);
                            isConfirmed = confirmationStatus.get(response.Data[i].OrderDetails.isConfirmed);
                            // if (response.Data[i].OrderDetails.promoCode == null) {
                            //     response.Data[i].OrderDetails.promoCode = '-';
                            // }
                            if (EmployeeData.has(response.Data[i].OrderDetails.employeeId)) {
                                EmpName = EmployeeData.get(response.Data[i].OrderDetails.employeeId);
                            }
                            if (customerData.has(response.Data[i].OrderDetails.customerId)) {
                                custName = customerData.get(response.Data[i].OrderDetails.customerId);
                            }
                            customerExpectedDate = getDate(response.Data[i].OrderDetails.customerExpectedDate);
                            FinalDeliveryDate = getDate(response.Data[i].OrderDetails.FinalDeliveryDate);
                            responseData += "<tr>";
                            responseData += "<td>" + response.Data[i].OrderDetails.orderId + "</td>";
                            responseData += "<td>" + custName.firstName + ' ' + custName.lastName + "</td>";
                            responseData += "<td>" + parseFloat(response.Data[i].OrderDetails.amount).toLocaleString() + "</td>";
                            responseData += "<td>" + rec_amount.toLocaleString() + "</td>";
                            // responseData += "<td>" + response.Data[i].OrderDetails.promoCode + "</td>";
                            responseData += "<td>" + getDate(response.Data[i].OrderDetails.purchaseDateTime) + "</td>";
                            responseData += "<td style='display:none;'>" + response.Data[i].OrderDetails.purchaseDateTime + "</td>";
                            responseData += "<td>" + orderStatus + "</td>";
                            responseData += "<td>" + isConfirmed + "</td>";
                            responseData += "<td>" + customerExpectedDate + "</td>";
                            responseData += "<td>" + FinalDeliveryDate + "</td>";
                            responseData += "<td>" + EmpName + "</td>";
                            responseData += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
                            responseData += "<button class='btn btn-success btn-sm' data-toggle='tooltip' data-placement='top' title='Edit' onclick='showData(\"" + response.Data[i].OrderDetails.orderId + "\",\"" + response.Data[i].OrderDetails.customerId + "\",\"" + (i) + "\")'><i class='fa fa-edit'></i></button>";
                            responseData += "</div></td></tr>";
                        }
                    } else {
                        var cash = 0,
                            neft = 0,
                            rec_amount = 0;
                        amount = amount + parseFloat(response.Data[i].OrderDetails.amount);
                        if (response.Data[i].OrderDetails.Cash_amount != null) {
                            cash_amount = cash_amount + parseFloat(response.Data[i].OrderDetails.Cash_amount);
                            cash = parseFloat(response.Data[i].OrderDetails.Cash_amount);
                        }
                        if (response.Data[i].OrderDetails.NEFT_amount != null) {
                            NEFT_amount = NEFT_amount + parseFloat(response.Data[i].OrderDetails.NEFT_amount);
                            neft = parseFloat(response.Data[i].OrderDetails.NEFT_amount);
                        }
                        rec_amount = cash + neft;
                        orderStatus = statusMap.get(response.Data[i].OrderDetails.orderStatus);
                        isConfirmed = confirmationStatus.get(response.Data[i].OrderDetails.isConfirmed);
                        // if (response.Data[i].OrderDetails.promoCode == null) {
                        //     response.Data[i].OrderDetails.promoCode = '-';
                        // }
                        if (EmployeeData.has(response.Data[i].OrderDetails.employeeId)) {
                            EmpName = EmployeeData.get(response.Data[i].OrderDetails.employeeId);
                        }
                        if (customerData.has(response.Data[i].OrderDetails.customerId)) {
                            custName = customerData.get(response.Data[i].OrderDetails.customerId);
                        }
                        customerExpectedDate = getDate(response.Data[i].OrderDetails.customerExpectedDate);
                        FinalDeliveryDate = getDate(response.Data[i].OrderDetails.FinalDeliveryDate);
                        responseData += "<tr>";
                        responseData += "<td>" + response.Data[i].OrderDetails.orderId + "</td>";
                        responseData += "<td>" + custName.firstName + ' ' + custName.lastName + "</td>";
                        responseData += "<td>" + parseFloat(response.Data[i].OrderDetails.amount).toLocaleString() + "</td>";
                        responseData += "<td>" + rec_amount.toLocaleString() + "</td>";
                        // responseData += "<td>" + response.Data[i].OrderDetails.promoCode + "</td>";
                        responseData += "<td>" + getDate(response.Data[i].OrderDetails.purchaseDateTime) + "</td>";
                        responseData += "<td style='display:none;'>" + response.Data[i].OrderDetails.purchaseDateTime + "</td>";
                        responseData += "<td>" + orderStatus + "</td>";
                        responseData += "<td>" + isConfirmed + "</td>";
                        responseData += "<td>" + customerExpectedDate + "</td>";
                        responseData += "<td>" + FinalDeliveryDate + "</td>";
                        responseData += "<td>" + EmpName + "</td>";
                        responseData += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
                        responseData += "<button class='btn btn-success btn-sm' data-toggle='tooltip' data-placement='top' title='Edit' onclick='showData(\"" + response.Data[i].OrderDetails.orderId + "\",\"" + response.Data[i].OrderDetails.customerId + "\",\"" + (i) + "\")'><i class='fa fa-edit'></i></button>";
                        responseData += "</div></td></tr>";
                    }
                }
                $("#customerOrdersData").html(responseData);
                $('#amt_total').html(amount.toLocaleString());
                $('#total_order_amount').html(amount.toLocaleString());
                $('#recieved_total').html((cash_amount + NEFT_amount).toLocaleString());
                $('#cash').html(cash_amount.toLocaleString());
                $('#neft').html(NEFT_amount.toLocaleString());
                $('#orderscount').html(count);
                table = $('#customerOrdersDataTable').DataTable({
                    searching: true,
                    retrieve: true,
                    bPaginate: $('tbody tr').length > 10,
                    order: [],
                    columnDefs: [{ orderable: false, targets: [0, 7, 8, 9, 10] }],
                    dom: 'Bfrtip',
                    buttons: ['copy', 'csv', 'excel', 'pdf'],
                    destroy: true
                });
            }

        },
        complete: function(response) {
            $(".preloader").hide();
        }
    });
}
// function getOrdersOfCustomer() {
//     var aid = $("#aid").val();
//     $('#customerOrdersDataTable').dataTable().fnDestroy();
//     $("#customerOrdersData").empty();
//     $.ajax({
//         url: api_url + 'getallcustomerorders.php',
//         type: 'POST',
//         async: false,
//         dataType: 'json',
//         beforeSend: function() {
//             $(".preloader").show();
//         },
//         success: function(response) {
//             if (response.Data != null) {
//                 var count = response.Data.length;
//                 const orders = response.Data;
//                 customerOrders = [];
//                 customerOrders = [...orders];
//                 var orderStatus = null,
//                     isConfirmed = null,
//                     customerExpectedDate = null,
//                     FinalDeliveryDate = null,
//                     amount = 0,
//                     rec_amount = 0,
//                     EmpName = '-';
//                 $('#customerOrdersBlock').show();
//                 var responseData = "";
//                 for (var i = 0; i < count; i++) {
//
//                     orderStatus = statusMap.get(response.Data[i].OrderDetails.orderStatus);
//                     if (aid == "1")
//                     {
//
//                         if (response.Data[i].OrderDetails.orderStatus == 0)
//                         {
//                             amount = amount + parseFloat(response.Data[i].OrderDetails.amount);
//                             if (response.Data[i].OrderDetails.RecievedAmount != null) {
//                                 rec_amount = rec_amount + parseFloat(response.Data[i].OrderDetails.RecievedAmount);
//                             } else {
//                                 response.Data[i].OrderDetails.RecievedAmount = '-';
//                             }
//
//
//                             isConfirmed = confirmationStatus.get(response.Data[i].OrderDetails.isConfirmed);
//                             if (response.Data[i].OrderDetails.promoCode == null) {
//                                 response.Data[i].OrderDetails.promoCode = '-';
//                             }
//                             if (EmployeeData.has(response.Data[i].OrderDetails.employeeId)) {
//                                 EmpName = EmployeeData.get(response.Data[i].OrderDetails.employeeId);
//                             }
//                             customerExpectedDate = getDate(response.Data[i].OrderDetails.customerExpectedDate);
//                             FinalDeliveryDate = getDate(response.Data[i].OrderDetails.FinalDeliveryDate);
//                             responseData += "<tr>";
//                             responseData += "<td>" + response.Data[i].OrderDetails.orderId + "</td>";
//                             responseData += "<td>" + response.Data[i].OrderDetails.amount + "</td>";
//                             responseData += "<td>" + response.Data[i].OrderDetails.RecievedAmount + "</td>";
//                             responseData += "<td>" + response.Data[i].OrderDetails.promoCode + "</td>";
//                             responseData += "<td>" + getDate(response.Data[i].OrderDetails.purchaseDateTime) + "</td>";
//                             responseData += "<td style='display:none;'>" + response.Data[i].OrderDetails.purchaseDateTime + "</td>";
//                             responseData += "<td>" + orderStatus + "</td>";
//                             responseData += "<td>" + isConfirmed + "</td>";
//                             responseData += "<td>" + customerExpectedDate + "</td>";
//                             responseData += "<td>" + FinalDeliveryDate + "</td>";
//                             responseData += "<td>" + EmpName + "</td>";
//                             responseData += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
//                             responseData += "<button class='btn btn-success btn-sm' data-toggle='tooltip' data-placement='top' title='Edit' onclick='showData(\"" + response.Data[i].OrderDetails.orderId + "\",\"" + response.Data[i].OrderDetails.customerId + "\",\"" + (i) + "\")'><i class='fa fa-edit'></i></button>";
//                             responseData += "</div></td></tr>";
//                         }
//                    }
//                    else if (aid == "2") {
//                        if (response.Data[i].OrderDetails.orderStatus == 6) {
//
//                          amount = amount + parseFloat(response.Data[i].OrderDetails.amount);
//                          if (response.Data[i].OrderDetails.RecievedAmount != null) {
//                              rec_amount = rec_amount + parseFloat(response.Data[i].OrderDetails.RecievedAmount);
//                          } else {
//                              response.Data[i].OrderDetails.RecievedAmount = '-';
//                          }
//
//
//                          isConfirmed = confirmationStatus.get(response.Data[i].OrderDetails.isConfirmed);
//                          if (response.Data[i].OrderDetails.promoCode == null) {
//                              response.Data[i].OrderDetails.promoCode = '-';
//                          }
//                          if (EmployeeData.has(response.Data[i].OrderDetails.employeeId)) {
//                              EmpName = EmployeeData.get(response.Data[i].OrderDetails.employeeId);
//                          }
//                          customerExpectedDate = getDate(response.Data[i].OrderDetails.customerExpectedDate);
//                          FinalDeliveryDate = getDate(response.Data[i].OrderDetails.FinalDeliveryDate);
//                          responseData += "<tr>";
//                          responseData += "<td>" + response.Data[i].OrderDetails.orderId + "</td>";
//                          responseData += "<td>" + response.Data[i].OrderDetails.amount + "</td>";
//                          responseData += "<td>" + response.Data[i].OrderDetails.RecievedAmount + "</td>";
//                          responseData += "<td>" + response.Data[i].OrderDetails.promoCode + "</td>";
//                          responseData += "<td>" + getDate(response.Data[i].OrderDetails.purchaseDateTime) + "</td>";
//                          responseData += "<td style='display:none;'>" + response.Data[i].OrderDetails.purchaseDateTime + "</td>";
//                          responseData += "<td>" + orderStatus + "</td>";
//                          responseData += "<td>" + isConfirmed + "</td>";
//                          responseData += "<td>" + customerExpectedDate + "</td>";
//                          responseData += "<td>" + FinalDeliveryDate + "</td>";
//                          responseData += "<td>" + EmpName + "</td>";
//                          responseData += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
//                          responseData += "<button class='btn btn-success btn-sm' data-toggle='tooltip' data-placement='top' title='Edit' onclick='showData(\"" + response.Data[i].OrderDetails.orderId + "\",\"" + response.Data[i].OrderDetails.customerId + "\",\"" + (i) + "\")'><i class='fa fa-edit'></i></button>";
//                          responseData += "</div></td></tr>";
//                        }
//                    } else {
//                      amount = amount + parseFloat(response.Data[i].OrderDetails.amount);
//                      if (response.Data[i].OrderDetails.RecievedAmount != null) {
//                          rec_amount = rec_amount + parseFloat(response.Data[i].OrderDetails.RecievedAmount);
//                      } else {
//                          response.Data[i].OrderDetails.RecievedAmount = '-';
//                      }
//
//
//                      isConfirmed = confirmationStatus.get(response.Data[i].OrderDetails.isConfirmed);
//                      if (response.Data[i].OrderDetails.promoCode == null) {
//                          response.Data[i].OrderDetails.promoCode = '-';
//                      }
//                      if (EmployeeData.has(response.Data[i].OrderDetails.employeeId)) {
//                          EmpName = EmployeeData.get(response.Data[i].OrderDetails.employeeId);
//                      }
//                      customerExpectedDate = getDate(response.Data[i].OrderDetails.customerExpectedDate);
//                      FinalDeliveryDate = getDate(response.Data[i].OrderDetails.FinalDeliveryDate);
//                      responseData += "<tr>";
//                      responseData += "<td>" + response.Data[i].OrderDetails.orderId + "</td>";
//                      responseData += "<td>" + response.Data[i].OrderDetails.amount + "</td>";
//                      responseData += "<td>" + response.Data[i].OrderDetails.RecievedAmount + "</td>";
//                      responseData += "<td>" + response.Data[i].OrderDetails.promoCode + "</td>";
//                      responseData += "<td>" + getDate(response.Data[i].OrderDetails.purchaseDateTime) + "</td>";
//                      responseData += "<td style='display:none;'>" + response.Data[i].OrderDetails.purchaseDateTime + "</td>";
//                      responseData += "<td>" + orderStatus + "</td>";
//                      responseData += "<td>" + isConfirmed + "</td>";
//                      responseData += "<td>" + customerExpectedDate + "</td>";
//                      responseData += "<td>" + FinalDeliveryDate + "</td>";
//                      responseData += "<td>" + EmpName + "</td>";
//                      responseData += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
//                      responseData += "<button class='btn btn-success btn-sm' data-toggle='tooltip' data-placement='top' title='Edit' onclick='showData(\"" + response.Data[i].OrderDetails.orderId + "\",\"" + response.Data[i].OrderDetails.customerId + "\",\"" + (i) + "\")'><i class='fa fa-edit'></i></button>";
//                      responseData += "</div></td></tr>";
//                    }
//                 }
//                 $("#customerOrdersData").html(responseData);
//                 $('#amt_total').html(amount.toLocaleString());
//                 $('#total_order_amount').html(amount.toLocaleString());
//                 $('#recieved_total').html(rec_amount.toLocaleString());
//                 $('#cash').html(rec_amount.toLocaleString());
//                 $('#orderscount').html(count);
//                 table = $('#customerOrdersDataTable').DataTable({
//                     searching: true,
//                     retrieve: true,
//                     bPaginate: $('tbody tr').length > 10,
//                     order: [],
//                     columnDefs: [{ orderable: false, targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }],
//                     dom: 'Bfrtip',
//                     buttons: ['copy', 'csv', 'excel', 'pdf'],
//                     destroy: true
//                 });
//             }
//
//         },
//         complete: function(response) {
//             $(".preloader").hide();
//         }
//     });
// }

function getDate(date) {
    var output = '-';
    if (date == null || date == "0000-00-00") {
        return output;
    } else {
        var d = new Date(date);
        output = d.toDateString(); // outputs to "Thu May 28 2015"
        let outarr = output.split(" ");
        let datestr = outarr[0] + "," + outarr[2] + " " + outarr[1] + " " + outarr[3];
        output = datestr;
        // output = d.toGMTString(); //outputs to "Thu, 28 May 2015 22:10:21 GMT"

    }
    return output;
}

//load an particular order of a customer for edit/update purpose
function showData(orderid, customerId, rowId) {
    customerId_g = customerId;
    $('#loadNewPage').empty();
    orderId = orderid;
    customerOrderDetails = customerOrders[rowId];
    indexRow = rowId;
    if (customerOrderDetails.OrderDetails != null) {
        OrderDetailsOfCustomer = customerOrderDetails.OrderDetails;
    }
    if (customerOrderDetails.orderItems != null) {

        var count = customerOrderDetails.orderItems.length;
        var markup = '';
        for (var i = 0; i < count; i++) {
            let styleTitle = '',
                alter = '';
            if (ParentProducts.has(customerOrderDetails.orderItems[i].OrderItem.parentId)) {
                styleTitle = ParentProducts.get(customerOrderDetails.orderItems[i].OrderItem.parentId);
            }
            if (customerOrderDetails.orderItems[i].OrderItem.isAlterNeeded == 1) {
                // alter = "required";
                alter = "<a  title='See Comment' data-toggle='tooltip' onclick='loadcomment(" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + ")' href='#'><code style='color: red;'>See Comment</code></a>";
            }
            let fablength = 0,
                fabarrhtml = '';
            if (customerOrderDetails.orderItems[i].Fabrics != null) {
                fablength += customerOrderDetails.orderItems[i].Fabrics.length;
                fabarrhtml = "<td >";
                for (var j = 0; j < fablength; j++) {
                    fabarrhtml += (j + 1) + " " + customerOrderDetails.orderItems[i].Fabrics[j].fabricTitle + "-" + customerOrderDetails.orderItems[i].Fabrics[j].colorName;
                    fabarrhtml += " -" + customerOrderDetails.orderItems[i].Fabrics[j].fabricPrice;
                    fabarrhtml += "</br >";
                }
                fabarrhtml += "</td >";
            } else {
                fabarrhtml = "<td></td>";
            }
            markup += "<tr id=" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "><td>" + customerOrderDetails.orderItems[i].OrderItem.productTitle + '-' + styleTitle + "</td>";
            //markup += "<td>" + customerOrderDetails.orderItems[i].OrderItem.productSubTitle + "</td>";
            markup += fabarrhtml;
            markup += "<td>" + customerOrderDetails.orderItems[i].OrderItem.orderItemPrice + "</td>";
            markup += "<td style='display:none;'><input type='hidden' id='amt" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "' value='" + customerOrderDetails.orderItems[i].OrderItem.orderItemPrice + "'/>";

            markup += "</td>";
            markup += "<td>";
            markup += alter;
            markup += "</td>";
            markup += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
            markup += "<a class='btn btn-dark btn-sm' title='Assign Sales' data-toggle='tooltip' onclick='loadAssignModel(\"" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "\",\"" + customerOrderDetails.orderItems[i].OrderItem.employeeid + "\")' href='#'><i class='fa fa-tasks'></i></a>";
            markup += "<a class='btn btn-info btn-sm' title='Edit Price' data-toggle='tooltip' onclick='loadPriceModal(\"" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "\",\"" + customerOrderDetails.orderItems[i].OrderItem.productTitle + "\",\"" + (i + 1) + "\")' href='#'><i class='fa fa-inr'></i></a>";
            markup += "<a class='btn btn-success btn-sm' title='Add Measurment' data-toggle='tooltip' onclick='loadMeasurment(\"" + customerOrderDetails.orderItems[i].OrderItem.productId + "\",\"" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "\",\"" + (i) + "\")' href='#'><i class='fa fa-balance-scale'></i></a>";
            markup += "<a class='btn btn-primary btn-sm' title='add Style' data-toggle='tooltip' href='#' onclick='loadStyles(\"" + customerOrderDetails.orderItems[i].OrderItem.productId + "\",\"" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "\",\"" + (i) + "\")'><i class='fa fa-male'></i></a>";
            markup += "<a class='btn btn-warning btn-sm' title='add Fabrics' data-toggle='tooltip' href='#' onclick='loadFabrics(\"" + customerOrderDetails.orderItems[i].OrderItem.productId + "\",\"" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "\",\"" + (i) + "\")'><i class='fa fa-gift'></i></a>";
            markup += "<a class='btn btn-danger btn-sm' title='Remove Item' data-toggle='tooltip' href='#' onclick='removeItem(\"" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "\",\"" + customerOrderDetails.orderItems[i].OrderItem.orderItemPrice + "\")'><i class='fa fa-trash'></i></a>";
            markup += "<a class='btn btn-primary btn-sm' title='Download PDF' data-toggle='tooltip' href='#' onclick='loadPdf(" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + ")'><i class='fa fa-file-pdf-o'></i></a>";
            markup += "</td></div></tr>";
        }
        mar = markup;
    }
    $('#customerSelectionBlock').hide();
    $('#customerOrdersBlock').hide();
    $('#showOrdersdiv').hide();
    $('#loadNewPage').load('ordermanagement_inner.php');
    $("#productData").empty();

}