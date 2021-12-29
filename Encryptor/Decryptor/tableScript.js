// Fill the encrypted data in the site table

let secretEncryptionkey = 2
let encrypt = (str) => {
    let newStr = "";
    for (let i = 0; i < str.length; i++){
        newChar = String.fromCharCode(str.charCodeAt(i) - secretEncryptionkey);
      newStr += newChar;
      }
    return newStr;
  } 

let tableData = [
  ["Name", "ID", "Phone Number"],
  ["Neta Filgfortz", "192361892", "052-444444"],
  ["Rotem Ismael", "41231223", "056-3332344"],
  ["Zrubabel Levy", "33122131", "052-2313123"],
  ["Slim Shady", "33146543", "055-5424466"],
  ["Ash Catchem", "313139875", "053-11264454"],
  ["Son Goku", "316327766", "054-3552054"],
  ["Ritha Kleinstein", "78090453", "04-26199622"],
  ["Mechanical Keyboard", "12456677", "09-796222"],
]

function createTable(tableData) {
    var table = document.createElement('table');
    table.setAttribute("id","Dor&PoTable")
    var tableBody = document.createElement('tbody');
    
    tableData.forEach(function(rowData) {
      var row = document.createElement('tr');
  
      rowData.forEach(function(cellData) {
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(encrypt(cellData)));
        row.appendChild(cell);
      });
  
      tableBody.appendChild(row);
    });
  
    table.appendChild(tableBody);
    document.body.appendChild(table);
  }

createTable(tableData)