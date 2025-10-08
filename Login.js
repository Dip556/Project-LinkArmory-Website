const signInButton = document.getElementById('signIn');
const signUpButton = document.getElementById('signUp');
const container = document.getElementById('container');

// Event listener to switch from Login to Register view
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

// Event listener to switch from Register to Login view
signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});



// MOBILE VIEW TOGGLE


document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('cardContainer');
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');

    // Function to switch to Login view
    function switchToLogin() {
        // Remove the class to show the first form (Login)
        cardContainer.classList.remove('register-active');
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
    }

    // Function to switch to Register view
    function switchToRegister() {
        // Add the class to slide the wrapper and show the second form (Register)
        cardContainer.classList.add('register-active');
        loginToggle.classList.remove('active');
        registerToggle.classList.add('active');
    }

    // Event listeners for the toggle buttons
    loginToggle.addEventListener('click', switchToLogin);
    registerToggle.addEventListener('click', switchToRegister);

    // Optional: Add basic form submission prevention for demonstration
    const forms = document.querySelectorAll('.form-panel');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formType = form.classList.contains('login-panel') ? 'Login' : 'Register';
            
            // In a real application, you would replace this alert with an API call (e.g., fetch)
            alert(`${formType} form submitted successfully!`);
            
            // Clear the form fields after submission for better UX
            form.reset();
        });
    });

    // Initialize to Login view (default)
    switchToLogin();
});