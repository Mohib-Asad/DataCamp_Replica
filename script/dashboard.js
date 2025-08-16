
// Profile dropdown toggle
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

profileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
    notificationDropdown.classList.remove('show');
});

// Notification dropdown toggle
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');

notificationBtn.addEventListener('click', function(e) { 
    e.stopPropagation();
    notificationDropdown.classList.toggle('show');
    profileDropdown.classList.remove('show');
});

// Close dropdowns when clicking outside
document.addEventListener('click', function() {
    profileDropdown.classList.remove('show');
    notificationDropdown.classList.remove('show');
});

// Prevent dropdown from closing when clicking inside
profileDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
});

notificationDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Close mobile app card
document.querySelector('.close-btn').addEventListener('click', function() {
    this.parentElement.style.display = 'none';
});