// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Global variables
let orderItems = [];

// Load order items from localStorage
function loadOrderItems() {
    const isOrderConfirmed = localStorage.getItem('orderConfirmed');
    if (!isOrderConfirmed) {
        // If order not confirmed, redirect to home or show message
        showNoOrderMessage();
        return;
    }

    const stored = localStorage.getItem('cart');
    orderItems = stored ? JSON.parse(stored) : [];
}

// Calculate delivery date (3-5 business days from now)
function calculateDeliveryDate() {
    const today = new Date();
    const deliveryDays = Math.floor(Math.random() * 3) + 3; // 3-5 days
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    return deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Render order items
function renderOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;

    if (orderItems.length === 0) {
        orderItemsContainer.innerHTML = '<p class="no-orders">No orders found. <a href="Products.html">Start shopping</a></p>';
        return;
    }

    const itemsHTML = orderItems.map(item => `
        <div class="orderItem">
            <img src="${item.image}" alt="${item.name}" class="orderItemImage">
            <div class="orderItemDetails">
                <div class="orderItemName">${item.name}</div>
                <div class="orderItemPrice">
                    <span class="currentPrice">${item.price}</span>
                    <span class="originalPrice">${item.mrp}</span>
                    <span class="discount">${item.discount}</span>
                </div>
            </div>
            <div class="orderItemQuantity">Qty: ${item.quantity}</div>
        </div>
    `).join('');

    orderItemsContainer.innerHTML = itemsHTML;
}

// Update delivery date
function updateDeliveryDate() {
    const deliveryDateElement = document.getElementById('deliveryDate');
    if (deliveryDateElement) {
        deliveryDateElement.textContent = calculateDeliveryDate();
    }
}

// Calculate and update order summary
function updateOrderSummary() {
    if (orderItems.length === 0) {
        // Set default values for empty cart
        document.getElementById('summarySubtotal').textContent = formatCurrency(0);
        document.getElementById('summaryDiscount').textContent = formatCurrency(0);
        document.getElementById('summaryTotal').textContent = formatCurrency(60); // Shipping + Packaging
        return;
    }

    // Calculate subtotal
    const subtotal = orderItems.reduce((sum, item) => sum + (item.basePriceNum * item.quantity), 0);

    // Calculate total discount
    const totalDiscount = orderItems.reduce((sum, item) => sum + ((item.mrpNum - item.basePriceNum) * item.quantity), 0);

    // Calculate order total
    const orderTotal = subtotal - totalDiscount + 50 + 10; // + shipping + packaging

    // Update DOM elements
    document.getElementById('summarySubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summaryDiscount').textContent = `-${formatCurrency(totalDiscount)}`;
    document.getElementById('summaryTotal').textContent = formatCurrency(orderTotal);
}

// Generate timeline updates
function generateTimelineUpdates() {
    const timelineContainer = document.getElementById('timelineUpdates');
    if (!timelineContainer) return;

    const updates = [
        {
            icon: '📦',
            time: '2 hours ago',
            text: 'Order placed successfully'
        },
        {
            icon: '🏭',
            time: '1 hour ago',
            text: 'Order processing started'
        },
        {
            icon: '🚚',
            time: '30 minutes ago',
            text: 'Package shipped from warehouse'
        },
        {
            icon: '📍',
            time: '10 minutes ago',
            text: 'Package out for delivery'
        }
    ];

    const updatesHTML = updates.map(update => `
        <div class="timelineUpdate">
            <div class="updateIcon">${update.icon}</div>
            <div class="updateContent">
                <div class="updateTime">${update.time}</div>
                <div class="updateText">${update.text}</div>
            </div>
        </div>
    `).join('');

    timelineContainer.innerHTML = updatesHTML;
}

// Update tracking progress
function updateTrackingProgress() {
    const progressBar = document.getElementById('progressBar');
    const steps = document.querySelectorAll('.step');

    // Simulate progress (75% complete - 3 out of 4 steps)
    if (progressBar) {
        progressBar.style.width = '75%';
    }

    // Activate steps
    steps.forEach((step, index) => {
        if (index < 3) { // First 3 steps active
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Handle order cancellation
function handleOrderCancellation() {
    const cancelBtn = document.getElementById('cancelOrderBtn');
    const modal = document.getElementById('cancellationModal');
    const confirmCancel = document.getElementById('confirmCancel');
    const closeModal = document.getElementById('closeModal');

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (confirmCancel) {
        confirmCancel.addEventListener('click', () => {
            // Clear cart
            localStorage.removeItem('cart');
            orderItems = [];

            // Update UI
            renderOrderItems();
            updateOrderSummary();

            // Close modal
            modal.style.display = 'none';

            // Show success message
            alert('Order cancelled successfully. Your cart has been cleared.');
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Show message when no order is confirmed
function showNoOrderMessage() {
    const mainContent = document.querySelector('.ordersContent');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="no-order-message" style="
                text-align: center;
                padding: 50px 20px;
                background: linear-gradient(to right, #121826, #064189);
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                color: #ffffff;
            ">
                <h2 style="color: #4ca644; margin-bottom: 20px;">No Active Orders</h2>
                <p style="font-size: 1.1rem; margin-bottom: 30px; color: #cccccc;">
                    You haven't placed any orders yet. Complete your purchase to view order details.
                </p>
                <a href="Products.html" style="
                    background-color: #4ca644;
                    color: white;
                    padding: 12px 30px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 600;
                    display: inline-block;
                    transition: background-color 0.3s ease;
                " onmouseover="this.style.backgroundColor='#3d8b40'" onmouseout="this.style.backgroundColor='#4ca644'">
                    Start Shopping
                </a>
            </div>
        `;
    }
}

// Initialize the orders page
function initOrdersPage() {
    loadOrderItems();
    if (localStorage.getItem('orderConfirmed')) {
        renderOrderItems();
        updateDeliveryDate();
        updateOrderSummary();
        generateTimelineUpdates();
        updateTrackingProgress();
        handleOrderCancellation();
    }
}

// Run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initOrdersPage);
