// Helper function to format a number into Indian Rupee currency string
function formatCurrency(amount) {
    // Uses 'en-IN' for Indian currency format (e.g., Lakhs/Thousands)
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Update amounts from localStorage (run after DOM is ready)
document.addEventListener('DOMContentLoaded', function() {
    const orderTotalNum = parseInt(localStorage.getItem('orderTotal')) || 0;
    const orderTotal = formatCurrency(orderTotalNum);

    // Update UPI pay button
    const upiPayBtn = document.querySelector('#upi-section .pay-btn');
    if (upiPayBtn) {
        upiPayBtn.textContent = `Pay ${orderTotal}`;
    }

    // Update Card pay button
    const cardPayBtn = document.querySelector('#card-section .pay-btn');
    if (cardPayBtn) {
        cardPayBtn.textContent = `Pay ${orderTotal}`;
    }

    // Update COD Order Amount
    const codOrderSpan = document.querySelector('#cod-section .charge-row:nth-child(1) span:last-child');
    if (codOrderSpan) {
        codOrderSpan.textContent = orderTotal;
    }

    // Update COD Total Amount (orderTotal + 50 handling fee)
    const codTotalSpan = document.querySelector('#cod-section .charge-row.total span:last-child');
    if (codTotalSpan) {
        const codTotal = formatCurrency(orderTotalNum + 50);
        codTotalSpan.textContent = codTotal;
    }
});

// Get all payment option buttons
const paymentOptions = document.querySelectorAll('.payment-option');
const paymentSections = document.querySelectorAll('.payment-section');

// Add click event to each payment option
paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        paymentOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Get the payment method from data attribute
        const method = option.getAttribute('data-method');
        
        // Hide all payment sections
        paymentSections.forEach(section => section.classList.remove('active'));
        
        // Show the selected payment section
        const activeSection = document.getElementById(`${method}-section`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    });
});

// Card number formatting
const cardNumberInput = document.getElementById('card-number');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
}

// Expiry date formatting (MM/YY)
const expiryInput = document.getElementById('expiry');
if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
}

// CVV input - numbers only
const cvvInput = document.getElementById('cvv');
if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Bank selection
const bankOptions = document.querySelectorAll('.bank-option');
bankOptions.forEach(bank => {
    bank.addEventListener('click', () => {
        // Remove active state from all banks
        bankOptions.forEach(b => b.style.borderColor = '#e0e0e0');
        bankOptions.forEach(b => b.style.background = 'white');
        
        // Add active state to clicked bank
        bank.style.borderColor = '#6a11cb';
        bank.style.background = '#f8f4ff';
    });
});

// Pay button functionality
const payButtons = document.querySelectorAll('.pay-btn');
payButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the active payment section
        const activeSection = document.querySelector('.payment-section.active');
        const sectionId = activeSection.id;
        
        // Basic validation based on payment method
        let isValid = false;
        let message = '';
        
        switch(sectionId) {
            case 'upi-section':
                const upiId = document.getElementById('upi-id').value;
                if (upiId && upiId.includes('@')) {
                    isValid = true;
                    message = 'Processing UPI payment...';
                } else {
                    message = 'Please enter a valid UPI ID';
                }
                break;
                
            case 'card-section':
                const cardNumber = document.getElementById('card-number').value;
                const expiry = document.getElementById('expiry').value;
                const cvv = document.getElementById('cvv').value;
                const cardName = document.getElementById('card-name').value;
                
                if (cardNumber.length >= 16 && expiry.length === 5 && cvv.length === 3 && cardName) {
                    isValid = true;
                    message = 'Processing card payment...';
                } else {
                    message = 'Please fill all card details correctly';
                }
                break;
                
            case 'netbanking-section':
                const selectedBank = document.querySelector('.bank-option[style*="border-color: rgb(106, 17, 203)"]');
                const otherBank = document.getElementById('other-bank').value;
                
                if (selectedBank || otherBank) {
                    isValid = true;
                    message = 'Redirecting to bank...';
                } else {
                    message = 'Please select a bank';
                }
                break;
                
            case 'cod-section':
                isValid = true;
                message = 'Order confirmed! Pay on delivery.';
                break;
        }
        
        // Show result
        if (isValid) {
            button.textContent = message;
            button.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
            
            setTimeout(() => {
                alert('Payment processed successfully! (Demo)');
                // Reset button dynamically
                const orderTotalNum = parseInt(localStorage.getItem('orderTotal')) || 0;
                const formattedAmount = formatCurrency(orderTotalNum);
                let resetText;
                switch(sectionId) {
                    case 'upi-section':
                    case 'card-section':
                        resetText = `Pay ${formattedAmount}`;
                        break;
                    case 'netbanking-section':
                        resetText = 'Continue to Bank';
                        break;
                    case 'cod-section':
                        resetText = 'Confirm Order';
                        break;
                }
                button.textContent = resetText;
                button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 1500);
        } else {
            alert(message);
        }
    });
});