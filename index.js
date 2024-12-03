const name_field = document.getElementById('name-field')
const check_in_field = document.getElementById('check-in-field')
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
    
    console.log(jsonResponse);
}

function createTable(data) {
    // Create table element
    let table = document.createElement('table');
    table.setAttribute('border', '1');

    let headerRow = document.createElement('tr');
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
        if (header != 'plus_hash'){
            let th = document.createElement('th');
            th.innerText = header;
            headerRow.appendChild(th);
        }
      });
    table.appendChild(headerRow);

    data.forEach(item => {
        let row = document.createElement('tr');
        
        // Loop through each property in the item
        headers.forEach(header => {
            if (header != 'plus_hash'){
                let td = document.createElement('td');
          
                if (typeof item[header] === 'object' && item[header] !== null) {
                  td.innerText = JSON.stringify(item[header]);
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
    createTable(jsonResponse)
    console.log(jsonResponse);
}

get_all()