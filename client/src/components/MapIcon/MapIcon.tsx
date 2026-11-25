import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'
import './MapIcon.scss'

interface MapIconProps {
    title: string
    href: string | number
    onShow?: () => void
    onHide?: () => void
}

const MapIcon = ({ title, href, onShow, onHide }: MapIconProps) => {
    return (
        <div className='icon-container'>
            <a
                href={`#${href}`}
                className='icon__link'
                aria-label={`View ${title}`}
                onMouseEnter={onShow}
                onMouseLeave={onHide}
                onFocus={onShow}
                onBlur={onHide}
            >
                <Icon icon={locationIcon} className='icon' />
            </a>
        </div>
    )
}

export default MapIcon;
