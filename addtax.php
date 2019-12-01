<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="">
  <meta name="author" content="Dashboard">
  <meta name="keyword" content="Dashboard, Bootstrap, Admin, Template, Theme, Responsive, Fluid, Retina">
  <title>Ecommerce</title>

  <!-- Favicons -->
  <link href="img/favicon.png" rel="icon">
  <link href="img/apple-touch-icon.png" rel="apple-touch-icon">
  <!-- Bootstrap core CSS -->
  <link href="css/lib/bootstrap/asterisks.css" rel="stylesheet">
  <link href="css/lib/sweetalert/sweetalert.css" rel="stylesheet">
  <!-- <link href="css/lib/bootstrap/bootstrap.min.css" rel="stylesheet"> -->
  <link href="lib/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/datatable.css">
  <!--external css-->
  <link href="lib/font-awesome/css/font-awesome.css" rel="stylesheet" />
  <!-- Custom styles for this template -->
  <link href="css/style.css" rel="stylesheet">
  <link href="css/style-responsive.css" rel="stylesheet">
  <link href="css/table-responsive.css" rel="stylesheet">
</head>

<body>
  <section id="container">
    <?php include "header.php"; ?>
    <?php include "sidebar.php"; ?>
    <section id="main-content">
      <section class="wrapper">
        <h3><i class="fa fa-angle-right"></i> Add Tax</h3>
        <div class="preloader">
            <svg class="circular" viewBox="25 25 50 50">
    			<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" /> </svg>
        </div>
        <div class="row" id="showtable">
          <div class="col-lg-12">
          <div class="content-panel" style="padding: 25px;">
            <div class="row">
              <div class="col-md-12">
                  <button type="button" id="button1" class="btn btn-success" onclick="addTax()" style="float:right;margin-bottom: 5px;"> New Tax</button>
              </div>
            </div>

              <table id="tablemain" cellpadding="0" cellspacing="0" border="0" class="display table table-bordered" id="hidden-table-info">
                <thead>
                  <tr>
                    <!-- <th>Id</th> -->
                    <th>Tax</th>
                    <th class="hidden-phone">Action</th>
                  </tr>
                </thead>
                <tbody id="tablebody">

                </tbody>
              </table>
          </div>
        </div>
          </div>
        <div class="row" id="showform" style="display:none;">
          <div class="col-lg-12">
            <div class="form-panel">
              <h4 class="mb"><i class="fa fa-angle-right"></i> Add Tax</h4>
              <form class="form-horizontal style-form" method="get">
                <input id="taxid" type="hidden" />
                  <div class="row">
                  <div class="col-sm-6">
                  <div class="form-group">
                  <label>Tax</label>

                    <input type="text" class="form-control" id="taxval" >
                  </div>
                </div>
                  </div>
                <div class="row">
                  <div class="col-sm-3">
                    <button class="btn btn-success" id="savebtn"  >Save</button>
                    <button class="btn btn-primary" id="updatebtn" style="display:none;">Update</button>
                  </div>
                  <div class="col-sm-3">
                   <button class="btn btn-warning" id="reloadbtn" type="button">Back</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <!-- col-lg-12-->
        </div>
        <!-- /row -->
      </section>
      <!-- /wrapper -->
    </section>

    <?php include "footer.php"; ?>
  </section>
  <!-- js placed at the end of the document so the pages load faster -->
  <!-- <script src="lib/jquery/jquery.min.js"></script> -->
  <script src="lib/jquery/jquery.min.js"></script>
  <script src="js/datatable1.js"></script>
  <script src="js/datatable2.js"></script>
    <script src="javascript/apifile.js"></script>
  <script src="lib/bootstrap/js/bootstrap.min.js"></script>
  <script src="js/lib/bootstrap/js/popper.min.js"></script>
  <!-- <script src="js/lib/bootstrap/js/bootstrap.min.js"></script> -->
  <!-- <script src="js/lib/datatables/datatables.min.js"></script> -->
  <!-- <script src="js/lib/datatables/cdn.datatables.net/buttons/1.2.2/js/dataTables.buttons.min.js"></script>
  <script src="js/lib/datatables/cdn.datatables.net/buttons/1.2.2/js/buttons.flash.min.js"></script>
  <script src="js/lib/datatables/cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>
  <script src="js/lib/datatables/cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/pdfmake.min.js"></script>
  <script src="js/lib/datatables/cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js"></script>
  <script src="js/lib/datatables/cdn.datatables.net/buttons/1.2.2/js/buttons.html5.min.js"></script>
  <script src="js/lib/datatables/cdn.datatables.net/buttons/1.2.2/js/buttons.print.min.js"></script>
  <script src="js/lib/datatables/datatables-init.js"></script> -->
  <script class="include" type="text/javascript" src="lib/jquery.dcjqaccordion.2.7.js"></script>
  <script src="lib/jquery.scrollTo.min.js"></script>
  <script src="lib/jquery.nicescroll.js" type="text/javascript"></script>
  <!--custom checkbox & radio-->
  <!-- <script type="text/javascript" src="lib/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
  <script type="text/javascript" src="lib/bootstrap-daterangepicker/date.js"></script>
  <script type="text/javascript" src="lib/bootstrap-daterangepicker/daterangepicker.js"></script>
  <script type="text/javascript" src="lib/bootstrap-inputmask/bootstrap-inputmask.min.js"></script> -->
  <script src="lib/common-scripts.js"></script>
  <!-- <script type="text/javascript">

    $(document).ready(function() {

      var oTable = $('#hidden-table-info').dataTable({
        "aoColumnDefs": [{
          "bSortable": false,
          "aTargets": [0]
        }],
        "aaSorting": [
          [1, 'asc']
        ]
      });
    });
  </script> -->
  <script src="javascript/gettax.js"></script>
  <script src="javascript/addtax.js"></script>

</body>

</html>
