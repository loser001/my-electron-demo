let counter = 0;

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    window.versions.send_msg(input.value, counter++)
    input.value = '';
  }
});
window.versions.socket_msg((data) => {
  const item = document.createElement('li');
  item.textContent = data;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
})