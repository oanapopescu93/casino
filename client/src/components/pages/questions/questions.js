import React, {useState} from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import { capitalizeFirstLetter } from '../../../utils/utils'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function QuestionList(props){
    const {list} = props
    const [index, setIndex] = useState({i:0, j: 0})
    let list_title = Object.getOwnPropertyNames(list)

    function handleDropdown(i){
        setIndex(i)
    }

    return <div className="box_scroll">
        <Row>
            <Col lg={2} />
            <Col sm={8}>
                {list_title.map((x, i)=>{
                    let title = capitalizeFirstLetter(x.split('_').join(' '))
                    let sublist = list[x]
                    return <div key={i} className="question_subcategory">
                        <h2>{title}</h2>
                        {sublist.map((item, j)=>{
                            let question = item.question
                            let answer = item.answer
                            return <div key={j} className="question_box">
                                <div className="question_container">
                                    <div className="question_title shadow_convex" onClick={()=>handleDropdown({i, j})}>{question}</div>
                                </div>
                                {(() => {
                                    let open = ""
                                    if(i === index.i && j === index.j){
                                        open = "open"
                                    }
                                    return <div box={j} className={"answer_container " + open}>{answer}</div>
                                })()}
                            </div>
                        })}
                    </div>
                })}
            </Col>
            <Col lg={2} />
        </Row>
    </div>
}

function Questions(props){
    const {list, settings} = props
    const {lang} = settings
    let dispatch = useDispatch()

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <div className="content_wrap">
        <Header template="questions" title={translate({lang: lang, info: "questions"})} />
        <div className="page_content">
            {list ? <QuestionList lang={lang} list={list} /> : <p>{translate({lang: lang, info: "error"})}</p>}
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
            </Button>
        </div>
        <br/><br/>
    </div>
}
export default Questions