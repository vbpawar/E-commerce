// $('#login').on('submit', function(event) {
//     event.preventDefault();
//     var loginData = {
//         usrname: $('#usrname').val(),
//         passwrd: $('#passwrd').val()
//     };
//     $.ajax({
//         url: api_url + 'login.php',
//         type: 'POST',
//         data: loginData,
//         dataType: 'json',
//         success: function(response) {
//             if (response.Data != null) {
//             var roleId = response.Data.roleId;
//              if (roleId == 1 || roleId == 3) {
//                  window.location.href='allorders.php';
//              } else if (roleId == 2) {
//                   window.location.href='products.php';
//              } else if (roleId == 4) {
//                   window.location.href='vendorOrders.php';
//              }
//               else{
//                 // alert("ok");
//               }
//             }
//           else {
//                 alert('Enter Correct Username and password');
//             }
//         }
//     });
// });

$('#login').on('submit', function(event) {
    event.preventDefault();
    var loginData = {
        usrname: $('#usrname').val(),
        passwrd: $('#passwrd').val()
    };
    $.ajax({
        url: './admin/login.php',
        type: 'POST',
        data: loginData,
        dataType: 'json',
        success: function(response) {
            if (response.Data != null) {
                var roleId = response.Data.roleId;
                var employeeId = response.Data.employeeId;
                var employeeName = response.Data.firstName + ' ' + response.Data.lastName;
                window.location.href = 'createSession.php?employeeId=' + employeeId + '&employeeName=' + employeeName + '&roleId=' + roleId;
            } else {
                alert('Enter Correct Username and password');
            }
        }
    });
});
