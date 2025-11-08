document.addEventListener("DOMContentLoaded", () => {
  const storedUser = localStorage.getItem("loggedInUser");
  if (!storedUser) {
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(storedUser);
  const email = user.email;
  document.getElementById("userName").textContent = user.username;

  const totalBalanceEl = document.getElementById("totalBalance");
  const vehicleList = document.getElementById("vehicleList");
  const transactionTable = document.getElementById("transactionTable");

  // Load dashboard data from localStorage first
  let dashboardData = JSON.parse(localStorage.getItem("dashboardData"));
  if (!dashboardData) {
    fetch("data/dashboard.json")
      .then((res) => res.json())
      .then((data) => {
        dashboardData = data;
        localStorage.setItem("dashboardData", JSON.stringify(data));
        initDashboard();
      });
  } else {
    initDashboard();
  }

  function initDashboard() {
    const userData = dashboardData[email];
    if (!userData) {
      alert("No dashboard data found for this user!");
      return;
    }

    // Render Balance
    totalBalanceEl.textContent = userData.balance;

    // Render Vehicles
    vehicleList.innerHTML = "";
    userData.vehicles.forEach((v) => {
      const div = document.createElement("div");
      div.className =
        "bg-white p-6 rounded-xl shadow hover:shadow-xl transition";
      div.innerHTML = `
        <h4 class="text-xl font-semibold mb-2 text-blue-600">${v.number}</h4>
        <p class="text-gray-600">FASTag ID: ${v.tag}</p>
      `;
      vehicleList.appendChild(div);
    });

    // Render Transactions
    renderTransactions(userData.transactions);

    // Recharge Modal Elements
    const rechargeModal = document.getElementById("rechargeModal");
    const rechargeBtn = document.getElementById("rechargeBtn");
    const closeModal = document.getElementById("closeModal");
    const vehicleSelect = document.getElementById("vehicleSelect");
    const rechargeForm = document.getElementById("rechargeForm");

    rechargeBtn.addEventListener("click", () => {
      vehicleSelect.innerHTML = "";
      userData.vehicles.forEach((v) => {
        const option = document.createElement("option");
        option.value = v.number;
        option.textContent = `${v.number} (${v.tag})`;
        vehicleSelect.appendChild(option);
      });
      rechargeModal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () =>
      rechargeModal.classList.add("hidden")
    );

    rechargeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const vehicleNumber = vehicleSelect.value;
      const amount = parseInt(document.getElementById("rechargeAmount").value);

      // Mock payment success
      alert(`₹${amount} added to ${vehicleNumber} successfully!`);

      // Update balance & transactions
      userData.balance += amount;
      totalBalanceEl.textContent = userData.balance;

      const today = new Date().toISOString().split("T")[0];
      userData.transactions.unshift({
        date: today,
        vehicle: vehicleNumber,
        amount: amount,
        status: "Success",
      });

      renderTransactions(userData.transactions);

      rechargeForm.reset();
      rechargeModal.classList.add("hidden");

      // Save to localStorage
      dashboardData[email] = userData;
      localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    });

    // Card Number formatting: xxxx-xxxx-xxxx-xxxx
    const cardNumberInput = document.getElementById("cardNumber");
    cardNumberInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
      value = value.substring(0, 16);
      const parts = [];
      for (let i = 0; i < value.length; i += 4) {
        parts.push(value.substring(i, i + 4));
      }
      e.target.value = parts.join("-");
    });

    // Expiry formatting: MM/YY
    const cardExpiryInput = document.getElementById("cardExpiry");
    cardExpiryInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      value = value.substring(0, 4);
      if (value.length >= 3) {
        e.target.value = value.substring(0, 2) + "/" + value.substring(2);
      } else {
        e.target.value = value;
      }
    });

    const cardCVVInput = document.getElementById("cardCVV");
    cardCVVInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").substring(0, 3);
    });
  }

  function renderTransactions(transactions) {
    transactionTable.innerHTML = "";
    transactions.forEach((t) => {
      const tr = document.createElement("tr");
      tr.className = "border-b hover:bg-gray-50";
      const color =
        t.status === "Success"
          ? "text-green-600"
          : t.status === "Failed"
          ? "text-red-600"
          : "text-gray-600";
      tr.innerHTML = `
        <td class="px-6 py-3">${t.date}</td>
        <td class="px-6 py-3">${t.vehicle}</td>
        <td class="px-6 py-3">₹${t.amount}</td>
        <td class="px-6 py-3 font-semibold ${color}">${t.status}</td>
      `;
      transactionTable.appendChild(tr);
    });
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });
});
