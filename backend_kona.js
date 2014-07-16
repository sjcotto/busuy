/*
 * @autor taio
 */
var model = kona.model.open('viaje');
var url = "http://bucket.konacloud.io/external/api/bucket/taio/BusUY/b1/kf-6cafa315-1ce9-461a-89ea-c1bb8066857c";

var loadDataFromJsonURL = function(){

    return 1;//antes de comentar asegurarse de tener vacia la coleccion
    var resource = new org.restlet.resource.ClientResource(url);
    resource.get();
    var s = resource.getResponseEntity().getText();
	  var all = com.mongodb.util.JSON.parse(s);

    all.forEach(function(entry) {
        model.insert(entry);
    });
};

var findByOriginAndDestino = function(req){
    var o = req.params.get("o");
    var d = req.params.get("d");

    var toret = kona.list();
    var dic = kona.obj();

    var find = {
            Origen : o,
            Destino : d
    }
    var sorter = {
        HSalida : 1
    }
    var keys = {
        Empresa: 1,
        HSalida: 1,
        HLlegada: 1
    }
    var q = model.buildQuery().sort(sorter).keys(keys).find(find);
    q.list().forEach(function(entry) {
        var id = entry.HSalida + "_" + entry.HLlegada + "_" + entry.Empresa;
        if (dic.get(id)==null){
            dic.put(id, 1);
            toret.add(entry);
        }
    });
    return toret;
};

var getOrigen = function(req){
    var list = model.buildQuery().distinct("Origen");
    var js = toJS(list);
    return js.sort();
};
var getDestino = function(req){
    var list = model.buildQuery().distinct("Destino");
    var js = toJS(list);
    return js.sort();
};
/*
 * @param req is the http request, req.params.get("")
 */
var get = function(req) {
	var id = req.params.get("id");
	if (id == null) {
		return model.all();
	} else {
		return model.queryById(id);
	}
};
