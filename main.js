let appData = {};
let sortableData = [];
const list = document.querySelector('#list');

function appStarter() {
  const myItems = JSON.parse(localStorage.getItem('myItems'));
  const sortingMethod = localStorage.getItem('sortingMethod');

  if (myItems) {
    appData = myItems;
    sortableData = Object.keys(appData);
    createList();
  }
  if (sortingMethod) {
    document.querySelector('#sortDropDown').value = sortingMethod;
    sortList(null, sortingMethod);
  }
  addEventListenersToStaticElements();
}

function addEventListenersToStaticElements() {
  const addItemBtn = document.querySelector('#addItemBtn');
  const inputFieldElement = document.querySelector('#inputField');
  const sortDropDown = document.querySelector('#sortDropDown');

  addItemBtn.addEventListener('click', addAnItem);
  inputFieldElement.addEventListener('keypress', (e) => {
    if (e.which === 13) {
      addAnItem();
    }
  });
  sortDropDown.addEventListener('change', sortList)
}

function addEventListenerToListItem(item) {
  const delBtnsElement = item.querySelector('.delBtn');
  delBtnsElement.addEventListener('click', deleteItem);

  const inputCheckBoxElement = item.querySelector('.itemCheckBox');
  inputCheckBoxElement.addEventListener('change', checkBoxOnChange)
}

function saveDataInLocalStorage() {
  const sortDropDown = document.querySelector('#sortDropDown').value;
  localStorage.setItem('myItems', JSON.stringify(appData));
  localStorage.setItem('sortingMethod', sortDropDown);
}

function checkBoxOnChange(event) {
  let liElement = event.srcElement.closest('li');
  appData[liElement.id].isChecked = !appData[liElement.id].isChecked;
  saveDataInLocalStorage();
}

function sortList(event, sortBy) {
  const selectedItemValue = sortBy || event.target.value;
  if (selectedItemValue === 'date') {
    sortableData.sort((a, b) => {
      return new Date(appData[a].date) - new Date(appData[b].date);
    });
  }
  if (selectedItemValue === 'alphabet') {
    sortableData.sort((a, b) => {
      if (appData[a].text.toLowerCase() < appData[b].text.toLowerCase()) {
        return -1;
      }
      if (appData[a].text.toLowerCase() > appData[b].text.toLowerCase()) {
        return 1;
      }
      return 0;
    });

  }
  if (selectedItemValue === 'done') {
    sortableData.sort((a, b) => {
      if (appData[a].isChecked === appData[b].isChecked) {
        return 0;
      }
      if (appData[a].isChecked) {
        return -1
      }
      if (!appData[a].isChecked) {
        return 1;
      }
    });
  }
  saveDataInLocalStorage();

  createList();
}

function createList() {
  list.innerHTML = '';
  sortableData.forEach((item) => {
    list.appendChild(createItem(item));
  })
}

function createItem(item) {
  const liElement = document.createElement('li');
  liElement.setAttribute("id", item);
  liElement.setAttribute("class", 'listItem');
  liElement.innerHTML = `<label><input class="itemCheckBox" type="checkbox" ${appData[item].isChecked ? 'checked' : ''}/>${appData[item].text}</label><span>${new Date(appData[item].date)}</span>${createDeleteButton()}`;
  addEventListenerToListItem(liElement);
  return liElement;
}

function addAnItem() {
  const inputValue = document.querySelector('#inputField');
  if (inputValue.value.length === 0) {
    console.log('input field is empty');
  }
  else {
    const idOfElement = Math.floor(Math.random() * 900000) + 10000;
    const item = {
      text: inputValue.value,
      isChecked: false,
      date: new Date()
    };
    appData[idOfElement] = item;
    sortableData = Object.keys(appData);

    const dropDownElementValue = document.querySelector('#sortDropDown').value;
    const index = getIndexOfNewItemInSortedList(idOfElement, dropDownElementValue);
    list.insertBefore(createItem(idOfElement), list.childNodes[index]);
    document.getElementById('inputField').value = '';
    saveDataInLocalStorage()
  }
}

function createDeleteButton() {
  return `<button class="delBtn">delete</button>`;
}

function deleteItem(event) {
  const liElement = event.toElement.closest('li');
  delete appData[liElement.id];
  list.removeChild(liElement);
  saveDataInLocalStorage();
}

function getIndexOfNewItemInSortedList(liElement, sortMethod) {
  const inputValue = document.querySelector('#inputField');
  const listOfItemsInDom = document.querySelectorAll('.listItem');
  const arrayOfItemsInDom = Array.from(listOfItemsInDom);
  let index = listOfItemsInDom.length;
  if (sortMethod === 'alphabet') {
    arrayOfItemsInDom.push(createItem(liElement));
    const sortedArray = [];
    arrayOfItemsInDom.forEach((item) => {
      let domElement = item.querySelector('label');
      sortedArray.push(domElement.innerText)
    });
    sortedArray.sort();
    index = sortedArray.indexOf(inputValue.value);
  }
  return index;
}

appStarter();
