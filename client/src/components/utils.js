import $ from 'jquery'; 

export const setCookie = function (cname,cvalue,exdays=30) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toGMTString();
  if(getCookie("casino_cookies") === "true"){
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  } else {
    if(cname === "casino_id" || cname === "casino_user" || cname === "casino_cookies"){
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
  }
}
export const getCookie = function (cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
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
    if($('.show_results .header').length>0){
      $('.show_results .header').empty();
      $('.show_results .header').append(title);
    }  
    if($('.show_results .message').length>0){
      $('.show_results .message').empty();
      $('.show_results .message').append(message);
    }    
    $( ".show_results_container" ).click(function() {
      $(this).hide();
    });
    $( ".show_results_container .show_results_close" ).click(function() {
      $(this).closest('show_results_container').hide();
    });
  }	
}

export const bigText = function(type, lang, payload) {
  let text = ``;
  if(lang === "ro"){
    text = `<div class="big_text_container">
      <div class="big_text">${payload}</div>
    </div>`;
  } else {
    text = `<div class="big_text_container">
      <div class="big_text">${payload}</div>
    </div>`;
  }
  return text;
}

export const sort = function(list=[], sort_by="", asc=true) {
  if(list && list.length>0){
    if(sort_by === ""){
      let done = false;
      if(asc){
        while (!done) {
          done = true;
          for (let i = 1; i < list.length; i += 1) {
              if (list[i - 1] > list[i]){
                  done = false;
                  let tmp = list[i - 1];
                  list[i - 1] = list[i];
                  list[i] = tmp;
              }
          }
        }
      } else {
        while (!done) {
          done = true;
          for (let i = 1; i < list.length; i += 1) {
              if (list[i - 1] < list[i]){
                  done = false;
                  let tmp = list[i - 1];
                  list[i - 1] = list[i];
                  list[i] = tmp;
              }
          }
        }
      }
    } else {
      let done = false;
      if(asc){
        while (!done) {
          done = true;
          for (let i = 1; i < list.length; i += 1) {
              if (list[i - 1][sort_by] > list[i][sort_by]){
                  done = false;
                  let tmp = list[i - 1];
                  list[i - 1] = list[i];
                  list[i] = tmp;
              }
          }
        }
      } else {
        while (!done) {
          done = true;
          for (let i = 1; i < list.length; i += 1) {
              if (list[i - 1][sort_by] < list[i][sort_by]){
                  done = false;
                  let tmp = list[i - 1];
                  list[i - 1] = list[i];
                  list[i] = tmp;
              }
          }
        }
      }
    }
  }   

  return list;
}