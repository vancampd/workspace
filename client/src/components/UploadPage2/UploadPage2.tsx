import listOfStates from '../../assets/data/listOfStates.json';
import SelectField from '../SelectField';
import TextField from '../TextField';

function UploadPage2() {
    return (
        <>
            <h2 className='form__sub-header'>Location</h2>
            <TextField
                name='streetAddress'
                label='*Street Address:'
                placeholder='Street Address'
                rules={{ required: 'You must enter the street address' }}
            />
            <TextField
                name='city'
                label='*City:'
                placeholder='City'
                rules={{ required: 'You must enter the city' }}
            />
            <SelectField
                name='state'
                label='*State:'
                placeholder='Please select'
                options={listOfStates.states}
                rules={{ required: 'You must select a state' }}
            />
            <TextField
                name='zipCode'
                label='*Zip Code:'
                placeholder='Zip Code'
                inputMode='numeric'
                rules={{
                    required: 'You must enter the zip code',
                    pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: 'Please enter a valid 5-digit zip code',
                    },
                }}
            />
        </>
    )
}

export default UploadPage2
