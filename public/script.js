//This is for the tags input, we need to initialise the tags input as a Tagify object
const tagsInput = document.getElementById("bookTags");
const tagify = new Tagify(tagsInput);

// Setting up variables for our HTML elements using DOM selection
const form = document.getElementById("addBookForm");
const booklist = document.getElementById("bookList");
const modal = document.getElementById("formModal");
const addButton = document.getElementById("addToShelfButton");

//Modal - open 
addButton.addEventListener("click", function (event) {
    event.preventDefault();
    modal.showModal();
})








// Handle form submission, using input values to add new book
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const tagsArray = tagify.value.map((tag) => tag.value); // Extract the tag values
    modal.close();
    
// (cover, title, author, genre, format, length, startDate, rating, review, tags)

    addBook(
        form.elements.bookCover.value,
        form.elements.bookTitle.value,
        form.elements.bookAuthor.value,
        form.elements.bookGenre.value,
        form.elements.bookFormat.value,
        form.elements.bookLength.value,
        form.elements.bookStartDate.value,
        document.querySelector('input[name="bookRating"]:checked').value,
        form.elements.bookReview.value,
        tagsArray
    );
});

// General function for fetching books from localStorage and rendering to screen
function displayBooks() {

    // Clear the booklist <ul> element's content
    booklist.innerHTML = ""

    // Fetch and parse books array from localStorage
    let localBooks = JSON.parse(localStorage.getItem('books'))

    // If there are books (localStorage item exists)
    if (localBooks !== null) {

    //     // Loop through all books in the array
    //     localBooks.forEach(function (book) {

    //         let taskImage = null;
    //         switch (task.type) {
    //             case 'Concept Ideation':
    //                 taskImage = images['ideate']
    //                 break;
    //             case 'Wireframing':
    //                 taskImage = images['design']
    //                 break;
    //             case 'Application Coding':
    //                 taskImage = images['code']
    //                 break;
    //             default:
    //                 break;
    //         }

            // Create new list item and populate with content (including data attribute for ID)
            let book = document.createElement("li");
            book.setAttribute("data-id", book.id);
            // book.innerHTML = `<p><strong>${book.name}</strong><br>${book.type}</p><img src='${taskImage}' width='50'/>`;
            book.innerHTML = `<p><strong>${book.cover}</strong><br>${book.title}</p>`;
            booklist.appendChild(book);

            // Clear the value of the input once the book has been added to the page
            form.reset();

            // Setup delete button DOM elements
            let delButton = document.createElement("button");
            let delButtonText = document.createTextNode("Delete");
            delButton.appendChild(delButtonText);
            book.appendChild(delButton); // Adds a delete button to every book

            // Listen for when the delete button is clicked
            delButton.addEventListener("click", function () {

                // Loop through all the books to find the matching ID and remove it from the array
                localBooks.forEach(function (bookArrayElement, bookArrayIndex) {
                    if (bookArrayElement.id == book.getAttribute('data-id')) {
                        localBooks.splice(bookArrayIndex, 1)
                    }
                })

                // Update localStorage with the newly spliced array (converted to a JSON string)
                localStorage.setItem('books', JSON.stringify(localBooks))

                book.remove(); // Remove the book item from the page when button clicked
                // Because we used 'let' to define the item, this will always delete the right element

            })
        }

    }


// Create a function called 'addBook'
// Give the function input parameters for: name, type, rate, time, client
// Paste your object definition from above in the function
// Replace the property values with the input paramaters
// Add the object to the bookList array

function addBook(cover, title, author, genre, format, length, startDate, rating, review, tags) {

    // Creating the object, directly passing in the input parameters
    let book = {
        cover,
        title,
        author,
        genre,
        format, 
        length, 
        startDate,
        rating,
        review,
        tags,
        id: Date.now(),
        date: new Date().toISOString()
        // daysRead: 
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