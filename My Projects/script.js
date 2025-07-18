// Simple form validation
document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (name === "" || email === "" || message === "") {
      alert("Please fill out all fields.");
    } else {
      alert("Message sent successfully!");
      // Reset the form
      document.getElementById("contact-form").reset();
    }
  });
