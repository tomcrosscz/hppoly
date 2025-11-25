function authenticate() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const resultDiv = document.getElementById('result');

    if (username === 'AVControl' && password === '123') {
        resultDiv.textContent = 'SUCCESS';
        resultDiv.style.color = 'green';
    } else {
        resultDiv.textContent = 'ACCESS DENIED';
        resultDiv.style.color = 'red';
    }
}

// Enable CORS headers (for demonstration, actual CORS is handled by server)
document.addEventListener('DOMContentLoaded', () => {
    console.log('CORS supported by server configuration on Render.com');
});
