// ==UserScript==
// @name         RAD Tool (Ship) Checkbox Generator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Generates checkboxes on RAD Tool Ship
// @author       Tyler Metz
// @match        https://rad-operations.supplychain.opstech.a2z.com/ship
// @downloadURL  https://github.com/Tyler-Metz/tampermonkey/raw/main/RAD%20Tool%20(Ship)%20Checkbox%20Generator.user.js
// @updateURL    https://github.com/Tyler-Metz/tampermonkey/raw/main/RAD%20Tool%20(Ship)%20Checkbox%20Generator.user.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

// Creates button to trigger function
var wrapButton = document.createElement("div");
wrapButton.setAttribute("id", "wrapButton");
var parentWrap = document.querySelectorAll(".container-fluid")[0]
var wrap = document.getElementById("content");
wrap.appendChild(wrapButton);
wrap.insertBefore(wrapButton, parentWrap);
var inputButton = document.createElement("button");
inputButton.setAttribute("class", "customButtons");
inputButton.setAttribute("type", "button");
// inputButton.setAttribute("value", "Generate Checkboxes");
inputButton.innerHTML = 'Generate Checkboxes';
wrapButton.appendChild(inputButton);

inputButton.addEventListener("click", function(){
    generateCheckBoxes();
})

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
                cln.setAttribute("class", "checkbox");
                cln.style.width = "10px";
                cln.style.length = "20px";
            }
        }
    }
}

// Makes Save & Load Button
var saveButton = document.createElement("button");
var loadButton = document.createElement("button");
saveButton.setAttribute("class", "customButtons");
loadButton.setAttribute("class", "customButtons");
saveButton.textContent = "Save Checkboxes";
loadButton.textContent = "Load Checkboxes";
wrapButton.appendChild(saveButton);
wrapButton.appendChild(loadButton);
wrapButton.style.display = "flex";
wrapButton.style.justifyContent = "space-evenly";

// Saves checkbox data to localStorage
function saveData(){
    const checkedBoxes = {};
    const defaultInput = document.querySelectorAll(".ant-input");
    const defaultInputStr = defaultInput[0].value
    var allCheckBoxes = document.querySelectorAll(".checkbox");
    for (var i=0;i < allCheckBoxes.length;i++){
        switch(allCheckBoxes[i].checked){
            case true:
                checkedBoxes[i] = allCheckBoxes[i].checked;
                continue;
            case false:
                continue;
        }
    }
    const checkedBoxesStr = JSON.stringify(checkedBoxes);
    localStorage.setItem(defaultInputStr, checkedBoxesStr);
}

// Loads checkbox data from localStorage
function loadData(){
    const defaultInput = document.querySelectorAll(".ant-input");
    const defaultInputStr = defaultInput[0].value
    var checkBoxData = localStorage.getItem(defaultInputStr);
    checkBoxData = JSON.parse(checkBoxData);
    var allCheckBoxes = document.querySelectorAll(".checkbox");
    console.log(checkBoxData);
    for (var i in allCheckBoxes){
        allCheckBoxes[i].checked = checkBoxData[i]
    }

}

saveButton.addEventListener("click", function(){
    saveData();
});

loadButton.addEventListener("click", function(){
    loadData();
});

// Inline CSS for all custom buttons
const allCustomButtons = document.querySelectorAll(".customButtons");
for (var i = 0;i < allCustomButtons.length;i++){
    allCustomButtons[i].style.borderWidth = "2px"
    allCustomButtons[i].style.borderColor = "orange"
    allCustomButtons[i].style.background = "linear-gradient(60deg, orange, white)";
}
