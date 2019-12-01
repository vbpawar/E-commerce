$('#products').select2({
    allowClear: true,
    placeholder: "Select Product Name"
});
var customerMeasurments = new Map();
display_customerInfo();
displayOrderDetails(OrderDetailsOfCustomer);

function display_customerInfo() {
    let cData = customerData.get(customerId_g);
    $('#custName').html(cData.firstName + ' ' + cData.lastName);
    $('#custEmail').html(cData.email);
    $('#custAddress').html(cData.address);
    $('#custCity').html(cData.city);
    $('#custMobile').html(cData.mobile);
    loadcustomerMeasurments(customerId_g);
}

function loadcustomerMeasurments(customerId) {
    $.ajax({
        url: api_url + 'getcustomerspecificmeasurement.php',
        type: 'POST',
        data: { customerId: customerId },
        dataType: 'json',
        success: function(response) {
            if (response.Data != null) {
                var count = response.Data.length;
                for (var i = 0; i < count; i++) {
                    customerMeasurments.set(response.Data[i].measurmentId, response.Data[i].value);
                }
            }
        }
    });
}

$('.add-row').on('click', function(e) {
    // console.log("Hello");
    var orderItemPrice = $('#OrderItemPrice').val();
    if (orderItemPrice == '') {
        orderItemPrice = 0;
    }
    e.preventDefault();
    if ($('#products').val() != null) {
        var createOrderData = {
            orderid: orderId,
            orderItemPrice: orderItemPrice,
            productid: $('#products').val()
        };
        $.ajax({
            url: api_url + 'createorderitem.php',
            type: 'POST',
            dataType: 'json',
            data: createOrderData,
            beforeSend: function() {
                $(".preloader").show();
            },
            success: function(response) {
                var count = response.Data.length;

                getOrdersOfCustomer(customerId_g);
                customerOrderDetails = [];
                customerOrderDetails = customerOrders[indexRow];
                OrderDetailsOfCustomer = customerOrderDetails.OrderDetails;
                displayOrderDetails(OrderDetailsOfCustomer);
                $('#customerOrdersBlock').hide();
                var markup = '';
                for (var i = 0; i < count; i++) {
                    let styleTitle = '',
                        alter = '';
                    if (ParentProducts.has(response.Data[i].parentId)) {
                        styleTitle = ParentProducts.get(response.Data[i].parentId);
                    }
                    if (customerOrderDetails.orderItems[i].OrderItem.isAlterNeeded == 1) {
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
                    markup += "<tr id=" + response.Data[i].orderItemId + ">";
                    markup += "<td>" + response.Data[i].productTitle + '-' + styleTitle + "</td>";
                    markup += fabarrhtml;
                    markup += "<td>" + response.Data[i].orderItemPrice + "</td>";
                    markup += "<td style='display:none'><input type='hidden' id='amt" + response.Data[i].orderItemId + "' value='" + response.Data[i].orderItemPrice + "'/>";
                    markup += "</td>";
                    markup += "<td>";
                    markup += alter;
                    markup += "</td>";
                    markup += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
                    markup += "<a class='btn btn-dark btn-sm' title='Assign Sales' data-toggle='tooltip' onclick='loadAssignModel(\"" + response.Data[i].orderItemId + "\",\"" + response.Data[i].employeeid + "\")' href='#'><i class='fa fa-tasks'></i></a>";
                    markup += "<a class='btn btn-info btn-sm' title='Edit Price' data-toggle='tooltip' onclick='loadPriceModal(\"" + response.Data[i].orderItemId + "\",\"" + response.Data[i].productTitle + "\",\"" + (i + 1) + "\")' href='#'><i class='fa fa-inr'></i></a>";
                    markup += "<a class='btn btn-success btn-sm' title='Add Measurment' data-toggle='tooltip' onclick='loadMeasurment(\"" + response.Data[i].productId + "\",\"" + response.Data[i].orderItemId + "\",\"" + (i) + "\")' href='#'><i class='fa fa-balance-scale'></i></a>";
                    markup += "<a class='btn btn-primary btn-sm' title='add Style' data-toggle='tooltip' href='#' onclick='loadStyles(\"" + response.Data[i].productId + "\",\"" + response.Data[i].orderItemId + "\",\"" + (i) + "\")'><i class='fa fa-male'></i></a>";
                    markup += "<a class='btn btn-warning btn-sm' title='add Fabrics' data-toggle='tooltip' href='#' onclick='loadFabrics(\"" + response.Data[i].productId + "\",\"" + response.Data[i].orderItemId + "\",\"" + (i) + "\")'><i class='fa fa-gift'></i></a>";
                    markup += "<a  class='btn btn-danger btn-sm' title='Remove Item' data-toggle='tooltip' href='#' onclick='removeItem(\"" + response.Data[i].orderItemId + "\",\"" + response.Data[i].orderItemPrice + "\")'><i class='fa fa-trash'></i></a>";
                    markup += "<a class='btn btn-primary btn-sm' title='Download PDF' data-toggle='tooltip' href='#' onclick='loadPdf(" + response.Data[i].orderItemId + ")'><i class='fa fa-file-pdf-o'></i></a>";
                    markup += "</td></div></tr>";
                }
                $("#productData").html(markup);
                $('#OrderItemPrice').val('');
                $('#products').val('').trigger('change');
            },
            complete: function(response) {
                $(".preloader").hide();
            }
        })
    } else {
        alert('Select product from list');
    }

});

function removeItem(orderItemId, price) {
    var r = confirm("Are you sure to remove this item");
    if (r === true) {
        var removeData = {
            orderitemid: orderItemId,
            orderid: orderId,
            price: price
        };
        $.ajax({
            url: api_url + 'deleteorderitem.php',
            type: 'POST',
            data: removeData,
            dataType: 'json',
            success: function(response) {
                $('#' + orderItemId).remove();
                getOrdersOfCustomer(customerId_g);
                $('#customerOrdersBlock').hide();
                customerOrderDetails = [];
                customerOrderDetails = customerOrders[indexRow];
            }
        });
    }
}

getActiveProductsList();
loadTable(mar);

function loadTable(param) {
    $("#productData").empty();
    $("#productData").html(param);
}

function getActiveProductsList() {
    $.ajax({
        url: api_url + 'getactiveproducts.php',
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".preloader").show();
        },
        success: function(response) {
            var createDropdownOptions = '';
            var count = response.Data.length;
            let styleTitle = '';
            for (var i = 0; i < count; i++) {
                if (ParentProducts.has(response.Data[i].parentId)) {
                    styleTitle = ParentProducts.get(response.Data[i].parentId);
                }
                ActiveProductsList.set(response.Data[i].productId, response.Data[i].price);
                createDropdownOptions += "<option value=" + response.Data[i].productId + ">" + response.Data[i].productTitle + '-' + styleTitle + '(' + response.Data[i].skuNo + ')' + "</option>";
            }
            $("#products").html(createDropdownOptions);
            $('#products').val('').trigger('change');
        },
        complete: function(response) {
            $(".preloader").hide();
        }
    })
}

