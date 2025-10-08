// Global array to store the items currently in the shopping list
let cart = [];

// Cache the product data once it's fetched, for easy lookup
let allProductsData = []; 

// --- 1. Helper Functions ---

// Helper function to format a number into Indian Rupee currency string
function formatCurrency(amount) {
    // Uses 'en-IN' for Indian currency format (e.g., Lakhs/Thousands)
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Function to update the number on the nav bar cart icon (NEW)
function updateCartNavCount() {
    const cartNavValue = document.querySelector('.addToCart .cartValue');
    if (!cartNavValue) return;

    // Calculate the total number of items (sum of quantities) in the cart
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update the button's text content
    cartNavValue.textContent = totalItems;
}

function createProductCard(product) {
    // Create rating stars HTML
    const ratingStars = Array(product.rating).fill(
        '<i class="fa-solid fa-star text-yellow-500 text-sm"></i>'
    ).join('');

    // Calculate initial total for 1 quantity
    const initialTotal = formatCurrency(product.basePriceNum * 1);

    // Use only the first image from the 'images' array
    const mainImageSrc = product.images[0] || "https://placehold.co/600x400/cccccc/000000?text=No+Image";


    return `
                <div class="cards" data-product-id="${product.id}">
                    <article class="information card bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full" 
                             data-base-price="${product.basePriceNum}">
                        
                        <span class="category text-xs font-semibold uppercase text-indigo-600 mb-2">${product.category}</span>
                        
                        <div class="imageContainer mb-4 h-40 rounded-lg overflow-hidden">
                            <img class="productImage w-full h-full object-cover" 
                                 src="${mainImageSrc}" 
                                 alt="${product.name} Image"
                            >
                        </div>
                        
                        <h2 class="productName text-xl font-bold text-gray-900 mb-2">${product.name}</h2>
                        
                        <div class="productRatung mb-3">
                            ${ratingStars}
                        </div>
                        
                        <p class="productDescription text-gray-600 text-sm mb-4 flex-grow">${product.description}</p>
                        
                        <div class="productPriceElement flex items-center space-x-3 mb-4">
                            <p class="productPrice text-2xl font-extrabold text-green-600">${product.price}</p>
                            <p class="productMRP text-sm productMRP line-through text-gray-400">${product.mrp}</p>
                            <p class="productDiscount text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">${product.discount}</p>
                        </div>
                        
                        <div class="productQuantityElement flex justify-between items-center mb-5 border-t pt-4">
                            <label for="quantity" class="text-gray-700 font-medium">Quantity:</label>
                            <div class="stockElement flex items-center space-x-3">
                                <button class="cartDecrement bg-gray-200 text-gray-800 w-8 h-8 rounded-full font-bold transition-colors hover:bg-gray-300">-</button>
                                <p class="productQuantity text-lg font-semibold w-4 text-center">1</p>
                                <button class="cartlncrement bg-indigo-600 text-white w-8 h-8 rounded-full font-bold transition-colors hover:bg-indigo-700">+</button>
                            </div>
                        </div>

                        <div class="totalPriceElement flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-5">
                            <span class="text-base font-semibold text-gray-700">Calculated Total:</span>
                            <span class="totalPriceDisplay text-2xl font-extrabold text-blue-800 ml-2">${initialTotal}</span>
                        </div>
                        
                        <button class="addToCartBtn w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold uppercase tracking-wider transition-all hover:bg-indigo-700 shadow-md">Add to Cart</button>
                    </article>
                </div>
            `;
}

// --- 2. Card Rendering and Quantity Logic (Unchanged) ---

function renderCards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    const allCardsHTML = data.map(product => createProductCard(product)).join('');
    container.innerHTML = allCardsHTML;
}


function handleQuantityChange(event) {
    if (!event.target.matches('.cartlncrement') && !event.target.matches('.cartDecrement')) {
        return;
    }

    const button = event.target;
    const stockElement = button.closest('.stockElement');
    const quantityDisplay = stockElement.querySelector('.productQuantity');
    const cardArticle = button.closest('.card');
    const totalPriceDisplay = cardArticle.querySelector('.totalPriceDisplay');

    let currentQuantity = parseInt(quantityDisplay.textContent, 10);

    if (isNaN(currentQuantity)) { currentQuantity = 1; }

    if (button.classList.contains('cartlncrement')) {
        currentQuantity += 1;
    } else if (button.classList.contains('cartDecrement')) {
        currentQuantity = Math.max(1, currentQuantity - 1);
    }

    quantityDisplay.textContent = currentQuantity;

    const basePriceNum = parseFloat(cardArticle.dataset.basePrice);

    if (isNaN(basePriceNum)) {
        console.error("Base price data attribute missing or invalid for card.");
        return;
    }

    const newTotal = currentQuantity * basePriceNum;
    const formattedTotal = formatCurrency(newTotal);
    totalPriceDisplay.textContent = formattedTotal;

    console.log(`Updated "${cardArticle.querySelector('.productName').textContent}" - Qty: ${currentQuantity}, Total: ${formattedTotal}`);
}

