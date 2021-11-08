import $ from 'jquery'; 

export const setCookie = function (cname,cvalue,exdays=30) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export const getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export const showResults = function(title="", message="", w=200, h="auto") {
  if($('.show_results_container').length>0){
    $('.show_results_container').show();
    $('.show_results').css('max-width', w);
    $('.show_results').css('height', h);
    if($('.show_results h1').length>0){
      $('.show_results h1').empty();
      $('.show_results h1').append(title);
    }  
    if($('.show_results p').length>0){
      $('.show_results p').empty();
      $('.show_results p').append(message);
    }    
    $( ".show_results_container" ).click(function() {
      $('.show_results_container').hide();
    });
  }	
}

export const bigText = function(type, lang, payload) {
  var text = ``;
  if(type === "slot_rules"){
    if(lang === "ro"){
      text = `<div class="big_text_container">
        <div class="big_text">${payload}</div>
      </div>`;
    } else {
      text = `<div class="big_text_container">
        <div class="big_text">${payload}</div>
      </div>`;
    }
  }
  return text;
}