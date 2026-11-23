import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './UploadPage.scss'
import UploadPage1 from '../../components/UploadPage1';
import UploadPage2 from '../../components/UploadPage2';
import UploadPage3 from '../../components/UploadPage3';
import UploadPage4 from '../../components/UploadPage4';
import errorIcon from '../../assets/images/error-12px.svg';
import { useCreateListingMutation } from '../../hooks/mutations/useCreateListingMutation';
import { useGeocodeAddressMutation } from '../../hooks/mutations/useGeocodeAddressMutation';
import { FormProvider, useForm } from 'react-hook-form';
import { STEP_FIELDS, type UploadFormValues } from './uploadFormValues';

type Coordinates = { lat: number; lng: number };

function UploadPage({signedIn, credentials}) {

    const [page, setPage] = useState(0)
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const navigate = useNavigate()

    const createListingMutation = useCreateListingMutation()
    const geocodeAddressMutation = useGeocodeAddressMutation()
    const methods = useForm<UploadFormValues>({
        // Step validation uses `trigger`, so `reValidateMode` never applies; validate on change instead.
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            rentPeriod: [],
            amenities: [],
            price: '',
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            email: '',
        },
    })
    const { handleSubmit, trigger, getValues, setError } = methods

    const handleCheckPage1 = async () => {
        const isStepValid = await trigger(STEP_FIELDS[0])
        if(isStepValid) setPage(1)
    }

    const handleCheckPage2 = async () => {
        const isStepValid = await trigger(STEP_FIELDS[1])
        if(!isStepValid) return

        const { streetAddress, city, state, zipCode } = getValues()

        try {
            const location = await geocodeAddressMutation.mutateAsync(
                `${streetAddress}, ${city}, ${state} ${zipCode}`
            )

            if(location.partialMatch) throw new Error('Partial address match')

            setCoordinates({ lat: location.lat, lng: location.lng })
            setPage(2)
        } catch {
            setError('streetAddress', {
                type: 'addressNotFound',
                message: 'We could not verify this address. Please check it and try again.',
            })
        }
    }

    const handleCheckPage3 = async () => {
        const isStepValid = await trigger(STEP_FIELDS[2])
        if(isStepValid) setPage(3)
    }

    const handlePostListing = ({ image, ...input }: UploadFormValues) => {
        createListingMutation.mutate(
            {
                ...input,
                image: image[0],
                name: credentials.name,
                coordinates: {
                    lat: String(coordinates?.lat),
                    lng: String(coordinates?.lng),
                },
            },
            {
                onSuccess: () => {
                    navigate(`/listings/${input.city.toLowerCase()}`)
                },
            }
        )
    }

    if(!signedIn){
        return <p className='form'>You must be logged in to post your space</p>
    }

    return (
        <div className='form__upload-container'>
            <FormProvider {...methods}>
                <form className='form' noValidate onSubmit={handleSubmit(handlePostListing)}>
                    {
                    page===0 ?
                        <>
                            <UploadPage1 />
                            <button type='button' className='button' onClick={handleCheckPage1}>Next</button>
                        </>
                        : ''
                    }
                    {
                    page===1 ?
                        <>
                            <UploadPage2 />
                            <div className='form__button-container'>
                                <button className='button--back' type='button' onClick={()=>setPage(0)}>Back</button> 
                                <button className='button' type='button' onClick={handleCheckPage2} disabled={geocodeAddressMutation.isPending}>Next</button>
                            </div>
                        </>
                        : ''
                    }
                    {
                    page===2 ?
                        <>
                            <UploadPage3 />
                            <div className='form__button-container'>
                                <button type='button' className='button--back'  onClick={()=>setPage(1)}>Back</button> 
                                <button className='button' type='button' onClick={handleCheckPage3}>Next</button>
                            </div>
                        </>
                        : ''
                    }
                    {
                    page===3 ?
                        <>
                            <UploadPage4 />
                            <div className='form__button-container'>
                                <button type='button' className='button--back'  onClick={()=>setPage(2)}>Back</button> 
                                <button className='button' type='submit' disabled={createListingMutation.isPending}>Post listing</button>
                            </div>
                        </>
                        : ''
                    }
                </form>
            </FormProvider>
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
