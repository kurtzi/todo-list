function addAnItem() {
  const inputValue = document.getElementById('inputField');
  if (inputValue.value.length === 0) {
    return console.log('input field is empty');
  }
  else {

    const list = document.getElementById('list');
    const liElm = document.createElement('li');
    const labelElm = document.createElement('label');
    const checkboxElm = document.createElement('input');
    labelElm.innerText = inputValue.value;

    checkboxElm.onchange = checkBoxOnChange;
    checkboxElm.type = "checkbox";
    // why ?
    const notWorking = `<li><label><input type="checkbox"/>${inputValue.value}</label></li>`;

    // labelElm.appendChild(checkboxElm);
    // liElm.appendChild(labelElm);
    // list.appendChild(liElm);
    list.innerHTML += notWorking;
    document.getElementById('inputField').value = '';
    addItemsToLocalStorage()
  }
  // list.appendChild(test);
}

function addItemsToLocalStorage() {

  const nodelist = document.querySelectorAll('li');
  const nodelistArr = Array.from(nodelist);
  const listToSave = nodelistArr.map((item) => {
    const text = item.innerText;
    const isChecked = item.querySelector('input').checked;
    return {text, isChecked}
  });
  localStorage.setItem('myItems', JSON.stringify(listToSave));
}

function printLocalStorage() {
  const myItems = JSON.parse(localStorage.getItem('myItems'));
  console.log(myItems);
}

function checkBoxOnChange(event) {
  console.log('onChange', event.target.checked);
}