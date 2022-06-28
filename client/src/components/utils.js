import $ from 'jquery'; 

import roulette_bets_european from './img/roulette/roulette_bets_european.png'
import roulette_bets_american from './img/roulette/roulette_bets_american.png'
import roulette_bets_european_small from './img/roulette/roulette_bets_european_small.png'
import roulette_bets_american_small from './img/roulette/roulette_bets_american_small.png'

import card_back from './img/blackjack/cards/back.png';
import card_0 from './img/blackjack/cards/card_0.png';
import card_1 from './img/blackjack/cards/card_1.png';
import card_2 from './img/blackjack/cards/card_2.png';
import card_3 from './img/blackjack/cards/card_3.png';
import card_4 from './img/blackjack/cards/card_4.png';
import card_5 from './img/blackjack/cards/card_5.png';
import card_6 from './img/blackjack/cards/card_6.png';
import card_7 from './img/blackjack/cards/card_7.png';
import card_8 from './img/blackjack/cards/card_8.png';
import card_9 from './img/blackjack/cards/card_9.png';
import card_10 from './img/blackjack/cards/card_10.png';
import card_11 from './img/blackjack/cards/card_11.png';
import card_12 from './img/blackjack/cards/card_12.png';
import card_13 from './img/blackjack/cards/card_13.png';
import card_14 from './img/blackjack/cards/card_14.png';
import card_15 from './img/blackjack/cards/card_15.png';
import card_16 from './img/blackjack/cards/card_16.png';
import card_17 from './img/blackjack/cards/card_17.png';
import card_18 from './img/blackjack/cards/card_18.png';
import card_19 from './img/blackjack/cards/card_19.png';
import card_20 from './img/blackjack/cards/card_20.png';
import card_21 from './img/blackjack/cards/card_21.png';
import card_22 from './img/blackjack/cards/card_22.png';
import card_23 from './img/blackjack/cards/card_23.png';
import card_24 from './img/blackjack/cards/card_24.png';
import card_25 from './img/blackjack/cards/card_25.png';
import card_26 from './img/blackjack/cards/card_26.png';
import card_27 from './img/blackjack/cards/card_27.png';
import card_28 from './img/blackjack/cards/card_28.png';
import card_29 from './img/blackjack/cards/card_29.png';
import card_30 from './img/blackjack/cards/card_30.png';
import card_31 from './img/blackjack/cards/card_31.png';
import card_32 from './img/blackjack/cards/card_32.png';
import card_33 from './img/blackjack/cards/card_33.png';
import card_34 from './img/blackjack/cards/card_34.png';
import card_35 from './img/blackjack/cards/card_35.png';
import card_36 from './img/blackjack/cards/card_36.png';
import card_37 from './img/blackjack/cards/card_37.png';
import card_38 from './img/blackjack/cards/card_38.png';
import card_39 from './img/blackjack/cards/card_39.png';
import card_40 from './img/blackjack/cards/card_0.png';
import card_41 from './img/blackjack/cards/card_41.png';
import card_42 from './img/blackjack/cards/card_42.png';
import card_43 from './img/blackjack/cards/card_43.png';
import card_44 from './img/blackjack/cards/card_44.png';
import card_45 from './img/blackjack/cards/card_45.png';
import card_46 from './img/blackjack/cards/card_46.png';
import card_47 from './img/blackjack/cards/card_47.png';
import card_48 from './img/blackjack/cards/card_48.png';
import card_49 from './img/blackjack/cards/card_49.png';
import card_50 from './img/blackjack/cards/card_50.png';
import card_51 from './img/blackjack/cards/card_51.png';

import item_image from './img/icons/vegetables_color.png'

import craps_bets from './img/craps/craps.png'
import craps_bets_small from './img/craps/craps.png'

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

