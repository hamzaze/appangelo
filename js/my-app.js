var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      path: '/about/',
      url: 'about.html',
    },
  ],
  // ... other parameters
});

var $$ = Dom7;

var isAjaxLoaded=false;
var pathToAjaxDispatcher="https://www.intellicomstudios.net/italiadirect/php/ajaxDispatcher1.php";
var ajaxLoader="<div class='ajaxLoader left50 top50 abs'><div class='fineloader'></div></div>";
var ajaxLoaderWithBackground="<div class='overlayWhite'>" + ajaxLoader + "</div>";

var dataParameter = {
    "amount_money": {
      "amount" : "125",
      "currency_code" : "CAD"
    },
    "callback_url" : "https://www.intellicomstudios.net/italiadirect/index.html", // Replace this value with your application's callback URL
    "client_id" : "sq0idp-ljqyUWvDEuqAMj1IHCc8cQ", // Replace this value with your application's ID
    "version": "2.0",
    "notes": "notes for the transaction",
    "options" : {
      "supported_tender_types" : ["CREDIT_CARD"]
    }
  };

$$(document).on("click", "[data-action='addedititem']", function(e){
    e.preventDefault();
    var $this=$$(this);
    
    var postData={};
    postData["context"]=$this.attr("data-context");
    
    switch(postData["context"]){
        case "sendOrder":
            var postData=app.formToJSON("#frmOrderFE");

        break;
        case "connectToSquare":
            $$("iframe[data-target='connectToSquare']").attr("src", $this.attr("data-href"));
        break;
    }
    console.log(postData);
});