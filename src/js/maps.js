// ==================== INTERACTIVE MAP WITH LEAFLET.JS ====================

let map = null;
let markers = [];
let propertyData = [];

// Inisialisasi peta
function initMap(containerId = 'map', center = [-8.1689, 113.7002], zoom = 13) {
    // Buat peta dengan center di Jember
    map = L.map(containerId).setView(center, zoom);
    
    // Tambahkan tile layer dari OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Load properties dari database
    loadMapProperties();
}

// Load data properti dari API
async function loadMapProperties() {
    try {
        const response = await fetch('api/get_map_properties.php');
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            propertyData = result.data;
            addMarkersToMap(propertyData);
        } else {
            console.log('Tidak ada properti dengan koordinat');
        }
    } catch (error) {
        console.error('Error loading map properties:', error);
    }
}

// Tambahkan marker ke peta
function addMarkersToMap(properties) {
    // Hapus marker lama jika ada
    clearMarkers();
    
    properties.forEach(property => {
        // Custom icon berdasarkan tipe properti
        const icon = getPropertyIcon(property.type);
        
        // Buat marker
        const marker = L.marker([property.latitude, property.longitude], {
            icon: icon
        }).addTo(map);
        
        // Buat popup content
        const popupContent = `
            <div class="property-popup" style="min-width: 250px;">
                <div style="position: relative; height: 150px; overflow: hidden; border-radius: 8px; margin-bottom: 10px;">
                    <img src="${property.foto}" 
                         alt="${property.nama}"
                         style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 5px 0;">
                    <span style="background: #2563eb; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px;">
                        ${property.type}
                    </span>
                    <h6 style="margin: 8px 0; font-weight: 600; color: #1f2937;">
                        ${property.nama}
                    </h6>
                    <p style="margin: 5px 0; font-size: 13px; color: #6b7280;">
                        <i class="bi bi-geo-alt"></i> ${property.kecamatan}
                    </p>
                    <div style="border-top: 1px solid #e5e7eb; margin: 10px 0; padding-top: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p style="margin: 0; font-size: 18px; font-weight: 700; color: #2563eb;">
                                    ${property.harga_format}
                                </p>
                                <p style="margin: 0; font-size: 11px; color: #9ca3af;">per bulan</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="margin: 0; font-size: 12px; color: #16a34a;">
                                    ${property.kamar_tersedia} kamar tersedia
                                </p>
                            </div>
                        </div>
                    </div>
                    <a href="listing-detail.html?id=${property.id}" 
                       class="btn btn-primary btn-sm w-100" 
                       style="margin-top: 10px; text-decoration: none; display: block; text-align: center; padding: 8px; border-radius: 6px;">
                        Lihat Detail
                    </a>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });
        
        // Event listener untuk marker
        marker.on('click', function() {
            map.setView([property.latitude, property.longitude], 15);
        });
        
        markers.push(marker);
    });
    
    // Fit bounds jika ada marker
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Get custom icon berdasarkan tipe properti
function getPropertyIcon(type) {
    let iconColor = '#2563eb'; // default blue
    let iconClass = 'bi-building';
    
    if (type.includes('Putri')) {
        iconColor = '#ec4899'; // pink
        iconClass = 'bi-house-heart';
    } else if (type.includes('Putra')) {
        iconColor = '#3b82f6'; // blue
        iconClass = 'bi-house';
    } else if (type.includes('Campur')) {
        iconColor = '#8b5cf6'; // purple
        iconClass = 'bi-houses';
    } else if (type.includes('Kontrakan')) {
        iconColor = '#10b981'; // green
        iconClass = 'bi-house-door';
    }
    
    return L.divIcon({
        html: `
            <div style="
                background: ${iconColor}; 
                color: white; 
                width: 36px; 
                height: 36px; 
                border-radius: 50% 50% 50% 0; 
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <i class="bi ${iconClass}" style="transform: rotate(45deg); font-size: 16px;"></i>
            </div>
        `,
        className: 'custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
}

// Clear semua marker
function clearMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
}

// Filter properti berdasarkan tipe
function filterPropertiesByType(type) {
    if (type === 'all') {
        addMarkersToMap(propertyData);
    } else {
        const filtered = propertyData.filter(p => 
            p.type.toLowerCase().includes(type.toLowerCase())
        );
        addMarkersToMap(filtered);
    }
}

// Filter properti berdasarkan range harga
function filterPropertiesByPrice(minPrice, maxPrice) {
    const filtered = propertyData.filter(p => 
        p.harga >= minPrice && p.harga <= maxPrice
    );
    addMarkersToMap(filtered);
}

// Search properti berdasarkan nama atau lokasi
function searchPropertiesOnMap(query) {
    const filtered = propertyData.filter(p => 
        p.nama.toLowerCase().includes(query.toLowerCase()) ||
        p.alamat.toLowerCase().includes(query.toLowerCase()) ||
        p.kecamatan.toLowerCase().includes(query.toLowerCase())
    );
    addMarkersToMap(filtered);
}

// Zoom ke properti tertentu
function zoomToProperty(propertyId) {
    const property = propertyData.find(p => p.id == propertyId);
    if (property) {
        map.setView([property.latitude, property.longitude], 17);
        
        // Buka popup marker
        const marker = markers.find(m => 
            m.getLatLng().lat === property.latitude && 
            m.getLatLng().lng === property.longitude
        );
        if (marker) {
            marker.openPopup();
        }
    }
}

// Export functions
window.MapManager = {
    init: initMap,
    filter: filterPropertiesByType,
    filterPrice: filterPropertiesByPrice,
    search: searchPropertiesOnMap,
    zoomTo: zoomToProperty,
    refresh: loadMapProperties
};