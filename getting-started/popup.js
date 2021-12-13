// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
// let encrypted = true;
chrome.storage.sync.set({encrypted : true});
chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});


// function decrypt(str) {
//   let newStr = "";
//   for (let i = 0; i < str.length; i++) {
//     newStr = newStr + (str.charAt(i) + 2);
//   }
//   return newStr;
// }


// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  let table = document.getElementById("dataTable");
  let newTable = table;
  chrome.storage.sync.get(['encrypted'],({encrypted}) =>{
    
    for (let i = 1; i < table.rows.length; i++) {
      for (let j = 0; j < table.rows[i].length; j++) {
      newTable.rows[i].cells[j].innerHTML = decryptEncrypt(table.rows[i].cells[j].innerHTML,encrypted);
      }
    }
    
    // chrome.storage.sync.set({encrypted: !encrypted});
  });
  console.log(newTable);
  table.replaceWith(newTable);
}


function decryptEncrypt(str,encrypted) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    newStr += encrypted ? (str.charAt(i) + 2) : ((str.charAt(i) - 2));
  }
  return newStr;
}
