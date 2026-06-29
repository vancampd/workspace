import React from 'react'
import './ListingMapNav.scss';

function ListingsMapNav({mapActive, setMapActive}) {

    return (
        <nav className='nav'>
            <ul className='nav__nav-list'>
                <li className='nav__list-item'>
                    <button 
                        className={mapActive ? 'nav__button' : 'nav__button--active-left'}
                        onClick={()=>setMapActive(false)}
                    >
                        Listings
                    </button>
                </li>
                <li className='nav__list-item'>
                    <button 
                        className={mapActive ? 'nav__button--active-right' : 'nav__button'}
                        onClick={()=>setMapActive(true)}
                    >
                        Map
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default ListingsMapNav
