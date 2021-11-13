// ==UserScript==
// @name         Tableau de notion
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pour le tableau des notions (ne me tener pas responsable si c'est pas juste)
// @author       Someone
// @match        https://intra.assistants.epita.fr/activity/piscine-2024
// @match        https://intra.assistants.epita.fr/assignment/piscine-2024/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==
var type = window.location.href.split("/")[3];
if (type == "activity"){
    function init() {
        var nonselected = document.querySelectorAll("[theme='small icon primary'], [theme='small success icon']");
        var res = Object();
        nonselected.forEach((val) => {
            res[val.parentNode.href.split("/")[5]] = null;
        });
        GM_setValue("value", res);
    }

    function fun_refresh() {
        init();
        GM_setValue("parcours", true);
        var value = GM_getValue("value");
        var default_href = "https://intra.assistants.epita.fr/assignment/piscine-2024/";
        for (let exe in value)
        {
            if (value[exe] == null)
            {
                window.location.replace(default_href.concat(exe))
                break;
            }
        }
    }

    var value = GM_getValue("value");
    var parcours = GM_getValue("parcours");
    if (parcours == undefined)
    {
        GM_setValue("parcours", false);
    }
    var inter = setInterval(() => {
        var already_title = document.querySelector(".notions_exercise_title");
        if (already_title == null)
        {
            var notions_exercise_tile = document.createElement("h2");
            notions_exercise_tile.className = "notions_exercise_title";
            var notions_exercise_title_texte = document.createTextNode("Notions par exercise");
            notions_exercise_tile.appendChild(notions_exercise_title_texte);
            var title = document.querySelector("h2");
            title.parentNode.insertBefore(notions_exercise_tile, title);
            var refresh = document.createElement("a");
            var refresh_text = document.createTextNode("Refresh");
            refresh.appendChild(refresh_text);
            refresh.addEventListener("click", fun_refresh, false);
            title.parentNode.insertBefore(refresh, title);
            var table = document.createElement("table");
            var thead = document.createElement("thead");
            table.appendChild(thead);
            var trHead = document.createElement("tr");
            thead.appendChild(trHead);
            var array = ["Name", "algorithm", "arrays", "core-language", "functional", "generics", "io", "memory", "pointers", "regex", "shell", "strings", "structures", "system"];
            array.forEach((val) => {
                let th = document.createElement("th");
                th.innerHTML = val;
                trHead.appendChild(th);
            });
            var tbody = document.createElement("tbody");
            table.appendChild(tbody);
            for (let key in value)
            {
                var tr = document.createElement("tr");
                tbody.appendChild(tr);
                var td_title = document.createElement("td");
                tr.appendChild(td_title);
                var a = document.createElement("a");
                a.innerHTML = key;
                a.href = "https://intra.assistants.epita.fr/assignment/piscine-2024/".concat(key);
                td_title.appendChild(a);
                for (let keyIn in value[key])
                {
                    var td = document.createElement("td");
                    td.innerHTML = value[key][keyIn];
                    tr.appendChild(td);
                }
            }
            title.parentNode.insertBefore(table, title);
            var json_val = document.createElement("p");
            json_val.innerHTML = JSON.stringify(value);
            title.parentNode.insertBefore(json_val, title);
        }
        //var nonselected = document.querySelectorAll("[theme='small icon primary']");
        //var res = Object();
        //nonselected.forEach((val) => {
        //    res[val.parentNode.href.split("/")[5]] = null;
        //});
        //GM_setValue("value", res);
    }, 1000);
}
if (type == "assignment"){
    var value_temp = GM_getValue("value");
    function next() {
        var value = GM_getValue("value");
        var default_href = "https://intra.assistants.epita.fr/assignment/piscine-2024/";
        for (let exe in value)
        {
            if (value[exe] == null)
            {
                window.location.replace(default_href.concat(exe));
                return;
            }
        }
        GM_setValue("parcours", false);
        window.location.replace("https://intra.assistants.epita.fr/activity/piscine-2024");
    }

    var parcours_exe = GM_getValue("parcours");
    var value_exe = GM_getValue("value");
    var inter_ui = setInterval(() => {
        var h2 = document.querySelector("h2");
        if (h2 != null && parcours_exe)
        {
            var exe = window.location.href.split("/")[5];
            value_exe[exe] = Object();
            var val = document.querySelector("vaadin-grid-cell-content");
            var last_value = "";
            value_exe[exe].algorithm = 0;
            value_exe[exe].arrays = 0;
            value_exe[exe]["core-language"] = 0;
            value_exe[exe].functional = 0;
            value_exe[exe].generics = 0;
            value_exe[exe].io = 0;
            value_exe[exe].memory = 0;
            value_exe[exe].pointers = 0;
            value_exe[exe].regex = 0;
            value_exe[exe].shell = 0;
            value_exe[exe].strings = 0;
            value_exe[exe].structures = 0;
            value_exe[exe].system = 0;
            while (val.textContent != "Name")
            {
                if (val.innerHTML == "<vaadin-grid-sorter path=\"col0\">Tag</vaadin-grid-sorter>")
                {
                    delete value_exe[exe];
                    break;
                }
                console.log(val.textContent);
                switch(val.textContent){
                    case "TRIVIAL":
                        value_exe[exe][last_value] = 1;
                        break;
                    case "EASY":
                        value_exe[exe][last_value] = 5;
                        break;
                    case "MEDIUM":
                        value_exe[exe][last_value] = 10;
                        break;
                    case "HARD":
                        value_exe[exe][last_value] = 20;
                        break;
                    default:
                        last_value = val.textContent;
                        break;
                }
                val = val.nextSibling;
            }
            GM_setValue("value", value_exe);
            next();
        }
    }, 60000);
}
