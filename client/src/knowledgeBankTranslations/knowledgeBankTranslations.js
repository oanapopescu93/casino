import { knowledgeBankDe } from "./de/knowledgeBank"
import { knowledgeBankEng } from "./eng/knowledgeBank"
import { knowledgeBankEs } from "./es/knowledgeBank"
import { knowledgeBankFr } from "./fr/knowledgeBank"
import { knowledgeBankIt } from "./it/knowledgeBank"
import { knowledgeBankPt } from "./pt/knowledgeBank"
import { knowledgeBankRo } from "./ro/knowledgeBank"
import { knowledgeBankRu } from "./ru/knowledgeBank"
import { knowledgeBankZh } from "./zh/knowledgeBank"

export const knowledgeBankTranslations = function (data){
    let lang = "ENG"
    lang = data && data.lang ? data.lang : "ENG"   
    let knowledgeBase = []
    switch(lang){
        case "DE":
            knowledgeBase = knowledgeBankDe()
            break
        case "ES":
            knowledgeBase = knowledgeBankEs()
            break
        case "FR":
            knowledgeBase = knowledgeBankFr()
            break
        case "IT":
            knowledgeBase = knowledgeBankIt()
            break
        case "PT":
            knowledgeBase = knowledgeBankPt()
            break
        case "RO":
            knowledgeBase = knowledgeBankRo()
            break
        case "RU":
            knowledgeBase = knowledgeBankRu()
            break
        case "ZH":
            knowledgeBase = knowledgeBankZh()
            break
        case "ENG":
        default:
            knowledgeBase = knowledgeBankEng()
    }
    return knowledgeBase && knowledgeBase.length > 0 ? knowledgeBase : []
}