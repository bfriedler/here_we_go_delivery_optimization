

/*global google $*/
(async function () {
    'use strict';

    // var inpSec = document.getElementById('inputsection');
    // var addAddr = document.getElementById('addLocation');
    var maxHrs;
    var startTime;
    var startLoc;
    var endLoc;
    var addresses = [];
    var timeHome;
    var longestDistance = 0;
    var distanceFromStart = [];
    var deliveryTime = 30;
    var totalTimeTravelled;
    //var addressesRemaining;
    var largestCounter = 0;
    var tripCounter = 1;
    var shortestCounter = 0;
    var shortestDistance = 0;
    var currentLocation = startLoc;
    // addAddr.onclick(){
    // inpSec.innerHTML +='<p></p><label for="">Delivery addresses: </label><input type="text" class="deliveryAddress"></input>';
    // }


    async function submit() {
        //console.log('clicked');
        maxHrs = $('#maxHours').val();
        startTime = $('#startTime').val();
        startLoc = $('#startLocation').val();
        endLoc = $('#endLocation').val();
        //   console.log("endLoc" + endLoc);
        $('.deliveryAddress').each(function () {
            if ($(this).val() !== '') {
                addresses.push($(this).val());
            }
        });

        //console.log('test');
        maxHrs = maxHrs * 60;
        while (addresses.length > 0) {
            currentLocation = startLoc;
            console.log("Trip " + tripCounter + "\n");
            let counter = 0;
            console.log("addresses: " + addresses + "\n")
            addresses.forEach(async addr => {
                //find longest distance
                // console.log("counter" + counter)
                // console.log("addreses[counter]" + addresses[counter]);

                let temp = await calculateDistance(startLoc, addresses[counter])
                //  console.log(startLoc);
                //  console.log(addr);
                //  console.log(temp);
                if (temp > longestDistance) {
                    longestDistance = temp;
                    largestCounter = counter;
                }
                counter++;
            });

            //first stop
            currentLocation = addresses[largestCounter];
            addresses.splice(largestCounter);
            // console.log(currentLocation + " " + longestDistance + "\n");
            totalTimeTravelled = longestDistance + deliveryTime;
            timeHome = await calculateDistance(currentLocation, endLoc);

            while (totalTimeTravelled + timeHome + deliveryTime < maxHrs && addresses.length > 0) {

                let counter2 = 0;
                let calcShort = [];
                addresses.forEach(async addr => {
                    //find shortest distance

                    calcShort[counter2] = await calculateDistance(currentLocation, addresses[counter2])

                    if (calcShort[counter2] < shortestDistance) {
                        shortestDistance = calcShort[counter2];
                        shortestCounter = counter2;
                    }
                    counter2++;
                });
                if (totalTimeTravelled + shortestDistance + deliveryTime + await calculateDistance(addresses[shortestCounter], endLoc) <= maxHrs) {
                    currentLocation = calcShort[shortestCounter];
                    // console.log(addresses[shortestCounter] + " " + shortestDistance + "\n");
                    addresses.splice(shortestCounter);
                    totalTimeTravelled = totalTimeTravelled + shortestDistance + deliveryTime;
                }
                else {
                    totalTimeTravelled = maxHrs + 1;
                    console.log("COULD NOT ADD ANOTHER STOP \n");
                }

                shortestDistance = 0;
                shortestCounter = 0;
            }
            tripCounter++;
        }

        maxHrs = $("#maxHours").val();
        //console.log(maxHrs);
    }


    async function calculateDistance(start, end) {
        var directionsService = new google.maps.DirectionsService();

        var request =
        {
            origin: start,
            destination: end,
            provideRouteAlternatives: false,
            travelMode: 'DRIVING',
            drivingOptions: {
                departureTime: new Date(),
                trafficModel: 'pessimistic'
            },
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }

        var val;
        await directionsService.route(request, function (result, status) {
            if (status == 'OK') {
                val = result.routes[0].legs[0].duration["value"] / 60;
            }
        });
        return val;
    }

    $('#Go').click(() => {
        submit();
        /*  console.log('clicked');
          maxHrs = $('#maxHours').val();
          startTime = $('#startTime').val();
          startLoc = $('#startLocation').val();
          endLoc = $('#endLocation').val();
          console.log("endLoc" + endLoc);
          $('.deliveryAddress').each(function () {
              if ($(this).val() !== '') {
                  addresses.push($(this).val());
              }
          });*/
    });

})();