function loadMeasurment(productId, orderItemId, rowId) { //for mapping product id and measurment id
    customer_orderItemId = orderItemId;

    var count_1 = 0;

    var check_mesurment_exists = customerOrderDetails.orderItems[rowId].Measurements;

    if (check_mesurment_exists != null) {
        count_1 = customerOrderDetails.orderItems[rowId].Measurements.length;
    }
    $.ajax({
        url: api_url + 'getproductmeasurementmapping.php',
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".preloader").show();
        },
        success: function(response) {
            var createDropdownOptions = '';
            if (response.Data != null) {
                var count = response.Data.length;
                var flag = null;
                for (var i = 0; i < count; i++) {
                    if (response.Data[i].productId == productId) {
                        createDropdownOptions += "<tr><td style='display:none;'>" + response.Data[i].measurementId + "</td><td>" + response.Data[i].itemTitle + "</td>";
                        if (count_1 > 0) {
                            flag = 0;
                            for (var a = 0; a < count_1; a++) {
                                if (response['Data'][i].measurementId == check_mesurment_exists[a].measurementId) {
                                    createDropdownOptions += "<td><input type='text' name='measurmentValues[]'  value=" + check_mesurment_exists[a].value + " class='form-control form-control-sm'></td>";
                                    flag = 1;
                                }
                            }
                            if (flag == 0) {
                                createDropdownOptions += "<td><input type='text' name='measurmentValues[]'  class='form-control form-control-sm'></td>";
                            }

                        } else {
                            if (customerMeasurments.has(response.Data[i].measurementId)) {
                                createDropdownOptions += "<td><input type='text' name='measurmentValues[]' value=" + customerMeasurments.get(response.Data[i].measurementId) + "  class='form-control form-control-sm'></td>";
                            } else {
                                createDropdownOptions += "<td><input type='text' name='measurmentValues[]'   class='form-control form-control-sm'></td>";
                            }

                        }
                        createDropdownOptions += "</tr>";
                    }
                }
                $("#measurementTable").html(createDropdownOptions);
                $('#myModal').modal();
            } else {
                alert('Add Measurment First');
            }
        },
        complete: function(response) {
            $(".preloader").hide();
        }
    });

}

