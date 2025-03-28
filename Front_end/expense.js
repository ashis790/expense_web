document.addEventListener('DOMContentLoaded',async()=>{
    
    const token = localStorage.getItem('token')
    if(!token){
        alert('please loging again ')
        window.location.href ="index.html"
        return
    }
    const expenceform = document.getElementById('expense-form')
    await fetchExpenses(token)
    const logoutBTN = document.getElementById('logout')
    logoutBTN.addEventListener('click',()=>{
        localStorage.removeItem(token)
        window.location.href = 'index.html'
    })
    const premium_btn = document.getElementById('buy_premium')
    premium_btn.addEventListener('click',async()=>{
        const token = localStorage.getItem('token')
        try{
            const response = await fetch("http://localhost:3000/orders/create",{
                method:'POST',
                headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                }
            })
            if(!response.ok){
                throw new Error("Failed to create order")
            }
            const data = await response.json()
            console.log("Order Created:", data)
            
            if (!data.payment_session_id){
                alert("Failed to get payment session ID. Try again.")
                return
            }
            const cashfree = Cashfree({ mode: "sandbox" })
            cashfree.checkout({ paymentSessionId: data.payment_session_id })
            .then(result => {
                alert("Payment Successful! ")
                window.location.reload()
            })
            .catch(error => {
                console.error("Payment Failed:", error);
                alert("Payment Failed. Please try again.");
            })

        }catch(err){
            console.error("Error:", err);
            alert("Something went wrong! samajhe ");
        }
    })

    expenceform.addEventListener('submit',async(event)=>{
        event.preventDefault()
        const amount = document.getElementById('amount').value
        const description = document.getElementById("description").value
        const category = document.getElementById("category").value
        try{
            const response = await fetch('http://localhost:3000/api/expenses/add',{
                method:"POST",
                headers: { "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                 },
                body: JSON.stringify({ amount, description, category })
    
            })
            if (!response.ok) {
                throw new Error("Failed to add expense samajhe");
            }
            const data = await response.json();
            alert("Expense added successfully!")
            expenceform.reset()
            await fetchExpenses(token)
        }catch(err){
            alert(err.message)
    
 }
 })
 }
)
async function fetchExpenses(token){
    try{
        const response = await fetch('http://localhost:3000/api/expenses/showAll', {
            headers: { "Authorization": `Bearer ${token}` }
        })
        if (!response.ok) {
            throw new Error("Failed to fetch expenses")
        }
        const { expenses } = await response.json()
        console.log(expenses)
        const expenceList = document.getElementById('expense-list')
        expenceList.innerHTML = ""
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.textContent = `${expense.amount} - ${expense.description} (${expense.category})`;
            expenceList.appendChild(li);
        })

    }catch(err){
        console.error("Error fetching expenses:", err)
    }
}

