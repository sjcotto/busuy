
var BASE_URL = "http://app.konacloud.io/api/taio/BusUY/";

$(document).ready(function() {
    loading = true;
    $.mobile.loading('show');

    $.getJSON(BASE_URL+"mr_viaje/getOrigen", function(data) {

            var list = data.data;
            var output = [];
            $.each(list, function(key,value)
            {
              output.push('<option value="'+ value +'">'+ value +'</option>');
            });
            $('#origen').html(output.join(''));
            loading = false;
            $.mobile.loading('hide');
    });

    $.getJSON(BASE_URL+"mr_viaje/getDestino", function(data) {

            var list = data.data;
            var output = [];
            $.each(list, function(key,value)
            {
              output.push('<option value="'+ value +'">'+ value +'</option>');
            });
            $('#destino').html(output.join(''));
            loading = false;
            $.mobile.loading('hide');

            var el = $('#origen');
            // Select the relevant option, de-select any others
            el.val('MONTEVIDEO').attr('selected', true).siblings('option').removeAttr('selected');
            // jQM refresh
            el.selectmenu("refresh", true);

            el = $('#destino');
            // Select the relevant option, de-select any others
            el.val('PUNTA DEL ESTE').attr('selected', true).siblings('option').removeAttr('selected');
            // jQM refresh
            el.selectmenu("refresh", true);

    });



    //$("#origen").val("MONTEVIDEO");
    //$("#destino").val("COLONIA");

    $("#btnBuscar").click(function() {



        var origen = $("#origen").val();
        var destino = $("#destino").val();

        //traemos la info del server

        $('#search-page-list-view').empty();

        $.getJSON(BASE_URL+"mr_viaje/findByOriginAndDestino?o="+origen+"&d="+destino, function(data) {

                  var array = data.data;
                  array.forEach(function(entry) {

                    //console.log(entry);

                    var li = $("<li/>");


                    var empresa = entry.Empresa.replace("ï¿½","N");

                    li.attr('data-id', entry._id);
                    li.attr('data-name', empresa);

                    var html = "<h2 class=\"ui-li-heading\"> " + entry.HSalida + " - " + entry.HLlegada + "</h2>" + "<p class=\"ui-li-desc\">" + empresa + "</p>";

                    var title = $("<a/>").append(html);
                    title.addClass( "ui-btn ui-btn-a ui-btn-icon-right ui-icon-carat-r" );
                    li.append(title);


                    li.appendTo("#search-page-list-view");
                  });
                if (array.length == 0){
                  $( "#popupBasic" ).popup( "open");
                }

        });

        $.mobile.navigate( "#page2" );
        $.mobile.changePage( "#page2");
        //event.preventDefault();
        //return false;
  });
});


$(document).on('vclick', '#search-page-list-view li', function(){

    //event.preventDefault();


    $.mobile.navigate( "#pageDetalles" );

    loading = true; //interlock to prevent multiple calls
    $.mobile.loading('show');

    //$("#headlineTitle",$.mobile.activePage).text($(this).attr('data-name'));

    var idd = $(this).attr('data-id');

    $.getJSON(BASE_URL+"mr_viaje?id="+idd, function(data) {

          var entry = data.data;
          console.log(entry);
          $("#viaje",$.mobile.activePage).text(entry.Origen + " - " + entry.Destino);
          $("#horario",$.mobile.activePage).text(entry.HSalida + " - " + entry.HLlegada);
          $("#dias",$.mobile.activePage).text(entry.Dias);
          $("#ruta",$.mobile.activePage).text(entry.Recorrido);
          $("#empresa",$.mobile.activePage).text(entry.Empresa);
          $("#lugar",$.mobile.activePage).text(entry.Lugar);

          loading = false; //interlock to prevent multiple calls
          $.mobile.loading('hide');
    });
    //return false;
});


$('#page2' ).bind( 'pageinit',function(event){
            setTimeout(function(){
              $("#popupBasic").popup();
              $("#popupBasic").popup("open");
            }, 100);
            setTimeout(function(){
              $("#popupBasic").popup("close");
            }, 5000);
});
