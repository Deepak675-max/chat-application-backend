const axoisInstance = axios.create({
    baseURL: 'http://52.66.114.142:3000/api/auth'
})

async function sendResetPasswordLink(userData) {
    try {
        const responseData = await axoisInstance.post('/update-password', userData);
        if (responseData.data.error) {
            throw responseData.data.error
        }
        console.log(responseData.data.data);
        return responseData.data.data
    } catch (error) {
        console.log(error);
        throw error;
    }
}


document.getElementById('resetpassword-btn').addEventListener('click', async function (event) {
    event.preventDefault();
    const msg = document.getElementById('msg');
    try {
        event.preventDefault();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password != confirmPassword) {
            msg.innerText = 'confirm password does not match';
            msg.style.color = 'res';
            setTimeout(() => msg.remove(), 3000);
            return;
        }
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathSegments = url.pathname.split('/');
        const id = pathSegments[pathSegments.length - 1];
        const userData = {
            password: password,
            forgotPasswordRequestId: id
        }
        const res = await sendResetPasswordLink(userData);
        msg.innerText = res.message;
        msg.style.color = 'green';
        setTimeout(() => msg.remove(), 3000);
    } catch (error) {
        msg.innerText = error.message;
        msg.style.color = 'red';
        setTimeout(() => msg.remove(), 3000);
    }
})