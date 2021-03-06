var defaultSettings={
    checkedvideos: "",
    checkednews: "",
    checkedquestions: "",
    checkedevents: "",
    range: 100
};

var timestamp   = Date.now();

 if(localStorage.getItem('defaultSettings')!==null){
    defaultSettings=JSON.parse(localStorage.getItem('defaultSettings'));
 }


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
  },
  view: {
    iosDynamicNavbar: false
  },
  swipeout: {
    noFollow: true,
    removeElements: false
  },
  // Pass app routes on app init
  routes: [
    {
      path: '/usetting/',
      templateUrl: './views/usetting.html?'+timestamp,
      options: {
        context: defaultSettings
        }
    },
    {
      path: '/events/',
      templateUrl: './views/events.html?'+timestamp
    },
    {
        path: '/eventdetails/',
        templateUrl: './views/eventdetails.html?'+timestamp
    },
    {
      path: '/videos/',
      templateUrl: './views/videos.html?'+timestamp
    },
    {
        path: '/videodetails/',
        templateUrl: './views/videodetails.html?'+timestamp
    },
    {
      path: '/news/',
      templateUrl: './views/news.html?'+timestamp
    },
    {
      path: '/bio/',
      templateUrl: './views/bio.html?'+timestamp
    },
    {
      path: '/questions/',
      templateUrl: './views/questions.html?'+timestamp
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

function playVideo($this){
    $this.closest("div.wrapVideoPlayer").addClass("activated");
    $this.closest("div.wrapVideoPlayer").find("iframe").attr("src", $this.attr("data-videohref"));
}

function storeEventToIamGoing($this){
    var eventsIAmGoingTo={};
    if(localStorage.getItem('eventsIAmGoingTo')!==null){
        eventsIAmGoingTo=JSON.parse(localStorage.getItem('eventsIAmGoingTo'));
    }
    eventsIAmGoingTo[$this.attr("data-id")]=1;
    localStorage.setItem('eventsIAmGoingTo', JSON.stringify(eventsIAmGoingTo));
    
    //Close swipeout and add custom class, I'm going
    app.swipeout.close($this.closest("li.swipeout"), function(){
        $this.closest("div.single-item").addClass("wrap-event-iamgoing");
    });
}

function storeDefaultSettingsAndClose($this){
    var defaultSettings={};
    var data1={};
    var container=$this.closest("div#wrapSettings");
    defaultSettings["checkedvideos"]=container.find("input[name='aEOE_videos']:checked").length>0?" checked='checked'":"";
    defaultSettings["checkednews"]=container.find("input[name='aEOE_news']:checked").length>0?" checked='checked'":"";
    defaultSettings["checkedquestions"]=container.find("input[name='aEOE_questions']:checked").length>0?" checked='checked'":"";
    defaultSettings["checkedevents"]=container.find("input[name='aEOE_events']:checked").length>0?" checked='checked'":"";
    defaultSettings["range"]=container.find("input[name='aEOE_range']").val();
    
    data1["videos"]=container.find("input[name='aEOE_videos']:checked").length>0?1:0;
    data1["news"]=container.find("input[name='aEOE_news']:checked").length>0?1:0;
    data1["questions"]=container.find("input[name='aEOE_questions']:checked").length>0?1:0;
    data1["events"]=container.find("input[name='aEOE_events']:checked").length>0?1:0;
    
    localStorage.setItem('defaultSettings', JSON.stringify(defaultSettings));
    
    setupPush($this.attr("data-userid"), data1);
    
    app.routes[0].options.context=defaultSettings;
    app.router.back();
}

function displayHomeUser(data1, container){
    
    var data=data1["results"];
    //Check for new event within the range
    var countnewevents=parseInt(data1["countneweventswithinrange"]);
    
    if(countnewevents>0){
        var pillRound='<div class="abs top0 right0 badge-round"><div class="badge bg-red text-align-center"><span class="abs top50 fullwidth">'+countnewevents+'</span></div></div>';
        
       $$("[data-id='eventlink']").closest("div.item").prepend(pillRound); 
    }
    
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
    
    $$("[data-target='comediansettings']").attr("data-context", JSON.stringify(eventlinkContext));
    
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
    //Check for #hash comedianname
    console.log("loadGetHomePage");
    var $hash=window.location.hash.substring(1);
    if($hash!==""){
        APP_COMEDIAN_NAME=$hash;
        switch($hash){
            case "hamzahrnjicevic":
                APP_TOKEN_KEY="E9FELS8W-801e406f69d8f39316e9741126a443f7";
            break;
            case "robinozolins":
                APP_TOKEN_KEY="iSzi1X0w-6917ef1dd05ade72b0de96840158ffc1";
            break;
            case "testtester":
                APP_TOKEN_KEY="kK33J6JE-d5c5048cc78196cd14f73e1cb6685b61";
            break;
        }
    }
    
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
    //Check is already I'm going events assigned
    if(localStorage.getItem('eventsIAmGoingTo')!==null){
        postData["eventsiamgoingto"]=localStorage.getItem('eventsIAmGoingTo');
    }
    
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

function loadGetQuestionsPage(userid){
    var postData={};
    postData["context"]="wrapGetUserQuestions";
    postData["userid"]=userid;
    var form=$$("#wrapQuestions");
    var obj=$$("#wrapQuestions");
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
                        displayHomeUser(data, form);
                    break;
                    case "wrapGetUserEvents":
                    case "wrapGetUserVideos":
                    case "wrapGetUserNews":
                    case "wrapGetUserQuestions":
                        if(data["results"]){
                            var content=displayWrapAllResults(data["results"], data["content"]);
                            if(postData["context"]=="wrapGetUserQuestions"){
                                form.find("div[data-target='ifrecords'] > div.display-list").html(content);
                            }else{
                                form.find("div[data-target='ifrecords']").html(content);
                            }
                            
                        }
                        form.removeClass("no-result-found").addClass("results-found");
                    break;
                    case "registerUserSettingsForPushNotifications":
                        console.log(data["message"]);
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
                    case "wrapGetUserQuestions":    
                        form.removeClass("results-found").addClass("no-result-found");
                    break;
                }
            }
    }, function (xhr, status){
        //displayAlert("Error. For more information check console.log.", $$("body"), 1);
        isAjaxLoaded=false;
    });
            
       
 }
 
