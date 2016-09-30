var geocoder;
var map;
var marker;

function initialize() {
	//Variavel contendo a latitude e longitude da localização inicial do mapa
	var latlng = new google.maps.LatLng(-27.0908588, -48.922381900000005);

	//Parametros do mapa centralizando pela latitude e com o parametro de zoom setado
	var options = {
		zoom: 10, //Parametro de zoom do mapa - Opção obrigatória
		center: latlng, //Centralizar na div pela latitude - Zoom = 0 corresponde ao planata inteiro
		mapTypeId: google.maps.MapTypeId.ROADMAP //Tipo de mapa
	};

	//Carregando o mapa na tela - Com a classe Map, cada instância corresponde a um mapa
	map = new google.maps.Map(document.getElementById("mapa"), options);

	//Carrega o serviço geocoding, processo responsável por transformar um endereço nas respectivas coordenadas geográficas.
	geocoder = new google.maps.Geocoder();

	/*
	Marker - Identifica uma localização no mapa. Por padrão, os marcadores	podem exibir imagens personalizadas
	*/
	marker = new google.maps.Marker({ //Assinaturas das funções
		map: map,
		draggable: true, //Permitindo que o usuário mova o marcador na tela
	});

	//Setando a posição do marcador, sobre o mapa, onde o endereço se localiza
	marker.setPosition(latlng);
}

$(document).ready(function () {
	 //Chamada da função Initialize
	initialize();
	//Função para carregar no mapa o endereço
	function carregarNoMapa(endereco) {
		//Enviando o endereço para a API												//Par. da função resultado e status
		geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
			//O processo de geocodificação foi bem sucedido
			if (status == google.maps.GeocoderStatus.OK) {
				//O retorno deu certo
				if (results[0]) {
					//Cria variaveis para acessar ao retorno da API do Google, para recer os valores da latitude e longitude
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();

					//Retornando a latitude e a longitude
					$('#txtEndereco').val(results[0].c);
					$('#txtLatitude').val(latitude);
                   	$('#txtLongitude').val(longitude);

					//Identifica no mapa o endereço marcado, e identificado pelo processo de geocodificação
					var location = new google.maps.LatLng(latitude, longitude);
					marker.setPosition(location);
					map.setCenter(location);
					map.setZoom(16);
				} else {
					alert("Ocorreu algum erro ao tentar geocodificar o endereço!");
				}
			}
		})
	}

	//No click do botão Mostra no mapa o endereço digitado
	$("#btnEndereco").click(function() {
		if($(this).val() != "")
			carregarNoMapa($("#txtEndereco").val());
	})

	//Evento que ocorre quando o endereço perder o foco
	$("#txtEndereco").blur(function() {
		if($(this).val() != "")
			carregarNoMapa($(this).val());
	})
	/*
	*  Na função abaixo, ao invés de passarmos o endereço para o geocoder,
	*  vamos passar a posição atual do marcador e a partir dela,
	*  o geocoder.geocode irá nos retornar o endereço, a latitude e a longitude do ponto.
	* */
	google.maps.event.addListener(marker, 'drag', function () {
		geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {  
					$('#txtEndereco').val(results[0].formatted_address);
					$('#txtLatitude').val(marker.getPosition().lat());
					$('#txtLongitude').val(marker.getPosition().lng());
				}
			}
		});
	});

	//Realizando o autocomplete no input do endereço para o cliente,
	$("#txtEndereco").autocomplete({
		source: function (request, response) {
			geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
				response($.map(results, function (item) {
					return {
						label: item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
          				longitude: item.geometry.location.lng()
					}
				}));
			})
		},
		select: function (event, ui) {
			$("#txtLatitude").val(ui.item.latitude);
    		$("#txtLongitude").val(ui.item.longitude);
			var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
			marker.setPosition(location);
			map.setCenter(location);
			map.setZoom(16);
		}
	});
	//Retornando o endereço, latitude, longitude para o alerta
	$("form").submit(function(event) {
		event.preventDefault();
		
		var endereco = $("#txtEndereco").val();
		var latitude = $("#txtLatitude").val();
		var longitude = $("#txtLongitude").val();
		
		alert("Endereço: " + endereco + "\nLatitude: " + latitude + "\nLongitude: " + longitude);
	});

});