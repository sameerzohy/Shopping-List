const itemForm = document.querySelector('.item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('.item-list');
const clearBtn = document.querySelector('.clear-btn');
const filterInput = document.querySelector('.filter-item');
const formBtn = itemForm.querySelector('#add-btn');
let isEditMode = false


//1) adding items to list
//Event Listeners Functions
function onAddItemSubmit(e){
    e.preventDefault();
    console.log('Form Submitted');
    // validating the form

    const newItem = itemInput.value;

    if (newItem === ''){
        alert("Please add an item");
        return
    }

    //Check For Edit Mode

    if(isEditMode){
        const itemToEdit = itemList.querySelector('.change-color');
        console.log(itemToEdit);
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove();
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if (checkIfItemExist(newItem)){
            alert(`${newItem} already exist`);
            return;
        }
    }


    // Create Item to DOM Element
    addItemToDOM(newItem);


    // Adding items to Local Storage

    addItemToStorage(newItem);

    checkUI();
}

// Adding items to DOM

function addItemToDOM(item){
    
    //create List Items
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('del-btn');

    li.appendChild(button);
    itemList.appendChild(li);
    itemInput.value = '';
}

function fetchFromStorage(){

    let itemsFromStroage;
    itemsFromStroage = JSON.parse(localStorage.getItem('items'));
    console.log(itemsFromStroage);
    if (itemsFromStroage !== null){
        console.log(itemsFromStroage)
        itemsFromStroage.map(it => {
            const li = document.createElement('li')

            li.appendChild(document.createTextNode(it));
            const button = createButton('del-btn');

            li.appendChild(button);
            itemList.appendChild(li);
        })

    }

}

function getItemsFromStorage(){
    let itemsFromStroage;
    itemsFromStroage = JSON.parse(localStorage.getItem('items'));
    return itemsFromStroage;
}


// Adding items to Local Storage
function addItemToStorage(item){
    let itemsFromStroage;
    // The key of the array in the local storage array gonna be the 'items'
    if(localStorage.getItem('items') === null){
        itemsFromStroage = [];
    }else{
        itemsFromStroage = JSON.parse(localStorage.getItem('items'));
    }
    //Add new Items to Storage.
    itemsFromStroage.push(item);
    //convert to JSON string and set to local storage;
    const items = JSON.stringify(itemsFromStroage);

    localStorage.setItem("items", items);
}




function createButton(classes){
    const button = document.createElement('button')
    button.className = classes
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button
}

function createIcon(classes){
    const icon = document.createElement('i')
    icon.className = classes
    return icon;
}


function onClickItem(e){
    if (e.target.parentElement.classList.contains('del-btn')){
        removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target)
    }
}

function checkIfItemExist(item){
    const itemsFromStroage = getItemsFromStorage();
    if (itemsFromStroage !== null){
    return itemsFromStroage.includes(item);}
}

function setItemToEdit(item){
    isEditMode = true
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('change-color'));

    item.classList.add('change-color');


    formBtn.value = 'Update';
    formBtn.style.background = 'red';
    itemInput.value = item.textContent

}



function removeItem(item){
    if (confirm("Are You Sure")){
        // To remove Element From DOM
        item.remove();


        //To remove Element From Storage
        removeItemFromStorage(item.textContent);

        checkUI
    }
}

function removeItemFromStorage(item){
    let itemsFromStroage = getItemsFromStorage();

    //Filter Items to remove
    itemsFromStroage = itemsFromStroage.filter(i => item.toLowerCase() !== i.toLowerCase())

    //Reset to Local Storage

    localStorage.setItem('items', JSON.stringify(itemsFromStroage));

}

function onClear(){
    if(confirm("Are you sure?")){
        itemList.innerHTML = '';
        localStorage.clear();
        checkUI();

    }
}


function filterItems(e){
    text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');
    items.forEach((item) => {
        const itemName = item.textContent.toLowerCase();
        if (itemName.indexOf(text) != -1){
            item.style.display = 'inline-block';
        }
        else{
            item.style.display = 'none';
        }
    })
}

function checkUI(){
    const items = JSON.parse(localStorage.getItem('items'));

    if (items == null){
        clearBtn.style.display = 'none';
        filterInput.style.display = 'none';
    }else{
        clearBtn.style.display = 'block';
        filterInput.style.display = 'block';
    }

    formBtn.value = "+ Add Item";
    formBtn.style.background = 'rgb(133, 181, 60)';
    
    isEditMode = false;
}

checkUI();

// Event Listeners

itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', onClear);

filterInput.addEventListener('input', filterItems);
fetchFromStorage();