import { createSlice } from '@reduxjs/toolkit'
import { getCookie, setCookie } from '../utils/utils'

const initialState = {
    cart: getCookie("casino_cart") !== "" ? JSON.parse(getCookie("casino_cart")) : [],
    promo: null
}

const cartWishlistSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        cartAdd: (state, { payload }) => {	
            let qty = parseInt(payload.qty)		
            const itemInCart = state.cart.find((item) => item.id === payload.id)
			if (itemInCart) {	
				itemInCart.qty = itemInCart.qty + qty
			} else {
				state.cart.push({ ...payload, qty: qty, cartId: state.cart.length })
			}
            setCookie("casino_cart", JSON.stringify(state.cart))
        },
        cartUpdate: (state, { payload }) => {	
			const itemInCart = state.cart.find((item) => item.id === payload.id)
			if (itemInCart) {
				itemInCart.qty = parseInt(payload.qty)
			}
            setCookie("casino_cart", JSON.stringify(state.cart))
        },
        cartRemove: (state, { payload }) => {
            const removeItem = state.cart.filter((item) => item.id !== payload.id)
      		state.cart = removeItem
            setCookie("casino_cart", JSON.stringify(state.cart))
        },
        cartRemoveAll: (state) => {
            state.cart = []
            setCookie("casino_cart", JSON.stringify(state.cart))
        },
        getPromo: (state, { payload }) => {
            state.promo = payload
        }
    }
})

export const {
    cartAdd,
    cartUpdate,
    cartRemove,
    cartRemoveAll,
    getPromo,
} = cartWishlistSlice.actions

export default cartWishlistSlice.reducer