import React, { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import { sortList } from '../../../utils/utils'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Header from '../../partials/header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Row, Col, Button } from 'react-bootstrap'
import { changePopup } from '../../../reducers/popup'

function CareerList(props){
    const { 
        settings, header, filter, indexHeader, titleDropdown,
        handleDropdown, handleApply, handleContact
    } = props
    const { lang } = settings

    return <>
        {(() => {
            if(filter && header && filter.length > 0 && header.length >0){
                return <Row>
                    <Col sm={2} />
                    <Col sm={8}>
                        <div className="career_header_container">
                            {(() => {
                                if (header.length > 0) {
                                    if (window.innerWidth < 960) {
                                        return <DropdownButton title={titleDropdown} id="language_button" onSelect={handleDropdown}>
                                            {header.map((t, i)=>{
                                                return <Dropdown.Item key={i} eventKey={t}>{translate({lang, info: t})}</Dropdown.Item>
                                            })}
                                        </DropdownButton>
                                    } else {
                                        return <>
                                            {header.map((t, i)=>{
                                                let open = ""
                                                if(i === indexHeader){
                                                    open = "open"
                                                }
                                                return <div key={i} id={'career_header_box_'+t} className={"career_header_box " + open}  onClick={()=>handleDropdown(t, i)}>{translate({lang, info: t})}</div>
                                            })}
                                        </>
                                    }
                                }
                            })()}
                        </div>
                        <div className="career_container 1">
                            <div className="career_scroll">
                                {(() => {
                                    if(filter.length > 0){
                                        return <>
                                            {filter.map((item, i)=>{
                                                    let requirements = item.requirements
                                                    let nice_to_have = item.nice_to_have
                                                    let responsabilities = item.responsabilities
                                                    return <div className="career_box" key={i}>
                                                        <div className="career_info career_title"><h3><span><b>{translate({lang, info: 'title'})}: </b></span><span>{item.title}</span></h3></div>
                                                        <div className="career_info career_location"><h4><span><b>{translate({lang, info: 'location'})}: </b></span><span>{item.location}</span></h4></div>
                                                        <div className="career_info career_requirements">
                                                            <h4><b>{translate({lang, info: 'requirements'})}: </b></h4>
                                                            <ul>
                                                                {requirements.map((item1, j)=>{
                                                                    return <li key={j}>{item1}</li>
                                                                })}
                                                            </ul>
                                                        </div>
                                                        {nice_to_have && nice_to_have.length > 0 ? <div className="career_info career_nice_to_have">
                                                            <h4><b>{translate({lang, info: 'nice_to_have'})}: </b></h4>
                                                            <ul>
                                                                {nice_to_have.map((item2, j)=>{
                                                                    return <li key={j}>{item2}</li>
                                                                })}
                                                            </ul>
                                                        </div> : null}
                                                        <div className="career_info career_responsabilities">
                                                            <h4><b>{translate({lang, info: 'responsabilities'})}: </b></h4>
                                                            <ul>
                                                                {responsabilities.map((item3, k)=>{
                                                                    return <li key={k}> {item3}</li>
                                                                })}
                                                            </ul>
                                                        </div>
                                                        <div className="apply_button">
                                                            <Button type="button" className="mybutton round button_transparent shadow_convex" onClick={()=>handleApply(item.id)}>
                                                                <FontAwesomeIcon icon={faPaperPlane} />
                                                             </Button>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        </>
                                    }
                                })()}
                            </div>
                        </div>
                    </Col>
                    <Col sm={2} />
                </Row>
            } else {
                return <div className="career_container 2">
                    <p className="text_center">{translate({lang, info: "no_jobs"})}</p>
                    <p className="text_center" id="about_contact" onClick={()=>handleContact()}><FontAwesomeIcon icon={faPaperPlane} />{translate({lang, info: "contact"})}</p>
                </div>
            }
        })()}
    </>
}

function Career(props){
    const {settings} = props
    const {lang, theme} = settings
    let dispatch = useDispatch()

    let all = translate({lang, info: 'all'})
    const [list, setList] = useState([])
    const [header, setHeader] = useState([])
    const [filter, setFilter] = useState([])
    const [indexHeader, setIndexHeader] = useState(0)
    const [titleDropdown, setTitleDropdown] = useState(all)

    function handleContact(){
        dispatch(changePage('Contact'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }    

    useEffect(() => {
        let mylist = sortList(props.list, 'type')
        let header = []
        let type = ''

        for(let i in mylist){
            if(type !== mylist[i].type){
                type = mylist[i].type
                header.push(type)
            }
        }
        if(header.length>0){
            header = ['all'].concat(header)
        }
        mylist = sortList(mylist, 'title')

        setList(mylist)
        setHeader(header)
        setFilter(mylist)
	}, [props.list])

    function handleDropdown(choice='all', i=0){ 
        setTitleDropdown(choice)
        setIndexHeader(i)
        if(choice !== 'all'){
            let mylist = sortList(list, 'type')
            mylist = mylist.filter((elem)=>{
                return elem.type === choice
            })
            setFilter(mylist)
        } else {
            let mylist = sortList(list, 'title')
            setFilter(mylist)
        }
    }

    function handleApply(id){
        let payload = {
            open: true,
            template: "apply_job",
            title: "apply",
            data: id,
            size: "sm",
        }
        dispatch(changePopup(payload))
    }

    return <div className="content_wrap">
        <Header template="career" title={translate({lang, info: "career"})} lang={lang} theme={theme}/>
        <div className="page_content">
            <CareerList 
                settings={settings} 
                header={header} 
                filter={filter}
                indexHeader={indexHeader}
                titleDropdown={titleDropdown}
                handleDropdown={handleDropdown}
                handleContact={handleContact}
                handleApply={handleApply}
            />            
        </div>
        <div className="tooltip">
            <Button 
                type="button"
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>handleBack()}
            ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
            <span className="tooltiptext">{translate({lang, info: "back"})}</span>
        </div>
    </div>
}
export default Career