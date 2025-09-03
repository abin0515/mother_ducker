/**
 * Utility functions for Google Maps integration
 * Handles URL generation and location parsing
 */

export interface ParsedLocation {
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Parse location string from database
 * Format: "address|lat,lng" or "lat,lng"
 */
export function parseLocationString(locationString?: string): ParsedLocation | null {
  if (!locationString) return null;
  
  try {
    if (locationString.includes('|')) {
      // Format: "address|lat,lng"
      const [address, coords] = locationString.split('|');
      const [lat, lng] = coords.split(',').map(Number);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        return {
          address: address.trim(),
          latitude: lat,
          longitude: lng
        };
      }
    } else if (locationString.includes(',')) {
      // Format: "lat,lng"
      const [lat, lng] = locationString.split(',').map(Number);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        return {
          address: '',
          latitude: lat,
          longitude: lng
        };
      }
    }
  } catch (error) {
    console.error('Error parsing location string:', error);
  }
  
  return null;
}

/**
 * Generate Google Maps URL for a single location
 */
export function generateGoogleMapsUrl(location: ParsedLocation, label?: string): string {
  const { latitude, longitude } = location;
  const coords = `${latitude},${longitude}`;
  
  if (label) {
    // URL with custom label
    return `https://maps.google.com/maps?q=${coords}&label=${encodeURIComponent(label)}`;
  }
  
  // Simple location URL
  return `https://maps.google.com/maps?q=${coords}`;
}

/**
 * Generate Google Maps directions URL
 * Opens Google Maps with directions from user's location to target
 */
export function generateDirectionsUrl(targetLocation: ParsedLocation): string {
  const { latitude, longitude } = targetLocation;
  return `https://maps.google.com/maps/dir//${latitude},${longitude}`;
}

/**
 * Generate Google Maps URL with search query
 * Useful for address-based searches
 */
export function generateSearchUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}`;
}

/**
 * Open Google Maps in new tab
 */
export function openGoogleMaps(location: ParsedLocation, label?: string): void {
  const url = generateGoogleMapsUrl(location, label);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Open Google Maps directions in new tab
 */
export function openDirections(targetLocation: ParsedLocation): void {
  const url = generateDirectionsUrl(targetLocation);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Check if location string has coordinates
 */
export function hasCoordinates(locationString?: string): boolean {
  const parsed = parseLocationString(locationString);
  return parsed !== null;
}

/**
 * Get display address from location string
 */
export function getDisplayAddress(locationString?: string): string {
  const parsed = parseLocationString(locationString);
  if (!parsed) return '';
  
  return parsed.address || `${parsed.latitude}, ${parsed.longitude}`;
}
