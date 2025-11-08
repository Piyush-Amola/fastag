document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  fetch("data/login.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load login data file");
      }
      return response.json();
    })
    .then((users) => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Save user data in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } else {
        errorMsg.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert("Error loading login data!");
    });
});

// Password toggle functionality
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  togglePassword.textContent = type === "password" ? "👁️" : "🙈";
});
