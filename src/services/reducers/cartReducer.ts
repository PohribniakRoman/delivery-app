(() => {
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify({price: 0, products: []}))
    }
})()

export type Cart = {
    price: number;
    products: CartItem[],
}

export type CartItem = {
    label: string,
    price: number,
    discount: boolean | number,
    store: string,
    img: string,
    view: number,
    rating: number,
    id: string | number,
};

export type CartAction = {
    type: "ADD_ITEM" | "REMOVE_ITEM",
    payload: any,
}

const updateStorage = (state: Cart) => {
    localStorage.setItem("cart", JSON.stringify(state));
    return (state);
}

const cart = localStorage.getItem("cart");
let defaultState: Cart = { price: 0, products: [] };
if (cart !== null) {
    defaultState = JSON.parse(cart);
}

export const cartReducer = (state = defaultState, action: CartAction) => {
    switch (action.type) {
        case "ADD_ITEM":{
            return updateStorage({ price: state.price + action.payload.price, products: [...state.products, action.payload.product] })
        }
        case "REMOVE_ITEM":{
            const newState: Cart = { price: state.price - action.payload.price, products: state.products.filter((product: CartItem) => product.id !== action.payload.product.id) }
            return updateStorage(newState)
        }
        default:{
            return defaultState;
        }
    }
}