import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'
import './MapIcon.scss'

interface MapIconProps {
    text: string | number
    href: string | number
}

const MapIcon = ({ text, href }: MapIconProps) => {
    return (
    <div className="icon-container">
      <a href={`#${href}`} className='icon__link'>
        <Icon icon={locationIcon} className="icon" />
        <p className="icon-text">{text}</p>
      </a>
    </div>
  )
}

export default MapIcon;
