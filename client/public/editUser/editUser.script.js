const logoutBtn = document.getElementById("logoutBtn");
const editEmployeeForm = document.getElementById('editEmployeeForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const vacationDaysInput = document.getElementById('vacationDaysInput');
const addressInput = document.getElementById('addressInput');


logoutBtn.addEventListener("click", async () => {
  await fetch("http://localhost:4000/api/auth/logout");
  window.location.replace("http://localhost:4000/index.html");
});

window.onload = async () => {
    const pathName = location.pathname;
    const pathStrSplit = pathName.split('/');
    const userId = pathStrSplit.pop();
    const {user} = await getUser(userId);
    insertToInputs(user);
}

editEmployeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pathName = location.pathname;
    const pathStrSplit = pathName.split('/');
    const userId = pathStrSplit.pop();
    const toUpdate = {
        id: userId,
        name: editEmployeeForm.name.value,
        email: editEmployeeForm.email.value,
        address: editEmployeeForm.address.value,
        vacation_days: editEmployeeForm.vacation_days.value
    }
    const result = await updateEmployee(toUpdate);
    window.location.replace('/public/dashboard');
})

const updateEmployee = async (updateInfo) => {
    const body = {
        name:updateInfo.name,
        email: updateInfo.email,
        address: updateInfo.address,
        vacation_days: updateInfo.vacation_days
    }
    
    const result = await fetch(`http://localhost:4000/api/user/update/${updateInfo.id}`,{
        method: 'put',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
    return result.json();
}

const insertToInputs = (user) => {
    nameInput.setAttribute('value', user.name);
    emailInput.setAttribute('value', user.email);
    addressInput.setAttribute('value', user.address);
    vacationDaysInput.setAttribute('value', user.vacation_days);
}

const getUser = async (id) => {
  const user = await fetch(`http://localhost:4000/api/user/id/${id}`,{
    method:"GET",
    headers:{
      "Content-Type": "application/json",
    }
  });
  return user.json();
}