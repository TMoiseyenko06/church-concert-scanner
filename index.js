const name_field = document.getElementById('name-field')
const check_in_field = document.getElementById('check-in-field')
const email_field = document.getElementById('email-field')
const check_in_btn = document.getElementById('check-in-btn')
const wrap_1 = document.getElementById('wrap-1')
const apiUrl = 'https://church-concert.onrender.com'
const apiKey = 'u]l]^dkxt[fi!qNz~$i[^PLQiW4!l|&9qo>qxI0(/257vJp57w9~7bkzWJ'
const table_wrapper = document.getElementById('table-wrap')
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

async function checkIn(hash){
    const api_result = await fetch(`${apiUrl}/person/check-in`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey
        }  

})
}

function createTable(data, columnOrder) {

    const people = data.length
    console.log(people)
   
    if (!data || data.length === 0) {
        console.log("No data available to display.");
        return;
    }

    let table = document.createElement('table');
    table.setAttribute('border', '1');
    table.style.borderCollapse = 'collapse'; 
    

    let headerRow = document.createElement('tr');
    const headers = columnOrder || Object.keys(data[0]);
    
    headers.forEach(header => {

        let th = document.createElement('th');
        th.innerText = header;
        headerRow.appendChild(th);

    });
    table.appendChild(headerRow);

    data.forEach(item => {
        let row = document.createElement('tr');
        

        headers.forEach(header => {

            let td = document.createElement('td');
              
            if (typeof item[header] === 'object' && item[header] !== null) {
                td.innerText = JSON.stringify(item[header], null, 2); 
                td.style.whiteSpace = 'pre-wrap'; 
            } else {
                td.innerText = item[header];
            }
            row.appendChild(td);

        });
        table.id = 'table'
        table.appendChild(row);
    });

    table_wrapper.appendChild(table);
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