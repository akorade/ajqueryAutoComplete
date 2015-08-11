
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
  'use strict';
    var $autoComplete = $.fn.ajAutoComplete = function () {
        //Set Properties
        var base=this;
        base.e1=document.getElementById(this.attr('id'));
        base.$e1=$(base.e1);
        base.namespace = '.keyboard' + Math.random().toString(16).slice(2);
        base=this;
        base.isSpaceInsensitive = this.attr('spaceinsensitive') ? this.attr('spaceinsensitive') : false;
        base.minimumChars = this.attr('suggestAfterChars') ? this.attr('suggestAfterChars') : 3;

        base.isCaseInsensitive = this.attr('caseInsensitive') ? this.attr('caseInsensitive') : false;
        
        base.jsonSourceArray =["ActionScript", "AppleScript", "Asp", "BASIC", "C", "C++", "Clojure", "COBOL", "CobdFusion", "coblang" ];
        base.x = document.getElementById(base.e1.getAttribute('id') + 'SuggestionBox') ? AppendSuggestionBox(0) : AppendSuggestionBox(1);
        //End Set Properties

        base.filteredArrayBasedOnMinChar=[];
        base.firstMinChars="";
        base.suggestionBoxID='#'+base.e1.getAttribute('id') + 'SuggestionBox';
        base.suggestionListID='#'+base.e1.getAttribute('id') + 'Suggestions';
        
        
        
        function AppendSuggestionBox (appendFlag) {
            if (appendFlag == 1) {
               base.e1.insertAdjacentHTML('afterend', '<div style="display:none;" id="' + base.e1.getAttribute('id') + 'SuggestionBox' + '"><ul id="' + base.e1.getAttribute('id') + 'Suggestions' + '" class="lstSuggestions"></ul></div>');
            }
            return true;
        }
        
        
        
        base.PopulateAndShowAutoCompleteBox = function (userInput) {
            var filteredArray = base.filteredArrayBasedOnMinChar.filter(function (value) {
                return CompareValues(value, userInput);
            });
            var suggestionList="";
            $.each(filteredArray, function (i, e) {
                suggestionList = suggestionList +"<li class='li'>" + e + "</li>";
                   // "<li class='li' onClick=\"base.SelectValue('" + e + "');\">" + e + "</li>";
            });
            //suggestionList = suggestionList + "</ul>";
            $(base.suggestionBoxID).show();

            $(base.suggestionListID).html(suggestionList);
            $("#search-box").css("background", "#FFF");
           
        };
         $(base.suggestionListID).on('click'+base.namespace,'li',function(){
           $('#'+ base.e1.getAttribute('id') ).val(this.textContent);
            $(base.suggestionBoxID).hide();
        });
        
        base.SelectValue=function(val){
            $('#'+ base.e1.getAttribute('id') ).val(val);
            $(base.suggestionBoxID).hide();
          
        };
        
        $(base.e1).on('keyup'+base.namespace,function(event) {
            var suggestionList = "";
            var filterString = GetValue(this.value);
            if (filterString.length >= base.minimumChars) {
                if (base.firstMinChars != filterString.substring(0, base.minimumChars)) {
                    base.firstMinChars = filterString.substring(0, base.minimumChars);
                    base.filteredArrayBasedOnMinChar = base.jsonSourceArray.filter(function (value) {
                        return CompareValues(value,base.firstMinChars);
                    });
                    base.PopulateAndShowAutoCompleteBox(base.firstMinChars);
                } else {
                    base.PopulateAndShowAutoCompleteBox(GetValue(this.value));
                }
            } else {
                $("#suggesstion-box").hide();
            }
        });
        
        function CompareValues(value, userInput) {
            var thisValue = value;
            var thisUserInput = userInput;
            if (base.isSpaceInsensitive) {
                thisValue = thisValue.replace(/ /g, '');
                thisUserInput = thisUserInput.replace(/ /g, '');
            }
            if (base.isCaseInsensitive) {
                thisValue = thisValue.toLowerCase();
                thisUserInput = thisUserInput.toLowerCase();
            }
            return (thisValue.indexOf(thisUserInput) === 0);
        }
        
        function GetValue(value) {
            var thisValue = value;
            if (base.isSpaceInsensitive) {
                thisValue = thisValue.replace(/ /g, '');
            }
            if (base.isCaseInsensitive) {
                thisValue = thisValue.toLowerCase();
            }
            return thisValue;
        }
        
        return $autoComplete;
    };
   
}));