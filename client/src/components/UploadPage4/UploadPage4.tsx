import TextField from '../TextField';

function UploadPage4() {
    return (
        <>
            <h2 className='form__sub-header'>Photo</h2>
            <TextField
                name='image'
                label='*Image:'
                type='file'
                accept='image/*'
                className='form__upload-image-container'
                rules={{ required: 'You must upload an image' }}
            />
        </>
    )
}

export default UploadPage4
