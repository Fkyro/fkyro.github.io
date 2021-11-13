// ==UserScript==
// @name         Tableau de notion
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pour le tableau des notions (ne me tener pas responsable si c'est pas juste)
// @author       Someone
// @match        https://intra.assistants.epita.fr/activity/piscine-2024
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

function close_open()
{
    var table = document.querySelector(".open_close");
    if (table.style.display === "none")
    {
        GM_setValue("display", "block");
    }
    else
    {
        GM_setValue("display", "none");
    }
    table.setAttribute("style", "display:" + GM_getValue("display") + " !important");
}

if (GM_getValue("display") == undefined)
{
    GM_setValue("display", "none");
}

var value;
let url = 'https://fkyro.github.io/';

fetch(url).then(res => res.json()).then(out => {value = out});
var inter = setInterval(() => {
    var already_title = document.querySelector(".notions_exercise_title");
    if (already_title == null)
    {
        var title = document.querySelector("h2");
        var notions_exercise_tile = document.createElement("h2");
        notions_exercise_tile.className = "notions_exercise_title";
        var notions_exercise_title_texte = document.createTextNode("Notions par exercise");
        notions_exercise_tile.appendChild(notions_exercise_title_texte);
        title.parentNode.insertBefore(notions_exercise_tile, title);
        var open_close = document.createElement("button");
        open_close.addEventListener('click', close_open);
        open_close.innerHTML = "Ouvrir/Fermer tableau"
        title.parentNode.insertBefore(open_close, title);
        var table = document.createElement("table");
        table.className = "open_close";
        table.border = "3";
        table.setAttribute("style", "display:" + GM_getValue("display") + " !important");
        var thead = document.createElement("thead");
        table.appendChild(thead);
        var trHead = document.createElement("tr");
        thead.appendChild(trHead);
        var array = ["Name", "algorithm", "arrays", "core-language", "functional", "generics", "io", "memory", "pointers", "regex", "shell", "strings", "structures", "system", "make"];
        array.forEach((val) => {
            let th = document.createElement("th");
            th.style.cursor = "pointer";
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
        const getCellValue = (tableRow, columnIndex) => tableRow.children[columnIndex].innerText || tableRow.children[columnIndex].textContent;

        const comparer = (idx, asc) => (r1, r2) => ((el1, el2) =>
                                                    el1 !== '' && el2 !== '' && !isNaN(el1) && !isNaN(el2) ? el1 - el2 : el1.toString().localeCompare(el2)
                                                   )(getCellValue(asc ? r1 : r2, idx), getCellValue(asc ? r2 : r1, idx));

        document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
            const tbody = document.querySelector("tbody");
            Array.from(tbody.querySelectorAll('tr'))
                .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                .forEach(tr => tbody.appendChild(tr) );
        })));
    }
}, 1000);
