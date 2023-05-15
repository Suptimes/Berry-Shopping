import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-ba577-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const addButtonEll = document.querySelectorAll(".add-button2")
const addButton3 = document.querySelectorAll(".add-button3")
const formEl = document.querySelector("form")   //to change the form name
const inputBox = Array.from(document.querySelectorAll("input"))
console.log(inputBox) // to check if working
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = `<p class="noItem">No items here... yet</p>`
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}

for (let i = 0; i < addButtonEll.length; i++) {

    addButtonEll[i].addEventListener("click", function() {
        
      // Get the corresponding select element using "this"
      let selectEl = this.previousElementSibling
      let itemX = selectEl.value
        if (itemX == 0) {
            
        } else {
            // Add the item to the shopping list in Firebase
            push(shoppingListInDB, itemX)
            selectEl.selectedIndex = 0
            // Clear the input field
            clearInputFieldEl()
        }
      
    })
  }
  
for (let i = 0; i<inputBox.length;i++){
//   inputBox[i].addEventListener("click", function() {
    let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
    if (inputBox[i].checked === "true") {
        // Highlight the selected items
    for (let j = 0; j < checkboxes.length; j++) {
        checkboxes[j].nextElementSibling.classList.add("selected");
      }
    } else {
        for (let j = 0; j < checkboxes.length; j++) {
            checkboxes[j].nextElementSibling.classList.remove("selected");
          }
    }
    
}
//   })}

 
  
addButton3.forEach(button => {

    button.addEventListener("click", function() {
        const form = this.closest("form");
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        const selectedItems = [];

        checkboxes.forEach(checkbox => selectedItems.push(checkbox.value));
        selectedItems.forEach(item => push(shoppingListInDB, item));

      

        form.reset();
    });
});

