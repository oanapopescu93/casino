import { call, put, takeLatest } from "redux-saga/effects"
import { sendPaymentRequest, sendPaymentRequestSuccess, sendWithdrawRequest, sendWithdrawRequestSuccess } from "../reducers/payments"

function request(url, payload){
    return api(url, payload).then((res)=>{
        return res
    })
}

function api(url, payload){
    return new Promise((resolve)=>{
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then((response) =>{
            return  response.json()
        })
        .then((data) => {
            resolve(data)
        })
        .catch(err => console.error('fetchBringThemAll2--> ' + err));
    })
}

function* fetchSendPaymentRequest({ payload }){
    try{
        const output = yield call(request, '/api/payment', payload)
        yield put(sendPaymentRequestSuccess(output))
    } catch(error){
        console.log('fetchSendPaymentRequest1--> ', error)
    }
}

function* fetchSendWithdrawRequest({ payload }){
    try{
        const output = yield call(request, '/api/withdraw', payload)
        yield put(sendWithdrawRequestSuccess(output))
    } catch(error){
        console.log('fetchSendWithdrawRequest1--> ', error)
    }
}

export function* paymentRegister() {    
    yield takeLatest(sendPaymentRequest.type, fetchSendPaymentRequest)
    yield takeLatest(sendWithdrawRequest.type, fetchSendWithdrawRequest)
}