$(document).ajaxStart(function() {
   console.log('in');
   $("#wait").css("display", "block");
});
$(document).ajaxComplete(function() {
   console.log('out');
   $("#wait").css("display", "none");
});
