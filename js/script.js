document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
  // Fetch all data from JSON
  fetch("data/data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch JSON data");
      return res.json();
    })
    .then((data) => {
      /* =============================
         1️⃣ FASTag Providers Section
      ============================== */
      const providerList = document.querySelector("#providerList");
      if (providerList && data.providers) {
        providerList.innerHTML = data.providers
          .map(
            (p) => `
          <div class="bg-white p-6 rounded-xl shadow hover:shadow-xl transition flex flex-col items-center">
            <img src="${p.logo}" alt="${p.name}" class="w-20 h-20 object-contain mb-3" />
            <h4 class="font-semibold text-center">${p.name}</h4>
          </div>`
          )
          .join("");
      }

      /* =============================
         2️⃣ Testimonials Section
      ============================== */
      const testimonialList = document.querySelector("#testimonialList");
      if (testimonialList && data.testimonials) {
        testimonialList.innerHTML = data.testimonials
          .map(
            (t) => `
          <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p class="italic text-gray-700 mb-4">"${t.quote}"</p>
            <h5 class="font-semibold text-blue-600">– ${t.user}</h5>
          </div>`
          )
          .join("");
      }

      /* =============================
         3️⃣ About Us Section
      ============================== */
      const aboutText = document.querySelector("#aboutText");
      const aboutImage = document.querySelector("#aboutImage");

      if (aboutText && data.about) {
        aboutText.innerHTML = `
          <h2 class="text-3xl font-bold mb-6">${data.about.title}</h2>
          <p class="mb-4 text-gray-700">${data.about.subtitle}</p>
          <p class="mb-4 text-gray-700">${data.about.paragraph1}</p>
          <p class="text-gray-700">${data.about.paragraph2}</p>
        `;
      }

      if (aboutImage && data.about?.image) {
        aboutImage.src = data.about.image;
        aboutImage.alt = data.about.title || "About FASTag Recharge";
      }

      /* =============================
         4️⃣ FAQs Section
      ============================== */
      const faqList = document.querySelector("#faqList");
      if (faqList && data.faqs) {
        faqList.innerHTML = data.faqs
          .map(
            (f) => `
          <div class="bg-white shadow rounded-lg">
            <button 
              class="faq-question w-full text-left px-6 py-4 flex justify-between items-center font-medium text-gray-800 focus:outline-none"
              aria-expanded="false"
            >
              ${f.question}
              <span class="icon text-xl font-bold">+</span>
            </button>
            <div class="faq-answer px-6 pb-4 hidden text-gray-600">${f.answer}</div>
          </div>`
          )
          .join("");

        // FAQ toggle behavior
        document.querySelectorAll(".faq-question").forEach((btn) => {
          btn.addEventListener("click", () => {
            const answer = btn.nextElementSibling;
            const icon = btn.querySelector(".icon");
            const isVisible = !answer.classList.contains("hidden");

            // Close all others
            document
              .querySelectorAll(".faq-answer")
              .forEach((a) => a.classList.add("hidden"));
            document
              .querySelectorAll(".faq-question .icon")
              .forEach((i) => (i.textContent = "+"));

            // Toggle selected one
            if (!isVisible) {
              answer.classList.remove("hidden");
              icon.textContent = "−";
            }
          });
        });
      }
    })
    .catch((error) => console.error("❌ Error loading JSON data:", error));
});
