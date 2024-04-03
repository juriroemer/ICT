elements = JSON.parse(localStorage.getItem("tree"));

if (elements === null) {
  document.getElementById("data").innerHTML =
    "Craft something to see the results here!";
} else {
  table = document.createElement("table");
  table.style.border = "1px solid black";
  table.style.margin = "auto";

  var header = table.createTHead();
  var row = header.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = "<b>Parent 1</b>";
  cell2.innerHTML = "<b>Parent 2</b>";
  cell3.innerHTML = "<b>Result</b>";

  for (element of elements) {
    element = JSON.parse(element);
    row = table.insertRow();
    parent1 = row.insertCell();
    parent1.innerHTML = element["parents"][0];
    parent2 = row.insertCell();
    parent2.innerHTML = element["parents"][1];
    result = row.insertCell();
    result.innerHTML = `${element["result"]["emoji"]} ${element["result"]["result"]}`;
  }

  document.getElementById("data").append(table);
}
