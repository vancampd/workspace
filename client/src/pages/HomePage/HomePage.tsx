import {useNavigate} from 'react-router-dom';
import './HomePage.scss';
import Add from '../../components/Add';
import globe from '../../assets/images/Blue_globe_icon.svg';
import office1 from '../../assets/images/office1.jpeg';
import office2 from '../../assets/images/office2.jpeg';
import errorIcon from '../../assets/images/error-12px.svg';
import { useListingsQuery } from '../../hooks/queries/useListingsQuery';
import { useForm } from 'react-hook-form';

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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            location: '',
        },
    });

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
            <form className='form'  onSubmit={handleSubmit(handleSearch)}>
                <h2 className='form__header'>Find a workspace</h2>
                <div className='form__element-container'>
                    <label className='form__label' htmlFor='location'>Location:</label>
                    <input
                        className='form__input'
                        id='location'
                        placeholder="Enter the city you're working in"
                        {...register('location', {
                            validate: {
                                required: (location) =>
                                    location.trim() !== '' || 'You must enter a location',
                                hasListings: (location) =>
                                    Boolean(findListingCity(location)) ||
                                    'Sorry, there are no listings currently in that city',
                            },
                        })}
                    />
                    {
                        errors.location ?
                        <p className='error-text'><img src={errorIcon} alt='error icon'/>{errors.location.message}</p>
                        : ''
                    }
                </div>
                <button
                    className='button'
                    disabled={areListingsPending || didListingsFail}
                >
                    Search
                </button>
                {
                    didListingsFail ?
                    <p className='error-text'><img src={errorIcon} alt='error icon'/>Unable to load listings. Please try again.</p>
                    : ''
                }
            </form>
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
