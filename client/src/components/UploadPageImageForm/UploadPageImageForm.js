import React from 'react';
import axios from 'axios';
const API_URL = 'http://localhost:8080/'

function UploadPageImageForm({newListingId}) {

    console.log(newListingId)

    const handleUploadImage = (e) => {

        e.preventDefault();

        const data = new FormData();
        data.append('file', e.target[0].files[0]);

        console.log(data.get('file'))

        axios.post(`${API_URL}listings/${newListingId}/images`, data)
        .then((res) => {
            console.log('response', res);
        });

        // if(name==='images'){
        //     const data = new FormData();
        //     const selectedFile = e.target.files[0];
        //     console.log('selectedFile', selectedFile);
        //     // console.log('data',data.get('file'))
        //     data.append('file', selectedFile)
        //     const formData = data.get('file')
        //     console.log('data', formData);

        //     // return setInput({...input, [name]: formData })
        // }
    }

    return (
        <form className='form' onSubmit={handleUploadImage}>
            <div className='form__upload-image-container'>
                <label className='form__label' htmlFor='images'>Images:</label>
                <input
                    className='form__input' 
                    name='images' 
                    id='images' 
                    type='file'
                    // onChange={handleInputChange}
                />
            </div>
            <button className='button'>Upload Images</button> 
        </form>
    )
}

export default UploadPageImageForm
