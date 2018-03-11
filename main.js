let appData = [];

function appStarter() {
  const myItems = JSON.parse(localStorage.getItem('myItems'));
  if (myItems === null) {
  }
  if (myItems) {
    appData = myItems;
    createList();
  }
}

function createList() {
  const list = document.getElementById('list');
  list.innerHTML = '';
  appData.forEach((item) => {
    list.innerHTML += createItem(item);
  })

}

function createItem(item) {
  const isChecked = item.isChecked;
  return `<li id=${item.id}><label><input type="checkbox" ${isChecked ? 'checked' : ''} onchange="checkBoxOnChange(this)"/> ${item.text}</label></li>`;
}

function addAnItem() {
  const inputValue = document.getElementById('inputField');
  if (inputValue.value.length === 0) {
    return console.log('input field is empty');
  }
  else {
    console.log(inputValue.value);
    const item = {
      id: Math.floor(Math.random() * 900000) + 10000,
      text: inputValue.value,
      isChecked: false
    };
    appData.push(item);
    document.getElementById('inputField').value = '';
    addItemsToLocalStorage()
  }
}

function addItemsToLocalStorage() {
  localStorage.setItem('myItems', JSON.stringify(appData));
  createList();
}

function checkBoxOnChange(event) {
  let liElement = event.closest('li');
  appData.forEach((item) => {
    if (item.id === Number(liElement.id)) {
      item.isChecked = item.isChecked ? false : true;
    }
  });
  addItemsToLocalStorage();
}

appStarter();
