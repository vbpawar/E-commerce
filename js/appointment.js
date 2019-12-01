var styleData = new Map();
var confirmationStatus1 = new Map();
var selectitemsdata = new Map();

function getConfirmation() {
    confirmationStatus1.set('0', 'Idle');
    confirmationStatus1.set('1', 'Confirmed');
    confirmationStatus1.set('2', 'Cancelled');
    confirmationStatus1.set('3', 'Withdrawn by customer');
    confirmationStatus1.set('5', 'None');
}
getConfirmation();
getcustomerappointmentdata(customerId_g);

function getcustomerappointmentdata(customerId) {
    $.ajax({
        type: "POST",
        url: api_url + "getcustomerAppointment.php",
        dataType: "json",
        data: { customerId: customerId },
        success: function(response) {
            var count;
            if (response["Data"] != null) {
                count = response["Data"].length; // For Count length of Get All Appointment
            }

            for (var i = 0; i < count; i++) {
                styleData.set(response.Data[i].AppointmentDetails.appointmentId, response.Data[i].AppointmentDetails);
                selectitemsdata.set(response.Data[i].AppointmentDetails.appointmentId, response.Data[i].SelectedItems);
            }
            settabledata(styleData);

        }
    });
}

function settabledata(styleData) {
    var xhtml = '',
        employee = null;
    for (let k of styleData.keys()) {
        var AllData = styleData.get(k);
        let orderStatus = confirmationStatus1.get(AllData.appointmentStatus);
        if (EmployeeData.has(AllData.servingEmployeeId)) {
            employee = "<td>" + EmployeeData.get(AllData.servingEmployeeId) + "</td>";
        } else {
            employee = "<td></td>";
        }

        xhtml += "<tr>";
        xhtml += "<td>" + AllData.firstName + " " + AllData.lastname + "</td>";
        xhtml += "<td style='display:none;'>" + AllData.appointmentDate + "</td>";
        xhtml += "<td>" + getDate(AllData.appointmentDate) + "</td>";
        xhtml += "<td>" + AllData.slotTime + "</td>";
        xhtml += "<td>" + AllData.address + "</td>";
        xhtml += "<td>" + AllData.city + "</td>";
        xhtml += "<td>" + AllData.mobile + "</td>";
        xhtml += employee;
        xhtml += "<td>" + orderStatus + "</td>";
        xhtml += "<td style='display:none;'>" + AllData.appointmentId + "</td>";
        xhtml += '<td style=""><div class="btn-group" role="group" aria-label="Basic Example"><button class="btn btn-success btn-sm" data-toggle="tooltip" data-placement="top" title="Edit" onclick="editcustomerappointmentdata(' + k + ')"><i class="fa fa-edit"></i></button></div></td>';
        xhtml += "</tr>";
    }
    $('#appointData').html(xhtml);
}

function editcustomerappointmentdata(id) {
    // setEmployeeData();
    var AllData = styleData.get(id.toString());
    var Allitemdata = selectitemsdata.get(id.toString());
    $('.app').show();
    $("#appointdetailtbldata").empty();

    if (Allitemdata != null) {
        var selectitemlen = Allitemdata.length;
        var html = '';
        var selectfabriclen = 0;
        for (var i = 0; i < selectitemlen; i++) {
            if (Allitemdata[i].Product != null) {
                if (Allitemdata[i].Fabrics != null) {
                    html += '<tr>';
                    selectfabriclen = Allitemdata[i].Fabrics.length;
                    console.log(Allitemdata[i].Fabrics);
                    html += '<td style="color: orange;font-weight: bolder;">' + Allitemdata[i].Product.productTitle + '</td>';
                    html += '<td>' + Allitemdata[i].Fabrics[0].fabricTitle + '-' + Allitemdata[i].Fabrics[0].skuNo + ' <font color="green"><u>' + Allitemdata[i].Fabrics[0].colorName + '</u></font></td>';
                    for (var j = 1; j < selectfabriclen; j++) {
                        // console.log(Allitemdata[i].Fabrics[j]);
                        html += '<tr>';
                        html += '<td> </td>';
                        html += '<td>' + Allitemdata[i].Fabrics[j].fabricTitle + '-' + Allitemdata[i].Fabrics[j].skuNo + ' <font color="green"><u> ' + Allitemdata[i].Fabrics[j].colorName + '</u></font></td>';
                        html += '</tr>';
                    }
                } else {
                    html += '<tr>';
                    html += '<td style="color: orange;font-weight: bolder;">' + Allitemdata[i].Product.productTitle + '</td>';
                    html += '<td></td>';
                    html += '</tr>';
                }
            } else {
                html += '<tr>';
                html += '<td style="color: orange;font-weight: bolder;">No Products Available Till Yet</td>';
                html += '<td></td>';
                html += '</tr>';
            }
        }
        $("#appointdetailtbldata").html(html);
    }


}