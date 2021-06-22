import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:8080/'

function UploadPageImageForm({newListingId, city, errorIcon}) {

    const history = useHistory();

    const [error, setError] = useState(false);
    const [image, setImage] = useState('');

    const handleSetImage = (e) => {

        const image = e.target.files[0];

        if(image){
            return setImage(image)
        } else {
            setImage('')
        }

    }

    const handleUploadImage = (e) => {
        e.preventDefault();

        if(!e.target[0].files[0]){
            return setError(true)
        }

        const data = new FormData();
        data.append('file', e.target[0].files[0]);

        axios.post(`${API_URL}listings/${newListingId}/images`, data)
        .then((res) => {
            history.push(`/listings/${city}`)
        });   
    }

    return (
        <form className='form' onSubmit={handleUploadImage}>
            <div className='form__upload-image-container'>
                <label className='form__label' htmlFor='images'>*Images:</label>
                <input
                    className='form__input' 
                    name='images' 
                    id='images' 
                    type='file'
                    onChange={handleSetImage}
                />
                {
                    error && !image ? 
                    <p className='error-text'><img src={errorIcon} alt='error icon'/> You must upload an image</p> 
                    : ''
                }
            </div>
            <button className='button'>Submit</button> 
        </form>
    )
}

export default UploadPageImageForm
