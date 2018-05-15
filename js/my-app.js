var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.ihumoruangelotsarouchas.app',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },// Pass app routes on app init
  routes: [
    {
      path: '/usetting/',
      templateUrl: './views/usetting.html',
    },
    {
      path: '/events/',
      templateUrl: './views/events.html'
    },
    {
      path: '/videos/',
      templateUrl: './views/videos.html',
    },
    {
      path: '/news/',
      templateUrl: './views/news.html',
    },
    {
      path: '/bio/',
      templateUrl: './views/bio.html',
    },
    {
      path: '/questions/',
      templateUrl: './views/questions.html',
    }
  ]
});

var mainView = app.views.create('.view-main');

var $$ = Dom7;

var isAjaxLoaded=false;
var pathToAjaxDispatcher="http://192.254.161.118/~ihumoru/php/ajaxDispatcher1.php";
var ajaxLoader="<div class='ajaxLoader left50 top50 abs'><div class='fineloader'></div></div>";
var ajaxLoaderWithBackground="<div class='overlayWhite'>" + ajaxLoader + "</div>";

var APP_TOKEN_KEY="t7tXVxdh-3276212a8b0f5641781bccd2730768d6";
var APP_COMEDIAN_NAME="angelotsarouchas";

//Preload static images
function preloader() {
	if (document.images) {
		var img1 = new Image();
		var img2 = new Image();
		var img3 = new Image();

		img1.src = "images/events_APP_icon_lg.png";
		img2.src = "images/video_APP_icon_lg.png";
		img3.src = "images/news_APP_icon_lg.png";
	}
}
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}
addLoadEvent(preloader);

loadGetHomePage();

function displayAlert(a, b){
    app.dialog.alert(a);
}

function displayWrapAllResults(data, template){
    var content="";
    if(data){
        for(var i=0; i<data.length; i++){
            content +=wrapSingleData(data[i], template);
        }
    }else{
        content +=template;
    }
    return content;
}

function wrapSingleData(data, template){
    var regex=/{{((\w+|\-))}}/g;
    var content="";
    var newTemplate=template.replace(regex, function(a, b){
        return typeof(data[b])!=="undefined"?data[b]:"";
    });
    content +=newTemplate;
    return content;
}

function displayHomeUser(data, container){
    var topNavigationDefault={};
    var eventlinkContext={};
    var videolinkContext={};
    var newslinkContext={};
    var biolinkContext={};
    var questionlinkContext={};
    topNavigationDefault["userid"]=data["id"];
    topNavigationDefault["firstname"]=data["firstname"];
    topNavigationDefault["lastname"]=data["lastname"];
    topNavigationDefault["imgsrc"]=data["imgsrc"];
    
    eventlinkContext=topNavigationDefault;
    videolinkContext=topNavigationDefault;
    newslinkContext=topNavigationDefault;
    biolinkContext=topNavigationDefault;
    questionlinkContext=topNavigationDefault;
    
    biolinkContext["description"]=data["description"];
    
    $$("[data-id='eventlink']").attr("data-context", JSON.stringify(eventlinkContext));
    $$("[data-id='videolink']").attr("data-context", JSON.stringify(videolinkContext));
    $$("[data-id='newslink']").attr("data-context", JSON.stringify(newslinkContext));
    $$("[data-id='biolink']").attr("data-context", JSON.stringify(biolinkContext));
    $$("[data-id='questionlink']").attr("data-context", JSON.stringify(questionlinkContext));
    
    var img=data["img"];
    var name=data["firstname"] + " " + data["lastname"];
    var comediangenres=data["comediangenres"];
    var CGString="";
    $$("div[data-target='comedianprofilephoto']", container).html(img);
    $$("div[data-target='comedianprofilename']", container).html(name);
    if(comediangenres){
        for(var i=0; i<comediangenres.length; i++){
            CGString +="<span class='badge badge-genre'>"+comediangenres[i]["name"]+"</span>";
        }
    }
    $$("div[data-target='comedianprofilegenres']", container).html(CGString);
}

function loadGetHomePage(){
    var postData={};
    postData["context"]="wrapGetUserInfo";
    postData["apikey"]=APP_TOKEN_KEY;
    var form=$$("#homeComedianBlock");
    var obj=$$("#homeComedianBlock div[data-target='comedianprofilephoto']");
    sendAjaxOnFly(postData, null, obj);
}


function loadGetEventsPage(userid){
    var postData={};
    postData["context"]="wrapGetUserEvents";
    postData["userid"]=userid;
    var form=$$("#wrapEvents");
    var obj=$$("#wrapEvents");
    sendAjaxOnFly(postData, form, obj);
}

function loadGetVideosPage(userid){
    var postData={};
    postData["context"]="wrapGetUserVideos";
    postData["userid"]=userid;
    var form=$$("#wrapVideos");
    var obj=$$("#wrapVideos");
    sendAjaxOnFly(postData, form, obj);
}

function loadGetNewsPage(userid){
    var postData={};
    postData["context"]="wrapGetUserNews";
    postData["userid"]=userid;
    var form=$$("#wrapNews");
    var obj=$$("#wrapNews");
    sendAjaxOnFly(postData, form, obj);
}

function sendAjaxOnFly(postData, form, obj){
    postData["isFromAPP"]=1;
    postData["comedian"]=APP_COMEDIAN_NAME;
    app.request.post(
            pathToAjaxDispatcher, 
    postData, 
    function (data){
        data=JSON.parse(data);
        isAjaxLoaded=false;
            if(data['success']==1){
                switch(postData["context"]){
                    case "wrapGetUserInfo":
                        displayHomeUser(data["results"], form);
                    break;
                    case "wrapGetUserEvents":
                    case "wrapGetUserVideos":
                    case "wrapGetUserNews":
                        if(data["results"]){
                            var content=displayWrapAllResults(data["results"], data["content"]);
                            form.find("div[data-target='ifrecords']").html(content);
                        }
                        form.removeClass("no-result-found").addClass("results-found");
                    break;
                }
            }else{
                switch(postData["context"]){
                    default:
                        displayAlert(data["message"], $$("body"));
                    break;
                    case "wrapGetUserEvents":
                    case "wrapGetUserVideos":
                    case "wrapGetUserNews":
                        form.removeClass("results-found").addClass("no-result-found");
                    break;
                }
            }
    }, function (xhr, status){
        //displayAlert("Error. For more information check console.log.", $$("body"), 1);
        isAjaxLoaded=false;
    });
            
       
 }

$$(document).on("click", "[data-action='addedititem']", function(e){
    e.preventDefault();
    var $this=$$(this);
    
    var postData={};
    postData["context"]=$this.attr("data-context");
    
    switch(postData["context"]){
        
    }
    console.log(postData);
});

app.on('pageInit', function (page) {
    // do something on page init
    var pageName=page.name;
    var userid=parseInt(page.route.context.userid);
    switch(pageName){
        case "events":
            loadGetEventsPage(userid);
        break;
        case "videos":
            loadGetVideosPage(userid);
        break;
        case "news":
            loadGetNewsPage(userid);
        break;
    }
});
