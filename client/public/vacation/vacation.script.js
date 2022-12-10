const vacationForm = document.getElementById("addVacationForm");
const idInput = document.getElementById("employee_id");
const startDateInput = document.getElementById("start_date");
const endDateInput = document.getElementById("end_date");
const errMsg = document.getElementById("errMsg");
const validMsg = document.getElementById("validMsg");
const declinedMsg = document.getElementById("declinedMsg");
const vacationsContainer = document.getElementById('vacationsContainer');
let cancelVacationBtn;
const employeeInfo = document.getElementById('employeeInfo');

window.onload = async () => {
    const tokenInfo = await getTokenInfo();
    const pathName = location.pathname;
    const pathStrSplit = pathName.split('/');
    const userId = pathStrSplit.pop();
    const {user} = await getEmployeeInfo(userId)
    renderUserInfo(user);
    if(tokenInfo.role === 'manager'){
        const vacations = await getEmployeeVacations(userId);
        renderVacations(vacations.result ,userId);
    }
    
    cancelVacationBtn = document.getElementsByClassName('cancelVacationBtn');
    for(const element of cancelVacationBtn){
        element.addEventListener('click', async (e) => {
        const vacationId = e.target.parentElement.getAttribute('key');
        const result = await fetch(`https://back-office-phase2.onrender.com/api/vacation/${vacationId}`, {
            method: 'put',
            headers:{
                "Content-Type": "application/json",
            }
        })
        const pathName = location.pathname;
        const pathStrSplit = pathName.split('/');
        const userId = pathStrSplit.pop();
        const vacations = await getEmployeeVacations(userId);
        vacationsContainer.innerHTML="";
        renderVacations(vacations.result ,userId);
    })
    }
    
}

const renderUserInfo = (user) => {
    employeeInfo.innerHTML=`Name:${user.name}, VacationdDayesLeft:${user.vacation_days}`
}

const getEmployeeInfo = async (id)=>{
  const user = await fetch(`https://back-office-phase2.onrender.com/api/user/id/${id}`,{
    method:"GET",
    headers:{
      "Content-Type": "application/json",
    }
  });
  return user.json();
}

const getTokenInfo = async (req,res) => {
  const tokenInfo = await fetch("https://back-office-phase2.onrender.com/api/auth/token-info",{
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  })
  return tokenInfo.json();
}

const renderVacations = async (vacations, userId) => {
    for(const v of vacations){
        const vacationItem = document.createElement('div');
        vacationItem.classList.add('vacationItem');
        vacationItem.setAttribute('key', v._id);
        vacationItem.innerHTML =`
            <span class="txt">From:</span>
            <span class="startDate">${v.start_date}</span>
            <span class="txt">To:</span>
            <span class="endDate">${v.end_date}</span>
            <span class="status ${v.status}">${v.status}</span>
            <button class="cancelVacationBtn">X Cancel</button>`;
        vacationsContainer.append(vacationItem);
    }
}


const getEmployeeVacations = async (employeeId) =>{
  const vacations = await fetch(`https://back-office-phase2.onrender.com/api/vacation/employee/${employeeId}`,{
    method: 'GET',
    headers:{
      "Content-Type": "application/json",
    }
  });
  return vacations.json();
}

vacationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newVacation = {
        start_date: vacationForm.start_date.value,
        end_date: vacationForm.end_date.value
    };

        if (!(newVacation.end_date && newVacation.start_date)) {
            e.preventDefault();
            errMsg.style.display = "block";
        } else {
            const data = await addVacation(newVacation);

            if (data.newVacation.status === "approved") {
                validMsg.style.display = "block";
            } else {
                declinedMsg.style.display = "block";
            }
        }
        const pathName = location.pathname;
        const pathStrSplit = pathName.split('/');
        const userId = pathStrSplit.pop();
        const vacations = await getEmployeeVacations(userId);
        vacationsContainer.innerHTML="";
        renderVacations(vacations.result ,userId);
    });



startDateInput.addEventListener("focus", () => {
    errMsg.style.display = "none";
    validMsg.style.display = "none";
});

endDateInput.addEventListener("focus", () => {
    errMsg.style.display = "none";
    validMsg.style.display = "none";
});


const addVacation = async (newVacation) => {

    const pathName = location.pathname;
    const pathStrSplit = pathName.split('/');
    const userId = pathStrSplit.pop();
    const body = {
        employee_id: userId,
        start_date: newVacation.start_date,
        end_date: newVacation.end_date
    }

    const response  = await fetch(
        `https://back-office-phase2.onrender.com/api/vacation` , {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });
    return response.json();
};



