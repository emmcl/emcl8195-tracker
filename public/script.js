
//This is for the tags input, we need to initialise the tags input as a Tagify object
const tagsInput = document.getElementById("tags");
const tagify = new Tagify(tagsInput);
const tagsArray = tagify.value.map((tag) => tag.value); // Extract the tag values

// Setting up variables for our HTML elements using DOM selection
const form = document.getElementById("taskform");
const tasklist = document.getElementById("tasklist");

// Handle form submission, using input values to add new task
form.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask(
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