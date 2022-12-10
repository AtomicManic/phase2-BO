const loginForm = document.getElementById("loginFrm");
const emailInpt = document.getElementById("emailInpt");
const passwordInpt = document.getElementById("passwordInpt");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInfo = {
    email: loginForm.email.value,
    password: loginForm.password.value,
  };
  try {
    if (userInfo.email || userInfo.password) {
      const data = await login(userInfo);
    } else {
      errorMsg.style.display = "block";
    }
  } catch (error) {
    
  }
});

emailInpt.addEventListener("focus", () => {
  errorMsg.style.display = "none";
});
passwordInpt.addEventListener("focus", () => {
  errorMsg.style.display = "none";
});

const login = async (userInfo) => {
  const response = await fetch("https://back-office-phase2.onrender.com/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
    redirect: "follow",
  }).then((res) => window.location.replace("/public/dashboard"));
  return response.json();
};
