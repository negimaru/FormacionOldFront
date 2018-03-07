var FOF = FOF || {};
FOF.Users = {
    init: function(userRequest){
    /**
     * Comprobacion de los parametros que se le pasan a la funcion (Constructor casero);
     **/
    var request = userRequest.request || '';
    var callbacks = userRequest.callbacks || {};
    var userId = userRequest.userId || 0;
    var event = userRequest.domainEvent || false;
    var dependency = userRequest.dependency ||  false;
    var allowCache = userRequest.allowCache || false;
    console.log(userRequest);
    if(allowCache){
        var requestCache = JSON.parse(localStorage.getItem(request));
        var currentDate = ((new Date).getTime());
        var cacheTimeHours = 1; //Cache Time in Hours
        var timeToUpdate = hoursToSeconds(cacheTimeHours);
    }
    
    /**
     * Fin (Constructor Casero)
     **/

    switch(request) {
        case 'getUser':{
            if(allowCache && requestCache != null && ((currentDate - requestCache.cacheLastUpdateDate)/1000) < timeToUpdate ){
                    console.log('From Cache');
                    callbacks.run(requestCache)
                
            }else{
                console.log('From ApiCall')
                FOF.Users.getUserData(callbacks,dependency,allowCache);
            }

            break;
        }
        case 'setUser':{}
        default:{//No se le ha pasado el parametro request o la peticion no es valida
            console.log('Param Request Empty or not valid');
        }
    }


    },
    getUserData : function(callbacks,dependency,cache){
        
        dependency.ajax({
            url: "Mocks/users.json",
            data: {},
            dataType: "json",
            method: 'get',
            success: function (data) {
                
                if (!isObjectEmpty(callbacks)) {
                    callbacks.run(data);
                }
                if(event){
                    document.dispatchEvent(new CustomEvent(event, {detail: {data}}));
                }
                if(cache){
                    storeInCache(data,'getUser'); //Es importante que se amacene el nombre de la cache con el mismo nombre de la request
                }
    
            },
            error : function (data) {
                if (!isObjectEmpty(callbacks)) {
                    callbacks.errors(data);
                }
                if(event){
                    document.dispatchEvent(new CustomEvent(event, {detail: {data}}));
                }
            },
            cache: false,
        });
    

    }

}




$(document).ready(function(){

    var getUserCallbacks = {
        run: function(data){
            console.log(data);
        },
        errors: function(data) {
            console.log(data);
        },
        serverError : function(data){
            console.log('La Culpa es de Api, preguntar a Pedro');
        },
    }

    var userRequest = {
        dependency : jQuery,
        request: 'getUser',
        userId : 1,
        callbacks :getUserCallbacks,
        allowCache: true,
        domainEvent: 'getUser' //Evento a Disparar cuando se complete la llamada
    }



    FOF.Users.init(userRequest);
});




/**
 * @description: Comprueba si un objeto esta vacio verificando la cantidad de keys
 */
function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}



/**
 * @description: convierte a segundos una hora dada como cualquier valor numerico
 * @param : {Number} hours | horas a convertir a segundos
 */
function hoursToSeconds(hours) {
    var seconds = (hours * 60 * 60);
    return seconds;
}

function storeInCache(data, cacheName){
    data.cacheLastUpdateDate = ((new Date).getTime());
    localStorage.setItem(cacheName, JSON.stringify(data));
}