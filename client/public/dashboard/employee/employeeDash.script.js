const logoutBtn = document.getElementById("logoutBtn");
const name = document.getElementById('nameInfo');
const address = document.getElementById('addressInfo');
const birthday = document.getElementById('birthdayInfo');
const vacationInfo = document.getElementById('vacationInfo');
const vacationList = document.getElementById('vacations'); 
const changeAddressBtn = document.getElementById('changeAddressBtn');
const formContainer = document.getElementById('formContainer');
const closeBtn = document.getElementById('closeBtn');
const addressForm = document.getElementById('addressForm');
const addressInput = document.getElementById('addressInput');
const askVacationBtn = document.getElementById('askVacationBtn');


askVacationBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const tokenInfo = await getTokenInfo();
  window.location.replace(`http://localhost:4000/public/dashboard/vacation/${tokenInfo.id}`)
})

logoutBtn.addEventListener("click", async () => {
  await fetch("http://localhost:4000/api/auth/logout");
  window.location.replace("http://localhost:4000/index.html");
});

changeAddressBtn.addEventListener('click', ()=>{
  if(formContainer.classList.contains('hide')){
    formContainer.classList.remove('hide');
  }
  formContainer.classList.add('show');
})

closeBtn.addEventListener('click', ()=>{
  if(formContainer.classList.contains('show')){
    formContainer.classList.remove('show');
  }
  formContainer.classList.add('hide');
})

addressForm.addEventListener('submit', async (e) =>{
  e.preventDefault();
  const addressText = addressForm.address.value;
  const tokenInfo = await getTokenInfo();
  const response = await updateAddress(addressText, tokenInfo);
  address.innerHTML = response.user.address;
  addressInput.value="";
})

const updateAddress = async (address, tokenInfo) => {
  const response = await fetch(`http://localhost:4000/api/user/update/${tokenInfo.id}`,{
    method:'put',
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({address})
  });
  return response.json();
}

window.onload = async () => {
  const tokenInfo = await getTokenInfo();
  const {user} = await getEmployeeInfo(tokenInfo.id);
  renderEmployeeInfo(user);
  const {result} = await getEmployeeVacations(user._id);
  renderVacations(result);
}



const getTokenInfo = async (req,res) => {
  const tokenInfo = await fetch("http://localhost:4000/api/auth/token-info",{
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  })
  return tokenInfo.json();
}

const getEmployeeInfo = async (id)=>{
  const user = await fetch(`http://localhost:4000/api/user/id/${id}`,{
    method:"GET",
    headers:{
      "Content-Type": "application/json",
    }
  });
  return user.json();
}

const getEmployeeVacations = async (employeeId) =>{
  const vacations = await fetch(`http://localhost:4000/api/vacation/employee/${employeeId}`,{
    method: 'GET',
    headers:{
      "Content-Type": "application/json",
    }
  });
  return vacations.json();
}

const renderEmployeeInfo = (employee) =>{
  let nameTxt = document.createTextNode(employee.name);
  name.appendChild(nameTxt);
  let addressTxt = document.createTextNode(employee.address);
  address.appendChild(addressTxt);
  let birthdayTxt = document.createTextNode(employee.birthday);
  birthday.appendChild(birthdayTxt);
  let vacationTxt = document.createTextNode(parseFloat(employee.vacation_days).toFixed(1));
  vacationInfo.appendChild(vacationTxt);
}

const renderVacations = (vacations) => {
  for(const v of vacations){
   
    const vacationItem = document.createElement('div');
    vacationItem.classList.add('vacationItem');
    vacationItem.innerHTML = `
          <span class="txt">From:</span>
          <span class="startDate">${v.start_date}</span>
          <span class="txt">To:</span>
          <span class="endDate">${v.end_date}</span>
          <span class="status ${v.status}">${v.status}</span>`;
    vacationList.append(vacationItem);
  }
}