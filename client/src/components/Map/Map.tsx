import './Map.scss'
import 'maplibre-gl/dist/maplibre-gl.css'
import { setWorkerUrl, type PositionAnchor } from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { useRef, useState } from 'react'
import { Map as MapLibreMap, Marker, Popup, type MapEvent } from 'react-map-gl/maplibre'
import MapIcon from '../MapIcon'

// MapLibre locates its worker relative to its own module, which breaks once
// Vite pre-bundles or bundles it, so point it at the emitted worker file.
setWorkerUrl(maplibreWorkerUrl)

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

// The preview picks whichever side of the pin fits inside the map. The pin's tip
// sits on the listing's coordinates and it is about 32px tall, so offset each
// side to clear the pin rather than cover it.
const PREVIEW_OFFSET: Record<PositionAnchor, [number, number]> = {
    'top': [0, 4],
    'top-left': [8, 4],
    'top-right': [-8, 4],
    'bottom': [0, -36],
    'bottom-left': [8, -36],
    'bottom-right': [-8, -36],
    'left': [16, -16],
    'right': [-16, -16],
    'center': [0, -16],
}

interface MapListing {
    id: string | number
    price: string | number
    title: string
    description: string
    images: string[]
    coordinates: { lat: string | number, lng: string | number }
}

interface MapProps {
    listings: MapListing | MapListing[]
    center?: { lat: number, lng: number }
    zoom?: number
}

function Map({ listings, center, zoom }: MapProps) {
    const defaultProps = {
        zoom: 10
    };

    // Compact attribution opens itself once its text loads and only closes when
    // the map is dragged. Close it the first time it opens; the "i" button
    // still toggles it afterwards.
    const isAttributionCollapsed = useRef(false)
    const collapseAttribution = (event: MapEvent) => {
        if (isAttributionCollapsed.current) return

        const attribution = event.target
            .getContainer()
            .querySelector('.maplibregl-ctrl-attrib.maplibregl-compact-show')

        if (attribution) {
            attribution.classList.remove('maplibregl-compact-show')
            isAttributionCollapsed.current = true
        }
    }

    const listingList = Array.isArray(listings) ? listings : [listings]

    // The listing whose pin is hovered or focused; its preview card is shown.
    const [previewId, setPreviewId] = useState<MapListing['id'] | null>(null)
    const previewListing = listingList.find(listing => listing.id === previewId)
    const showPreview = (id: MapListing['id']) => setPreviewId(id)
    const hidePreview = (id: MapListing['id']) => setPreviewId(current => (current === id ? null : current))

    // Without a center (e.g. the favorites page), center on the first listing.
    const firstCoordinates = listingList[0]?.coordinates
    const mapCenter = center ?? (firstCoordinates && {
        lat: Number(firstCoordinates.lat),
        lng: Number(firstCoordinates.lng),
    })

    if (!mapCenter || !Number.isFinite(mapCenter.lat) || !Number.isFinite(mapCenter.lng)) {
        return <div className='map-container' />
    }

    return (
        <div>
            <div className='map-container'>
                <MapLibreMap
                    initialViewState={{
                        latitude: mapCenter.lat,
                        longitude: mapCenter.lng,
                        zoom: zoom || defaultProps.zoom
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle={MAP_STYLE}
                    attributionControl={{ compact: true }}
                    onStyleData={collapseAttribution}
                    onSourceData={collapseAttribution}
                >
                    {
                        listingList.map(listing => (
                            <Marker
                                key={listing.id}
                                latitude={Number(listing.coordinates.lat)}
                                longitude={Number(listing.coordinates.lng)}
                                anchor='bottom'
                            >
                                <MapIcon
                                    title={listing.title}
                                    href={listing.id}
                                    onShow={() => showPreview(listing.id)}
                                    onHide={() => hidePreview(listing.id)}
                                />
                            </Marker>
                        ))
                    }
                    {previewListing && (
                        <Popup
                            latitude={Number(previewListing.coordinates.lat)}
                            longitude={Number(previewListing.coordinates.lng)}
                            offset={PREVIEW_OFFSET}
                            maxWidth='240px'
                            closeButton={false}
                            closeOnClick={false}
                            className='map-preview'
                        >
                            <div className='map-preview__content'>
                                {previewListing.images?.[0] && (
                                    <img
                                        className='map-preview__image'
                                        src={previewListing.images[0]}
                                        alt=''
                                    />
                                )}
                                <div className='map-preview__body'>
                                    <p className='map-preview__title'>{previewListing.title}</p>
                                    <p className='map-preview__price'>{previewListing.price}</p>
                                    <p className='map-preview__description'>{previewListing.description}</p>
                                </div>
                            </div>
                        </Popup>
                    )}
                </MapLibreMap>
            </div>
        </div>
    )
}

export default Map
