//This is for the tags input, we need to initialise the tags input as a Tagify object
// const tagsInput = document.getElementById("tags");
// const tagify = new Tagify(tagsInput);
// const tagsArray = tagify.value.map((tag) => tag.value); // Extract the tag values

// Setting up variables for our HTML elements using DOM selection
const form = document.getElementById("addBookForm");
const booklist = document.getElementById("bookList");

// Handle form submission, using input values to add new book
form.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook(
        form.elements.bookCover.value,
        form.elements.bookTitle.value,
        form.elements.bookAuthor.value,
        form.elements.bookGenre.value,
        form.elements.bookFormat.value,
        form.elements.bookLength.value,
        form.elements.bookRating.value,
        form.elements.bookReview.value,
        form.elements.bookTags.value,
    )
})

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