function loadStyles(productId, orderItemId, rowId) {
    style_orderItemId = orderItemId;

    var count_1 = 0;
    var check_styles_exists = customerOrderDetails.orderItems[rowId].Styles;
    if (check_styles_exists != null) {
        count_1 = customerOrderDetails.orderItems[rowId].Styles.length;
    }
    $.ajax({
        url: api_url + 'getproductstitchstylemapping.php',
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".preloader").show();
        },
        success: function(response) {
            var firstList = '',
                secondList = '',
                thirdList = '';
            var second = '',
                third = '',
                nameKey = 0;
            var valFirst = '',
                valSecond = '',
                valThird = '';
            var m = 0,
                flag_0 = null,
                flag_1 = null;
            if (response.Data != null) {
                var count = response.Data.length;

                for (var i = 0; i < count; i++) {
                    if (response.Data[i].StitchStyle.productId == productId) {
                        if (response.Data[i].StitchSubstyle != null) {
                            var StitchSubstyleCount = response.Data[i].StitchSubstyle.length;
                            if (response.Data[i].StitchStyle.stitchStyleType == 0) {
                                valFirst = response.Data[i].StitchStyle.stitchStyleId;
                                firstList += "<tr><td colspan='3' style='text-align:center;'><strong>" + response.Data[i].StitchStyle.stitchStyleTitle + "</strong></td></tr>";
                                for (var j = 0; j < StitchSubstyleCount; j++) {
                                    flag_0 = 0;

                                    firstList += "<tr><td style='display:none;'>" + response.Data[i].StitchStyle.stitchStyleId + "</td><td>" + response.Data[i].StitchSubstyle[j].stitchSubStyleTitle + "</td>";
                                    if (count_1 > 0) {

                                        for (var a = 0; a < count_1; a++) {
                                            if (response.Data[i].StitchSubstyle[j].stitchSubStyleId == check_styles_exists[a].stitchSubStyleId) {

                                                firstList += "<td><input type='checkbox' name='multipleSelection'  value=" + response.Data[i].StitchSubstyle[j].stitchSubStyleId + " checked></td>";
                                                m++;
                                                flag_0 = 1;

                                            }
                                        }
                                        if (flag_0 == 0) {
                                            firstList += "<td><input type='checkbox' name='multipleSelection'  value=" + response.Data[i].StitchSubstyle[j].stitchSubStyleId + "></td>";
                                        }


                                    } else {
                                        firstList += "<td><input type='checkbox' name='multipleSelection'  value=" + response.Data[i].StitchSubstyle[j].stitchSubStyleId + "></td>";
                                    }
                                    firstList += "</tr>";


                                }

                            } else if (response.Data[i].StitchStyle.stitchStyleType == 1) {
                                second = response.Data[i].StitchStyle.stitchStyleTitle;
                                valSecond = response.Data[i].StitchStyle.stitchStyleId;

                                secondList += "<tr><td colspan='3' style='text-align:center;'><strong>" + response.Data[i].StitchStyle.stitchStyleTitle + "</strong></td></tr>";
                                for (var k = 0; k < StitchSubstyleCount; k++) {
                                    secondList += "<tr><td style='display:none;'>" + response.Data[i].StitchStyle.stitchStyleId + "</td><td>" + response.Data[i].StitchSubstyle[k].stitchSubStyleTitle + "</td>";
                                    flag_1 = 0;
                                    if (count_1 > 0) {

                                        for (var a = 0; a < count_1; a++) {

                                            if (response.Data[i].StitchSubstyle[k].stitchSubStyleId == check_styles_exists[a].stitchSubStyleId) {

                                                secondList += "<td><input type='radio' name='" + response.Data[i].StitchStyle.stitchStyleId + "chek'   value=" + response.Data[i].StitchSubstyle[k].stitchSubStyleId + " checked></td>";
                                                m++;
                                                flag_1 = 1;
                                            }
                                        }
                                        if (flag_1 == 0) {


                                            secondList += "<td><input type='radio' name='" + response.Data[i].StitchStyle.stitchStyleId + "chek'   value=" + response.Data[i].StitchSubstyle[k].stitchSubStyleId + "></td>";

                                        }

                                    } else {
                                        secondList += "<td><input type='radio' name='" + nameKey + "singleSelection'   value=" + response.Data[i].StitchSubstyle[k].stitchSubStyleId + "></td>";
                                    }
                                    secondList += "</tr>";

                                }
                                nameKey++;

                            } else if (response.Data[i].StitchStyle.stitchStyleType == 2) {
                                third = response.Data[i].StitchStyle.stitchStyleTitle;
                                valThird = response.Data[i].StitchStyle.stitchStyleId;
                                thirdList += "<tr><td colspan='3' style='text-align:center;'><strong>" + response.Data[i].StitchStyle.stitchStyleTitle + "</strong></td></tr>";
                                for (var l = 0; l < StitchSubstyleCount; l++) {

                                    flag_2 = 0;
                                    thirdList += "<tr><td style='display:none;'>" + response.Data[i].StitchStyle.stitchStyleId + "</td><td style='display:none;'>" + response.Data[i].StitchSubstyle[l].stitchSubStyleId + "</td>";
                                    thirdList += "<td>" + response.Data[i].StitchSubstyle[l].stitchSubStyleTitle + "</td>";
                                    if (count_1 > 0) {
                                        for (var a = 0; a < count_1; a++) {
                                            if (response.Data[i].StitchSubstyle[l].stitchSubStyleId == check_styles_exists[a].stitchSubStyleId) {
                                                thirdList += "<td><input type='text' class='form-control form-control-sm' value=" + check_styles_exists[a].value + "></td>";
                                                m++;
                                                flag_2 = 1;


                                            }
                                        }
                                        if (flag_2 == 0) {
                                            thirdList += "<td><input type='text' class='form-control form-control-sm'></td>";
                                        }

                                    } else {
                                        thirdList += "<td><input type='text' class='form-control form-control-sm'></td>";
                                    }
                                    thirdList += "</tr>";

                                }
                            }
                        }

                    }
                }

                valThird = Number(valThird);
                valFirst = Number(valFirst);
                valSecond = Number(valSecond);
                $("#FirststyleTable").html(firstList);
                $("#SecondstyleTable").html(secondList);
                $("#ThirdstyleTable").html(thirdList);
                $('#valFirst').val(valFirst);
                $('#valSecond').val(valSecond);
                $('#valThird').val(valThird);
                $('#styleModal').modal();
            } else {
                alert('Add Styles First');
            }
        },
        complete: function(response) {
            $(".preloader").hide();
        }

    });
}

