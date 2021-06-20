import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom';
import './HomePage.scss';
import Add from '../../components/Add';
import globe from '../../assets/images/Blue_globe_icon.svg';
import office1 from '../../assets/images/office1.jpeg';
import office2 from '../../assets/images/office2.jpeg';
import errorIcon from '../../assets/images/error-12px.svg';
import axios from 'axios';
const API_URL = process.env.REACT_APP_EXPRESS_API_URL


function HomePage() {
// TODO: add form functionality/verification
    // const [location, setLocation] = useState('');

    // const search = useLocation().search;
    // const searchLocation = new URLSearchParams(search).get('location');

    const [error, setError] = useState(false);

    const [listings, setListings] = useState([]);
    useEffect(() => {
        // Get the listings
        getListings()
        
    }, [])

    const getListings = () => {
        axios
        .get(`${API_URL}listings`)
        .then(res => {
            const listings = res.data;
            setListings(listings)
        })
        .catch(err => console.log("Error fetching listings", err))
    }

    const [input, setInput]= useState({})

    const handleInputChange = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    const history = useHistory();

    const handleSearch = (e) => {
        e.preventDefault();

       const {location} = input;

       if(!location){
           return setError(true)
       }

       const foundCity = listings.find(listing => listing.city.toLowerCase() === location.toLowerCase())

       if(!foundCity) {
          return console.log('did not find listings in that city')
       }

       history.push(`/listings/${foundCity.city.toLowerCase()}`)

    }


    return(
        <div>
            <form className='card form'  onSubmit={handleSearch}>
                <h2 className='form__header'>Find a workspace</h2>
                <div className='form__element-container'>
                    <label className='form__label' htmlFor='location'>Location:</label>
                    <input 
                        className='form__input' 
                        name='location' 
                        id='location' 
                        placeholder="Enter the city you're working in"
                        onChange={handleInputChange}
                    />
                    {
                        error && !input.location ? 
                        <p className='error-text'><img src={errorIcon} alt='error icon'/>You must enter a location</p> 
                        : ''
                    }
                </div>
                <div className='form__element-container'>
                    <div className='form__inner-container'>
                        <div className='form__inner-left'>
                            <label className='form__label' htmlFor='startDate'>Start date:</label>
                            <input type='date' className='form__input' name='startDate' id='startDate' placeholder='Select a date'/>
                        </div>
                        <div className='form__inner-right'>
                            <label className='form__label' htmlFor='endDate'>End date:</label>
                            <input type='date' className='form__input' name='endDate' id='endDate' placeholder='Select a date'/>
                        </div>
                    </div>
                </div>
                <button className='button'>Search</button>
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