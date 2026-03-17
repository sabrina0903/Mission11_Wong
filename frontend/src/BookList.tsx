import { useEffect, useState } from "react"

interface Book {
    bookID: number
    title: string
    author: string
    publisher: string
    isbn: string
    classification: string
    category: string
    pageCount: number
    price: number
}

function BookList() {
    const [books, setBooks] = useState<Book[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [sortAsc, setSortAsc] = useState(true)

    useEffect(() => {
        fetch("http://localhost:5000/api/books/all")
        .then(res => res.json())
        .then(data => setBooks(data))
    }, [])

  // ✅ SORTING
    const sortedBooks = [...books].sort((a, b) =>
        sortAsc
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    )

  // ✅ PAGINATION
    const startIndex = (currentPage - 1) * pageSize
    const selectedBooks = sortedBooks.slice(startIndex, startIndex + pageSize)
    const totalPages = Math.ceil(books.length / pageSize)

    return (
        <div className="container mt-4">
        <h1>Book List</h1>

        <div className="d-flex justify-content-between align-items-center mb-3">
            
            {/* LEFT SIDE */}
            <button
                className="btn btn-primary"
                onClick={() => setSortAsc(!sortAsc)}
            >
                Sort by Title ({sortAsc ? "A-Z" : "Z-A"})
            </button>

            {/* RIGHT SIDE */}
            <div>
                <label>Results per page: </label>
                <select
                value={pageSize}
                onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                }}
                >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                </select>
            </div>

        </div>

        {/* ✅ TABLE */}
        <table className="table table-striped">
            <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {selectedBooks.map((b) => (
                <tr key={b.bookID}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.publisher}</td>
                <td>{b.isbn}</td>
                <td>{b.classification}</td>
                <td>{b.category}</td>
                <td>{b.pageCount}</td>
                <td>${b.price}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <div className="pagination-controls">
            <button
                className="btn btn-secondary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
            >
                Previous
            </button>

            <span> Page {currentPage} of {totalPages} </span>

            <button
                className="btn btn-secondary ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
            >
                Next
            </button>
        </div>
        </div>
    )
}

export default BookList