// --- 3. Cart Logic ---

function createCartItemHTML(item) {
    const itemTotal = formatCurrency(item.basePriceNum * item.quantity);

    return `
        <div class="item" data-id="${item.id}">
            <div class="imageCont">
                <img src="${item.image}" alt="${item.name} image">
            </div>
            <div class="itemInfo">
                <h3>${item.name}</h3>
                <h3 class="itemPrice">
                    <p class="productPrice">${item.price}</p>
                    <p class="productMRP">${item.mrp}</p>
                    <p class="productDiscount">${item.discount}</p>
                </h3>
                <p class="text-xs text-gray-700 mt-1">Item Total: <span class="font-bold">${itemTotal}</span></p>
            </div>
            <div class="quantityBtns">
                <button class="quantityBtn cart-decrease" data-id="${item.id}">-</button>
                <h3 class="quantityValue">${item.quantity}</h3>
                <button class="quantityBtn cart-increase" data-id="${item.id}">+</button>
            </div>
        </div>
    `;
}

function renderCart() {
    const cartList = document.querySelector('.cartList');
    const totalPriceDisplay = document.querySelector('.totaPrice'); // Target the grand total element
    
    if (!cartList || !totalPriceDisplay) return;

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-center text-gray-500 pt-5">Your shopping list is empty.</p>';
        totalPriceDisplay.textContent = formatCurrency(0);
        
        // Update the nav bar count to 0
        updateCartNavCount(); 
        return;
    }

    // 1. Calculate Grand Total
    const grandTotal = cart.reduce((sum, item) => sum + (item.basePriceNum * item.quantity), 0);
    totalPriceDisplay.textContent = formatCurrency(grandTotal);

    // 2. Render Cart Items
    const cartItemsHTML = cart.map(item => createCartItemHTML(item)).join('');
    cartList.innerHTML = cartItemsHTML;
    
    // 3. Update the Nav Bar Count
    updateCartNavCount(); 
}

function addToCart(event) {
    if (!event.target.matches('.addToCartBtn')) {
        return;
    }

    const productCard = event.target.closest('.cards');
    const productId = parseInt(productCard.dataset.productId); 
    
    const quantityElement = productCard.querySelector('.productQuantity');
    const quantityToAdd = parseInt(quantityElement.textContent, 10);
    
    const productDetails = allProductsData.find(p => p.id === productId);

    if (!productDetails) {
        console.error(`Product details for ID ${productId} not found.`);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantityToAdd;
    } else {
        const newItem = {
            id: productId,
            name: productDetails.name,
            price: productDetails.price,
            mrp: productDetails.mrp,
            discount: productDetails.discount,
            image: productDetails.images[0] || "https://placehold.co/600x400/cccccc/000000?text=No+Image",
            basePriceNum: productDetails.basePriceNum,
            quantity: quantityToAdd
        };
        cart.push(newItem);
    }
    
    console.log(`Added ${quantityToAdd} x ${productDetails.name} to cart.`);
    renderCart(); // This calls renderCart, which now updates the nav bar count.
}

function handleCartQuantityChange(event) {
    if (!event.target.matches('.cart-increase') && !event.target.matches('.cart-decrease')) {
        return;
    }

    const button = event.target;
    const productId = parseInt(button.dataset.id); 
    let itemIndex = cart.findIndex(i => i.id === productId);

    if (itemIndex === -1) return;

    if (button.classList.contains('cart-increase')) {
        cart[itemIndex].quantity += 1;
    } else if (button.classList.contains('cart-decrease')) {
        cart[itemIndex].quantity -= 1;
    }

    // Remove item if quantity drops to 0 or less
    if (cart[itemIndex] && cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1); 
    }
    
    // Rerender the entire cart to reflect changes in quantity, item total, and grand total, and nav count
    renderCart();
}

// --- 4. Asynchronous Data Fetch and Execution ---

async function fetchProductsAndRender() {
    const containerId = 'cardValue';
    
    try {
        const response = await fetch('products.json'); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const productsData = await response.json(); 
        
        // Store the fetched data globally for cart lookup
        allProductsData = productsData;
        
        // Render the product cards
        renderCards(productsData, containerId);

        // Render the empty cart initially (updates grand total and nav count)
        renderCart(); 

        // Attach event listeners
        const productContainer = document.getElementById(containerId);
        const cartTab = document.querySelector('.cartTab'); 

        if (productContainer) {
            productContainer.addEventListener('click', handleQuantityChange);
            productContainer.addEventListener('click', addToCart); 
        }

        if (cartTab) {
            cartTab.addEventListener('click', handleCartQuantityChange); 
        }
        

    } catch (error) {
        console.error('Could not fetch products data:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p class="text-red-600 text-center p-10">Error loading products. Please ensure the "products.json" file is present and you are running on a local server.</p>';
        }
    }
}

// Start the process once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchProductsAndRender);