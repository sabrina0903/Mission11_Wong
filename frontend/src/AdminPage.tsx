import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://booklist-sabrina-backend-cpg5heawfcfrasaw.centralus-01.azurewebsites.net/api/books";

interface Book {
    bookID?: number
    title: string
    author: string
    publisher: string
    isbn: string
    classification: string
    category: string
    pageCount: number
    price: number
}

function AdminPage() {
    const navigate = useNavigate()
    const [books, setBooks] = useState<Book[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)

    const [form, setForm] = useState<Book>({
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        classification: "",
        category: "",
        pageCount: 0,
        price: 0
    })

    const [editingId, setEditingId] = useState<number | null>(null)

    useEffect(() => {
        fetch(API + "/all")
            .then(res => res.json())
            .then(data => setBooks(data))
    }, [])

    const startIndex = (currentPage - 1) * pageSize
    const selectedBooks = books.slice(startIndex, startIndex + pageSize)
    const totalPages = Math.ceil(books.length / pageSize)

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: any) => {
    e.preventDefault()

    let isEditing = editingId !== null

    if (isEditing) {
        await fetch(`${API}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })
    } else {
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })
    }

    const res = await fetch(API + "/all")
    const data = await res.json()
    setBooks(data)

    // ✅ ONLY go to last page if ADDING
    if (!isEditing) {
        const newTotalPages = Math.ceil(data.length / pageSize)
        setCurrentPage(newTotalPages)
    }

    // reset form
    setForm({
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        classification: "",
        category: "",
        pageCount: 0,
        price: 0
    })

    setEditingId(null)
    }

    const handleDelete = async (id: number, title: string) => {
        const confirmDelete = window.confirm(`Delete "${title}"?`)
        if (!confirmDelete) return

        await fetch(`${API}/${id}`, {
            method: "DELETE"
        })

        alert(`"${title}" deleted`)

        const updated = books.filter(b => b.bookID !== id)
        setBooks(updated)

        if ((currentPage - 1) * pageSize >= updated.length) {
            setCurrentPage(prev => Math.max(prev - 1, 1))
        }
    }

    const handleEdit = (book: Book) => {
        setForm(book)
        setEditingId(book.bookID!)
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/")}
                >
                    ← Back to Book List
                </button>
            </div>

            <h1 className="text-center mb-4">Admin Panel</h1>

            {/* FORM */}
            <div className="card p-4 mb-4 shadow-sm">
                <h5>
                    {editingId ? `Editing: ${form.title}` : "Add New Book"}
                </h5>

                <form onSubmit={handleSubmit} className="row g-3">

                    <div className="col-md-6">
                        <input className="form-control" name="title" placeholder="Title" value={form.title} onChange={handleChange} required/>
                    </div>

                    <div className="col-md-6">
                        <input className="form-control" name="author" placeholder="Author" value={form.author} onChange={handleChange} required/>
                    </div>

                    <div className="col-md-6">
                        <input className="form-control" name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} required/>
                    </div>

                    <div className="col-md-6">
                        <input className="form-control" name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required/>
                    </div>

                    <div className="col-md-6">
                        <input className="form-control" name="category" placeholder="Category" value={form.category} onChange={handleChange} required/>
                    </div>

                    <div className="col-md-3">
                        <input
                            className="form-control"
                            name="pageCount"
                            type="number"
                            placeholder="Pages"
                            value={form.pageCount || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            className="form-control"
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={form.price || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <button className="btn btn-primary w-100">
                            {editingId ? "Update Book" : "Add Book"}
                        </button>
                    </div>
                </form>
            </div>

            {/* PAGE SIZE */}
            <div className="d-flex justify-content-end mb-3">
                <label className="me-2">Results per page:</label>
                <select
                    className="form-select w-auto"
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

            {/* TABLE */}
            <table className="table table-striped table-hover shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Category</th>
                        <th>Pages</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {selectedBooks.map((b) => (
                        <tr key={b.bookID}>
                            <td>{b.title}</td>
                            <td>{b.author}</td>
                            <td>{b.publisher}</td>
                            <td>{b.isbn}</td>
                            <td>{b.category}</td>
                            <td>{b.pageCount}</td>
                            <td>${b.price.toFixed(2)}</td>

                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-success btn-sm px-3"
                                        onClick={() => handleEdit(b)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm px-3"
                                        onClick={() => handleDelete(b.bookID!, b.title)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* PAGINATION */}
            <div className="d-flex justify-content-center align-items-center mt-3">
                <button
                    className="btn btn-outline-secondary me-3"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>

                <span className="fw-bold">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    className="btn btn-outline-secondary ms-3"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default AdminPage;