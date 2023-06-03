//This is for the tags input, we need to initialise the tags input as a Tagify object
const tagsInput = document.getElementById("bookTags");
const tagify = new Tagify(tagsInput);

// Setting up variables for our HTML elements using DOM selection
const form = document.getElementById("addBookForm");
const booklist = document.getElementById("bookList");
const modal = document.getElementById("formModal");
const addButton = document.getElementById("addToShelfButton");

var selectedImageBase64 = ""

displayBooks();

//Opening the modal when you select the "add to shelf" button 
addButton.addEventListener("click", function (event) {
    event.preventDefault();
    modal.showModal();
})


// Handle form submission, using input values to add new book
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const tagsArray = tagify.value.map((tag) => tag.value); // Extract the tag values
    modal.close();

    addBook(
        selectedImageBase64,
        form.elements.bookTitle.value,
        form.elements.bookAuthor.value,
        form.elements.bookGenre.value,
        form.elements.bookFormat.value,
        form.elements.bookLength.value,
        form.elements.bookStartDate.value,
        form.elements.bookFinishDate.value,
        document.querySelector('input[name="bookRating"]:checked').value,
        form.elements.bookReview.value,
        tagsArray
    );

    // Hide current tab
    tabPanels[currentStep].classList.add('hidden')
    tabTargets[currentStep].classList.remove('active')
  
    // Show first tab
    currentStep = 0
    tabPanels[currentStep].classList.remove('hidden')
    tabTargets[currentStep].classList.add('active')
    
    // validateEntry()
    updateStatusDisplay()
});


// setting modal to close on click outside of the form box
// modal instructions from https://blog.webdevsimplified.com/2023-04/html-dialog/ via canvas 

modal.addEventListener("click", e => {
    const modalDimensions = modal.getBoundingClientRect()
    if (
      e.clientX < modalDimensions.left ||
      e.clientX > modalDimensions.right ||
      e.clientY < modalDimensions.top ||
      e.clientY > modalDimensions.bottom
    ) {
      modal.close()
    }
  })

// handling user uploaded images

// Get the image input and destination elements
const imgInput = document.getElementById("bookCover");
// const imgDest = document.getElementById("img-dest");

// Add a 'change' event listener to the image input element
imgInput.addEventListener("change", function (event) {
  // Create a new FileReader instance
  var reader = new FileReader();

  // Get the first selected file from the input event (the image)
  var selectedFile = event.target.files[0];

  // Set up the FileReader's 'onloadend' event handler
  reader.onloadend = function (e) {
    // Get the base64 representation of the image from the event target result
    var base64 = e.target.result;
    
    // Log the base64 data to the console
    console.log(base64);

    selectedImageBase64 = base64
    
  };

  // Read the uploaded image as a Data URL (Base64 encoded string)
  reader.readAsDataURL(selectedFile);
});




// General function for fetching tasks from localStorage and rendering to screen
function displayBooks() {

    // Clear the booklist <ul> element's content
    booklist.innerHTML = ""

    // Fetch and parse tasks array from localStorage
    let localBooks = JSON.parse(localStorage.getItem('books'))

    // If there are tasks (localStorage item exists)
    if (localBooks !== null) {

        // Loop through all tasks in the array
        localBooks.forEach(function (book) {

            // Create new list item and populate with content (including data attribute for ID)
            let item = document.createElement("li");
            item.setAttribute("data-id", book.id);
            console.log(book.bookName, book.bookRating);
            // item.innerHTML = `<p><strong>${book.cover}</strong><br>${book.rating}</p>`;
            item.innerHTML = `<img src="${book.cover}"/><br><p>${book.rating}</p>`;
            // `<img src="${book.cover}"">`
            booklist.appendChild(item);

            // Clear the value of the input once the task has been added to the page
            form.reset();

            // // Setup delete button DOM elements
            // let delButton = document.createElement("button");
            // let delButtonText = document.createTextNode("Delete");
            // delButton.appendChild(delButtonText);
            // item.appendChild(delButton); // Adds a delete button to every task

            // Listen for when the delete button is clicked
            // delButton.addEventListener("click", function () {

            //     // Loop through all the tasks to find the matching ID and remove it from the array
            //     localBooks.forEach(function (bookArrayElement, bookArrayIndex) {
            //         if (bookArrayElement.id == item.getAttribute('data-id')) {
            //             localBooks.splice(bookArrayIndex, 1)
            //         }
            //     })

            //     // Update localStorage with the newly spliced array (converted to a JSON string)
            //     localStorage.setItem('books', JSON.stringify(localBooks))

            //     item.remove(); // Remove the task item from the page when button clicked
            //     // Because we used 'let' to define the item, this will always delete the right element

            // })
        })

    }

}


