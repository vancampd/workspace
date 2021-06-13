import {Component} from 'react';
import './HomePage.scss';
import Add from '../../components/Add';
import globe from '../../assets/images/Blue_globe_icon.svg';
import office1 from '../../assets/images/office1.jpeg';
import office2 from '../../assets/images/office2.jpeg';



class HomePage extends Component {
    render(){
        return(
            <div>
                <form className='card form'>
                    <h2 className='form__header'>Find a workspace</h2>
                    <div className='form__element-container'>
                        <label className='form__label' htmlFor='location'>Location:</label>
                        <input className='form__input' name='location' id='location' placeholder='Enter a location'/>
                    </div>
                    <div className='form__element-container'>
                        <div className='form__date-container'>
                            <div className='form__start-date'>
                                <label className='form__label' htmlFor='startDate'>Start date:</label>
                                <input type='date' className='form__input' name='startDate' id='startDate' placeholder='Select a date'/>
                            </div>
                            <div className='form__end-date'>
                                <label className='form__label' htmlFor='endDate'>End date:</label>
                                <input type='date' className='form__input' name='endDate' id='endDate' placeholder='Select a date'/>
                            </div>
                        </div>
                    </div>
                    <button className='button'>Search</button>
                </form>
                <Add 
                    heading='Choose from 1000s of locations across the world' 
                    icon={globe} 
                    iconAlt='Globe Icon' 
                    background='alt-background'
                    image1={office1}
                    alt1='Shared open office'
                    image2={office2}
                    alt2='Office space with two desks'
                    buttonClass='button'
                    buttonText='List your space here'
                />
            </div>
        )
    }
}

export default HomePage;