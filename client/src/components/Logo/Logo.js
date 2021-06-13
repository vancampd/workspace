import {Component} from 'react';
import './Logo.scss';
import {Link} from 'react-router-dom';

class Logo extends Component {
    render(){
        return(
            <Link to='/' className='logo__link'>
                <h1 className="logo">
                    W
                    <span className='logo--underline'>or</span>
                    kspace
                </h1>   
            </Link>        
        )
    }
}

export default Logo;