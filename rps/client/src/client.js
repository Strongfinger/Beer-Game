
const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};

const updateStock = (data) => {
  const stock = document.querySelector('#stock')
  stock.innerHTML = data
}

const updateOrder = (data) =>{
  const order = document.querySelector('#order')
  order.innerHTML = data
}

const updateBacklog = (data) =>{
  const backlog = document.querySelector('#backlog')
  backlog.innerHTML = data
}

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
sock.on('stock info', updateStock);
sock.on('order info',updateOrder);
sock.on('backlog info',updateBacklog);
sock.on('week update',(msg)=>{
  const week = document.querySelector('#week')
  week.innerHTML = msg
})

document
  .querySelector('#input-form')
  .addEventListener('submit', onFormSubmitted);

addButtonListeners();