function loadFabrics(productId, orderItemId, rowId) {
    $('#fabric_row').val(parseInt(rowId) + 1);
    fabric_orderItemId = orderItemId;
    //load fabrics data if exists and checked associative checkboxes
    var count_1 = 0;
    var check_fabrics_exists = customerOrderDetails.orderItems[rowId].Fabrics;
    if (check_fabrics_exists != null) {
        count_1 = customerOrderDetails.orderItems[rowId].Fabrics.length;
    }
    var flag = null;
    //end for load data

    $.ajax({
        url: api_url + 'getproductfabricmapping.php',
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".preloader").show();
        },
        success: function(response) {
            var createDropdownOptions = '';
            if (response.Data != null) {
                var count = response.Data.length;
                for (var i = 0; i < count; i++) {
                    if (response.Data[i].productId == productId) {
                        //createDropdownOptions += "<td>" + response['Data'][i].fabricTitle + "</td>";
                        createDropdownOptions += "<tr><td><img class='img-thumbnail' src='mobileimages/fabric/300x300/" + response['Data'][i].skuNo + ".jpg' alt='No Image Available'></img></td>";
                        createDropdownOptions += "<td>" + response['Data'][i].fabricTitle + "</td>";
                        createDropdownOptions += "<td>" + response['Data'][i].skuNo + "</td>";
                        createDropdownOptions += "<td>" + response['Data'][i].fabricPrice + "</td>";
                        if (count_1 > 0) {
                            flag = 0;
                            for (var j = 0; j < count_1; j++) {
                                if (response['Data'][i].fabricId == check_fabrics_exists[j].fabricId) {
                                    createDropdownOptions += "<td><input type='checkbox' name='fabrics' value=" + response['Data'][i].fabricId + " checked></td>";
                                    flag = 1;
                                }
                            }
                            if (flag == 0) {
                                createDropdownOptions += "<td><input type='checkbox' name='fabrics' value=" + response['Data'][i].fabricId + "></td>";
                            }

                        } else {
                            createDropdownOptions += "<td><input type='checkbox' name='fabrics' value=" + response['Data'][i].fabricId + "></td>";
                        }
                        createDropdownOptions += "</tr>";
                    }
                }

                $("#fabricsTable").html(createDropdownOptions);
                $('#FabricsModal').modal();
            } else {
                alert('Add Fabrics First');
            }
        },
        complete: function(response) {
            $(".preloader").hide();
        }
    })
}
getPaymentList();
// var totalpayment =0;
function getPaymentList() {
    var Orderamount = parseFloat($('#Orderamount').html());
    $("#spanperror").html("<strong>Remaining Amount</strong>  <span class='badge' style='background-color: aquamarine;font-weight: bolder;'>" + Orderamount + "</span></font>");
    $("#amount").val(Orderamount);
    var empName = $('#empName').val();
    var totalpayment = 0;
    $("#totalpayment").val(totalpayment);
    $("#paymentData").empty();
    $.ajax({
        url: api_url + 'getorderpayments.php',
        type: 'POST',
        data: { orderid: orderId },
        success: function(response) {

            var paymentDateTime = null;
            if (response.Data.Payments != null) {
                var count = response.Data.Payments.length;
                var markup = '';
                for (var i = 0; i < count; i++) {
                    var isSuceed = '',
                        isDeleted = '',
                        deleteEntry = '';
                    if (response.Data.Payments[i].isSuceed == 1) {
                        isSuceed = "<td><span class='badge badge-pill badge-success'>completed</span></td>";
                        isDeleted = "<td></td>";
                        deleteEntry = "";
                    } else {
                        isSuceed = "<td><span class='badge badge-pill badge-danger'>pending</span></td>";
                        if (response.Data.Payments[i].isDeleted == 1) {
                            isDeleted = "<td><code>" + empName + "</code></td>";
                            deleteEntry = "<a class='btn btn-primary btn-sm' title='Revert Payment' data-toggle='tooltip' href='#' onclick='updatePaymentFlag(\"" + response.Data.Payments[i].paymentId + "\",\"" + response.Data.OrderDetails.orderId + "\")'><i class='fa fa-info'></i></a>";
                        } else {
                            isDeleted = "<td><code></code></td>";
                            deleteEntry = "<a class='btn btn-danger btn-sm' title='Remove Payment' data-toggle='tooltip' href='#' onclick='removePayment(\"" + response.Data.Payments[i].paymentId + "\",\"" + response.Data.OrderDetails.orderId + "\")'><i class='fa fa-trash'></i></a>";
                        }
                    }

                    paymentDateTime = getDate(response.Data.Payments[i].paymentDateTime);
                    markup += "<tr><td>" + (i + 1) + "</td><td>" + response.Data.Payments[i].paymentMode + "</td>";
                    markup += "<td>" + response.Data.Payments[i].paymentType + "</td><td>" + response.Data.Payments[i].amount + "</td>";
                    totalpayment += parseFloat(response.Data.Payments[i].amount);
                    markup += "<td>" + response.Data.Payments[i].currency + "</td><td>" + empName + "</td><td>" + paymentDateTime + "</td>";
                    markup += isSuceed;
                    markup += isDeleted;
                    markup += "<td><div class='btn-group' role='group' aria-label='Basic example'>";
                    markup += deleteEntry;
                    markup += "</td></div></tr>";
                }
                $("#spanperror").html("<strong>Remaining Amount</strong> <span class='badge' style='background-color: aquamarine;font-weight: bolder;'>" + (Orderamount - parseFloat(totalpayment)) + "</span></font>");
                $("#amount").val(Orderamount - parseFloat(totalpayment));
                $("#totalpayment").val(totalpayment);
                $("#paymentData").html(markup);
            }
        }
    });
}

