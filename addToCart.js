

const CartIcon = document.querySelector('.addToCart');
const CartTab = document.querySelector('.cartTab');
const CloseBtn = document.querySelector('.closrBtn');

CartIcon.addEventListener('click', ()=> CartTab.classList.add('cartTab-active'));
CloseBtn.addEventListener('click', ()=> CartTab.classList.remove('cartTab-active'));
