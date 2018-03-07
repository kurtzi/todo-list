/*
1. Have a list of tasks, sorted by add time.
2. At the end of the task list, add input box that accepts new task by ‘Enter’ key. Adding a new task should put the task at the end of the list and the input box should still appear after the whole list.
3. Each task should have a checkbox to indicate it’s status (done/open).
4. Ability to delete task.
5. Ability to sort by date, done/not done, alphabetical order.
6. Persistency: upon refresh, task list should appear.
7. CSS - design however you like
*/


function addElementToList(){
    addElementToDOM();
    clearTextInput();
}


function addElementToDOM(){
    let mainDiv = document.getElementById("checkboxes-lst");
    let taskDescription = document.getElementById("task-description").value;

    if (taskDescription){
            let listElement = createListElement(taskDescription);
            mainDiv.appendChild(listElement);
    }
    else{
        //TODO: error msg
    }
}

function clearTextInput(){
    document.getElementById("task-description").value = "";
}

function createListElement(taskDescription){
    let listElemDiv = document.createElement("div");
    listElemDiv.className = "list-element";


    let deleteBtn = createDeleteButton();
    let doneCheckbox = createDoneCheckbox();
    let descriptionTaskText = createTaskDescription(taskDescription);

    //TODO: should use insertAfter function instead
    listElemDiv.appendChild(doneCheckbox);
    listElemDiv.appendChild(descriptionTaskText);
    listElemDiv.appendChild(deleteBtn);


    return listElemDiv;

}


function createDeleteButton() {
    let deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.value = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {alert("blabla")};

    return deleteBtn;
}

function createTaskDescription(taskDescription) {
    let taskDescriptionParagraph = document.createElement("p");
    taskDescriptionParagraph.innerHTML = taskDescription;
    taskDescriptionParagraph.className = "task-description";
    return taskDescriptionParagraph;
}

function createDoneCheckbox(){
    let checkbox = document.createElement('input');
    checkbox.type= 'checkbox';
    checkbox.className = "checkbox-done";
    return checkbox;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


/*
* function add(type) {
  //Create an input type dynamically.
  var element = document.createElement("input");
  //Assign different attributes to the element.
  element.type = type;
  element.value = type; // Really? You want the default value to be the type string?
  element.name = type; // And the name too?
  element.onclick = function() { // Note this is a function
    alert("blabla");
  };

  var foo = document.getElementById("fooBar");
  //Append the element in page (in span).
  foo.appendChild(element);
}
document.getElementById("btnAdd").onclick = function() {
  add("text");
};
*
* */