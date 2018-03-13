let appData = [];
const list = document.getElementById('list');

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
  list.innerHTML = '';
  appData.forEach((item) => {
    list.innerHTML += createItem(item);
  })

}

function createItem(item) {
  const isChecked = item.isChecked;
  return `<li id=${item.id}><label><input type="checkbox" ${isChecked ? 'checked' : ''} onchange="checkBoxOnChange(this)"/> ${item.text}</label><span>${item.date}</span></li>`;
}

function addAnItem() {
  const inputValue = document.getElementById('inputField');
  if (inputValue.value.length === 0) {
    return console.log('input field is empty');
  }
  else {
    const item = {
      id: Math.floor(Math.random() * 900000) + 10000,
      text: inputValue.value,
      isChecked: false,
      date: new Date()
    };
    const liElement = document.createElement('li');
    const labelElement = `<label><input type="checkbox" ${item.isChecked ? 'checked' : ''} onchange="checkBoxOnChange(this)"/> ${item.text}</label><span>${item.date}</span>`;
    liElement.setAttribute("id", item.id);
    liElement.innerHTML = labelElement;
    appData.push(item);
    document.getElementById('inputField').value = '';
    list.appendChild(liElement);
    addItemsToLocalStorage()
  }
}

function addItemsToLocalStorage() {
  localStorage.setItem('myItems', JSON.stringify(appData));
}

function checkBoxOnChange(event) {
  let liElement = event.closest('li');
  appData.forEach((item) => {
    if (item.id === Number(liElement.id)) {
      item.isChecked = !item.isChecked;
    }
  });
  addItemsToLocalStorage();
}

function sortList(event) {
  const selectedItemValue = event.value;
  if (selectedItemValue === 'date') {
    appData.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
  }
  if (selectedItemValue === 'alphabet') {
    appData.sort((a, b) => {
      if (a.text < b.text) return -1;
      if (a.text > b.text) return 1;
      return 0;
    })
  }
  if (selectedItemValue === 'done') {
    appData.sort((a, b) => {
      return (a.isChecked === b.isChecked) ? 0 : a.isChecked ? -1 : 1;
    })

  }
  createList();

}

appStarter();
