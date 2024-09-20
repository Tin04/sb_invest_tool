// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

// Function to toggle the theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Add event listener to the toggle button
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Set initial button text
updateButtonText();

// Function to update button text
function updateButtonText() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const button = document.getElementById('theme-toggle');
  button.textContent = currentTheme === 'light' ? 'Light Mode' : 'Dark Mode';
}

// Update button text whenever theme changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
      updateButtonText();
    }
  });
});

observer.observe(document.documentElement, { attributes: true });
