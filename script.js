let excelData = [];

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        excelData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        displayFilterForm(excelData);
    };

    reader.readAsArrayBuffer(file);
});

function displayFilterForm(data) {
    const headers = data[0];
    const filterFormContainer = document.getElementById('filterFormContainer');
    filterFormContainer.innerHTML = '';

    headers.forEach((header, index) => {
        const label = document.createElement('label');
        label.innerHTML = `${header}: `;
        const select = document.createElement('select');
        select.id = `filter${index}`;
        select.innerHTML = `<option value="">Select ${header}</option>`;

        const uniqueValues = [...new Set(data.slice(1).map(row => row[index]))].sort();
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.text = value;
            select.appendChild(option);
        });

        filterFormContainer.appendChild(label);
        filterFormContainer.appendChild(select);
        filterFormContainer.appendChild(document.createElement('br'));
    });

    document.getElementById('filterButton').style.display = 'block';
}

document.getElementById('filterButton').addEventListener('click', function() {
    applyFilters();
});

function applyFilters() {
    const headers = excelData[0];
    const filters = Array.from(document.querySelectorAll('#filterFormContainer select')).map(select => select.value);
    const filteredData = excelData.slice(1).filter(row => {
        return filters.every((filter, index) => !filter || row[index] == filter);
    });

    displayTable([headers, ...filteredData]);
}

function displayTable(data) {
    const table = document.getElementById('dataTable');
    table.innerHTML = '';

    const headers = data[0];
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerHTML = header;
        headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    data.slice(1).forEach(rowData => {
        const row = tbody.insertRow();
        rowData.forEach(cellData => {
            const cell = row.insertCell();
            cell.innerHTML = cellData;
        });
    });
}
