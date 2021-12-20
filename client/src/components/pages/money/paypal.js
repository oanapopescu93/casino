import React, {Component} from 'react';
import { PayPalButton } from "react-paypal-button-v2";

class Paypal extends Component {	
	render() {
		return (
			<>	
            <input></input>	
				<PayPalButton
                    amount="0.01"
                    onSuccess={(details, data) => {
                        alert("Transaction completed!");
                    }}
                    style= {{
                        layout:  'horizontal',
                        color:   'gold',
                        shape:   'pill',
                        label:   'paypal',
                        size: 'small',
                        height: 40,
                        width: 40,
                        tagline: 'false'
                    }}
                    createOrder={function(data, actions) {
                        return actions.order.create({
                          purchase_units: [{
                            amount: {
                              value: '0.01'
                            }
                          }]
                        });
                      }
                    }
                    options={{
                        clientId: "AUpu9iRRXvgyRV_dne9h9G-3MvLVOjmbNIyYcCxbWaZao3aciBdSzvKbvvC-JJHH9-KZQFMFVSJ2nR1Z"
                    }}
                />	
		  	</>
		);
	}
}

export default Paypal;