// Create a function called 'addBook'
// Give the function input parameters for: name, type, rate, time, client
// Paste your object definition from above in the function
// Replace the property values with the input paramaters
// Add the object to the bookList array

function addBook(cover, title, author, genre, format, length, startDate, finishDate, rating, review, tags) {

    // Creating the object, directly passing in the input parameters
    let book = {
        cover,
        title,
        author,
        genre,
        format, 
        length, 
        startDate,
        finishDate,
        rating,
        review,
        tags,
        id: Date.now(),
        daysRead: finishDate - startDate
    }

    // Fetch and parse books array from localStorage 
    let localBooks = JSON.parse(localStorage.getItem('books'))

    // If no books exist in local storage, create a new array using the current book
    if (localBooks == null) {
        localBooks = [book]
    } else {
        // Otherwise check to see if a book with the same ID already exists (just in case)
        if (localBooks.find(element => element.id === book.id)) {
            console.log('Book already exists')
        } else {
            // If not, push the new book to the array
            localBooks.push(book);
        }
    }

    // Update localStorage with the array (converted to a JSON string)
    localStorage.setItem('books', JSON.stringify(localBooks))

    // Call function to display the books on the DOM
    displayBooks();

}

// Call the function with test values for the input paramaters
// addBook();




// javascript for multi step form page on canvas - 
// "Code taken from https://webdesign.tutsplus.com/tutorials/how-to-build-a-multi-step-form-wizard-with-javascript--cms-93342"

const previousButton = document.querySelector('#prev')
const nextButton = document.querySelector('#next')
const submitButton = document.querySelector('#submit')
const tabTargets = document.querySelectorAll('.tab')
const tabPanels = document.querySelectorAll('.tabpanel')
const isEmpty = (str) => !str.trim().length
let currentStep = 0

// Validate first input on load
validateEntry()

// Next: Change UI relative to current step and account for button permissions
nextButton.addEventListener('click', (event) => {
  event.preventDefault()

  // Hide current tab
  tabPanels[currentStep].classList.add('hidden')
  tabTargets[currentStep].classList.remove('active')

  // Show next tab
  tabPanels[currentStep + 1].classList.remove('hidden')
  tabTargets[currentStep + 1].classList.add('active')
  currentStep += 1
  
  validateEntry()
  updateStatusDisplay()
})

// Previous: Change UI relative to current step and account for button permissions
previousButton.addEventListener('click', (event) => {
  event.preventDefault()

  // Hide current tab
  tabPanels[currentStep].classList.add('hidden')
  tabTargets[currentStep].classList.remove('active')

  // Show previous tab
  tabPanels[currentStep - 1].classList.remove('hidden')
  tabTargets[currentStep - 1].classList.add('active')
  currentStep -= 1

  nextButton.removeAttribute('disabled')
  updateStatusDisplay()
})


function updateStatusDisplay() {
  // If on the last step, hide the next button and show submit
  if (currentStep === tabTargets.length - 1) {
    nextButton.classList.add('hidden')
    previousButton.classList.remove('hidden')
    submitButton.classList.remove('hidden')
    validateEntry()

    // If it's the first step hide the previous button
  } else if (currentStep == 0) {
    nextButton.classList.remove('hidden')
    previousButton.classList.add('hidden')
    submitButton.classList.add('hidden')
    // In all other instances display both buttons
  } else {
    nextButton.classList.remove('hidden')
    previousButton.classList.remove('hidden')
    submitButton.classList.add('hidden')
  }
}

function validateEntry() {
  let input = tabPanels[currentStep].querySelector('.form-input')
  
  // Start but disabling continue button
  nextButton.setAttribute('disabled', true)
  submitButton.setAttribute('disabled', true)
  
  // Validate on initial function fire
  setButtonPermissions(input)
  
  // Validate on input
  input.addEventListener('input', () => setButtonPermissions(input))
  // Validate if bluring from input
  input.addEventListener('blur', () => setButtonPermissions(input))
}

function setButtonPermissions(input) {
  if (isEmpty(input.value)) {
    nextButton.setAttribute('disabled', true)
    submitButton.setAttribute('disabled', true)
  } else {
    nextButton.removeAttribute('disabled')
    submitButton.removeAttribute('disabled')
  }
}