$(document).ready(function () {

    const API_KEY = 'YXRfNlNuNEplTUQ5TXE5bmVEaGp6RnpqZUVESGVMUG8maXBBZGRyZXNz'

    const decrypt = (data) => {
      return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
    };

    function getIpData(ip) {
        let ipurl = ''
        if (ip===undefined) {
            ipurl = `https://geo.ipify.org/api/v2/country,city?apiKey=${decrypt(API_KEY)}=`
        }
        else{
            ipurl = `https://geo.ipify.org/api/v2/country,city?apiKey=${decrypt(API_KEY)}=`+ip
        }

        // dummy ip address link for testing only
        // ipurl = '../assets/data/data.json'
        
        $.ajax({
            type: "GET",
            url: ipurl,
            data: "data",
            dataType: "json",
            success: function (response) {
                const [
                    ip,
                    location,
                    isp,
                    timezone,
                    lng,
                    lat
                ] = [
                        response.ip,
                        (response.location.city + ', ' + response.location.country),
                        response.isp,
                        response.location.timezone,
                        response.location.lng,
                        response.location.lat
                    ]

                $('#ip-tag').text(ip);
                $('#location-tag').text(location);
                $('#timezone-tag').text(timezone);
                $('#isp-tag').text(isp);
                getMap(lat, lng, location)
            }
        });
    }
    function getMap(lat, lng, location) {
        const myIcon = L.icon({
            iconUrl: './assets/icon-location.png',
            iconSize: [38, 48],
            iconAnchor: [22, 52],
            popupAnchor: [-3, -76],
            shadowUrl: './assets/icon-location.png',
            shadowSize: [38, 48],
            shadowAnchor: [22, 52]
        });

        // check for map container already difined or not
        var container = L.DomUtil.get('map')
        if (container != null) {
            container._leaflet_id = null;
        }

        let map = L.map('map');
        map.setView([lat, lng], 13, 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([lat, lng], { icon: myIcon }).addTo(map).bindPopup(location).openPopup();
    }

    $('#ip-form').submit(function (e) {
        e.preventDefault();
        const ipRegex = new RegExp("^(([1-9]?\\d|1\\d\\d|2[0-5][0-5]|2[0-4]\\d)\\.){3}([1-9]?\\d|1\\d\\d|2[0-5][0-5]|2[0-4]\\d)$");
        
        $('input').val().match(ipRegex)?getIpData($('input').val()):alert('Incorrect Ip?')
    });

    getIpData()
});
