import {useNavigate} from 'react-router-dom';
import './HomePage.scss';
import Add from '../../components/Add';
import globe from '../../assets/images/Blue_globe_icon.svg';
import office1 from '../../assets/images/office1.jpeg';
import office2 from '../../assets/images/office2.jpeg';
import FormError from '../../components/FormError';
import TextField from '../../components/TextField';
import { useListingsQuery } from '../../hooks/queries/useListingsQuery';
import { FormProvider, useForm } from 'react-hook-form';

type SearchFormValues = {
    location: string;
};


function HomePage() {
    const {
        data: listings = [],
        isPending: areListingsPending,
        isError: didListingsFail,
    } = useListingsQuery();
    const navigate = useNavigate();
    const methods = useForm<SearchFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            location: '',
        },
    });
    const { handleSubmit } = methods;

    const findListingCity = (location: string) => {
        const normalizedLocation = location.trim().toLowerCase()

        return listings.find(
            (listing) => listing.city.toLowerCase() === normalizedLocation
        )
    }

    const handleSearch = ({ location }: SearchFormValues) => {
        const foundCity = findListingCity(location)

        if(!foundCity) return

        navigate(`/listings/${foundCity.city.toLowerCase()}`)
    }


    return(
        <div>
            <FormProvider {...methods}>
                <form className='form'  onSubmit={handleSubmit(handleSearch)}>
                    <h2 className='form__header'>Find a workspace</h2>
                    <TextField
                        name='location'
                        label='Location:'
                        placeholder="Enter the city you're working in"
                        rules={{
                            validate: {
                                required: (location) =>
                                    location.trim() !== '' || 'You must enter a location',
                                hasListings: (location) =>
                                    Boolean(findListingCity(location)) ||
                                    'Sorry, there are no listings currently in that city',
                            },
                        }}
                    />
                    <button
                        className='button'
                        disabled={areListingsPending || didListingsFail}
                    >
                        Search
                    </button>
                    {didListingsFail ? <FormError>Unable to load listings. Please try again.</FormError> : ''}
                </form>
            </FormProvider>
            <Add
                heading='Become one of our 1000s of locations across the world'
                icon={globe}
                iconAlt='Globe Icon'
                background='alt-background'
                image1={office1}
                alt1='Shared open office'
                image2={office2}
                alt2='Office space with two desks'
                buttonClass='button'
                buttonText='List your space here'
                path='/post'
            />
        </div>
    )
}

export default HomePage;
