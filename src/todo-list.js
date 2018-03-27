/**
 * Created by idoi on 25/03/2018.
 */

var itemArr = [];

function addEntry() {
    var newEntry = document.getElementsByTagName("input")[0].value
    if(newEntry) {
        var currTime = new Date();
        document.getElementsByTagName("input")[0].value = '';
        itemArr.push({text: newEntry, time: currTime, isDone: false})
        updateList();
    }
    else {
        alert('Please enter something, surely you got SOMETHING to do')
    }
}

function getSavedList() {
    var savedList = JSON.parse(localStorage.getItem("entriesList"))
    if (savedList) {
        itemArr = savedList;
         updateList()
    }
}

function updateList() {
    //console.log("updateList is running")
    var todoList = document.getElementById("todoList");
    while( todoList.firstChild ){
        todoList.removeChild( todoList.firstChild );
    }
    for (var thisItem in itemArr) {

        var node = document.createElement("LI");
        var textNode = document.createTextNode(itemArr[thisItem]['text']);
        var checkBox = document.createElement('input');

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
    var isChecked = document.getElementById(d).checked
    var index = d.substr(6)  //gets the index #
    itemArr[index].isDone = isChecked;
    saveListLocally();
}

function saveListLocally() {
    try {localStorage.setItem("entriesList", JSON.stringify(itemArr))
        }
    catch (err){
        console.log(err)
    };
}

function removeDone() {
    var newArr = [];
    for (var i = 0;  i < itemArr.length; i++) {
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
    var selection = document.getElementById('sortBox').value;
    console.log(selection)
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
            console.log("case 4")
            itemArr.sort(function(a, b) {
                var text1 = a.text.toUpperCase();
                var text2 = b.text.toUpperCase();
                console.log(text1, text2)
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
                var text1 = a.text.toUpperCase();
                var text2 = b.text.toUpperCase();
                console.log(text1, text2)
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