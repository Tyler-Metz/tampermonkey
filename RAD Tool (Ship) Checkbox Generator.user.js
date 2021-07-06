// ==UserScript==
// @name         RAD Tool (Ship) Checkbox Generator
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Generates checkboxes on RAD Tool Ship
// @author       Tyler Metz
// @match        https://rad-operations.supplychain.opstech.a2z.com/ship
// @downloadURL  https://github.com/Tyler-Metz/tampermonkey/raw/main/RAD%20Tool%20(Ship)%20Checkbox%20Generator.user.js
// @updateURL    https://github.com/Tyler-Metz/tampermonkey/raw/main/RAD%20Tool%20(Ship)%20Checkbox%20Generator.user.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
const checkedBoxes = {};

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
                var checkboxes = document.querySelectorAll(".checkbox")
                cln.addEventListener("mousedown", function(){
                    saveData(this);
                });
            }
        }
    }
}

// Makes Save & Load Button
// var saveButton = document.createElement("button");
var loadButton = document.createElement("button");
// saveButton.setAttribute("class", "customButtons");
loadButton.setAttribute("class", "customButtons");
// saveButton.textContent = "Save Checkboxes";
loadButton.textContent = "Load Checkboxes";
// wrapButton.appendChild(saveButton);
wrapButton.appendChild(loadButton);
wrapButton.style.display = "flex";
wrapButton.style.justifyContent = "space-evenly";

// Saves checkbox data to localStorage automatically
function saveData(ele){
    const defaultInput = document.querySelectorAll(".ant-input");
    const defaultInputStr = defaultInput[0].value
    var getStore = localStorage.getItem(defaultInputStr)
    const allCheckBoxes = document.querySelectorAll(".checkbox");

    for (var i=0;i < allCheckBoxes.length;i++){
        if(!allCheckBoxes[i].checked && ele == allCheckBoxes[i]){
            checkedBoxes[i] = true;
        }
        else if (allCheckBoxes[i].checked && ele == allCheckBoxes[i]){
            delete checkedBoxes[i];
            continue;
        }
        else if (allCheckBoxes[i].checked){
            checkedBoxes[i] = allCheckBoxes[i].checked;
        }
    }

    const checkedBoxesStr = JSON.stringify(checkedBoxes);
    confirmSaveData(defaultInputStr, checkedBoxesStr, ele);
}

// Triggers an confirm if you attempt to automatically save over checkbox data
function confirmSaveData(key, val, ele){
    var numFlag = 0;
    var oldKey = localStorage.getItem(key);
    console.log("oldKey data: ", oldKey);
    console.log("newKey data: ", key, + "" + val);

    var parsedOldKey = JSON.parse(oldKey);
    var parsedNewKey = JSON.parse(val);

    for (var i in parsedOldKey){
        var jflag = false;
        var ind = -1;
        for (var j in parsedNewKey){
            ind += 1;
            if (i == j){
                console.log("Found a match");
                jflag = true;
            }

            console.log(i);
            console.log(Object.keys(parsedNewKey).length - 1);
            if(!jflag && ind == Object.keys(parsedNewKey).length - 1){
                console.log("No match found");
                numFlag += 1
            }
        }
    }

    if (1 < numFlag){
        var boolean = confirm("Are you sure you want to overwrite saved checkbox data for this ticket/toa?");
        if (boolean){
            localStorage.setItem(key, val);
        } else {
            alert("Not saving data");
            ele.checked = !ele.checked
            console.log("Almost kloop time: ", val);
            console.log(checkedBoxes);
            for (var k in checkedBoxes){
                    delete checkedBoxes[k];
            }
        }
    }
    else localStorage.setItem(key, val);
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

/*saveButton.addEventListener("click", function(){
    saveData();
});*/

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
