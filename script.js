const bookForm = document.querySelector("form")
const inputs = Array.from(document.querySelectorAll("input"))
const description = document.querySelector("textarea")
const genreSelect = document.querySelector("select")
const bookList = document.getElementById("bookList")

formElement = [...inputs, description, genreSelect]

let state = {
    username: "",
    title: "",
    author: "",
    description: "",
    genre: "",

    books: [],

    isEdit: false,
    editUsername: "",
    editTitle: "",
    editAuthor: "",
    editDescription: "",
    editGenre: "",
    edit_id: "",
}

formElement.forEach(elem => elem.value = state[elem.name])

const setState = newState => Object.assign(state, newState)

const handleInput = (e) => {
    let { name, value } = e.target
    setState({
        ...state,
        [name]: value,
    })
}

formElement.forEach((elem) => elem.addEventListener("input", (e) => handleInput(e)))

const handleSubmit = (e) => {
    e.preventDefault()

    let newBook = {}
    newBook.title = state.title
    newBook.username = state.username
    newBook.author = state.author
    newBook.description = state.description
    newBook.genre = state.genre
    newBook._id = Math.floor(Math.random() * 999999999)
    setState({
        ...state,
        username: "",
        title: "",
        author: "",
        description: "",
        genre: "",

        books: [newBook, ...state.books],
    })
    formElement.forEach(elem => elem.value = state[elem.name])
    displayBooks()
}

const handleDelete = (_id) => {
    let allTheOthers = state.books.filter((e) => e._id !== _id)
    setState({
        ...state,
        books: allTheOthers,
    })
    displayBooks()
}

const prepareToEdit = (book) => {
    setState({
        ...state,
        isEdit: true,
        editUsername: book.username,
        editTitle: book.title,
        editAuthor: book.author,
        editDescription: book.description,
        editGenre: book.genre,
        edit_id: book._id,
    })
    displayBooks()
    console.log(state)
}

const handleEdit = (e) => {
    e.preventDefault()
    let youveChanged = state.books.map(book => {
        if (book._id === state.edit_id) {
            book.title = state.editTitle
            book.author = state.editAuthor
            book.description = state.editDescription
            book.genre = state.editGenre
            book.username = state.editUsername
        }
        return book
    })
    setState({
        ...state,
        books: youveChanged,

        isEdit: false,
        editUsername: "",
        editTitle: "",
        editAuthor: "",
        editDescription: "",
        editGenre: "",
        edit_id: "",

    })
    displayBooks()
    console.log(state)
}

const editForm = () => {
    const formWrapper = document.createElement("div")

    const form = document.createElement("form")
    formWrapper.append(form)
    form.addEventListener("submit", handleEdit)

    let userLabel = document.createElement("label")
    userLabel.setAttribute("for", "editUsername")
    userLabel.innerText = "username: "
    let usernameInput = document.createElement("input")
    usernameInput.name = "editUsername"
    usernameInput.id = "editUsername"
    usernameInput.required = true
    usernameInput.value = state.editUsername
    usernameInput.addEventListener("input", (e) => handleInput(e))
    form.append(userLabel)
    form.append(usernameInput)

    let titleLabel = document.createElement("label")
    titleLabel.setAttribute("for", "editTitle")
    titleLabel.innerText = "Title: "
    let titleInput = document.createElement("input")
    titleInput.name = "editTitle"
    titleInput.id = "editTitle"
    titleInput.required = true
    titleInput.value = state.editTitle
    titleInput.addEventListener("input", (e) => handleInput(e))
    form.append(titleLabel)
    form.append(titleInput)

    let authorLabel = document.createElement("label")
    authorLabel.setAttribute("for", "editAuthor")
    authorLabel.innerText = "Author: "
    let authorInput = document.createElement("input")
    authorInput.name = "editAuthor"
    authorInput.id = "editAuthor"
    authorInput.required = true
    authorInput.value = state.editAuthor
    authorInput.addEventListener("input", (e) => handleInput(e))
    form.append(authorLabel)
    form.append(authorInput)

    let descriptionLabel = document.createElement("label")
    descriptionLabel.setAttribute("for", "editDescription")
    descriptionLabel.innerText = "Description: "
    let descriptionInput = document.createElement("textarea")
    descriptionInput.name = "editDescription"
    descriptionInput.id = "editDescription"
    descriptionInput.required = true
    descriptionInput.value = state.editDescription
    descriptionInput.addEventListener("input", (e) => handleInput(e))
    form.append(descriptionLabel)
    form.append(descriptionInput)


    let select = document.createElement("select")
    select.name = "editGenre"
    select.innerHTML = `<option value="">Genre</option>
    <option value="fiction">Fiction</option>
    <option value="nonfiction">Non-Fiction</option>
    <option value="scifi">Sci-Fi</option>
    <option value="fantasy">Fantasy</option>
    <option value="distopian">Distopian</option>
    <option value="humor">Humor</option>
    <option value="cooking">Cooking</option>
    <option value="history">History</option>`
    select.addEventListener("input", (e) => handleInput(e))
    form.append(select)


    const submitBtn = document.createElement("button")
    submitBtn.type = "submit"
    submitBtn.innerText = "Change"
    form.append(submitBtn)



    return formWrapper
}

const card = book => {
    const wrapper = document.createElement("article")
    const cardTitleDiv = document.createElement("div")
    cardTitleDiv.innerHTML = `<h2>Title: ${book.title}</h2> \n <p>By: ${book.author}</p>`
    wrapper.append(cardTitleDiv)
    const descriptionDiv = document.createElement("div")
    descriptionDiv.innerHTML = `<p>${book.description}</p> \n <h3>${book.genre}</h3>`
    wrapper.append(descriptionDiv)
    postedBy = document.createElement("div")
    postedBy.innerHTML = `<h4>Posted by: ${book.username}</h4>`
    wrapper.append(postedBy)

    const deleteBtn = document.createElement("button")
    deleteBtn.innerText = "X"
    deleteBtn.style.color = "red"
    deleteBtn.setAttribute("class", "deleteBtn")
    deleteBtn.addEventListener("click", () => handleDelete(book._id))

    const editBtn = document.createElement("button")
    editBtn.innerText = "🖊"
    editBtn.style.color = "red"
    editBtn.setAttribute("class", "editBtn")
    editBtn.addEventListener("click", () => prepareToEdit(book))

    const buttonDiv = document.createElement("div")
    buttonDiv.setAttribute("class", "buttonDiv")
    buttonDiv.append(deleteBtn)
    buttonDiv.append(editBtn)

    wrapper.append(buttonDiv)

    wrapper.setAttribute("class", "card")

    return wrapper
}


const displayBooks = () => {
    bookList.innerHTML = ""
    if (state.books.length) {

        state.books.forEach(book => {
            if (state.isEdit && book._id === state.edit_id) {
                let div = document.createElement("div")
                div.append(editForm())
                bookList.append(div)

            }
            else {
                let li = document.createElement("li")
                li.append(card(book))
                bookList.append(li)
            }

        })
    }
    else {
        bookList.innerHTML = `<h1>No books here!</h1>`
    }

}
displayBooks()

bookForm.addEventListener("submit", (e) => handleSubmit(e))

