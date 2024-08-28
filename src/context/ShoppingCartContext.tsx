import { createContext, ReactNode, useContext, useState } from "react";

type ShoppingCartProviderProps  = {
    children: ReactNode
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
}

type CartItem = {
    id: number
    quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext) 

//This is the radio that listens for context
export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}

//This is the radio station that broadcasts the context
export function ShoppingCartProvider({children} : ShoppingCartProviderProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    const openCart = () => setIsOpen(true)
    const closeCart = () => closeCart(true) //5:11
    
    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }
    function increaseCartQuantity(id: number) {
        setCartItems (currItems => {
            if(currItems.find(item => item.id === id) == null){
                return [...currItems, {id, quantity: 1}]
            } else {
                return currItems.map(item => {
                    if (item.id===id){
                        return {...item, quantity: item.quantity + 1}
                    } else {
                        return item
                    }
                })
            }
        })
    } 
    function decreaseCartQuantity(id: number) {
        setCartItems (currItems => {
            if(currItems.find(item => item.id === id)?.quantity === 1){
                return currItems.filter(item => item.id !== id)
            } else {
                return currItems.map(item => {
                    if (item.id===id){
                        return {...item, quantity: item.quantity - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    } 
    function removeFromCart(id: number) {
        setCartItems( currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }


    return (
        <ShoppingCartContext.Provider value={{
            getItemQuantity,
            increaseCartQuantity, 
            decreaseCartQuantity, 
            removeFromCart,
            cartItems,
            cartQuantity,
            }}>
            {children}
        </ShoppingCartContext.Provider>
    )
}