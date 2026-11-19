import {useState} from 'react'
import './UploadPage.scss'
import UploadPage1 from '../../components/UploadPage1';
import UploadPage2 from '../../components/UploadPage2';
import UploadPage3 from '../../components/UploadPage3';
import UploadPageImageForm from '../../components/UploadPageImageForm';
import errorIcon from '../../assets/images/error-12px.svg';
import { useCreateListingMutation } from '../../hooks/mutations/useCreateListingMutation';
import { useForm, useWatch } from 'react-hook-form';

type UploadFormValues = {
    title: string;
    description: string;
    rentPeriod: string[];
    amenities: string[];
    price: string;
    streetAddress: string;
    city: string;
    state: string;
    phone: string;
    email: string;
};

function UploadPage({signedIn, credentials}) {

    const [page, setPage] = useState(0)
    const [newListingId, setNewListingId] = useState('')

    const createListingMutation = useCreateListingMutation()
    const {
        register,
        handleSubmit,
        trigger,
        control,
        formState: { errors },
    } = useForm<UploadFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            rentPeriod: [],
            amenities: [],
            price: '',
            streetAddress: '',
            city: '',
            state: '',
            phone: '',
            email: '',
        },
    })
    const city = useWatch({
        control,
        name: 'city',
    })

    const handleCheckPage1 = async () => {
        const isStepValid = await trigger(['title', 'description', 'rentPeriod', 'price'])
        if(isStepValid) setPage(1)
    }

    const handleCheckPage2 = async () => {
        const isStepValid = await trigger(['streetAddress', 'city', 'state'])
        if(isStepValid) setPage(2)
    }

    const handlePostListing = (input: UploadFormValues) => {
        createListingMutation.mutate(
            { ...input, name: credentials.name, comments: [], images: [] },
            {
                onSuccess: (data) => {
                    setNewListingId(data.id)
                    setPage(3)
                },
            }
        )
    }

    const validatePhone = (phone) => {

        const re=/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        
        return re.test(String(phone));
    }
    
    const validateEmail = (email) => {

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        return re.test(String(email).toLowerCase());
    }

    if(!signedIn){
        return <p className='form'>You must be logged in to post your space</p>
    }

    return (
        <div className='form__upload-container'>
            <form className='form' onSubmit={handleSubmit(handlePostListing)}>
                {
                page===0 ?
                    <>
                        <UploadPage1 register={register} errors={errors} errorIcon={errorIcon}/>
                        <button type='button' className='button' onClick={handleCheckPage1}>Next</button>
                    </>
                    : ''
                }
                {
                page===1 ?
                    <>
                        <UploadPage2 register={register} errors={errors} errorIcon={errorIcon}/>
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
                            register={register}
                            errors={errors}
                            errorIcon={errorIcon}
                            validateEmail={validateEmail}
                            validatePhone={validatePhone}
                        />
                        <div className='form__button-container'>
                            <button type='button' className='button--back'  onClick={()=>setPage(1)}>Back</button> 
                            <button className='button' type='submit' disabled={createListingMutation.isPending}>Next</button>
                        </div>
                    </>
                    : ''
                }
            </form>
                {
                page===3 ?
                <>
                    <UploadPageImageForm newListingId={newListingId} city={city} errorIcon={errorIcon}/>
                </>
                : ''
                }
            <p className='form__footnote'>* indicates a required field</p>
            <p className='form__footnote'>** indicates at least one field must be selected</p>
            {
                createListingMutation.isError ?
                <p className='error-text'><img src={errorIcon} alt='error icon'/>Unable to post listing. Please try again.</p>
                : ''
            }
        </div>
    )
}

export default UploadPage
