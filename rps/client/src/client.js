
const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#input');
  const text = input.value;
  input.value = '';

  sock.emit('input', text);
};

const addButtonListeners = () => {
  ['rock', 'paper', 'scissors'].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
      sock.emit('turn', id);
    });
  });
};

writeEvent('Welcome to Beer Game');

const sock = io();
sock.on('message', writeEvent);

document
  .querySelector('#input-form')
  .addEventListener('submit', onFormSubmitted);

addButtonListeners();