function removePayment(paymentid, orderid) {
    var removeData = {
        orderid: orderid,
        paymentid: paymentid,
        employeeid: $('#empId').val()
    };
    $.ajax({
        url: api_url + 'deletepayment.php',
        type: 'POST',
        data: removeData,
        success: function(response) {
            alert(response.Message);
            getPaymentList();
        }
    })
}

function updatePaymentFlag(paymentid) {
    var updateData = {
        paymentid: paymentid,
        employeeid: $('#empId').val()
    };
    $.ajax({
        url: api_url + 'revertpayment.php',
        type: 'POST',
        data: updateData,
        success: function(response) {
            alert(response.Message);
            getPaymentList();
        }
    })
}
$('#loadfirstpage').on('click', function(e) {
    e.preventDefault();
    $('#loadNewPage').empty();
    $('#customerSelectionBlock').show();
    $('#customerOrdersBlock').show();
});

function displayOrderDetails(orderDetails) {
    $('#orderId').html(orderDetails.orderId);
    $('#Orderamount').html(orderDetails.amount);
    $('#orderStatus').html(statusMap.get(orderDetails.orderStatus));
    $('#purchaseDateTime').html(getDate(orderDetails.purchaseDateTime));
    $('#customerExpectedDate').html(getDate(orderDetails.customerExpectedDate));
    $('#FinalDeliveryDate').html(getDate(orderDetails.FinalDeliveryDate));
}

