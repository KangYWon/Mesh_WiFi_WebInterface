import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import axios from 'axios';
//AIzaSyCt-NwipYKBgslAi8kryPgIZay2YQkCNgs

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 37.5665, // Default latitude
    lng: 126.9780 // Default longitude
};

const apiKey = 'AIzaSyCt-NwipYKBgslAi8kryPgIZay2YQkCNgs';

export default function MapContainerWithGoogleMap() {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        // 서버로부터 GPS 데이터 가져오기
        axios.get('/api/gps-data') //서버의 주소를 정확히 지정
          .then(response => {
            setMarkers(response.data); // 서버로부터 데이터를 받아와서 markers 상태에 저장
          })
          .catch(error => {
            console.error('Error fetching GPS data:', error);
          });
      }, []);
    
      return (
        <Box sx={{ flex: 2, border: '1px solid black' }}>
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
            >
              {markers.map((marker) => (
                <Marker
                  key={marker.id} //고유 id를 key로 사용
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </Box>
      );
    }