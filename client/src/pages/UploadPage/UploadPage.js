import {useState,} from 'react'
import './UploadPage.scss'
import UploadPage1 from '../../components/UploadPage1';
import UploadPage2 from '../../components/UploadPage2';
import UploadPage3 from '../../components/UploadPage3';
import axios from 'axios';
const API_URL = 'http://localhost:8080/'

function UploadPage() {

    const [page, setPage] = useState(0)

    const [input, setInput] = useState({})
    const handleInputChange = (e) => {
        const {name, value, checked, type} = e.target

        if(name==='images'){
            let data = new FormData();
            let selectedFile = e.target.files[0];
            console.log('selectedFile',selectedFile);
            console.log('data',data.get('file'))
            data.append('file', selectedFile)
            const formData = data.get('file')
            console.log('data', formData);

            return setInput({...input, [name]: selectedFile })
        }
        

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

    console.log('input', input)

    const handlePostListing = (e) => {
        e.preventDefault();
        console.log(input)


        axios
        .post(`${API_URL}listings`, input)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    return (
        <div>
        <form className='card form' onSubmit={handlePostListing}>
            {
                page===0 ?
                <>
                    <UploadPage1 handleInputChange={handleInputChange}/>
                    <button type='button' className='button' onClick={()=>setPage(1)}>Next</button>
                </>
                : ''
            }
            {
                page===1 ?
                <>
                    <UploadPage2 handleInputChange={handleInputChange}/>
                    <div className='form__button-container'>
                        <button className='button--back' type='button' onClick={()=>setPage(0)}>Back</button> 
                        <button className='button' type='button' onClick={()=>setPage(2)}>Next</button>
                    </div>
                </>
                : ''
            }
            {
                page===2 ?
                <>
                    <UploadPage3 handleInputChange={handleInputChange}/>
                    <div className='form__button-container'>
                        <button type='button' className='button--back' onClick={()=>setPage(1)}>Back</button> 
                        <button className='button' type='submit'>Submit</button>
                    </div>
                </>
                : ''
            }
        </form>
    </div>
    )
}

export default UploadPage
