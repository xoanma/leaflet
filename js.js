(function($){

  /** Define the layer type
   *  GEOGRAPHICALGRIDSYSTEMS.MAPS
   *  GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.CLASSIQUE
   *  GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD
   */
  var layerIGNScanStd = "GEOGRAPHICALGRIDSYSTEMS.MAPS";

  // The WMTS URL 
  var url = "https://www.ign.es/wmts/pnoa-ma?request=getTile&layer=OI.OrthoimageCoverage";

  var ign = new L.TileLayer.WMTS(url,
    {
    }
  );
  var map = L.map('map').setView([48.505, 3.09], 13);
  L.control.scale({ 'position': 'bottomleft', 'metric': true, 'imperial': false }).addTo(map);
  map.addLayer(ign);
  var baseLayers = { "Carte IGN": ign };
  L.control.layers(baseLayers, {}).addTo(map);         


    const geojsonMarkerOptions = L.icon({
      iconUrl: 'https://www.eurostarshotels.com/CLIENTES/www.eurostarshotels.com/images/markers/m_eurostars.png',
      iconSize: [50, 50], 
      iconAnchor: [25, 50], 
      popupAnchor: [0, -35] 
    });

    const markers = L.markerClusterGroup({
      disableClusteringAtZoom: 18,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      iconCreateFunction: function (cluster) {

        var markers = cluster.getAllChildMarkers();
        return L.divIcon({
          html: markers.length,
          className: "mycluster",
          iconSize: L.point(40, 40),
        });
      },
    });

    function highlightFeature() {
      console.log('hover')
    }

    L.geoJSON(data, {
      
      pointToLayer: function(feature, coordinates){
          var popupContent = '<div class="sta-popup">' +
            '<div class="sta-popup_cont">' +
            '<div class="sta-popup_imagen" data-img="' + feature.properties.img + '" style="background-image:url(' + feature.properties.img + ')"  >' +
            '</div>' +
            '<div class="sta-texto">' +
            '<div class="sta-popup_nombre">' +
            feature.properties.nombre +
            '</div>' +
            '<div class="sta-popup_descr">' +
            feature.properties.descr +
            '</div>' +
            '<div class="sta-popup_lugar">' +
            feature.properties.lugar +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
            return markers.addLayer(L.marker(coordinates, {icon: geojsonMarkerOptions}).bindPopup(popupContent, {maxWidth : 300}));
        },
        onEachFeature: function (feature, layer) {
          layer.on({
            mouseover: highlightFeature,
            mouseout: highlightFeature,
          });
        }
    }).addTo(map)


//map.addLayer(markers);
    
})(window.jQuery)









//Script para convertir en geojson



    fetch("datos/quevisitarGALnaturaleza.json")
    .then(response => {
       return response.json();
    })
    .then(jsondata => filtrarJsonSitios(jsondata));
    var jsonMap = {
      type: "FeatureCollection",
      features: [],
    };

    var push = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: []
        },
        properties: {
          nombre: "",
          descr: "",
          lugar: "",
          ico: "",
          img: "",
          id: "",
        },
      };

      var links = [];
    function filtrarJsonSitios(eljson){
        for (var i = 0; i < eljson.length; i++) {
            var clone = JSON.parse(JSON.stringify(push));
            clone.geometry.coordinates.push(Number(eljson[i].pt[0].lng), Number(eljson[i].pt[0].lat))
            clone.properties.nombre = eljson[i].pt[0].nombre
            clone.properties.descr = eljson[i].nom
            clone.properties.lugar = eljson[i].pt[0].descriptor
            clone.properties.ico = eljson[i].ico
            clone.properties.lugar = clone.properties.lugar.replace('<br/>'+clone.properties.descr, '')
            clone.properties.id = 'https://www.turismo.gal/recurso/-/detalle/' + eljson[i].pt[0].id + "?langId=es_ES"
            links.push(clone.properties.id);
            var img = eljson[i].pt[0].img;
            if(!!img){
                clone.properties.img = eljson[i].pt[0].img
            }
            jsonMap.features.push(clone)
            //var marker = L.marker([eljson[i].pt[0].lat, eljson[i].pt[0].lng]).addTo(map);
        }
        console.log(jsonMap)
        console.log(links)
    }
    
