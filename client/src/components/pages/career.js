import React, {useState, useEffect} from 'react'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../reducers/page'
import { translate } from '../../translations/translate'
import { sortList } from '../../utils/utils'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Header from '../partials/header'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function CareerList(props){
    const {lang} = props
    let all = translate({lang: lang, info: 'all'})
    const [list, setList] = useState([])
    const [header, setHeader] = useState([])
    const [filter, setFilter] = useState([])
    const [indexHeader, setIndexHeader] = useState(0)
    const [titleDropdown, setTitleDropdown] = useState(all)

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

    return <>
        {(() => {
            if(filter && header && filter.length>0 && header.length>0){
                return <>
                    <div className="career_header_container">
                        {(() => {
                            if (header.length>0) {
                                if (window.innerWidth < 960) {
                                    return <DropdownButton title={titleDropdown} id="language_button" onSelect={handleDropdown}>
                                        {header.map((t, i)=>{
                                            return <Dropdown.Item key={i} eventKey={t}>{translate({lang: lang, info: t})}</Dropdown.Item>
                                        })}
                                    </DropdownButton>
                                } else {
                                    return <>
                                        {header.map((t, i)=>{
                                            let open = ""
                                            if(i === indexHeader){
                                                open = "open"
                                            }
                                            return <div key={i} id={'career_header_box_'+t} className={"career_header_box " + open}  onClick={()=>handleDropdown(t, i)}>{translate({lang: lang, info: t})}</div>
                                        })}
                                    </>
                                }
                            }
                        })()}
                    </div>
                    <div className="career_container">
                        <div className="career_scroll">
                            {(() => {
                                if(filter.length>0){
                                    return <>
                                        {filter.map((item, i)=>{
                                                let requirements = item.requirements
                                                let responsabilities = item.responsabilities
                                                return <div className="career_box" key={i}>
                                                    <div className="career_info career_title"><h3><span><b>{translate({lang: lang, info: 'title'})}: </b></span><span>{item.title}</span></h3></div>
                                                    <div className="career_info career_location"><h4><span><b>{translate({lang: lang, info: 'location'})}: </b></span><span>{item.location}</span></h4></div>
                                                    <div className="career_info career_requirements">
                                                        <h4><b>{translate({lang: lang, info: 'requirements'})}: </b></h4>
                                                        <ul>
                                                            {requirements.map((item1, j)=>{
                                                                return <li key={j}>{item1}</li>
                                                            })}
                                                        </ul>
                                                    </div>
                                                    <div className="career_info career_responsabilities">
                                                        <h4><b>{translate({lang: lang, info: 'responsabilities'})}: </b></h4>
                                                        <ul>
                                                            {responsabilities.map((item2, k)=>{
                                                                return <li key={k}> {item2}</li>
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </>
                                }
                            })()}
                        </div>
                    </div>
                </>
            } else {
                return <p>{translate({lang: lang, info: 'no_jobs'})}</p>
            }
        })()}
    </>
}

function Career(props){
    const {list, settings} = props
    const {lang} = settings
    let dispatch = useDispatch()

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <div className="content_wrap">
        <Header template="career" title={translate({lang: lang, info: "career"})} />
        <div className="page_content">
            {(() => {
                if(list){
                    if(list.length>0){
                        return <CareerList lang={lang} list={list} />
                    } else {
                        return <div className="career_container">
                            <p className="text_center">{translate({lang: lang, info: "no_career"})}</p>
                        </div>
                    }
                } else {
                    return <p className="text_center">{translate({lang: lang, info: "error"})}</p>
                }
            })()}
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
            </Button>
        </div>
        <br/><br/>
    </div>
}
export default Career