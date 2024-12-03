const name_field = document.getElementById('name-field')
const check_in_field = document.getElementById('check-in-field')
const email_field = document.getElementById('email-field')
const check_in_btn = document.getElementById('check-in-btn')
const wrap_1 = document.getElementById('wrap-1')
const apiUrl = 'https://church-concert.onrender.com'
const apiKey = 'u]l]^dkxt[fi!qNz~$i[^PLQiW4!l|&9qo>qxI0(/257vJp57w9~7bkzWJ'
const scanner = new Html5QrcodeScanner('reader', {
    qrbox: {
        width: 700,
        height: 700
    },
    fps: 30
});

scanner.render(success, error);

async function success(result) {
    scanner.pause()
    const api_result = await fetch(`${apiUrl}/person/check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey
        },
        body: JSON.stringify({
            "plus_hash": result
        })
    });

    
    const jsonResponse = await api_result.json();
    
    name_field.textContent = `Name: ${jsonResponse['first_name']} ${jsonResponse['last_name']}`
    check_in_field.textContent = `Checked In: ${jsonResponse['checked_in']}`
    email_field.textContent = `E-mail: ${jsonResponse['email']}`
    console.log(jsonResponse);
}

function createTable(data, columnOrder) {
    // Check if data is valid and not empty
    if (!data || data.length === 0) {
        console.log("No data available to display.");
        return;
    }

    // Create table element
    let table = document.createElement('table');
    table.setAttribute('border', '1');
    table.style.borderCollapse = 'collapse'; // Optional styling for better appearance
    table.style.width = '100%'; // Optional styling for full-width

    let headerRow = document.createElement('tr');
    
    // Use the custom column order, or fall back to the original order
    const headers = columnOrder || Object.keys(data[0]);
    
    // Ensure columns in the table match the desired order (excluding 'plus_hash' and 'id')
    headers.forEach(header => {
        if (header !== 'plus_hash' && header !== 'id') {
            let th = document.createElement('th');
            th.innerText = header;
            headerRow.appendChild(th);
        }
    });
    table.appendChild(headerRow);

    data.forEach(item => {
        let row = document.createElement('tr');
        
        // Loop through each header in the custom order
        headers.forEach(header => {
            if (header !== 'plus_hash' && header !== 'id') {
                let td = document.createElement('td');
              
                // Check if value is an object and handle it
                if (typeof item[header] === 'object' && item[header] !== null) {
                    td.innerText = JSON.stringify(item[header], null, 2); // Beautify JSON
                    td.style.whiteSpace = 'pre-wrap'; // Allows wrapping of JSON content
                } else {
                    td.innerText = item[header];
                }
                row.appendChild(td);
            }
        });
    
        table.appendChild(row);
    });

    document.body.appendChild(table);
}


function error(result) {
    console.log(result)
};


async function get_all() {
    const api_result = await fetch(`${apiUrl}/person/get_all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey
        }  

})
    const jsonResponse = await api_result.json();
    createTable(jsonResponse,['first_name','last_name','email','checked_in'])
    console.log(jsonResponse);
}

get_all()