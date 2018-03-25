// var cookiesAlert = '<div id="cookies-alert"><div class="bg"></div><div class="info"></div><div class="content">' + $('.cookies-data').attr('data-text') + ' <a id="open-cookies-layer" href="' + $('.cookies-data').attr('data-url') + '" target="_blank">' + $('.cookies-data').attr('data-link-text') + '.</a></div><a class="close-btn" href="#"></a></div>';
//
//
// function initLayersCookies(){
//   $('body').prepend(cookiesAlert);
//   $('#cookies-alert').css({'opacity': '0', 'bottom':'0px', 'height': '100px'});
//   initActions();
// }
//
//
// function openAlertCookies(){
//   if(getCookie("_cookies")!="true" && $(".subtitle-homepage:first").length > 0){
//     $("#cookies-alert").show();
//     $("#cookies-alert").delay(500).animate({ 'opacity': '1', 'top': '0px'}, 250);
//     $(".logo-out").delay(200).animate({ 'top': '64px'}, 250);
//
//   }
// }
//
//
// function closeAlertCookies(){
//   $("#cookies-alert").animate({ 'opacity': 0, 'margin-top':'-60px'}, 250, function() {  $(this).hide(); });
//   $(".logo-out").animate({ 'top': '4px'}, 250);
//   setCookie("_cookies", "true", 999999999);
// }
//
//
// function initActions(){
//   $('#cookies-alert .close-btn').click(function(e){
//     e.preventDefault();
//     closeAlertCookies();
//   });
//   $('#cookies-alert #open-cookies-layer').click(function(e){
//     closeAlertCookies();
//   });
// }
//
//
// function setCookie(c_name,value,exdays){
//   var exdate=new Date();
//   exdate.setDate(exdate.getDate() + exdays);
//   var c_value=escape(value) + ((exdays === null) ? '' : '; expires='+exdate.toUTCString());
//   document.cookie=c_name + "=" + c_value;
// }
//
// function getCookie(c_name){
//   var c_value = document.cookie;
//   var c_start = c_value.indexOf(" " + c_name + "=");
//   if (c_start == -1){
//     c_start = c_value.indexOf(c_name + "=");
//   }
//   if (c_start == -1){
//     c_value = null;
//   }
//   else{
//     c_start = c_value.indexOf("=", c_start) + 1;
//     var c_end = c_value.indexOf(";", c_start);
//     if (c_end == -1){
//       c_end = c_value.length;
//     }
//     c_value = unescape(c_value.substring(c_start,c_end));
//   }
//   return c_value;
// }
//
// $(document).ready(function(){
//   initLayersCookies();
//   openAlertCookies();
// });
