'use client';
import { useState, useEffect, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

// Declare global google object for TypeScript
declare global {
  interface Window {
    google: typeof google;
  }
}

interface CurrentLocationMapProps {
  value?: string; // Format: "address|lat,lng" or just "lat,lng"
  onChange?: (location: string) => void;
  readonly?: boolean;
  className?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationData {
  address: string;
  coordinates: Coordinates;
}

// Parse location string into address and coordinates
const parseLocation = (locationString?: string): LocationData | null => {
  if (!locationString) return null;
  
  if (locationString.includes('|')) {
    // Format: "address|lat,lng"
    const [address, coords] = locationString.split('|');
    const [lat, lng] = coords.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { address, coordinates: { lat, lng } };
    }
  } else if (locationString.includes(',')) {
    // Format: "lat,lng"
    const [lat, lng] = locationString.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { address: '', coordinates: { lat, lng } };
    }
  }
  
  return null;
};

// Format location data into string
const formatLocation = (address: string, coordinates: Coordinates): string => {
  return `${address}|${coordinates.lat},${coordinates.lng}`;
};

// Map component that uses Google Maps API
function MapComponent({ 
  center, 
  onLocationSelect, 
  readonly = false 
}: { 
  center: Coordinates; 
  onLocationSelect?: (location: LocationData) => void;
  readonly?: boolean;
}) {
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      const mapInstance = new window.google.maps.Map(node, {
        center,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        gestureHandling: readonly ? 'none' : 'auto',
        disableDoubleClickZoom: readonly,
        draggable: !readonly,
        scrollwheel: !readonly,
      });
      setMap(mapInstance);
    }
  }, [center, readonly]);

  useEffect(() => {
    if (map) {
      // Create marker
      const markerInstance = new google.maps.Marker({
        position: center,
        map: map,
        draggable: !readonly,
        title: readonly ? 'Current Location' : 'Drag to set location',
      });
      setMarker(markerInstance);

      if (!readonly && onLocationSelect) {
        // Add click listener to map
        const clickListener = map.addListener('click', (event: google.maps.MapMouseEvent) => {
          const position = event.latLng;
          if (position) {
            const coordinates = {
              lat: position.lat(),
              lng: position.lng()
            };
            markerInstance.setPosition(coordinates);
            
            // Reverse geocoding to get address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: coordinates }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
              if (status === 'OK' && results?.[0]) {
                onLocationSelect({
                  address: results[0].formatted_address,
                  coordinates
                });
              } else {
                onLocationSelect({
                  address: `${coordinates.lat}, ${coordinates.lng}`,
                  coordinates
                });
              }
            });
          }
        });

        // Add drag listener to marker
        const dragListener = markerInstance.addListener('dragend', () => {
          const position = markerInstance.getPosition();
          if (position) {
            const coordinates = {
              lat: position.lat(),
              lng: position.lng()
            };
            
            // Reverse geocoding to get address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: coordinates }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
              if (status === 'OK' && results?.[0]) {
                onLocationSelect({
                  address: results[0].formatted_address,
                  coordinates
                });
              } else {
                onLocationSelect({
                  address: `${coordinates.lat}, ${coordinates.lng}`,
                  coordinates
                });
              }
            });
          }
        });

        return () => {
          google.maps.event.removeListener(clickListener);
          google.maps.event.removeListener(dragListener);
        };
      }
    }
  }, [map, center, readonly, onLocationSelect]);

  return <div ref={ref} className="w-full h-full" />;
}

// Loading component
const MapLoading = ({ t }: { t: any }) => (
  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-gray-600">{t.profile.location.loadingMap}</p>
    </div>
  </div>
);

// Error component
const MapError = ({ t }: { t: any }) => (
  <div className="w-full h-64 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
    <div className="text-center text-red-600">
      <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{t.profile.location.mapError}</p>
    </div>
  </div>
);

export default function CurrentLocationMap({
  value,
  onChange,
  readonly = false,
  className = ''
}: CurrentLocationMapProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);

  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    parseLocation(value)
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Default center (Beijing)
  const defaultCenter: Coordinates = { lat: 39.9042, lng: 116.4074 };
  const mapCenter = currentLocation?.coordinates || defaultCenter;

  const handleLocationSelect = (location: LocationData) => {
    setCurrentLocation(location);
    if (onChange) {
      onChange(formatLocation(location.address, location.coordinates));
    }
  };

  const getCurrentPosition = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Reverse geocoding to get address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: coordinates }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            setIsGettingLocation(false);
            if (status === 'OK' && results?.[0]) {
              handleLocationSelect({
                address: results[0].formatted_address,
                coordinates
              });
            } else {
              handleLocationSelect({
                address: `${coordinates.lat}, ${coordinates.lng}`,
                coordinates
              });
            }
          });
        },
        (error) => {
          setIsGettingLocation(false);
          console.error('Geolocation error:', error);
          alert(t.profile.location.geolocationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setIsGettingLocation(false);
      alert(t.profile.location.geolocationNotSupported);
    }
  };

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <MapLoading t={t} />;
      case Status.FAILURE:
        return <MapError t={t} />;
      case Status.SUCCESS:
        return (
          <MapComponent
            center={mapCenter}
            onLocationSelect={readonly ? undefined : handleLocationSelect}
            readonly={readonly}
          />
        );
    }
  };

  return (
    <div className={`current-location-map ${className}`}>
      {/* Current Location Display */}
      {currentLocation && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900">{t.profile.location.currentLocation}</p>
              <p className="text-sm text-blue-700 break-words">{currentLocation.address}</p>
              {/* <p className="text-xs text-blue-600 mt-1">
                {t.profile.location.coordinates}: {currentLocation.coordinates.lat.toFixed(6)}, {currentLocation.coordinates.lng.toFixed(6)}
              </p> */}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!readonly && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={getCurrentPosition}
            disabled={isGettingLocation}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGettingLocation ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span>{isGettingLocation ? t.profile.location.gettingLocation : t.profile.location.getCurrentLocation}</span>
          </button>
          
          {currentLocation && (
            <button
              onClick={() => {
                setCurrentLocation(null);
                if (onChange) onChange('');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{t.profile.location.clearLocation}</span>
            </button>
          )}
        </div>
      )}

      {/* Map Container */}
      <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300">
        <Wrapper
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          render={render}
          libraries={['places']}
        />
      </div>

      {/* Instructions */}
      {!readonly && (
        <div className="mt-3 text-sm text-gray-600">
          <p>💡 {t.profile.location.instructions}</p>
          <p className="mt-1">📍 {t.profile.location.dragHint}</p>
        </div>
      )}
    </div>
  );
}
