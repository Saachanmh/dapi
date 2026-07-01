import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import RoutingPanel from './components/RoutingPanel';
import FilterBar from './components/FilterBar';
import AccessibilityPanel from './components/AccessibilityPanel';
import ElementTypePanel from './components/ElementTypePanel';
import { getPMRByCommune, getAllPMRLocations, formatPMRData } from './services/index.js';
import { geocodeAddress } from './services/index.js';
import { findPMRAlongRoute } from './services/pmrProximityService';
import {
    createMarker,
    saveMarkersToLocalStorage,
    getMarkersFromLocalStorage,
} from './services/customMarkerService';
import './App.css';

/**
 * Calcule un itinéraire rue par rue avec OSRM public (sans clé API, sans CORS)
 */
const calculateRouteWithOSRM = async (start, end) => {
    const osrmServers = [
        'https://router.project-osrm.org/route/v1/foot',
        'https://routing.openstreetmap.de/routed-foot/route/v1/foot'
    ];

    for (const server of osrmServers) {
        try {
            const url = `${server}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson&steps=true`;

            const response = await fetch(url, {
                method: 'GET',
                signal: AbortSignal.timeout(8000)
            });

            if (!response.ok) {
                console.warn(`Serveur ${server} a retourné ${response.status}`);
                continue;
            }

            const data = await response.json();

            if (data.code === 'Ok' && data.routes?.[0]) {
                const coordinates = data.routes[0].geometry.coordinates.map(
                    coord => [coord[1], coord[0]]
                );

                console.log(`✅ Route calculée avec ${server}`, {
                    points: coordinates.length,
                    distance: data.routes[0].distance,
                    duration: data.routes[0].duration
                });

                return {
                    geometry: coordinates,
                    distance: data.routes[0].distance,
                    duration: data.routes[0].duration,
                    success: true
                };
            }
        } catch (error) {
            console.warn(`❌ Erreur avec ${server}:`, error.message);
            continue;
        }
    }

    throw new Error('Impossible de calculer l\'itinéraire - Tous les serveurs de routage sont indisponibles');
};

/**
 * Composant principal de l'application PMR
 */
