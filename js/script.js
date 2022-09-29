class CourseBook {
    constructor(courseTitle, coursePrice, courseYear) {
        this.courseTitle = courseTitle;
        this.coursePrice = coursePrice;
        this.courseYear = courseYear;
    }
}

class Store {
    static getCourseBooks() {
        let books;
        if (localStorage.getItem('courseBook') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('courseBook'))
        }
        return books;
    }

    static addCourseBook(book) {
        const books = Store.getCourseBooks()

        books.push(book)
        localStorage.setItem('courseBook', JSON.stringify(books))
    }
    static removeCourseBook(courseYear) {
        const books = Store.getCourseBooks()

        books.forEach((book, index) => {
            if (book.courseYear === courseYear) {
                books.splice(index, 1)
            }
        })
        localStorage.setItem('courseBook', JSON.stringify(books))
    }

}

class UI {
    static displayBooks() {
        const books = Store.getCourseBooks()
        books.forEach(book => UI.addCourseToList(book))
    }

    static addCourseToList(book) {
        const courseList = document.querySelector('#course-list')
        const row = document.createElement('tr')

        row.innerHTML = `
            <td>${book.courseTitle}</td>
            <td>$${book.coursePrice}</td>
            <td>${book.courseYear}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">&times;</a></td>
        `
        courseList.appendChild(row)
    }

    static clearFields() {
        document.querySelector('.course-name').value = ''
        document.querySelector('.course-price').value = ''
        document.querySelector('.course-year').value = ''
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(`${message}`))

        const container = document.querySelector('.container')
        const form = document.querySelector('#course-form')
        container.insertBefore(div, form)

        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 1600);
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks)

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()

    const courseNameInput = document.querySelector('.course-name').value
    const coursePriceInput = document.querySelector('.course-price').value
    const courseYearInput = document.querySelector('.course-year').value


    if (courseNameInput === '' && coursePriceInput === '' && courseYearInput === '') {
        UI.showAlert('Please kindly fill all the fields', 'danger')
    } else {
        const book = new CourseBook(courseNameInput, coursePriceInput, courseYearInput)

        UI.showAlert('Course Successfully added to the list', 'success ')
        UI.addCourseToList(book)
        Store.addCourseBook(book)
        UI.clearFields()
    }
})

document.querySelector('#course-list').addEventListener('click', e => {
    UI.deleteBook(e.target);
    UI.showAlert('Course Successfully removed from the list', 'success ')
    Store.removeCourseBook(e.target.parentElement.previousElementSibling.innerHTML)
})
