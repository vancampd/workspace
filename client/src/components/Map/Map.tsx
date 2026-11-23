import './Map.scss'
import 'maplibre-gl/dist/maplibre-gl.css'
import { setWorkerUrl } from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { useRef } from 'react'
import { Map as MapLibreMap, Marker, type MapEvent } from 'react-map-gl/maplibre'
import MapIcon from '../MapIcon'

// MapLibre locates its worker relative to its own module, which breaks once
// Vite pre-bundles or bundles it, so point it at the emitted worker file.
setWorkerUrl(maplibreWorkerUrl)

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

interface MapListing {
    id: string | number
    price: string | number
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
                                    text={listing.price}
                                    href={listing.id}
                                />
                            </Marker>
                        ))
                    }
                </MapLibreMap>
            </div>
        </div>
    )
}

export default Map
