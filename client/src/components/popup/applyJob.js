import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { translate } from '../../translations/translate'
import { validateInput } from '../../utils/validate'
import { isEmpty } from '../../utils/utils'
import { decryptData } from '../../utils/crypto'
import Spinner from '../partials/spinner'

function ApplyJob(props) {
    const { settings, home, user, data, applyJobSending, handleApplyJob } = props
    const { lang } = settings
    const { career } = home
    let userEmail = user.email ? decryptData(user.email) : ""
    let job = career.filter((x)=>{ return x.id === data})

    const [email, setEmail] = useState(userEmail)
    const [cv, setCv] = useState(null)  // Store Base64 encoded file
    const [cvName, setCvName] = useState(null)
    const [applyJobError, setApplyError] = useState({
        email: { fill: true, fill_message: "fill_field", validate: true, validate_message: "validate_message_email" },
        cv: { fill: true, fill_message: "fill_field_cv", validate: true }
    })    

    function handleChange(e) {
        setEmail(e.target.value)
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            setCvName(file.name)            
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64File = reader.result.split(',')[1]  // Extract Base64 string (remove data URL prefix)
                setCv(base64File)  // Store the Base64 string
            }
            reader.readAsDataURL(file)  // Read file as Base64
        }
    }

    function validateForm() {
        let errors = { ...applyJobError }
        if (isEmpty(email)) {
            errors.email.fill = false
        }
        if (!validateInput(email, "email")) {
            errors.email.validate = false
        }

        if (!cv) {
            errors.cv.fill = false
        }

        setApplyError(errors)
        let problem = Object.values(errors).some(error => !error.fill || !error.validate)
        return problem
    }

    function handleSubmit() {
        if (!validateForm()) {
            // Send the email, job ID, and Base64 encoded CV to handleApplyJob
            handleApplyJob({ email, id: data, cv, cvName, job: job[0], lang })
        }
    }    

    return (
        <div className="applyJob">
            <div className="applyJob_box">
                <label htmlFor="email">{translate({ lang, info: "email" })} *</label>
                <input
                    name="email"
                    className="input_light"
                    type="text"
                    value={email}
                    onChange={handleChange}
                />
                {!applyJobError.email.fill ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: applyJobError.email.fill_message })}
                        </p>
                    </div>
                ) : !applyJobError.email.validate ? (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: applyJobError.email.validate_message })}
                        </p>
                    </div>
                ) : null}
            </div>
            <div className="applyJob_box">
                <label htmlFor="cv">{translate({ lang, info: "CV" })} *</label>
                <input
                    type="file"
                    name="cv"
                    className="input_light"
                    onChange={handleFileChange}
                    accept=".pdf"
                />
                {!applyJobError.cv.fill && (
                    <div className="alert alert-danger">
                        <p className="text_red">
                            {translate({ lang, info: applyJobError.cv.fill_message })}
                        </p>
                    </div>
                )}
            </div>
            {applyJobSending ? <div className="applyJob_box">
                {applyJobSending !== "sending" ? <div className="applyJob_box">
                    <p>{translate({ lang, info: applyJobSending })}</p>
                </div> : <Spinner size="small" color="black"/>}
            </div> : null}
            <div className="applyJob_buttons">
                <Button type="button" id="applyJob_btn_ok" className="mybutton button_fullcolor_dark" onClick={handleSubmit}>
                    {translate({ lang, info: "apply" })}
                </Button>
            </div>
        </div>
    )
}

export default ApplyJob