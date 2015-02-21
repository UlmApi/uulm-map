// Karten definieren

var attr_osm = 'Kartendaten &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a>-Beitragende',
    attr_overpass = 'Punkte via <a href="http://www.overpass-api.de/">Overpass API</a>',
    attr_bbs = '<a href="http://codefor.de">CfG-Kartenserver</a>',
    attr_hikebike = '<a href="http://hikebikemap.de/">Hikebikemap.de</a>',
    attr_transitmap = 'OSM Transit Map';

var bbs_ulm = new L.TileLayer('http://tiles.codefor.de/static/bbs/ulm/{z}/{x}/{y}.png', {opacity: 0.7, attribution: [attr_osm, attr_overpass, attr_bbs].join(', ')});

var hikebike = new L.TileLayer('http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png', {opacity: 0.7, attribution: [attr_osm, attr_overpass, attr_hikebike].join(', ')});

var transitmap = new L.TileLayer('http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', {opacity: 0.7, attribution: [attr_osm, attr_overpass, attr_transitmap].join(', ')});


// Und die Basiskarte einfuehren

var map = new L.Map('map').addLayer(transitmap).setView(new L.LatLng(48.4218, 9.95), 16);

// *************************
//OverPassAPI overlays

// Zuerst alle Fahrradabstellplaetze, ab einem Zoomlevel von 15
var bikeparking = new L.OverPassLayer({
      minzoom: 15,
      query: "node(BBOX)[amenity=bicycle_parking];out;",
      callback: function(data) {
        for(i=0;i<data.elements.length;i++) {
          e = data.elements[i];
          if (e.id in this.instance._ids) return;
          this.instance._ids[e.id] = true;

          var pos = new L.LatLng(e.lat, e.lon);
//          var popup = this.instance._poiInfo(e.tags,e.id);
          var popup = '<b>Fahrradabstellanlage</b><br><div>';
          if (e.tags.name) { popup = popup + e.tags.name + '<br>'};
          if ((e.tags.covered) && (e.tags.covered == 'yes')) {popup = popup + 'überdachte Anlage<br>'};
          if (e.tags.capacity) {popup = popup + e.tags.capacity + ' Plätze<br>'};
          if (e.tags.opening_hours) {popup = popup + 'Öffnungszeiten: ' + e.tags.opening_hours + '<br>'};
          if (e.tags.operator) {popup = popup + 'Betreiber: ' + e.tags.operator};
          popup = popup + '</div><a href="http://www.openstreetmap.org/edit?editor=id&node='+e.id+'">Eintrag mit iD-Editor bearbeiten</a><br>';

          var myicon = L.icon({
              iconUrl: 'img/transport_parking_bicycle.n.0092DA.20.png',
              iconSize: [20, 20],
              iconAnchor: [0, 10],
              popupAnchor: [10, -12]
          });
          var marker = L.marker(pos, {icon: myicon}).bindPopup(popup);
          this.instance.addLayer(marker);
        }
      },
    });


// Alle Warenautomaten

var vending = new L.OverPassLayer({
      minzoom: 15,
      query: "node(BBOX)[amenity=vending_machine];out;",
      callback: function(data) {
        for(i=0;i<data.elements.length;i++) {
          e = data.elements[i];
          if (e.id in this.instance._ids) return;
          this.instance._ids[e.id] = true;

          var icon = 'img/shopping_vending_machine.glow.8E7409.32.png'
          var pos = new L.LatLng(e.lat, e.lon);
          var popup = '<b>Warenautomat</b><br><div>';
          if (e.tags.vending == 'food') 
                    { popup = popup + 'Speisen<br>';
                      icon = 'img/food_pizza.glow.8E7409.32.png'; }
          else if (e.tags.vending == 'sweets') 
                    { popup = popup + 'Süßwaren<br>';
                      icon = 'img/shopping_confectionery.glow.8E7409.32.png'; }
          else if (e.tags.vending == 'drinks') 
                    { popup = popup + 'Getränke<br>'; }
          else if (e.tags.vending == 'ice_cream')
                    { popup = popup + 'Eis<br>'; 
                      icon = 'img/food_ice_cream.glow.8E7409.32.png'; }
          else if (e.tags.vending == 'condoms')
                    { popup = popup + 'Kondome<br>'; }
          else { popup = popup + e.tags.vending + '<br>'; }
                                          
//          if (e.tags.payment:coins == 'yes') {popup = popup + 'Nimmt Münzen<br>'}; // geht net, wegen Doppelpunkt oO
          if (e.tags.operator) {popup = popup + 'Betreiber: ' + e.tags.operator};
          popup = popup + '</div><a href="http://www.openstreetmap.org/edit?editor=id&node='+e.id+'">Eintrag mit iD-Editor bearbeiten</a><br>';

          var myicon = L.icon({
              iconUrl: icon,
              iconSize: [20, 20],
              iconAnchor: [0, 10],
              popupAnchor: [10, -12]
          });
          var marker = L.marker(pos, {icon: myicon}).bindPopup(popup);
          this.instance.addLayer(marker);
        }
      },
    });




var baseMaps = {
   "Code for Germany: BBS Ulm": bbs_ulm,
   "Hike and Bike Map": hikebike,
   "Transit Map": transitmap
};

var overlayMaps = {
   "Fahrradabstellplätze": bikeparking,
   "Warenautomaten": vending
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

