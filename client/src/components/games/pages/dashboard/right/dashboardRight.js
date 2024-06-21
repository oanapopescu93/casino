import React from 'react'
import Cart from './cart'
import Orders from './orders'

function DashboardRight(props){
    return <>
        <div id="dashboard_right_cart" className="dashboard_box shadow_concav">								
            <Cart {...props} />
        </div>
        <div id="dashboard_right_orders" className="dashboard_box shadow_concav">								
            <Orders {...props} />
        </div>
    </>
}
export default DashboardRight