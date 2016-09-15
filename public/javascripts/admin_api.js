var app = angular.module("EternalApp");

app.factory('rest', function($http) {
    var restService = {
        church: {
            add: function(param, onSuccess) {
                $http.post("/admin/church/add", {
                    newChurch: param
                }).then(function(response) {
                    onSuccess(response.data);
                }, function(response) {
                    //TODO: handle error
                    console.log("ERROR in ADDING CLINIC", response);
                });
            },
            list: function(page, onSuccess) {

            }
        }
    };

    return restService;
});