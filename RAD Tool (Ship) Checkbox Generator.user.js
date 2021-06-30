// ==UserScript==
// @name         RAD Tool (Ship) Checkbox Generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generates checkboxes on RAD Tool Ship
// @author       You
// @match        https://rad-operations.supplychain.opstech.a2z.com/ship
// @include      https://rad-operations.supplychain.opstech.a2z.com/pick
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

// Creates button to trigger function
var wrapButton = document.createElement("div");
var parentWrap = document.querySelectorAll(".container-fluid")[0]
var wrap = document.getElementById("content");
wrap.appendChild(wrapButton);
wrap.insertBefore(wrapButton, parentWrap);
var inputButton = document.createElement("button");
inputButton.setAttribute("type", "button");
inputButton.setAttribute("value", "Generate Checkboxes");
inputButton.innerHTML = 'Generate Checkboxes';
wrapButton.appendChild(inputButton);

inputButton.addEventListener("click", function(){
    generateCheckBoxes();
})

// Inline CSS for Button
inputButton.style.borderWidth = "2px";
inputButton.style.borderColor = "orange";
inputButton.style.marginLeft = "38px";
inputButton.style.background = "linear-gradient(60deg, orange, white)";

// Toggles Andon Checkbox
var tickBox = document.querySelectorAll(".ant-checkbox-input");
tickBox[0].click();

// Function that is ran when button is clicked
function generateCheckBoxes(){
    var cells = document.querySelectorAll(".ant-table-cell");
    var input = document.createElement("input");
    input.setAttribute("type", "checkbox");

    for (var i=0;i < cells.length;i++){
        var cln = input.cloneNode(true);

        /*if (i % 10 == 2 && i != 2){
           cells[i].appendChild(cln);
       }*/

        if (cells[i].hasChildNodes() && cells[i].childNodes[0].tagName == "DIV"){
            if (cells[i].firstChild.firstChild.firstChild.innerHTML != "Ship") {
                continue;
            }
            else if (cells[i].firstChild.children.length == 2){
                cells[i].firstChild.appendChild(cln)
                cln.style.width = "10px";
                cln.style.length = "20px";
            }
        }
    }
}



