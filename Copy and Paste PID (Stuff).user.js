// ==UserScript==
// @name         Copy and Paste PID (Stuff)
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Copies PIDs from a TOA and converts it to excel format for pasting.
// @author       Tyler Metz
// @match        https://stuff.amazon.com
// @downloadURL  https://github.com/Tyler-Metz/tampermonkey/raw/main/Copy%20and%20Paste%20PID%20(Stuff).user.js
// @updateURL    https://github.com/Tyler-Metz/tampermonkey/raw/main/Copy%20and%20Paste%20PID%20(Stuff).user.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

var allPids = [];

// Pulls PID information and puts it into a 2d array.
function waitForDOM() {
    var allTds = document.querySelectorAll("td");
    var num = 0;
    var tempArr = [];
    for (var i=0; i < allTds.length;i++){
        var nameAndPid = allTds[i].innerHTML
        if (nameAndPid.search("pid") != -1){
            var pidIndex = nameAndPid.search("pid");
            var endPidIndex = pidIndex + 13;
            var subStr = nameAndPid.slice(pidIndex, endPidIndex);
            allPids[num] = [subStr]
            console.log(allPids[num][0]);
            num += 1;
        }
    }

    // Makes another array with removed duplicate values.
    for (var j of allPids){
        if (j == 0) tempArr.push(j[0]);
        if (!tempArr.includes(j[0])) tempArr.push(j[0])
    }
    console.log("After filter: ", tempArr);

    // Transforms removed duplicate array into a 2d array.
    allPids = tempArr.map(function(ele, ind){
        return [ele];
    });
    console.log("After map: ", allPids);
}

// Waits for STUFF to finishing loading and fires the waitForDOM function.
setTimeout(waitForDOM, 7000);

// Copies allPids[] array to clipboard
function copyAllPids(){
    console.log(allPids);
    const newAllPids = allPids.map(e => e.join('\t')).join('\n'); // 1:2;3:4
    var clipboardDOM = document.createElement("textarea");
    clipboardDOM.textContent = newAllPids;
    console.log(clipboardDOM);
    document.body.appendChild(clipboardDOM);
    // clipboardDOM.setAttribute("value", newAllPids);
    clipboardDOM.select();
    document.execCommand("copy");
}

// Makes a button for firing copyToClipboard.
setTimeout(function(){
    var inputButton = document.createElement("button");
    inputButton.innerHTML = "Copy PIDS";
    var grabH2 = document.querySelectorAll("h2");
    grabH2[0].appendChild(inputButton);

    // Makes event listener for the button object.
    grabH2[0].addEventListener("click", copyAllPids);
}, 8000);


