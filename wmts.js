L.TileLayer.WMTS = L.TileLayer.extend({
  defaultWmtsParams: {
    TileMatrixSet : 'GoogleMapsCompatible'
  },
  initialize: function(a, b) {
      this._url = a;
      var c = {}
        , d = Object.keys(b);
      d.forEach(a=>{
          c[a.toLowerCase()] = b[a]
      }
      );
      var e = L.extend({}, this.defaultWmtsParams)
        , f = c.tileSize || this.options.tileSize;
      for (var g in e.width = c.detectRetina && L.Browser.retina ? e.height = 2 * f : e.height = f,
      c)
          e.hasOwnProperty(g) && "matrixIds" != g && (e[g] = c[g]);
      this.wmtsParams = e,
      this.matrixIds = b.matrixIds || this.getDefaultMatrix(),
      L.setOptions(this, b)
  },
  onAdd: function(a) {
      this._crs = this.options.crs || a.options.crs,
      L.TileLayer.prototype.onAdd.call(this, a)
  },
  getTileUrl: function(a) {
      var b = this.options.tileSize
        , c = a.multiplyBy(b);
      c.x += 1,
      c.y -= 1;
      var d = c.add(new L.Point(b,b))
        , e = this._tileZoom
        , f = this._crs.project(this._map.unproject(c, e))
        , g = this._crs.project(this._map.unproject(d, e));
      tilewidth = g.x - f.x;
      var h = this.matrixIds[e].identifier
        , i = h
        , j = this.matrixIds[e].topLeftCorner.lng
        , k = this.matrixIds[e].topLeftCorner.lat
        , l = Math.floor((f.x - j) / tilewidth)
        , m = -Math.floor((f.y - k) / tilewidth)
        , n = L.Util.template(this._url, {
          s: this._getSubdomain(a)
      });
      return n + L.Util.getParamString(this.wmtsParams, n) + "&tilematrix=" + i + "&tilerow=" + m + "&tilecol=" + l + '&format=image/jpeg'
  },
  setParams: function(a, b) {
      return L.extend(this.wmtsParams, a),
      b || this.redraw(),
      this
  },
  getDefaultMatrix: function() {
      for (var a = Array(22), b = 0; 22 > b; b++)
          a[b] = {
              identifier: "" + b,
              topLeftCorner: new L.LatLng(20037508.3428,-20037508.3428)
          };
      return a
  }
}),
L.tileLayer.wmts = function(a, b) {
  return new L.TileLayer.WMTS(a,b)
}
;
