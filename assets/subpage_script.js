// JavaScript for sub-pages
document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('back-button');

    if (backButton) {
        backButton.addEventListener('click', () => {
            history.back(); // Navigates to the previous page in browser history
        });
    }
});