function loadPriceModal(orderItemId, productTitle, rowId) {
    $('#rowId').val(rowId);
    $('#orderItemId').val(orderItemId);
    $('#pTitle').html(productTitle);
    var price = $('#amt' + orderItemId).val();
    $('#sendPrice').val(price);
    $('#changeAmount').val(price);
    $('#editOrderItemPrice').modal();
}

function getPriceOfProduct(productId) {
    if (ActiveProductsList.has(productId)) {
        var price = ActiveProductsList.get(productId);
        $('#OrderItemPrice').val(price);
    }
}
changeStatusOfOrder();

function changeStatusOfOrder() {
    var OrderDetails = customerOrders[indexRow];
    $('#statusOfOrder').val(OrderDetails.OrderDetails.orderStatus).trigger('change');
    $('#confirmationOfOrder').val(OrderDetails.OrderDetails.isConfirmed).trigger('change');
    $('#dateOfExpected').val(OrderDetails.OrderDetails.customerExpectedDate);
    $('#dateOfFinalDelivery').val(OrderDetails.OrderDetails.FinalDeliveryDate);
}
$('#updateorderstatus').on('click', function() {
    orderStatusData = {
        orderId: orderId,
        statusOfOrder: $('#statusOfOrder').val(),
        confirmationOfOrder: $('#confirmationOfOrder').val(),
        dateOfExpected: $('#dateOfExpected').val(),
        dateOfFinalDelivery: $('#dateOfFinalDelivery').val()
    };
    $.ajax({
        url: api_url + 'updatecustomerorderstatus.php',
        type: 'POST',
        data: orderStatusData,
        dataType: 'json',
        beforeSend: function() {
            $(".preloader").show();
        },
        success: function(response) {
            alert(response.Message);
            getOrdersOfCustomer(customerId_g);
            $('#customerOrdersBlock').hide();
        },
        complete: function(response) {
            $(".preloader").hide();
        }
    });
});

function loadAssignModel(orderItemId, employeeid) {
    if (employeeid != null) {
        // $('#assignedEmp').html('Allready Assigned Employee ' + EmployeeData.get(employeeid));
        $('#assignId').val(employeeid).trigger('change');
    }
    $('#orderItemIdforassign').val(orderItemId);
    $('#assignWork').modal();
}

function loadcomment(orderItemId) {
    var html = '';
    $.ajax({
        url: api_url + 'getcommentorderItemId.php',
        type: 'POST',
        data: {
            orderItemId: orderItemId
        },
        dataType: 'json',
        beforeSend: function() {
            // $(".preloader").show();
        },
        success: function(response) {

            if (response.Responsecode == 200) {
                if (response['Data'] != null) {
                    count = response['Data'].length;
                }
                for (var i = 0; i < count; i++) {
                    html += '<tr>';
                    html += '<td width="70%;">' + response.Data[i].remarks + '</td>';
                    html += '<td width="30%;">' + response.Data[i].requestDateTime + '</td>';
                    html += '</tr>';
                }
                $("#spancomment").html(html);
                $('#openComment').modal();
            } else {
                alert("No Comment is Available for this Item");
            }
        },
        complete: function(response) {}
    });
}

function loadPdf(orderItemId) {
    window.open(api_url + 'orderitempdf.php?orderitemid=' + orderItemId);
}