const logoutBtn = document.getElementById("logoutBtn");
const employeeList = document.getElementById('employeesList');
let removeEmployeeBtns;
let editEmployeeBtns;
let askVacationBtns;

logoutBtn.addEventListener("click", async () => {
  await fetch("http://localhost:4000/api/auth/logout");
  window.location.replace("http://localhost:4000/index.html");
});

window.onload = async () => {
    const {employees} = await getAllEmployees();
    renderEmployees(employees);

    removeEmployeeBtns = document.getElementsByClassName('removeEmployeeBtn');
    for(const element of removeEmployeeBtns){
        
        element.addEventListener('click', handleRemove)
    }

    editEmployeeBtns = document.getElementsByClassName('editEmployeeBtn');
    for(const element of editEmployeeBtns){
        element.addEventListener('click', handleEdit);
    }

    askVacationBtns = document.getElementsByClassName('askVacationBtn');
    for(const element of askVacationBtns){
        element.addEventListener('click', goToVacationPage)
    }
}

const goToVacationPage = (e) => {
    const employeeId = e.target.parentElement.parentElement.getAttribute('key');
    window.location.replace(`http://localhost:4000/public/dashboard/vacation/${employeeId}`);
}

const handleEdit = async (e) => {
    e.preventDefault();
    const employeeId = e.target.parentElement.parentElement.getAttribute('key');
    window.location.href = window.location.origin+`/public/dashboard/edit-employee/${employeeId}`;
}


const handleRemove = async (e) => {
    e.preventDefault();
    const employeeId = e.target.parentElement.parentElement.getAttribute('key');
    const result = await removeEmployee(employeeId);
    const {employees} = await getAllEmployees();
    employeeList.innerHTML='';
    renderEmployees(employees);
}


const getAllEmployees = async () => {
    const employees = await fetch('http://localhost:4000/api/user/list',{
        method: 'GET',
        headers: {
        "Content-Type": "application/json",
        },
    })
    return employees.json();
}

const removeEmployee = async (employeeId) => {
    const result = await fetch(`http://localhost:4000/api/user/delete/${employeeId}`,{
        method:'delete',
        headers:{
            "Content-Type": "application/json",
        }
    })
    return result.json();
}

const renderEmployees = (employees) => {
    for(const employee of employees){
        const employeeElement = document.createElement('div');
        employeeElement.classList.add('employeeItem');
        employeeElement.setAttribute('key', employee._id);
        employeeElement.innerHTML = `
            <span class="txt">Name:</span>
            <span class="employeeName">${employee.name}</span>
            <span class="txt">Email:</span>
            <span class="employeeEmail">${employee.email}</span>
            <div class="options"> 
                <button class="editEmployeeBtn">Edit</button>
                <button class="removeEmployeeBtn">Remove</button>
                <button class="askVacationBtn">Vacation</button>
            </div>
        `
        employeeList.append(employeeElement);
    }
}