import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";

function CartPage() {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    const total = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="container mt-4">
            <h1>Your Cart</h1>

            {cart.length === 0 ? (
                <div className="alert alert-warning">Your cart is empty</div>
            ) : (
                <>
                    <table className="table table-bordered mt-3">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item: any) => (
                                <tr key={item.bookID}>
                                    <td>{item.title}</td>
                                    <td>${item.price}</td>

                                    {/* QUANTITY CONTROLS */}
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => decreaseQuantity(item.bookID)}
                                        >
                                            -
                                        </button>

                                        <span className="mx-2">{item.quantity}</span>

                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => increaseQuantity(item.bookID)}
                                        >
                                            +
                                        </button>
                                    </td>

                                    <td>${(item.price * item.quantity).toFixed(2)}</td>

                                    {/* REMOVE BUTTON */}
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeFromCart(item.bookID)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="text-end">Total: ${total.toFixed(2)}</h3>
                </>
            )}

            {/* CONTINUE SHOPPING */}
            <button
                className="btn btn-secondary mt-3"
                onClick={() => navigate("/")}
            >
                Continue Shopping
            </button>
        </div>
    );
}

export default CartPage;