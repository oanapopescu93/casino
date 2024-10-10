import React from 'react'
import { Row, Col } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import WithdrawFormStripe from './withdrawFormStripe'
import { decryptData } from '../../../utils/crypto'

function Withdraw(props){
    const {lang, user} = props
    let money = user.money ? decryptData(user.money) : 0
    let dispatch = useDispatch()

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleSubmit(payload){
        console.log(payload)
    }

    return <div className="content_wrap">
        <Header template="terms_cond" title={translate({lang: lang, info: "withdraw"})} />
        <div className="page_content">            
            <Row>
                <Col lg={2} />
                <Col lg={8}>                    
                    <WithdrawFormStripe
                        {...props} 
                        money={money}
                        handleSubmit={(e)=>handleSubmit(e)}
                        handleBack={()=>handleBack()}
                    />                  
                </Col>
                <Col lg={2} />
            </Row>
        </div>        
    </div>
}
export default Withdraw