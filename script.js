// Function to toggle the visibility of case study content
function toggleCaseStudy(id) {
    const content = document.getElementById(id);
    // Toggle 'active' class to trigger CSS transition for max-height
    content.classList.toggle('active');
}

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Toggle Resources dropdown for mobile menu
    const resourcesDropdownBtnMobile = document.getElementById('resources-dropdown-btn-mobile');
    if (resourcesDropdownBtnMobile) {
        resourcesDropdownBtnMobile.addEventListener('click', function() {
            // Find the closest parent with 'relative' class to toggle the dropdown
            const parentDiv = this.closest('.relative');
            if (parentDiv) {
                parentDiv.classList.toggle('dropdown-mobile-active');
            }
        });
    }

    // Attach event listeners for case study toggles
    // Using event delegation for efficiency and future-proofing
    const caseStudyHeaders = document.querySelectorAll('#case-studies .cursor-pointer');
    caseStudyHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const caseStudyId = this.getAttribute('data-case-study');
            if (caseStudyId) {
                toggleCaseStudy(caseStudyId);
            }
        });
    });
});