export const get_blackjack_cards = function() {
  return [
    {suit: '', value: '', src: card_back}, 
    {suit: 'Hearts', value: 'A', src: card_0}, 
    {suit: 'Hearts', value: '2', src: card_1}, 
    {suit: 'Hearts', value: '3', src: card_2}, 
    {suit: 'Hearts', value: '4', src: card_3}, 
    {suit: 'Hearts', value: '5', src: card_4}, 
    {suit: 'Hearts', value: '6', src: card_5}, 
    {suit: 'Hearts', value: '7', src: card_6}, 
    {suit: 'Hearts', value: '8', src: card_7}, 
    {suit: 'Hearts', value: '9', src: card_8}, 
    {suit: 'Hearts', value: '10', src: card_9}, 
    {suit: 'Hearts', value: 'J', src: card_10}, 
    {suit: 'Hearts', value: 'Q', src: card_11}, 
    {suit: 'Hearts', value: 'K', src: card_12}, 
    {suit: 'Spades', value: 'A', src: card_13}, 
    {suit: 'Spades', value: '2', src: card_14}, 
    {suit: 'Spades', value: '3', src: card_15}, 
    {suit: 'Spades', value: '4', src: card_16}, 
    {suit: 'Spades', value: '5', src: card_17}, 
    {suit: 'Spades', value: '6', src: card_18}, 
    {suit: 'Spades', value: '7', src: card_19}, 
    {suit: 'Spades', value: '8', src: card_20}, 
    {suit: 'Spades', value: '9', src: card_21}, 
    {suit: 'Spades', value: '10', src: card_22}, 
    {suit: 'Spades', value: 'J', src: card_23}, 
    {suit: 'Spades', value: 'Q', src: card_24}, 
    {suit: 'Spades', value: 'K', src: card_25}, 
    {suit: 'Diamonds', value: 'A', src: card_26}, 
    {suit: 'Diamonds', value: '2', src: card_27}, 
    {suit: 'Diamonds', value: '3', src: card_28}, 
    {suit: 'Diamonds', value: '4', src: card_29}, 
    {suit: 'Diamonds', value: '5', src: card_30}, 
    {suit: 'Diamonds', value: '6', src: card_31}, 
    {suit: 'Diamonds', value: '7', src: card_32}, 
    {suit: 'Diamonds', value: '8', src: card_33}, 
    {suit: 'Diamonds', value: '9', src: card_34}, 
    {suit: 'Diamonds', value: '10', src: card_35}, 
    {suit: 'Diamonds', value: 'J', src: card_36}, 
    {suit: 'Diamonds', value: 'Q', src: card_37}, 
    {suit: 'Diamonds', value: 'K', src: card_38}, 
    {suit: 'Clubs', value: 'A', src: card_39}, 
    {suit: 'Clubs', value: '2', src: card_40}, 
    {suit: 'Clubs', value: '3', src: card_41}, 
    {suit: 'Clubs', value: '4', src: card_42}, 
    {suit: 'Clubs', value: '5', src: card_43}, 
    {suit: 'Clubs', value: '6', src: card_44}, 
    {suit: 'Clubs', value: '7', src: card_45}, 
    {suit: 'Clubs', value: '8', src: card_46}, 
    {suit: 'Clubs', value: '9', src: card_47}, 
    {suit: 'Clubs', value: '10', src: card_48}, 
    {suit: 'Clubs', value: 'J', src: card_49}, 
    {suit: 'Clubs', value: 'Q', src: card_50}, 
    {suit: 'Clubs', value: 'K', src: card_51}, 
  ];
}

export const get_roulette_bets = function(){
  return [
    {id: 'european', src: roulette_bets_european},
    {id: 'european_small', src: roulette_bets_european_small},
    {id: 'american', src: roulette_bets_american},
    {id: 'american_small', src: roulette_bets_american_small},
  ];
}

export const get_slots_images = function(){
  return [
    {id: 'carrot', src: item_image, coord:[0, 0]},
    {id: 'onion', src: item_image, coord:[300, 0]},
    {id: 'potato', src: item_image, coord:[600, 0]},
    {id: 'radish', src: item_image, coord:[600, 300]},
    {id: 'cabbage', src: item_image, coord:[300, 600]},
    {id: 'garlic', src: item_image, coord:[600, 600]},
    {id: 'turnip', src: item_image, coord:[900, 900]},
  ];
}

export const get_craps_bets = function(){
  return [
		{id: 'craps', src: craps_bets},
		{id: 'craps_small', src: craps_bets_small},
	];
}