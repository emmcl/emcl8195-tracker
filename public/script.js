//importing images for star ratings 
import images from "./images/star-ratings/*.png";

//This is for the tags input, we need to initialise the tags input as a Tagify object
const tagsInput = document.getElementById("bookTags");
const tagify = new Tagify(tagsInput);

// Setting up variables for our HTML elements using DOM selection
const form = document.getElementById("addBookForm");
const booklist = document.getElementById("bookList");
const formModal = document.getElementById("formModal");
const bookInfoModal = document.getElementById("bookInfoModal");
const addButton = document.getElementById("addToShelfButton");
var selectedImageBase64 = "";
const closeInfoModalButton = document.getElementById("closeInfoModal");
const closeFormModalButton = document.getElementById("closeFormModal");
const listDiv = document.getElementById("listDiv");
const emptyStateMessage = document.createElement("div");
const delButton = document.getElementById("more-info-modal-delete");

//run display books on each load - not just after submission of form
displayBooks();

//Opening the modal when you select the "add to shelf" button 
addButton.addEventListener("click", function (event) {
    event.preventDefault();
    formModal.showModal();
})


// Handle form submission, using input values to add new book
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const tagsArray = tagify.value.map((tag) => tag.value); // Extract the tag values
    formModal.close();
    // let rating = getStars(document.querySelector('input[name="bookRating"]:checked').value)
    let rating = document.querySelector('input[name="bookRating"]:checked').value

    addBook(
        selectedImageBase64,
        form.elements.bookTitle.value,
        form.elements.bookAuthor.value,
        form.elements.bookGenre.value,
        form.elements.bookFormat.value,
        form.elements.bookLength.value,
        form.elements.bookStartDate.value,
        form.elements.bookFinishDate.value,
        rating,
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

//function to get star rating image based on radio funtion
function getStars (rating) {
    if (rating == "1") {
        return images["one-stars"];
    } else if (rating == "2") {
        return images["two-stars"];
    } else if (rating == "3") {
        return images["three-stars"];
    } else if (rating == "4") {
        return images["four-stars"];
    } else if (rating == "5") {
        return images["five-stars"];
    } else {
        return images["zero-stars"];
    }
 }


// setting modal to close on click outside of the form box
// modal instructions from https://blog.webdevsimplified.com/2023-04/html-dialog/ via canvas 
//for form modal 
formModal.addEventListener("click", e => {
    const modalDimensions = formModal.getBoundingClientRect()
    if (
      e.clientX < modalDimensions.left ||
      e.clientX > modalDimensions.right ||
      e.clientY < modalDimensions.top ||
      e.clientY > modalDimensions.bottom
    ) {
      formModal.close()
    }
  })




//for info modal 
bookInfoModal.addEventListener("click", e => {
    const modalDimensions = bookInfoModal.getBoundingClientRect()
    if (
      e.clientX < modalDimensions.left ||
      e.clientX > modalDimensions.right ||
      e.clientY < modalDimensions.top ||
      e.clientY > modalDimensions.bottom
    ) {
      bookInfoModal.close();
    }
  })

closeInfoModalButton.addEventListener("click", function(){
  bookInfoModal.close();
})  

closeFormModalButton.addEventListener("click", function(){
  formModal.close();
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

    // If there are books in localStorage
    if (localBooks !== null) {
      emptyStateMessage.className = "hide";
      // Loop through all tasks in the array
      localBooks.forEach(function (book) {
          // Create new list item and populate with content (including data attribute for ID)
          let item = document.createElement("li");
          item.setAttribute("data-id", book.id);
          item.innerHTML = `<img src="${book.cover}" class="displayBook" alt="${book.title} by ${book.author}"/><br><img src="${getStars(book.rating)}"class="displayBook"/>`;
          
          item.addEventListener("click", function (event) {
              event.preventDefault();
              document.getElementById("more-info-modal-title").innerHTML = book.title;
              document.getElementById("more-info-modal-cover").src = book.cover;
              document.getElementById("more-info-modal-rating").src = getStars(book.rating);
              document.getElementById("more-info-modal-author").innerHTML = book.author
              document.getElementById("more-info-modal-genre").textContent = book.genre;
              document.getElementById("more-info-modal-format").textContent = book.format;
              document.getElementById("more-info-modal-length").textContent = book.length;
              document.getElementById("more-info-modal-dates").textContent = `${book.startDate} to ${book.finishDate}` //display dates as a range instead of two lines
              document.getElementById("more-info-modal-days").textContent = book.daysRead;
              document.getElementById("more-info-modal-review").textContent = `"${book.review}"` //display review in quotation marks
              

              //turning tags array into a list for displaying
              //from https://getbutterfly.com/generate-html-list-from-javascript-array/
              
              // Make the list
              let tags = book.tags;
              let tagList = document.getElementById("more-info-modal-tags");
              tagList.innerHTML = "";
              // Make the list item
              let li = document.createElement('li');
              // document.querySelector('#more-info-modal-tags').appendChild(li);
              tags.forEach((item) => {
                  // Add the item text
                  li.innerHTML += item;
                  // Add li to the ul
                  tagList.appendChild(li);
                  // Reset the list item
                  li = document.createElement('li');
              });
            
              // Configure delete button
              delButton.addEventListener("click", function () {

                // Loop through all the tasks to find the matching ID and remove it from the array
                localBooks.forEach(function (bookArrayElement, bookArrayIndex) {
                    if (bookArrayElement.id == item.getAttribute('data-id')) {
                        localBooks.splice(bookArrayIndex, 1)
                    }
                })

                // Update localStorage with the newly spliced array (converted to a JSON string)
                localStorage.setItem('books', JSON.stringify(localBooks))

                item.remove(); // Remove the task item from the page when button clicked
                // Because we used 'let' to define the item, this will always delete the right element

                bookInfoModal.close();
              });

              bookInfoModal.showModal();
          });
          
          booklist.appendChild(item);

          // Clear the value of the input once the task has been added to the page
          form.reset();
      })

  }

    // if there is no books in local storage - an empty state message will appear to encourage the user to shelve a book 
    else{
      emptyStateMessage.className = "emptyState";
      emptyStateMessage.textContent = 'Click "Add To Shelf" to Track Your Reading!';
      listDiv.after(emptyStateMessage, booklist);
    }

}


//add a book, with the paramters entered by the user and add the book to the bookList array 
function addBook(cover, title, author, genre, format, length, startDate, finishDate, rating, review, tags){ 


  //determine the days it took to read the book based on the two dates entered by the user 
  //utilised the method from https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
  //adding one to the total days to include both the day you started and the day you finished 
  var start = new Date(startDate);
  var finish = new Date(finishDate);
  var timeReading = Math.abs(finish - start);
  var daysReading = Math.ceil(timeReading / (1000 * 60 * 60 * 24)) + 1; 
  

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
      daysRead: daysReading
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
          // instead of pushing to the end of the array - unshifts to the beginning of the list to display the most recent book first
          localBooks.unshift(book);
      }
  }

  // Update localStorage with the array (converted to a JSON string)
  localStorage.setItem('books', JSON.stringify(localBooks))

  // Call function to display the books on the DOM
  displayBooks();

}

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