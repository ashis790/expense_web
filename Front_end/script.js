document.addEventListener('DOMContentLoaded',(event)=>{
    const loginform = document.getElementById('login-form')
    const signupform = document.getElementById('register-form')
    signupform.style.display = 'none'
    document.getElementById('showLogin').addEventListener('click',()=>{
        loginform.style.display = 'block'
        signupform.style.display = 'none'
    })

    document.getElementById('showSignup').addEventListener('click',()=>{
        loginform.style.display = 'none'
        signupform.style.display = 'block'
    })

    document.getElementById('register-form').addEventListener('submit',async (event)=>{
        event.preventDefault()
        const name = document.getElementById('name').value
        const user_id = document.getElementById("user_id").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        const response = await fetch("http://localhost:3000/api/users/register",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, user_id, email, password })
        })
        const data = await response.json()
        alert(data.message)
    })
    document.getElementById('login-form').addEventListener('submit',async (event)=>{
        event.preventDefault()
        const user_id = document.getElementById('login-user_id').value
        const password = document.getElementById('login-password').value

        const response = await fetch("http://localhost:3000/api/users/login",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, password })
        })
        const data = await response.json()
        if(response.ok){
            localStorage.setItem('token',data.token)
            window.location.href = 'expense.html'
        }
        else{
            alert(data.message)
        }

    })


})