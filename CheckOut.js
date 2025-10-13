// Helper function to format a number into Indian Rupee currency string
function formatCurrency(amount) {
    // Uses 'en-IN' for Indian currency format (e.g., Lakhs/Thousands)
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Helper function to parse MRP string to number
function parseMRP(mrpString) {
    // Remove ₹ symbol and commas
    let numStr = mrpString.replace('₹', '').replace(/,/g, '');
    // Handle 'k' for thousands
    if (numStr.includes('k')) {
        numStr = numStr.replace('k', '');
        return parseFloat(numStr) * 1000;
    }
    return parseFloat(numStr);
}

// Global cart array for checkout
let checkoutCart = [];

// Function to load cart from localStorage
function loadCheckoutCart() {
    const stored = localStorage.getItem('cart');
    checkoutCart = stored ? JSON.parse(stored) : [];
}

// Function to create HTML for a checkout item container
function createItemContainerHTML(item) {
    const itemTotal = formatCurrency(item.basePriceNum * item.quantity);

    return `
        <div class="itemContainer" data-id="${item.id}">
            <div class="itemImg">
                <img src="${item.image}" alt="${item.name} image">
            </div>
            <div class="itemInfo">
                <h3 class="itemName">${item.name}</h3>
                <div class="itemPrice">
                    <p class="productPrice">${item.price}</p>
                    <p class="productMRP">${item.mrp}</p>
                    <p class="productDiscount">${item.discount}</p>
                </div>
            </div>
            <button class="quantityBtn">
                Qty:
                <select class="quantitySelect" data-id="${item.id}">
                    <option value="1" ${item.quantity === 1 ? 'selected' : ''}>1</option>
                    <option value="2" ${item.quantity === 2 ? 'selected' : ''}>2</option>
                    <option value="3" ${item.quantity === 3 ? 'selected' : ''}>3</option>
                    <option value="4" ${item.quantity === 4 ? 'selected' : ''}>4</option>
                </select>
            </button>
        </div>
    `;
}

// Function to render all item containers in #orderItems
function renderOrderItems() {
    const orderItems = document.getElementById('orderItems');
    if (!orderItems) return;

    if (checkoutCart.length === 0) {
        orderItems.innerHTML = '<p class="text-center text-gray-500">No items in cart.</p>';
        return;
    }

    const itemsHTML = checkoutCart.map(item => createItemContainerHTML(item)).join('');
    orderItems.innerHTML = itemsHTML;

    // Attach event listeners to quantity selects
    const selects = orderItems.querySelectorAll('.quantitySelect');
    selects.forEach(select => {
        select.addEventListener('change', handleQuantityChange);
    });
}

// Function to calculate and update totals
function calculateTotals() {
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('total');

    if (!subtotalEl || !discountEl || !totalEl) return;

    if (checkoutCart.length === 0) {
        subtotalEl.textContent = formatCurrency(0);
        discountEl.textContent = formatCurrency(0);
        totalEl.textContent = formatCurrency(50 + 10); // Fixed shipping and packaging
        return;
    }

    // Subtotal: sum of (basePriceNum * quantity)
    const subtotal = checkoutCart.reduce((sum, item) => sum + (item.basePriceNum * item.quantity), 0);

    // You Save: sum of ((parseMRP(item.mrp) - item.basePriceNum) * quantity)
    const youSave = checkoutCart.reduce((sum, item) => sum + ((parseMRP(item.mrp) - item.basePriceNum) * item.quantity), 0);

    // Order Total: Subtotal + Shipping (50) + Secure Packaging (10)
    const orderTotal = subtotal + 50 + 10;

    subtotalEl.textContent = formatCurrency(subtotal);
    discountEl.textContent = formatCurrency(youSave);
    totalEl.textContent = formatCurrency(orderTotal);

    // Store orderTotal in localStorage for payment page
    localStorage.setItem('orderTotal', orderTotal);
}

// Function to handle quantity select change
function handleQuantityChange(event) {
    const select = event.target;
    const productId = parseInt(select.dataset.id);
    const newQuantity = parseInt(select.value);

    const itemIndex = checkoutCart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    checkoutCart[itemIndex].quantity = newQuantity;

    // Re-render items and recalculate totals
    renderOrderItems();
    calculateTotals();

    // Save updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(checkoutCart));
}

// Main function to initialize checkout
async function initCheckout() {
    // Load cart
    loadCheckoutCart();

    // Fetch products.json if needed (for now, cart has all details)
    // const response = await fetch('products.json');
    // const productsData = await response.json();

    // Render order items
    renderOrderItems();

    // Calculate and display totals
    calculateTotals();
}

// Run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initCheckout);

// Handle checkout button click
const checkoutBtn = document.querySelector('.OrderBtn');
checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.getElementById('checkoutForm');
    if (form.checkValidity()) {
        window.location.href = 'paymentPage.html';
    } else {
        form.reportValidity();
    }
});
