/**
 * Created by idoi on 25/03/2018.
 */

let itemArr = [];

function addEntry() {
    let newEntry = document.getElementById("inputBox").value
    console.log(newEntry)
    if(newEntry) {
        let currTime = new Date();
        document.getElementById("inputBox").value = '';
        itemArr.push({text: newEntry, time: currTime, isDone: false})
        updateList();
        deSelectDropdown();
    }
    else {
        alert('Please enter something, surely you got SOMETHING to do')
    }
}

function getSavedList() {
    let savedList = JSON.parse(localStorage.getItem("entriesList"))
    if (savedList) {
        itemArr = savedList;
         updateList()
    }
}

function updateList() {
    //console.log("updateList is running")
    let todoList = document.getElementById("todoList");
    while( todoList.firstChild ){
        todoList.removeChild( todoList.firstChild );
    }
    for (let thisItem in itemArr) {

        let node = document.createElement("LI");
        let textNode = document.createTextNode(itemArr[thisItem]['text']);
        let checkBox = document.createElement('input');

        checkBox.type = 'checkbox';
        checkBox.id = 'isDone' + thisItem;
        checkBox.checked =  itemArr[thisItem].isDone;
        checkBox.addEventListener("click", function() {
            changeIsDone(this.id)
        });

        node.appendChild(checkBox);
        node.appendChild(textNode);

        todoList.appendChild(node);
    }

    saveListLocally();
}

function changeIsDone(d) {
    let isChecked = document.getElementById(d).checked
    let index = d.substr(6)  //gets the index #
    itemArr[index].isDone = isChecked;
    deSelectDropdown();
    saveListLocally();
}
function deSelectDropdown () {
    document.getElementById('sortBox').value = -1;
}
function saveListLocally() {
    try {localStorage.setItem("entriesList", JSON.stringify(itemArr))
        }
    catch (err){
        console.log(err)
    };
}

function removeDone() {
    let newArr = [];
    for (let i = 0;  i < itemArr.length; i++) {
        if (!itemArr[i].isDone) {
            newArr.push(itemArr[i]);
        }
    }
    itemArr = newArr;
    updateList();
}

<!--0 date oldest to newest-->
<!--1 date newest oldest-->
<!--2 done-->
<!--3 not done-->
<!--4 alpha A to Z-->
<!--5 alpha Z to A-->


function sortList() {
    let selection = document.getElementById('sortBox').value;
    switch(Number(selection)) {
        case 0:
            itemArr.sort(function(a, b) {

                if (a.time < b.time) {
                    return -1;
                }
                if (a.time > b.time) {
                    return 1;
                }
                return 0;
            })
            break;
        case 1:
            itemArr.sort(function(a, b) {

                if (a.time > b.time) {
                    return -1;
                }
                if (a.time < b.time) {
                    return 1;
                }
                return 0;
            })
            break;
        case 2:
            itemArr.sort(function(a, b) {

                if (a.isDone > b.isDone) {
                    return -1;
                }
                if (a.isDone < b.isDone) {
                    return 1;
                }
                return 0;
            })
            break;
        case 3:
            itemArr.sort(function(a, b) {

                if (a.isDone < b.isDone) {
                    return -1;
                }
                if (a.isDone > b.isDone) {
                    return 1;
                }
                return 0;
            })
            break;
        case 4:
            itemArr.sort(function(a, b) {
                let text1 = a.text.toUpperCase();
                let text2 = b.text.toUpperCase();
                if (text1 < text2) {
                    return -1;
                }
                if (text1 > text2) {
                    return 1;
                }
                return 0;
            })
            break;
        case 5:
            itemArr.sort(function(a, b) {
                let text1 = a.text.toUpperCase();
                let text2 = b.text.toUpperCase();
                if (text1 > text2) {
                    return -1;
                }
                if (text1 < text2) {
                    return 1;
                }
                return 0;
            })

            break;

        default:
            console.log('Wrong selection')
            break;

    }
    updateList()
}