import { createContext, useState, useEffect } from "react";

export const CartContext = createContext<any>(null);

export function CartProvider({ children }: any) {
    const [cart, setCart] = useState<any[]>(() => {
        const saved = sessionStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    // ADD TO CART
    const addToCart = (book: any) => {
        setCart((prev) => {
            const existing = prev.find((x) => x.bookID === book.bookID);

            if (existing) {
                return prev.map((x) =>
                    x.bookID === book.bookID
                        ? { ...x, quantity: x.quantity + 1 }
                        : x
                );
            }

            return [...prev, { ...book, quantity: 1 }];
        });
    };

    //  REMOVE ITEM COMPLETELY
    const removeFromCart = (bookID: number) => {
        setCart((prev) => prev.filter((item) => item.bookID !== bookID));
    };

    // INCREASE QUANTITY
    const increaseQuantity = (bookID: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.bookID === bookID
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // DECREASE QUANTITY
    const decreaseQuantity = (bookID: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.bookID === bookID
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0) // removes if 0
        );
    };

    // SAVE TO SESSION STORAGE
    useEffect(() => {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
}