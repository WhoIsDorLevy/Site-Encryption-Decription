// Initialize buttons
let encryptButton = document.getElementById("encrypt");
let submitButton = document.getElementById("submitButton");

//Add global variables to storage
chrome.storage.sync.set({ encrypted: true });
chrome.storage.sync.set({ encryptionKey: 0 });

//add on click listeners to the buttons

// When the "submit key" button is clicked, set the encryption key to the input
submitButton.addEventListener("click", async () => {
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
  let doorOpen = new Audio(chrome.runtime.getURL("doorOpen.mp3"));
  doorOpen.play();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: encrypt,
  });
});

// The body of this function will be execuetd when the user clicks on the button
// The fuction gets the data table , decrypts/encrypts the table and replaces the old data table.
function encrypt() {
  let currTable = document.getElementById("Dor&PoTable");
  if (currTable == null) {
    alert("This extension is for Dor&Po agency use only!");
  } 
  else {
  let newTable = currTable;

  //Defining the encryption/decryption function
  //the function receives three parameters:
  //str - the string to encrypt/decrypt
  //encrypted - boolean param which defines if the string is already encrypted
  //encryptionKey - encryption key set by the user
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
  // Get from the global storage the parameters required for the function described above
  chrome.storage.sync.get(["encrypted", "encryptionKey"], ( res ) => {
    for (let i = 0; i < newTable.rows.length; i++) {
      for (let j = 0; j < newTable.rows[i].cells.length; j++) {
        newTable.rows[i].cells[j].innerHTML = decryptEncrypt(
          newTable.rows[i].cells[j].innerHTML,
          res.encrypted,
          res.encryptionKey
        );
      }
    }
  // Set the new status of encrypted var
  chrome.storage.sync.set({ encrypted: !res.encrypted });
  });
  currTable.replaceWith(newTable);
  }
}
