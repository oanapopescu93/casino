import React, {useEffect, useRef} from 'react'
import Leaflet from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap}  from 'react-leaflet'
import { translate } from '../../../translations/translate'
import icon from '../../../img/icons/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.css'

const { BaseLayer } = LayersControl
let L = Leaflet.noConflict()

function MapChild(props){
    const {lang, markerOptions, popupOptions, country, city, zoom} = props 
    const map = useMap()
    const leafletRef = useRef()

    useEffect(() => {
        map.setView(markerOptions.position, zoom)
    }, [markerOptions, popupOptions, country, city, zoom])

    useEffect(() => {
        leafletRef.current.openPopup() //open popup imediately
    },[])

    return <>
        <LayersControl position="topright">
            <BaseLayer checked name="Default Map">
                <TileLayer
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </BaseLayer>
            <BaseLayer name="ESRI Streets">
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                />
            </BaseLayer>
        </LayersControl>
        <Marker ref={leafletRef} {...markerOptions}>
            <Popup {...popupOptions}><p>{translate({lang: lang, info: country + ', ' + city})}</p></Popup>
        </Marker>
    </>
}

function ContactMap(props){
    const {mapCenter, markerPosition, country, city, zoom} = props 
    let mapOptions = {
        center: mapCenter,
        maxZoom: 19,
        minZoom: 3,
        zoom: zoom,
        scrollWheelZoom: true,
        className: "contactMap"
    }
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [40,40],
        iconAnchor: [40,40],
        popupAnchor: [-22, -40]
    })
    let markerOptions = {
        position: markerPosition,
        icon: DefaultIcon,
    }
    let popupOptions={
        className: 'markerTooltipContainer',
    }

    return <div id="contact_map" className="contact_box shadow_concav">
        <MapContainer {...mapOptions}>
            <MapChild markerOptions={markerOptions} popupOptions={popupOptions} country={country} city={city} zoom={zoom}></MapChild>
        </MapContainer>
    </div>
}
export default ContactMap