import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cart: [],
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
        },
        cartUpdate: (state, { payload }) => {	
			const itemInCart = state.cart.find((item) => item.id === payload.id)
			if (itemInCart) {
				itemInCart.qty = parseInt(payload.qty)
			}
        },
        cartRemove: (state, { payload }) => {
            const removeItem = state.cart.filter((item) => item.id !== payload.id)
      		state.cart = removeItem
        },        
        cartRemoveAll: (state) => {
            state.cart = []
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