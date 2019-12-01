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
var totalorderamount = 0;
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
            //  console.log(TailorData);
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
            var createDropdownOptions = '';
            if (response.Data != null) {
                var count = response.Data.length;
                createDropdownOptions += "<option value=''>Select Customer Name</option>";
                for (var i = 0; i < count; i++) {
                    createDropdownOptions += "<option value=" + response.Data[i].customerId + ">" + response.Data[i].firstName + " " + response.Data[i].lastName + "-" + response.Data[i].mobile + "</option>";
                    customerData.set(response.Data[i].customerId, response.Data[i]);
                }
            } else {
                createDropdownOptions += "<option value=''>No customers available</option>";
            }
            $("#customerId").html(createDropdownOptions);
        },
        complete: function() {
            $(".preloader").hide();
        }
    })
}
$('#customerId').select2({
    allowClear: true,
    placeholder: "Select Customer Name"
});
//first select customer then customerOrders[] intialize to all order details of that customer
function getOrdersOfCustomer(customerId) {
    customerId_g = customerId;
    $('#customerOrdersDataTable').dataTable().fnDestroy();
    $("#customerOrdersData").empty();
    $.ajax({
        url: api_url + 'customerorders.php',
        type: 'POST',
        async: false,
        data: { customerid: customerId },
        dataType: 'json',
        beforeSend: function() {
            $(".preloader").show();
        },
        success: function(response) {

            if (response.Data != null) {
                var count = response.Data.length;
                const orders = response.Data;
                customerOrders = [];
                customerOrders = [...orders];
                var orderStatus = null,
                    isConfirmed = null,
                    customerExpectedDate = null,
                    FinalDeliveryDate = null,
                    cash_amount = 0,
                    NEFT_amount = 0,
                    EmpName = '-';
                $('#customerOrdersBlock').show();
                var responseData = "";
                for (var i = 0; i < count; i++) {
                    var cash = 0,
                        neft = 0;
                    orderStatus = statusMap.get(response.Data[i].OrderDetails.orderStatus);
                    isConfirmed = confirmationStatus.get(response.Data[i].OrderDetails.isConfirmed);
                    // if (response.Data[i].OrderDetails.promoCode == null) {
                    //     response.Data[i].OrderDetails.promoCode = '-';
                    // }
                    // if (response.Data[i].OrderDetails.Cash_amount != null) {
                    //     cash_amount = cash_amount + parseFloat(response.Data[i].OrderDetails.Cash_amount);
                    //     cash = parseFloat(response.Data[i].OrderDetails.Cash_amount);
                    // }
                    if (response.Data[i].OrderDetails.RecievedAmount != null) {
                        // NEFT_amount = NEFT_amount + parseFloat(response.Data[i].OrderDetails.NEFT_amount);
                        cash_amount = parseFloat(response.Data[i].OrderDetails.RecievedAmount);
                    }
                    if (EmployeeData.has(response.Data[i].OrderDetails.employeeId)) {
                        EmpName = EmployeeData.get(response.Data[i].OrderDetails.employeeId);
                    }
                    customerExpectedDate = getDate(response.Data[i].OrderDetails.customerExpectedDate);
                    FinalDeliveryDate = getDate(response.Data[i].OrderDetails.FinalDeliveryDate);
                    responseData += "<tr>";
                    responseData += "<td>" + parseFloat(response.Data[i].OrderDetails.amount).toLocaleString() + "</td>";
                    responseData += "<td>" + cash_amount.toLocaleString() + "</td>";
                    responseData += "<td>" + orderStatus + "</td>";
                    responseData += "<td>" + isConfirmed + "</td>";
                    responseData += "<td>" + customerExpectedDate + "</td>";
                    responseData += "<td>" + FinalDeliveryDate + "</td>";
                    responseData += "<td>" + EmpName + "</td>";
                    responseData += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
                    responseData += '<button class="btn btn-success btn-sm" data-toggle="tooltip" data-placement="top" title="Edit" onclick="showData(' + response.Data[i].OrderDetails.orderId + ',' + (i) + ')"><i class="fa fa-edit"></i></button>';
                    responseData += "</div></td></tr>";
                }
                $("#customerOrdersData").html(responseData);

                $('#customerOrdersDataTable').DataTable({
                    searching: true,
                    retrieve: true,
                    bPaginate: $('tbody tr').length > 10,
                    order: [],
                    columnDefs: [{ orderable: false, targets: [] }],
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
// function getDate(date) {
//     var output = '-';
//     if (date == null) {
//         return output;
//     } else {
//         var d = new Date(date);
//         output = d.toDateString(); // outputs to "Thu May 28 2015"
//         //output = d.toGMTString(); //outputs to "Thu, 28 May 2015 22:10:21 GMT"
//     }
//     return output;
// }
function getDate(date) {
    var output = '-';
    if (date == null) {
        return output;
    } else {
        var d = new Date(date);
        output = d.toDateString(); // outputs to "Thu May 28 2015"
        let outarr = output.split(" ");
        let datestr = outarr[0] + "," + outarr[2] + " " + outarr[1] + " " + outarr[3];
        output = datestr;
    }
    return output;
}

function showpdf(orderid, rowId) {
    orderId = orderid;
    customerOrderDetails = JSON.stringify(customerOrders[rowId]);
    var order = api_url + 'orderpdf.php?orderId=' + orderId;
    window.open(order, '_blank');
}
//load an particular order of a customer for edit/update purpose
function showData(orderid, rowId) {
    $('#loadNewPage').empty();
    orderId = orderid;
    customerOrderDetails = customerOrders[rowId];
    totalorderamount = 0;
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
                    fabarrhtml += " -" + customerOrderDetails.orderItems[i].Fabrics[j].fabricPrice + "-" + customerOrderDetails.orderItems[i].Fabrics[j].skuNo;
                    fabarrhtml += "</br >";
                }
                fabarrhtml += "</td >";
            } else {
                fabarrhtml = "<td></td>";
            }

            markup += "<tr id=" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "><td>" + customerOrderDetails.orderItems[i].OrderItem.productTitle + '-' + styleTitle + "</td>";
            markup += fabarrhtml;
            markup += "<td>" + customerOrderDetails.orderItems[i].OrderItem.orderItemPrice + "</td>";
            markup += "<td style='display:none'><input type='hidden' id='amt" + customerOrderDetails.orderItems[i].OrderItem.orderItemId + "' value='" + customerOrderDetails.orderItems[i].OrderItem.orderItemPrice + "'/>";
            // console.log(customerOrderDetails.orderItems[i].OrderItem.orderItemPrice);
            totalorderamount += parseFloat(customerOrderDetails.orderItems[i].OrderItem.orderItemPrice);
            // markup += alter;
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
        // console.log("totalorderamount"+totalorderamount);
        mar = markup;
    }
    $('#customerSelectionBlock').hide();
    $('#customerOrdersBlock').hide();

    $('#loadNewPage').load('createNewOrder.php');
    $("#productData").empty();

}
//create new order data using customerid
$('#createOrder').on('click', function(event) {
    $('#loadNewPage').empty();
    event.preventDefault();
    var custId = $('#customerId');
    customerId_g = custId.val();
    if (custId.val() === '') {
        alert("Please select an Customer from the list and then proceed!");
        $('#customerId').focus();
        return false;
    } else {
        var OrderData = {
            customerid: $('#customerId').val(),
            employeeid: $('#empId').val()
        };
        $.ajax({
            url: api_url + 'createorder.php',
            type: 'POST',
            dataType: 'json',
            data: OrderData,
            beforeSend: function() {
                $(".preloader").show();
            },
            success: function(response) {
                var OrderId = response.OrderDetails.orderId;
                orderId = OrderId;
                indexRow = 0;
                mar = '';
                if (response.OrderDetails != null) {
                    OrderDetailsOfCustomer = response.OrderDetails;
                }
                $('#customerSelectionBlock').hide();
                $('#customerOrdersBlock').hide();
                $('#loadNewPage').load('createNewOrder.php');

            },
            complete: function(response) {
                $(".preloader").hide();
            }
        })
    }
});