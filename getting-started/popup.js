// Initialize buttons
let encryptButton = document.getElementById("encrypt");
let submitButton = document.getElementById("submitButton");

//Add global variables to storage
chrome.storage.sync.set({ encrypted: true });
chrome.storage.sync.set({ encryptionKey: 0 });

//add on click listeners to the buttons

//when the "submit key" button is clicked, set the encryption key to the input
submitButton.addEventListener("click", async () => {
  // let careful = new Audio(chrome.runtime.getURL("Careful.mp3"));
  // careful.play();
  
  let textBox = document.getElementById("keyInput");
  let keyInput = textBox.value;
  let keyInteger = parseInt(keyInput);
  textBox.value = '';
  if (isNaN(keyInteger)){
    let fail = new Audio(chrome.runtime.getURL("fail.mp3"));
    fail.onplaying = function () {alert("Please provide a valid number")}
    fail.play();
    
  }
  else {
    chrome.storage.sync.set({ encryptionKey: keyInteger })
    let marioCoin = new Audio(chrome.runtime.getURL("marioCoin.mp3"));
    marioCoin.play();
  }
} )

// When the encryption button is clicked, inject encryption key into current page
encryptButton.addEventListener("click", async () => {
  // let redCar = new Audio(chrome.runtime.getURL("redCar.mp3"));
  // redCar.play();
  let doorOpen = new Audio(chrome.runtime.getURL("doorOpen.mp3"));
  doorOpen.play();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: encrypt,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
//Get the data table , decrypt/encrypt the table and override the old data table.
function encrypt() {
  let currTable = document.getElementById("dataTable");
  if (currTable == null) {
    alert("This extension is for Dor&Po agency use only!");
  } 
  else {
  let newTable = currTable;
  let decryptEncrypt = (str, encrypted, encryptionKey) => {
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
      newChar = encrypted
        ? String.fromCharCode(str.charCodeAt(i) + encryptionKey)
        : String.fromCharCode(str.charCodeAt(i) - encryptionKey);
      newStr += newChar;
      }
    return newStr;
  } 
  chrome.storage.sync.get(["encrypted", "encryptionKey"], ( res ) => {
    for (let i = 1; i < newTable.rows.length; i++) {
      for (let j = 0; j < newTable.rows[i].cells.length; j++) {
        newTable.rows[i].cells[j].innerHTML = decryptEncrypt(
          newTable.rows[i].cells[j].innerHTML,
          res.encrypted,
          res.encryptionKey
        );
      }
    }
  chrome.storage.sync.set({ encrypted: !res.encrypted });
  });
  currTable.replaceWith(newTable);
  }
}
