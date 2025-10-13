// Get the current page URL
const currentPage = window.location.pathname.split('/').pop();

// Function to set active link
function setActiveLink() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');

        // Get the href of the link
        const linkHref = link.getAttribute('href');

        // If the link matches the current page, add active class
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', setActiveLink);
