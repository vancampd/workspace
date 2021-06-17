import {Component} from 'react';
import './Add.scss';



class Add extends Component {
    render(){
        const {heading, icon, iconAlt, background, image1, alt1, image2, alt2, buttonClass, buttonText} = this.props;
        // const appStyles = {
        //     backgroundColor: {background}
        // }

        return(
            <div className={background ? `add add__${background}` : 'add'}>
                <h2 className='add__heading'>
                    {heading}
                    {icon ? <img src={icon} alt={iconAlt} className='add__icon'/> : ''}
                </h2>
                {image1 ? <img src={image1} alt={alt1} className='add__image'/> : ''}
                {image2 ? <img src={image2} alt={alt2} className='add__image'/> : ''}
                {buttonText ? <button className={buttonClass}>{buttonText}</button> : ''}
            </div>
            
        )
    }
}

export default Add;