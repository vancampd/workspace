import CheckboxGroup from '../CheckboxGroup';
import TextField from '../TextField';

const RENT_PERIODS = ['Daily', 'Weekly', 'Monthly'].map((period) => ({
    value: period,
    id: period.toLowerCase(),
}));

const AMENITIES = [
    'Conference Room',
    'Refrigerator',
    'Bathroom',
    'Coffee',
    'Outside work area',
];

const rentPeriodRules = {
    validate: (value: string[]) =>
        value.length > 0 || 'You must leave a time period',
};

function UploadPage1() {
    return (
        <>
            <h2 className='form__header'>Post your workspace</h2>
            <TextField
                name='title'
                label='*Give a title to your post:'
                placeholder='Title'
                rules={{ required: 'You must enter the title of your post' }}
            />
            <TextField
                as='textarea'
                name='description'
                label='*Describe your space:'
                placeholder='Description'
                rules={{ required: 'You must write the description of your space' }}
            />
            <div className='form__element-container'>
                <div className='form__inner-container'>
                    <div className='form__inner-left'>
                        <CheckboxGroup
                            name='rentPeriod'
                            label='**Length of availability:'
                            options={RENT_PERIODS}
                            rules={rentPeriodRules}
                        />
                    </div>
                    <div className='form__inner-right'>
                        <CheckboxGroup
                            name='amenities'
                            label='Amenities:'
                            options={AMENITIES}
                        />
                    </div>
                </div>
            </div>
            <TextField
                name='price'
                label='*Daily price:'
                placeholder='Enter the price to rent each day'
                type='number'
                rules={{ required: 'You must list your daily price' }}
            />
        </>
    )
}

export default UploadPage1
