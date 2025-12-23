// start of globel var
var formContact = document.getElementById("formContact");
var fullName = document.getElementById("fullname");
var mobile = document.getElementById("mobile");
var email = document.getElementById("email");
var address = document.getElementById("address");
var category = document.getElementById("category");
var notes = document.getElementById("notes");
var contactList = [];
var filteredList = [];
var currentIndex = null;
var notFound = document.getElementById("notFound");
// setting local storage
if (localStorage.getItem("contacts") != null) {
  contactList = JSON.parse(localStorage.getItem("contacts"));
} else {
  contactList = [];
}

displayContact(contactList);
changeTotal();
function openForm() {
  formContact.classList.remove("d-none");
}

function closeForm() {
  formContact.classList.add("d-none");
}

function addContact() {
  event.preventDefault();

  var contact = {
    name: fullName.value,
    phone: mobile.value,
    mail: email.value,
    address: address.value,
    category: category.value,
    notes: notes.value,
    favorite: document.getElementById("favorite").checked,
    emergency: document.getElementById("emergency").checked,
  };
  if (nameValidation()) {
    if (phoneValidation()) {
      if (meilValidation()) {
        if (currentIndex === null) {
          contactList.push(contact);
          sucssful();
        } else {
          contactList[currentIndex] = contact;
          updated();
          currentIndex = null;
        }
        localStorage.setItem("contacts", JSON.stringify(contactList));
        displayContact(contactList);
        changeTotal();
        clearForm();
        closeForm();
      }
    }
  }
}

