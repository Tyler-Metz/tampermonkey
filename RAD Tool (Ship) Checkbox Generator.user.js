// ==UserScript==
// @name         RAD Tool (Ship) Checkbox Generator
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Generates checkboxes on RAD Tool Ship
// @author       Tyler Metz
// @match        https://rad-operations.supplychain.opstech.a2z.com/ship
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
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
var loadButton = document.createElement("button");
loadButton.setAttribute("class", "customButtons");
loadButton.textContent = "Load Checkboxes";
wrapButton.appendChild(loadButton);
wrapButton.style.display = "flex";
wrapButton.style.justifyContent = "space-evenly";

// Saves checkbox data to localStorage automatically
function saveData(ele){
    const defaultInput = document.querySelectorAll(".ant-input");
    const defaultInputStr = defaultInput[0].value
    var getStore = localStorage.getItem(defaultInputStr)
    const allCheckBoxes = document.querySelectorAll(".checkbox");
    var test = $(".checkbox").closest("td").next().text();
    console.log("jquery test results: ", test);
    for (var i=0;i < allCheckBoxes.length;i++){
        if(!allCheckBoxes[i].checked && ele == allCheckBoxes[i]){
            checkedBoxes[i] = $(".checkbox").eq(i).closest("td").next().text();
        }
        else if (allCheckBoxes[i].checked && ele == allCheckBoxes[i]){
            delete checkedBoxes[i];
            continue;
        }
        else if (allCheckBoxes[i].checked){
            checkedBoxes[i] = $(".checkbox").eq(i).closest("td").next().text();
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
            // console.log("Checking if ", parsedOldKey[i]," matches ", parsedNewKey[j])
            if (parsedOldKey[i] == parsedNewKey[j]){
                console.log("Found a match");
                jflag = true;
                delete parsedNewKey[j];
                break;
            }

            // console.log("Fetching ", i," from local storage.");
            // console.log("Length of current newkey: ", Object.keys(parsedNewKey).length - 1);
            if(!jflag && ind == Object.keys(parsedNewKey).length - 1){
                console.log(`No match found on oldKey: ${i} and newKey: ${j}`);
                numFlag += 1
            }
        }
    }

    if (1 < numFlag){
        var boolean = confirm("Are you sure you want to overwrite saved checkbox data for this ticket/toa?");
        if (boolean){
            localStorage.setItem(key, val);
        } else {
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
    var idmsData = Object.values(checkBoxData)

    var siblingIndex = findIdmsIndex();

    function findIdmsIndex(){
        var idms = "";
        var siblings = $(allCheckBoxes).eq(i).closest("td").siblings();
        $(siblings).each(function(ind, ele){
            if (+ele.textContent.length == 6){
                console.log("idms sibling found! ", ele)
                idms = ele.textContent;
                return false;
            }
        });
        return idms;
    }

    for (var i in allCheckBoxes){
        var idmsText = $(allCheckBoxes).eq(i).closest("td").siblings().eq(siblingIndex).text()

        if (idmsData.includes(idmsText)){
            console.log("IDMS Found, making checkbox.checked true");
            allCheckBoxes[i].checked = true;
        }
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