function App() {
    const [pmrLocations, setPMRLocations] = useState([]);
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);
    const [route, setRoute] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('bank');
    const [routePath, setRoutePath] = useState(null);
    const [error, setError] = useState(null);
    const [showPMR, setShowPMR] = useState(false);
    const [showRoutingPanel, setShowRoutingPanel] = useState(false);
    const [customMarkers, setCustomMarkers] = useState(() => getMarkersFromLocalStorage());
    const [showElementTypePanel, setShowElementTypePanel] = useState(false);
    const [pendingMarkerType, setPendingMarkerType] = useState(null);
    const [showPlacementHint, setShowPlacementHint] = useState(false);

    const loadPMRByNantes = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getPMRByCommune('Nantes');
            const formatted = formatPMRData(data);
            setPMRLocations(formatted);
        } catch (error) {
            console.error('Erreur lors du chargement des places PMR de Nantes:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadPMRLocations = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAllPMRLocations();
            const formatted = formatPMRData(data);
            setPMRLocations(formatted);
        } catch (error) {
            console.error('Erreur lors du chargement des places PMR:', error);
            await loadPMRByNantes();
        } finally {
            setIsLoading(false);
        }
    }, [loadPMRByNantes]);

    const pmrNearbyRoute = useMemo(() => {
        if (routePath && pmrLocations.length > 0) {
            return findPMRAlongRoute(pmrLocations, routePath, 0.5);
        }

        return [];
    }, [pmrLocations, routePath]);

    useEffect(() => {
        const initialize = async () => {
            await loadPMRLocations();
        };

        void initialize();
    }, [loadPMRLocations]);

    const handleSearch = async (addresses) => {
        try {
            setIsLoading(true);
            setError(null);

            let startGeo = addresses.depart;
            if (!startGeo.latitude || !startGeo.longitude) {
                startGeo = await geocodeAddress(addresses.depart.address);
            }
            setStartLocation(startGeo);

            let endGeo = addresses.arrivee;
            if (!endGeo.latitude || !endGeo.longitude) {
                endGeo = await geocodeAddress(addresses.arrivee.address);
            }
            setEndLocation(endGeo);

            const routeData = await calculateRouteWithOSRM(startGeo, endGeo);

            setRoute(routeData);
            setRoutePath(routeData.geometry);
            setShowRoutingPanel(true);

            console.log('✅ Trajet calculé rue par rue:', {
                distance: `${routeData.distance.toFixed(2)} m`,
                duree: `${Math.round(routeData.duration / 60)} min`,
                points: routeData.geometry.length
            });

        } catch (err) {
            console.error('❌ Erreur lors de la recherche:', err);
            setError(err.message || 'Erreur lors du calcul de l\'itinéraire');
            setRoute(null);
            setRoutePath(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePMRMarkerClick = (location) => {
        console.log('Place sélectionnée:', location);
    };

    const handleMapClick = (coordinates) => {
        console.log('🗺️ Clic sur la carte:', coordinates, 'Type en attente:', pendingMarkerType);

        if (pendingMarkerType) {
            const newMarker = createMarker(
                coordinates.latitude,
                coordinates.longitude,
                pendingMarkerType,
                ''
            );

            console.log('✅ Marqueur créé:', newMarker);

            const updatedMarkers = [...customMarkers, newMarker];
            setCustomMarkers(updatedMarkers);
            saveMarkersToLocalStorage(updatedMarkers);

            setPendingMarkerType(null);
            setShowElementTypePanel(false);
            setShowPlacementHint(false);
        }
    };

    const handleSelectElementType = (type) => {
        console.log('🎯 Type d\'élément sélectionné:', type);
        setPendingMarkerType(type);
        setShowElementTypePanel(false);
        setShowPlacementHint(true);
    };

    const handleShowElementTypePanel = () => {
        setShowElementTypePanel(true);
    };

    const handleCloseElementTypePanel = () => {
        setShowElementTypePanel(false);
        setPendingMarkerType(null);
        setShowPlacementHint(false);
    };

    const handleCustomMarkerClick = (marker) => {
        console.log('Marqueur personnalisé cliqué:', marker);
    };

    const handleClearRoute = () => {
        setStartLocation(null);
        setEndLocation(null);
        setRoute(null);
        setRoutePath(null);
        setShowRoutingPanel(false);
        setError(null);
    };

    const handleCloseRoutingPanel = () => {
        setShowRoutingPanel(false);
    };

    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
    };

    const handlePMRToggle = (checked) => {
        setShowPMR(checked);
    };

    const handleShowPMRNearby = () => {
        if (pmrNearbyRoute.length > 0) {
            setShowPMR(true);
        }
    };

    const handleAccessibilitySettings = (action) => {
        console.log('Action accessibilité:', action);
    };

    let visiblePMRLocations = [];
    if (showPMR) {
        if (pmrNearbyRoute.length > 0) {
            visiblePMRLocations = pmrNearbyRoute;
        } else if (routePath) {
            visiblePMRLocations = [];
        } else {
            visiblePMRLocations = pmrLocations;
        }
    }

    return (
        <div className="app">
            {error && (
                <div className="app__error">
                    ⚠️ {error}
                </div>
            )}

            {showPlacementHint && (
                <div className="app__placement-hint">
                    📍 Cliquez sur la carte pour placer votre signalement
                </div>
            )}

            <Map
                pmrLocations={visiblePMRLocations}
                startLocation={startLocation}
                endLocation={endLocation}
                routePath={routePath}
                customMarkers={customMarkers}
                onMarkerClick={handlePMRMarkerClick}
                onMapClick={handleMapClick}
                onCustomMarkerClick={handleCustomMarkerClick}
            />

            <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                startLocation={startLocation}
                endLocation={endLocation}
            />

            <FilterBar
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onPMRToggle={handlePMRToggle}
                showPMR={showPMR}
            />

            {showRoutingPanel && (
                <RoutingPanel
                    startLocation={startLocation}
                    endLocation={endLocation}
                    route={route}
                    isLoading={isLoading}
                    onClear={handleClearRoute}
                    onClose={handleCloseRoutingPanel}
                    pmrNearbyCount={pmrNearbyRoute.length}
                    onShowPMRNearby={handleShowPMRNearby}
                />
            )}

            <AccessibilityPanel
                onSettingsClick={handleAccessibilitySettings}
                onAddMarker={handleShowElementTypePanel}
            />

            {showElementTypePanel && (
                <ElementTypePanel
                    onSelectType={handleSelectElementType}
                    onClose={handleCloseElementTypePanel}
                />
            )}
        </div>
    );
}

export default App;
