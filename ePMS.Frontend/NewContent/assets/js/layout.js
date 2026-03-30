//sub menu color active state 
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    });
  });
// notification dropdown tabs script//
  //function openCity(evt, cityName) {
  //  evt.preventDefault(); 
  //  evt.stopPropagation(); 
  
  //  var i, tabcontent, tablinks;
  //  tabcontent = document.getElementsByClassName("tabcontent-dp");
  //  for (i = 0; i < tabcontent.length; i++) {
  //    tabcontent[i].style.display = "none";
  //  }
  //  tablinks = document.getElementsByClassName("tablinks");
  //  for (i = 0; i < tablinks.length; i++) {
  //    tablinks[i].className = tablinks[i].className.replace(" active", "");
  //  }
  //  document.getElementById(cityName).style.display = "block";
  //  evt.currentTarget.className += " active";
  //}
  document.addEventListener("DOMContentLoaded", function () {
   /* document.getElementById("general").click();*/
  });
  // message tab script//
function msg_tab(evt, tabId) {
  evt.preventDefault();
  evt.stopPropagation(); // Prevent dropdown from closing

  // Hide all tab contents
  document.querySelectorAll(".msg-tabcontent").forEach(function (tab) {
    tab.style.display = "none";
  });

  // Remove 'active' class from all tab buttons
  document.querySelectorAll(".msg-tablinks").forEach(function (btn) {
    btn.classList.remove("active");
  });

  // Show selected tab content
  document.getElementById(tabId).style.display = "block";

  // Add active class to clicked button
  evt.currentTarget.classList.add("active");
}
document.addEventListener("DOMContentLoaded", function () {
  const firstTab = document.getElementById("first-open");
  if (firstTab) firstTab.click();
});

// navbar tab dropdown color active class 
  function message(evt, tabName) {
    const tablinks = document.querySelectorAll(".msg-tablinks");
    tablinks.forEach(tab => tab.classList.remove("active"));
    evt.currentTarget.classList.add("active");
  
  }
  
// **********crud operation  search bar ************
$(document).ready(function () {
  $(".search-input").click(function (e) {
    $(this).toggleClass("expanded").focus();
    e.stopPropagation();
  });

  $(document).click(function (e) {
    if (!$(e.target).closest(".search-box").length) {
      $(".search-input").removeClass("expanded");
    }
  });
});

// accordion open in dropdown
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.dropdown-menu').forEach(function (dropdown) {
      dropdown.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });
  });

