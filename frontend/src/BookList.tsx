import { useEffect, useState, useContext } from "react"
import { CartContext } from "./context/CartContext";
import { useNavigate } from "react-router-dom";

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
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const { addToCart, cart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://booklist-sabrina-backend-cpg5heawfcfrasaw.centralus-01.azurewebsites.net/api/books/all")
            .then(res => res.json())
            .then(data => setBooks(data))
    }, [location])

    useEffect(() => {
    const savedState = sessionStorage.getItem("bookListState");

    if (savedState) {
        const state = JSON.parse(savedState);

        setCurrentPage(state.currentPage || 1);
        setPageSize(state.pageSize || 5);
        setSortAsc(state.sortAsc ?? true);
        setSelectedCategories(state.selectedCategories || []);
    }
}, []);

    const filteredBooks =
        selectedCategories.length === 0
            ? books
            : books.filter(b => selectedCategories.includes(b.category))

    const sortedBooks = [...filteredBooks].sort((a, b) =>
        sortAsc
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
    )

    const startIndex = (currentPage - 1) * pageSize
    const selectedBooks = sortedBooks.slice(startIndex, startIndex + pageSize)
    const totalPages = Math.ceil(filteredBooks.length / pageSize)

    const categories = [...new Set(books.map(b => b.category))]

    // TOTAL PRICE
    const total = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
    );

    // TOTAL ITEM COUNT (important fix)
    const itemCount = cart.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
    );

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setCurrentPage(1);
    };

    return (
        <div className="container mt-4">

            {/* TITLE */}
            <h1 className="text-center mb-4">Book List</h1>

            <div className="row">

                {/* LEFT SIDEBAR */}
                <div className="col-md-3 pe-4 border-end">
                    <h5 className="fw-bold mb-3">Categories</h5>

                    {categories.map((cat, index) => (
                        <div key={index} className="form-check d-flex align-items-center mb-2">
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => handleCategoryChange(cat)}
                            />
                            <label className="form-check-label">{cat}</label>
                        </div>
                    ))}
                </div>

                {/* RIGHT CONTENT */}
                <div className="col-md-9">

                    {/*  TOP RIGHT CART BUTTON */}
                    <div className="d-flex justify-content-end mb-3 gap-2">
                        {/* ADMIN BUTTON */}
                        <button
                            className="btn btn-dark"
                            onClick={() => navigate("/adminbooks")}
                        >
                            Admin
                        </button>
                        <button
                            className="btn btn-outline-dark position-relative"
                            onClick={() => navigate("/cart")}
                        >
                            🛒 Cart - ${total.toFixed(2)}

                            {/* BADGE */}
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {itemCount}
                            </span>
                        </button>
                    </div>

                    {/* CONTROLS */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button
                            className="btn btn-primary px-4"
                            onClick={() => setSortAsc(!sortAsc)}
                        >
                            Sort by Title ({sortAsc ? "A-Z" : "Z-A"})
                        </button>

                        <div className="d-flex align-items-center">
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
                    </div>

                    {/* TABLE */}
                    <table className="table table-striped table-hover mt-3 shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Publisher</th>
                                <th>ISBN</th>
                                <th>Category</th>
                                <th>Pages</th>
                                <th>Price</th>
                                <th></th>
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
                                        <button
                                            className="btn btn-success btn-sm px-3"
                                            onClick={() => {
                                                sessionStorage.setItem("bookListState", JSON.stringify({
                                                    currentPage,
                                                    pageSize,
                                                    sortAsc,
                                                    selectedCategories
                                                }));

                                                addToCart(b);
                                                navigate("/cart");
                                            }}
                                        >
                                            Add to Cart
                                        </button>
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
            </div>
        </div>
    )
}

export default BookList;