const name_field = document.getElementById('name-field')
const check_in_field = document.getElementById('check-in-field')
const email_field = document.getElementById('email-field')
const check_in_btn = document.getElementById('check-in-btn')
const total_amount = document.getElementById('total-amt')
const ctx = document.getElementById('chart')
const checked_in_amt = document.getElementById('checked-in-amt')
const wrap_1 = document.getElementById('wrap-1')
const apiUrl = 'https://church-concert.onrender.com'
const apiKey = 'u]l]^dkxt[fi!qNz~$i[^PLQiW4!l|&9qo>qxI0(/257vJp57w9~7bkzWJ'
const table_wrapper = document.getElementById('table-wrap')
let current_hash = ''
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
    if (!jsonResponse['checked_in']){
        name_field.textContent = `Name: ${jsonResponse['first_name']} ${jsonResponse['last_name']}`
        check_in_field.textContent = `Checked In: ${jsonResponse['checked_in']}`
        email_field.textContent = `E-mail: ${jsonResponse['email']}`
        current_hash = jsonResponse['plus_hash']
        console.log(jsonResponse);
    }else{
        alert('This Person has Already Checked In!')
    }

}

async function checkIn(hash){
    const api_result = await fetch(`${apiUrl}/person/confirm`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey
        },
        body: JSON.stringify({
            "plus_hash": hash
        })
})

    return api_result.status

}

function createChart(total,checked){
    
    new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Total People','Checked in'],
          datasets: [{
            label: 'People',
            data: [total-checked,checked],
            borderWidth: 1,
            backgroundColor: ['#b4a789','#9c5b46']
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
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

    const checked_in_result = await fetch(`${apiUrl}/person/get_checked_in`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey
        }
    })
    
    const jsonResponse = await api_result.json();
    const checkedResponse = await checked_in_result.json()
    createTable(jsonResponse,['first_name','last_name','email','checked_in'])
    createChart(jsonResponse.length,checkedResponse.length)
    console.log(jsonResponse);
}

get_all()

check_in_btn.addEventListener("click",async (event) => {
    event.preventDefault()
    console.log(current_hash)
    const status = await checkIn(current_hash)
    console.log(status)
    if (status== 200){
        name_field.textContent = `Name:`
        check_in_field.textContent = `Checked In:`
        email_field.textContent = "E-Mail:"
        table.innerHTML = ''
        current_hash = ''
        get_all()
        scanner.resume()
    }
})