function displayContact(flist) {
  if (flist.length === 0) {
    notFound.classList.remove("d-none");
  } else {
    notFound.classList.add("d-none");
  }

  var cartona = "";
  for (var i = 0; i < flist.length; i++) {
    var realIndex = contactList.indexOf(flist[i]);

    cartona += `
    <div class="col-lg-6 p-2 d-flex">
      <div class="innercard bg-white rounded-4 p-3 h-100 w-100 d-flex flex-column">
        <div class="cont-card d-flex flex-column flex-grow-1">
          <div class="cardHead d-flex flex-row">
            <div class="icon position-relative me-3">
            <div class="category">
                <i class="fa-solid fa-star text-white rounded-circle d-flex justify-content-center align-items-center ${
                  flist[i].favorite ? "" : "d-none"
                }"></i>
                <i class="fa-solid fa-heart-pulse text-white rounded-circle d-flex justify-content-center align-items-center ${
                  flist[i].emergency ? "" : "d-none"
                }"></i>
              </div>
              <p class="char p-3 text-center text-uppercase rounded-3 text-white fw-semibold fs-5 mb-0">
                ${flist[i].name[0]}
              </p>
            </div>
            <div class="info">
              <p class="fs-6 fw-semibold text-black mb-2">${flist[i].name}</p>
              <p class="d-flex flex-row">
                <i class="fa-solid fa-phone blue me-1 text-center rounded-3"></i>
                <span class="mt-1 fw-normal">${flist[i].phone}</span>
              </p>
            </div>
          </div>
          <div class="cardBody">
            <div class="bodyGroup d-flex flex-row">
              <div class="icon">
                <i class="fa-solid fa-envelope burb rounded-3 me-2 emailIcon"></i>
              </div>
              <p class="mt-1 fw-normal">${flist[i].mail}</p>
            </div>
            <div class="bodyGroup d-flex flex-row">
              <div class="icon">
                <i class="fa-solid fa-location-dot green rounded-3 me-2 adressIcon"></i>
              </div>
              <p class="mt-1 fw-normal">${flist[i].address}</p>
            </div>
            <div class="category d-flex flex-row categoryIcon">
              <p class="type me-3 px-2 py-1 rounded-2 fw-medium category-text">
                ${flist[i].category}
              </p>
              </p>
            </div>
          </div>
          <div class="cardfoot w-100 d-flex justify-content-between mt-auto">
            <div class="quickacses d-flex flex-row">
              <div class="icon">
                <a href="tel:${
                  flist[i].phone
                }" class=" text-decoration-none"><i class="fa-solid fa-phone rounded-3 me-2 iconhoverg"></i></a>
              </div>
              <div class="icon">
                <a  href="mailto:${
                  flist[i].mail
                }" class=" text-decoration-none"><i class="fa-solid fa-envelope rounded-3 me-2 iconhoverb"></i></a>
              </div>
            </div>
            <div class="edit d-flex flex-row gap-4">
              <div class="icon">
                <i class="fa-star ${
                  flist[i].favorite ? "fa-solid gold" : "fa-regular"
                }" onclick="addFavorite(${realIndex})"></i>

              </div>
              <div class="icon">
                <i class="fa-heart ${
                  flist[i].emergency ? "fa-solid text-danger" : "fa-regular"
                }" onclick="addEmergency(${realIndex})"></i>
              </div>
              <div class="icon">
                <i class="fa-solid fa-pen" onclick="updateContact(${realIndex})"></i>
              </div>
              <div class="icon">
                <i class="fa-solid fa-trash" onclick="deleteContact(${realIndex})"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  document.getElementById("card").innerHTML = cartona;

  for (var i = 0; i < flist.length; i++) {
    if (!flist[i].mail) {
      var emailIcon = document.getElementsByClassName("emailIcon")[i];
      emailIcon.classList.add("d-none");
    }
    if (!flist[i].address) {
      var adressIcon = document.getElementsByClassName("adressIcon")[i];
      adressIcon.classList.add("d-none");
    }
    if (!flist[i].category) {
      var categoryIcon = document.getElementsByClassName("categoryIcon")[i];
      categoryIcon.classList.add("d-none");
    }
  }

  var categories = document.querySelectorAll(".category-text");
  for (var i = 0; i < categories.length; i++) {
    if (flist[i].category === "Friends") {
      categories[i].classList.add("green");
    } else if (flist[i].category === "Family") {
      categories[i].classList.add("blue");
    } else if (flist[i].category === "work") {
      categories[i].classList.add("burb");
    } else if (flist[i].category === "School") {
      categories[i].classList.add("yelow-txt");
    } else if (flist[i].category === "other") {
      categories[i].classList.add("gray-txt");
    }
  }

  displayFavorites();
  displayEmergency();
}

function deleteContact(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      contactList.splice(index, 1);
      localStorage.setItem("contacts", JSON.stringify(contactList));
      displayContact(contactList);
      changeTotal();

      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
      });
    }
  });
}

function updateContact(index) {
  currentIndex = index;
  var contact = contactList[index];
  fullName.value = contact.name;
  mobile.value = contact.phone;
  email.value = contact.mail;
  address.value = contact.address;
  category.value = contact.category;
  document.getElementById("favorite").checked = contact.favorite || false;
  document.getElementById("emergency").checked = contact.emergency || false;
  openForm();
}

function editContact() {
  contactList[currentIndex] = {
    name: fullName.value,
    phone: mobile.value,
    mail: email.value,
    address: address.value,
    category: category.value,
  };
  localStorage.setItem("contacts", JSON.stringify(contactList));
  displayContact(contactList);
  clearForm();
}

function searchContact(searchvalue) {
  filteredList = [];

  for (var i = 0; i < contactList.length; i++) {
    if (
      contactList[i].name.toLowerCase().includes(searchvalue.toLowerCase()) ||
      contactList[i].mail.toLowerCase().includes(searchvalue.toLowerCase()) ||
      contactList[i].phone.toLowerCase().includes(searchvalue.toLowerCase())
    ) {
      filteredList.push(contactList[i]);
    }
  }

  displayContact(filteredList);
}

function changeTotal() {
  var totalCounter = contactList.length;
  var favoritesCounter = 0;
  var emergencyCounter = 0;

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite) favoritesCounter++;
    if (contactList[i].emergency) emergencyCounter++;
  }

  document.getElementById("total").innerHTML =
    "<h4 class='mb-0 fw-medium text-uppercase'>Total</h4>" +
    "<p class='ms-1 fw-bold fs-4'>" +
    totalCounter +
    "</p>";

  document.querySelector(".cardFav .txtTotal p").innerHTML = favoritesCounter;
  document.querySelector(".cardEmergancy .txtTotal p").innerHTML =
    emergencyCounter;
  document.getElementById("counter").innerHTML = totalCounter;
}

function clearForm() {
  fullName.value = "";
  mobile.value = "";
  email.value = "";
  address.value = "";
  category.value = "";
}

function nameValidation() {
  var nameShort = document.getElementById("nameShort");
  if (fullName.value) {
    if (fullName.value.length > 1 && fullName.value.length < 50) {
      return true;
    } else {
      invalidValueName();
      nameShort.classList.remove("d-none");
      return false;
    }
  } else {
    missValueName();
  }
}

function phoneValidation() {
  var regex = /^01[0125]\d{8}$/;
  var phoneInvalid = document.getElementById("phoneInvalid");

  if (!mobile.value) {
    missValuephone();
    return false;
  }

  if (!regex.test(mobile.value)) {
    phoneInvalid.classList.remove("d-none");
    invalidValuePhone();
    return false;
  }

  for (var i = 0; i < contactList.length; i++) {
    if (
      !(currentIndex !== null && i === currentIndex) &&
      contactList[i].phone === mobile.value
    ) {
      repeatedPhone();
      return false;
    }
  }

  return true;
}

function meilValidation() {
  var regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
  if (email.value.length === 0) {
    return true;
  } else if (regex.test(email.value)) {
    return true;
  } else {
    mailInvalid.classList.remove("d-none");
    invalidValueEmail();
    return false;
  }
}

function addFavorite(index) {
  contactList[index].favorite = !contactList[index].favorite;
  localStorage.setItem("contacts", JSON.stringify(contactList));
  displayContact(contactList);
  changeTotal();
}

function displayFavorites() {
  var favorites = [];
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite) {
      favorites.push(contactList[i]);
    }
  }

  var favoritesContainer = document.querySelector(
    ".favorites-card .bottom-container"
  );

  if (favorites.length === 0) {
    favoritesContainer.innerHTML =
      '<p class="text-center text-muted p-3">No favorite contacts</p>';
    return;
  }

  var cartona = "";
  for (var i = 0; i < favorites.length; i++) {
    cartona += `
      <div class="favorites-bottom mb-2 d-flex align-items-center p-3 rounded-4">
        <div class="avatar orange-gradient rounded-3 d-flex justify-content-center align-items-center me-3">
          <span class="text-white fw-bold fs-4">${
            favorites[i].name ? favorites[i].name[0].toUpperCase() : ""
          }</span>
        </div>
        <div class="contact-info flex-grow-1">
          <p class="fw-bold fs-6 mb-1 text-dark">${favorites[i].name}</p>
          <p class="text-muted small mb-0">${favorites[i].phone}</p>
        </div>
        <a href="tel:${
          favorites[i].phone
        }" class="call-btn bg-light-mint rounded-3 d-flex justify-content-center align-items-center text-decoration-none">
          <i class="fa-solid fa-phone text-dark-green"></i>
        </a>
      </div>`;
  }

  favoritesContainer.innerHTML = cartona;
}

function addEmergency(index) {
  contactList[index].emergency = !contactList[index].emergency;
  localStorage.setItem("contacts", JSON.stringify(contactList));
  displayContact(contactList);
  changeTotal();
}

function displayEmergency() {
  var emergencies = [];
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].emergency) {
      emergencies.push(contactList[i]);
    }
  }
  var emergencyContainer = document.querySelector(
    ".card.mb-4 .bottom-container"
  );

  if (emergencies.length === 0) {
    emergencyContainer.innerHTML =
      '<p class="card-text text-center">No emergency contacts</p>';
    return;
  }
  var cartona = "";
  for (var i = 0; i < emergencies.length; i++) {
    cartona += `<div class="emergency-bottom mb-2  d-flex align-items-center p-3 rounded-4">
                                        <div
                                            class="avatar orange-gradient rounded-3 d-flex justify-content-center align-items-center me-3">
                                            <span class="text-white fw-bold fs-4">${
                                              emergencies[i].name
                                                ? emergencies[
                                                    i
                                                  ].name[0].toUpperCase()
                                                : ""
                                            }</span>
                                        </div>
                                        <div class="contact-info flex-grow-1">
                                            <p class="fw-bold fs-6 mb-1 text-dark">${
                                              emergencies[i].name
                                            }</p>
                                            <p class="text-muted small mb-0">${
                                              emergencies[i].phone
                                            }</p>
                                        </div>
                                        <div
                                            class="call-btn bg-light-mint rounded-3 d-flex justify-content-center align-items-center">
                                            <i class="fa-solid fa-phone "></i>
                                        </div>
                                    </div>
      `;
  }

  emergencyContainer.innerHTML = cartona;
}

// sweet alert functions

function sucssful() {
  Swal.fire({
    title: "Added!",
    icon: "success",
    draggable: true,
  });
}

function updated() {
  Swal.fire({
    title: "updated!",
    icon: "success",
    draggable: true,
  });
}

function missValueName() {
  Swal.fire({
    icon: "error",
    title: "Missing Name",
    text: "Please enter a name for the contact!",
  });
}
function missValuephone() {
  Swal.fire({
    icon: "error",
    title: "Missing phone",
    text: "Please enter a phone number!",
  });
}

function invalidValueName() {
  Swal.fire({
    icon: "error",
    title: "Invalid Name",
    text: "Name should contain only letters and spaces (2-50 characters)",
  });
}

function invalidValuePhone() {
  Swal.fire({
    icon: "error",
    title: "Invalid Phone",
    text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
  });
}
function invalidValueEmail() {
  Swal.fire({
    icon: "error",
    title: "Invalid Email",
    text: "Please enter a valid email address",
  });
}

function repeatedPhone() {
  Swal.fire({
    icon: "error",
    title: "Duplicate Phone Number",
    text: "A contact with this phone number already exists",
  });
}
