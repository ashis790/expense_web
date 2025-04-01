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
        localStorage.removeItem('token')
        window.location.href = 'index.html'
    })
    async function cheack_premium(){
        const responce = await fetch('http://localhost:3000/api/users/cheak_premium',{
            method:'GET',
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                }
        })
        if(!responce.ok){
            throw new Error("Failed to check premium status")
        }
        const data = await responce.json()
        console.log("Premium Check Response:", data)
        return data.isPremiumMember
    }

    const is_premium_membor = await cheack_premium()
    console.log(is_premium_membor)
    const premium_btn = document.getElementById('buy_premium')
    premium_btn.style.display = 'none'
    if(!is_premium_membor){
            console.log(is_premium_membor)
            premium_btn.style.display = 'block'
    }

    premium_btn.addEventListener('click',async(e)=>{
        e.preventDefault()
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
            cashfree.checkout({ paymentSessionId: data.payment_session_id })
            .then(async result => {
                console.log("Payment Result:", result)
                console.log('payment sucess status ', result , result.status)
                if (result && result.status === "SUCCESS"){
                    try {
                        const updateResponse = await fetch("http://localhost:3000/orders/updatePremium", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                        });
                
                        if (!updateResponse.ok) {
                            throw new Error("Failed to update premium membership.");
                        }
                
                        alert("You are now a premium member!");
                        window.location.reload(); 
                    } catch (error) {
                        console.error("Error updating membership:", error);
                        alert("Payment successful, but failed to update membership. Contact support.");
                    }
                }
            

            })
            .catch(error => {
                console.error("Payment Failed:", error);
                alert("Payment Failed. Please try again.");
            });
            
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
        console.log(amount,description,category)
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

