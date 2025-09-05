document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if(form){
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("✅ Thank you! Your message has been sent.");
      form.reset();
    });
  }
});
