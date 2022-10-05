import React, { useEffect, useState } from 'react'
import { getCookie, isEmpty, setCookie } from '../../utils'
import UserChoice from './userChoice'
import Button from 'react-bootstrap/Button'

function UserPage(props){	
	const [empty, setEmpty] = useState(false)

	useEffect(() => {
		let casino_uuid = getCookie("casino_uuid")
		if(isEmpty(casino_uuid)){
			setEmpty(true)
		}
	}, [])

	function handleBack(){
		setCookie("casino_uuid", '')
		setCookie("casino_user", '')
		setCookie("casino_email", '')
		props.back()
	}
	
	return(
		<>
			{empty ? <div className="userPage_error">
				{props.lang === "ro" ? 
					<>
						<h3>Acces interzis</h3>
						<h4>Intoarce-te si logheaza-te/inregistreaza-te</h4>
						<Button className="button_table shadow_convex" type="button" onClick={()=>handleBack()}>
							{props.lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
						</Button>
					</> : 
					<>
						<h3>No access</h3>
						<h4>Please go back and login in / sign in</h4>
						<Button className="button_table shadow_convex" type="button" onClick={()=>handleBack()}>
							{props.lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
						</Button>
					</>
				}								
			</div> : <UserChoice choice={props.choice} data={props.info} lang={props.lang} socket={props.socket}></UserChoice>
			} 
		</>
	)
}

export default UserPage