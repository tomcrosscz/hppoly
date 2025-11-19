document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
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
});
