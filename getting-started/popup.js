// Initialize button
let encryptButton = document.getElementById("encrypt");

//Add global variable to storage
chrome.storage.sync.set({ encrypted: true });

// When the button is clicked, inject encryption into current page
encryptButton.addEventListener("click", async () => {
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
    alert("This extension is for Dor&Po agency use only !");
  } 
  else {
  let newTable = currTable;
  let decryptEncrypt = (str, encrypted) => {
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
      newChar = encrypted
        ? String.fromCharCode(str.charCodeAt(i) + 2)
        : String.fromCharCode(str.charCodeAt(i) - 2);
      newStr += newChar;
      }
    return newStr;
  } 
  chrome.storage.sync.get(["encrypted"], ({ encrypted }) => {
    for (let i = 1; i < newTable.rows.length; i++) {
      for (let j = 0; j < newTable.rows[i].cells.length; j++) {
        newTable.rows[i].cells[j].innerHTML = decryptEncrypt(
          newTable.rows[i].cells[j].innerHTML,
          encrypted
        );
      }
    }
  chrome.storage.sync.set({ encrypted: !encrypted });
  });
  currTable.replaceWith(newTable);
  }
}
