// (function(){
//
//    navigator.sayswho = (function(){
//       var N = navigator.appName
//       var ua = navigator.userAgent
//       var tem;
//       var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
//       if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
//       M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
//       return M;
//    })();
//    var browser_version = navigator.sayswho;
//    console.log(browser_version);
//
// }());
