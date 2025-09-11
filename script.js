  const btn = document.getElementById('feedbackBtn');
  const form = document.getElementById('feedbackForm');
  const close = document.getElementById('closeFeedback');
  const submit = document.getElementById('submitFeedback');
  const text = document.getElementById('feedbackText');

  btn.onclick = () => form.style.display = 'flex';
  close.onclick = () => form.style.display = 'none';
  submit.onclick = () => {
    if(text.value.trim() === '') return alert('Write something!');
    alert('Thanks for your feedback! 💌');
    text.value = '';
    form.style.display = 'none';
  }
  form.onclick = e => { if(e.target === form) form.style.display = 'none'; }

