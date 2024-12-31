const TRUCK_NUMBERS = [
  "8019",
  "8111",
  "1739",
  "0984",
  "5282",
  "9762",
  "5399",
  "9919",
  "2466",
  "8075",
  "2107",
];


const WEEK_DAYS = 7;
const STORAGE_KEY = "weeklyTruckData";
let currentFileName = "Weekly_Transport_Data.xlsx";


function initializeTable() {
    const tbody = document.getElementById("truckData");
    TRUCK_NUMBERS.forEach((truckNumber) => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
                      <td>${truckNumber}</td>
                      <td><input type="text" placeholder="From"></td>
                      <td><input type="text" placeholder="To"></td>
                      <td>
                          <select>
                              <option value="Load">Going to Load</option>
                              <option value="Unload">Going for Unload</option>
                          </select>
                      </td>
                  `;
  
      tbody.appendChild(row);
    });
}



function saveData() {
  const date = new Date();
  const today = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const rows = document.querySelectorAll("#truckData tr");
  const dailyData = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td");
    return [
      cells[0].innerText, // Truck Number
      cells[1].querySelector("input").value, // From
      cells[2].querySelector("input").value, // To
      cells[3].querySelector("select").value, // Load/Unload
      today, // Date and Time
    ];
  });

  let weeklyData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  weeklyData = weeklyData.concat(dailyData);

  if (weeklyData.length / TRUCK_NUMBERS.length >= WEEK_DAYS) {
    // Export data to Excel file for the week
    exportToExcel(weeklyData, currentFileName);

    // Clear local storage for new week
    weeklyData = [];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(weeklyData));
  alert("Daily data saved!");
  rows.forEach((row) => {
    row.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
    row.querySelector("select").selectedIndex = 0; // Select the first option
  });
}



function exportToExcel(data, fileName) {
  const headers = [
    "Truck Number",
    "From",
    "To",
    "Load/Unload",
    "Date and Time",
  ];
  const worksheetData = [headers, ...data];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName);

  alert(`Weekly data saved as ${fileName}`);
}



function navigateToFile() {
  const weeklyData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!weeklyData || weeklyData.length === 0) {
    alert("No weekly data available yet!");
    return;
  }
  exportToExcel(weeklyData, currentFileName);
}



document.addEventListener("DOMContentLoaded", initializeTable);
