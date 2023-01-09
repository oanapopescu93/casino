import React, { useEffect, useState } from 'react'
import { useDispatch} from 'react-redux'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import {bigText, getCookie, setCookie, isEmpty } from '../../utils'
import {game_load, game_page, game_visible, popup_info} from '../../actions/actions'
import UserPage from '../user/userPage'
import giftPic from '../../img/chest/chest.gif'

function Salon(props){
	let dispatch = useDispatch()
	let socket = props.socket
	let lang = props.lang	
	const [change, setChange] = useState('games') //games, race, keno
	const [uuid, setUuid] = useState(-1)
	const [loaded, setLoaded] = useState(false)
	const [open, setOpen] = useState('')
	const [data, setData] = useState(null)

	useEffect(() => {
		dispatch(game_page("salon"))
		dispatch(game_load(true))
		salonData().then(res => {
			if(res){
				setData(res)
				// popup for first time user - 100 carrots
				if(res.first_enter_salon){
					let gift_title = 'Welcome gift'
					let gift_text = 'First time players get 100 carrots!'
					if(lang === "ro"){
						gift_title = 'Cadou de bun-venit'
						gift_text = 'Ai 100 de morcovi cadou de bun-venit.'
					}
					let gift_table = `<div id="first_enter_salon" class="first_enter_salon">
						<img alt="gift_img" class="gift_img" src="` + giftPic + `"/>
						<p><b>` + gift_text + `</b></p>
					</div>`
					let text = bigText(gift_table)
					dispatch(popup_info({title: gift_title, text: text, width: 300, fireworks: false}))		
				}
			} 
			setLoaded(true)
			dispatch(game_load(false))
			setOpen("open")
		}).catch(err => console.log(err))
	}, [])
	
	function salonData(){
		return new Promise(function(resolve, reject){
			let casino_uuid = getCookie("casino_uuid")
			setUuid(casino_uuid)
			setTimeout(function(){
				socket.emit('salon_send', casino_uuid)
				socket.on('salon_read', function(result){
					resolve(result)
				})
			}, 500)
		})
	}

	function handleBack(){
		setCookie("casino_uuid", '')
		setCookie("casino_user", '')
		setCookie("casino_email", '')
		props.back()
	}
	
	function handleChange(type){
		dispatch(game_visible('game'))
		dispatch(game_page('salon'))
		setChange(type)
	}
		
	return (
		<>	
			{ loaded ? (
				<>
					<Row>
						{isEmpty(uuid) ? (
							<div className="table_container color_yellow">
								{lang === "ro" ? 
									<>
										<h3>Acces interzis</h3>
										<h4>Intoarce-te si logheaza-te/inregistreaza-te</h4>
										<Button className="button_table shadow_convex" type="button" onClick={()=>handleBack()}>
											{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
										</Button>
									</> : 
									<>
										<h3>No access</h3>
										<h4>Please go back and login in / sign in</h4>
										<Button className="button_table shadow_convex" type="button" onClick={()=>handleBack()}>
											{lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
										</Button>
									</>
								}								
							</div>
						) : (
							<>
								{ !data ? <>{lang === "ro" ? <span className="color_yellow">Ceva s-a intamplat</span> : <span className="color_yellow">Something went wrong</span>}</> : 
									<>
										<div className={"salon_button_container "+open}>
											<div className="salon_button_box">
												<div id="salon_buton_games" className="salon_button shadow_convex" onClick={()=>{handleChange('games')}}>
													{lang === "ro" ? <span><i className="fa fa-smile-o"></i><span className="salon_button_text">Jocuri</span></span> : <span><i className="fa fa-smile-o"></i><span className="salon_button_text">Games</span></span>}											
												</div>            
												<div id="salon_buton_race" className="salon_button shadow_convex" onClick={()=>{handleChange('race')}}>
													{lang === "ro" ? <span><i className="fa fa-flag-checkered"></i><span className="salon_button_text">Curse</span></span> : <span><i className="fa fa-flag-checkered"></i><span className="salon_button_text">Race</span></span>}	
												</div>
												<div id="salon_buton_keno" className="salon_button shadow_convex" onClick={()=>{handleChange('keno')}}>
													<span><i className="fa fa-ticket "></i><span className="salon_button_text">Keno</span></span>	
												</div>
											</div>
										</div>
										<UserPage choice={change} info={data} lang={lang} socket={socket} back={handleBack}></UserPage>
									</>
								}
							</>
						)}
					</Row>
				</>
			) : null }
		</>
	)
}

export default Salon