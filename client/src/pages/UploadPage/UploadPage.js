import {useState,} from 'react'
import './UploadPage.scss'
import UploadPage1 from '../../components/UploadPage1';
import UploadPage2 from '../../components/UploadPage2';
import UploadPage3 from '../../components/UploadPage3';
import UploadPageImageForm from '../../components/UploadPageImageForm';
import axios from 'axios';
import errorIcon from '../../assets/images/error-12px.svg';
require('dotenv').config()
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const API_URL = process.env.REACT_APP_EXPRESS_API_URL;
const GEO_URL = process.env.REACT_APP_GOOGLE_GEOCODING_URL;

function UploadPage() {

    const [page, setPage] = useState(0)

    const [input, setInput] = useState({})
    const handleInputChange = (e) => {
        const {name, value, checked, type} = e.target        

        // Enter this block if the input/target is a checkbox
        if(type==='checkbox'){
            // If the input was checked, add it to the list of checked values
            if(checked){
                // if the array of checked values already exists, add the new value to the end
                if(input[name]){
                    input[name].push(value)
                    setInput({...input, [name]: input[name]})
                } 
                // If the array doesn't exist, create it
                else {
                    setInput({...input, [name]: [value]})
                }  
            } 
            // If the input was unchecked, remove it from the array of checked values
            else {
                const newRentPeriod = input[name].filter(input => input !== value)
                setInput({...input, [name]: newRentPeriod})
            }
        } 
        // If the input/target is not a check box, set the input to be the current value in the input field
        else {
            setInput({...input, [name]: value})
        }
    }

    // console.log('input', input)

    const [newListingId, setNewListingId] = useState('')

    const [error, setError] = useState(false);

    const handleCheckPage1 = () => {
        const {title, description, rentPeriod, amenities, price } = input;


        if(!title || !description || !rentPeriod || !price){
            return setError(true)
        }

        if(!amenities){
            setInput({...input, amenities: []})
        }

        setError(false)
        setPage(1)
    }

    const handleCheckPage2 = () => {
        const {streetAddress, city, state} = input;

        if(!streetAddress || !city || !state){
            return setError(true)
        }

        setError(false)
        setPage(2)
    }

    // const handleCheckPage3 = () => {
    //     const {phone, email} = input;

    //     if(!phone && !email){
    //         return setError(true)
    //     }

    //     if(phone){
    //         if(!validatePhone(phone)){
    //             return setError(true)
    //         }
    //     }

    //     // Have to check valid email before returning setValidPhone
    //     if(email){
    //         if(!validateEmail(email)){
    //             return setError(true)
    //         }
    //     }

    //     setError(false)
    //     setPage(3)
    // }

    // const [validPhone, setValidPhone] = useState(true)
    // const [validEmail, setValidEmail] = useState(true)

    const handlePostListing = (e) => {
        e.preventDefault();
        console.log(input)

        const {phone, email} = input;

        if(!phone && !email){
            return setError(true)
        }

        if(phone){
            if(!validatePhone(phone)){
                return setError(true)
            }
        }

        // Have to check valid email before returning setValidPhone
        if(email){
            if(!validateEmail(email)){
                return setError(true)
            }
        }

        // setValidPhone(true)
        // setValidEmail(true)
        setError(false)

        axios
        .get(`${GEO_URL}${input.streetAddress},${input.city},${input.state}&key=${API_KEY}`)
        .then(res => {
            const {location} = res.data.results[0].geometry;
            console.log(location.lat, location.lng)

            axios
            .post(`${API_URL}listings`, {
                ...input,
                coordinates:{lat: String(location.lat), lng: String(location.lng)}
            })
            .then(res => {
                console.log('Response from server', res.data)
                return (setNewListingId(res.data.id), setPage(3))
            })
            .catch(err => console.log(err)) 
        })  
    }

    const validatePhone = (phone) => {

        const re=/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        
        return re.test(String(phone));
    }
    
    const validateEmail = (email) => {

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        return re.test(String(email).toLowerCase());
    }

    return (
        <div className='form__upload-container'>
        <form className='card form' onSubmit={handlePostListing}>
            {
                page===0 ?
                <>
                    <UploadPage1 handleInputChange={handleInputChange} error={error} input={input} errorIcon={errorIcon}/>
                    <button type='button' className='button' onClick={handleCheckPage1}>Next</button>
                </>
                : ''
            }
            {
                page===1 ?
                <>
                    <UploadPage2 handleInputChange={handleInputChange} error={error} input={input} errorIcon={errorIcon}/>
                    <div className='form__button-container'>
                        <button className='button--back' type='button' onClick={()=>setPage(0)}>Back</button> 
                        <button className='button' type='button' onClick={handleCheckPage2}>Next</button>
                    </div>
                </>
                : ''
            }
            {
                page===2 ?
                <>
                    <UploadPage3 
                        handleInputChange={handleInputChange} 
                        error={error} 
                        input={input} 
                        errorIcon={errorIcon}
                        // validPhone={validPhone}
                        // validEmail={validEmail}
                        validateEmail={validateEmail}
                        validatePhone={validatePhone}
                    />
                    <div className='form__button-container'>
                        <button type='button' className='button--back'  onClick={()=>setPage(1)}>Back</button> 
                        {/* <button className='button' type='submit' onClick={handleCheckPage3}>Submit Info</button> */}
                        <button className='button' type='submit'>Next</button>
                    </div>
                </>
                : ''
            }
        </form>
            {
            page===3 ?
            <>
                <UploadPageImageForm newListingId={newListingId}/>
            </>
            : ''
            }
        <p className='form__footnote'>* indicates a required field</p>
        <p className='form__footnote'>** indicates at least one field must be selected</p>
    </div>
    )
}

export default UploadPage