addToCalendar = function(data, firstname) {
    
     var data=window.atob(data);
        var v={};
        var a=data.split("|");
        a.forEach(function(element){
            var temp=element.split("{");
            v[temp[0]]=temp[1];
        });
        
        var startDate = new Date(parseInt(v["dstart"])); // beware: month 0 = january, 11 = december
        var endDate = new Date(parseInt(v["dend"]));
        var title = v["dsum"];
        var eventLocation = v["dloca"];
        var notes = v["ddesc"];
        
        console.log(startDate);
    
    if (window.plugins.calendar) {
        
       
        
        var success = function(message) { displayAlert(firstname + "'s event has been added to your calendar.", $$("body")); };
        var error = function(message) { displayAlert("Error: " + message, $$("body")); };

        var calSuccess = success;
        var calError = error;
        window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate,success,error);
    }
    else displayAlert("Calendar plugin not found", $$("body"));
}

$$(document).on("click", "[data-action='addedititem']", function(e){
    e.preventDefault();
    var $this=$$(this);
    
    var postData={};
    postData["context"]=$this.attr("data-context");
    
    switch(postData["context"]){
        case "storeDefaultSettings":
            storeDefaultSettingsAndClose($this);
            return false;
        break;
        case "toggleShowHideAdditionalMenu":
            $this.closest("div.item").toggleClass("show");
        break;
        case "addEventToIamGoing":
            storeEventToIamGoing($this);
            return false;
        break;
        case "addEventToCalendar":
            addToCalendar($this.attr("data-calendardata"), $this.attr("data-firstname"));
            return false;
        break;
        case "playVideo":
            playVideo($this);
        break;
    }
    console.log(postData);
});

$$(document).on('range:change', function (e, range) {
  $$('[data-target="range"]').text(range.value);
});

$$(document).on('page:init', function (e, page) {
    // do something on page init
    
    var pageName=page.name;
    if(pageName==="home"){
        loadGetHomePage();
    }else{
        var userid=parseInt(page.route.context.userid);
    }
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
        case "questions":
            loadGetQuestionsPage(userid);
        break;
    }
    
    //this.$el.on('click', '[data-context="addEventToCalendar"]', this.addToCalendar);
    
});

function setupPushInit(){
    var push = PushNotification.init({
       "android": {},
       "ios": {
         "sound": true,
         "alert": true,
         "badge": true
       },
       "windows": {}
   });
   
   push.on('error', function(e) {
       console.log("push error = " + e.message);
   });
   
   push.on('notification', function(data) {
         console.log('notification event');
         navigator.notification.alert(
             data.message,         // message
             null,                 // callback
             data.title,           // title
             'Ok'                  // buttonName
         );
     });
}

function setupPush(userid, data1) {
    if(isCordovaApp) {
   var push = PushNotification.init({
       "android": {},
       "ios": {
         "sound": true,
         "alert": true,
         "badge": true
       },
       "windows": {}
   });

   push.on('registration', function(data) {
        console.log("userid ID: " + userid);
        console.log("registration event: " + data.registrationId);
        var oldRegId = localStorage.getItem('registrationId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            localStorage.setItem('registrationId', data.registrationId);
            // Post registrationId to your app server as the value has changed
        }
        var newRegID=localStorage.getItem('registrationId');
       
        var postData={};
        postData["context"]="registerUserSettingsForPushNotifications";
        postData["userid"]=userid;
        postData["senderid"]=newRegID;
        postData["oldsenderid"]=oldRegId;
        postData["data"]=data1;
        postData["uuid"]=device.uuid;
       
        sendAjaxOnFly(postData, null, null);
       
   });

   push.on('error', function(e) {
       console.log("push error = " + e.message);
   });
   
   push.on('notification', function(data) {
         console.log('notification event');
         navigator.notification.alert(
             data.message,         // message
             null,                 // callback
             data.title,           // title
             'Ok'                  // buttonName
         );
     });
    }
 }

var isCordovaApp = document.URL.indexOf('http://') === -1
  && document.URL.indexOf('https://') === -1;

$$(document).on('deviceready', function(){
    console.log("deviceready is ready");
    if(isCordovaApp) {
        setupPushInit();
    }
});