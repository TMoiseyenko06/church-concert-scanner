
const scanner = new Html5QrcodeScanner('reader', {
    qrbox: {
        width: 250,
        height: 250
    },
    fps: 30
});

scanner.render(success, error);

function success(result) {
    console.log(result)
};

function error(result) {
    console.log(result)
};