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
    console.log(userRequest.dependency);
    console.log(userRequest);
    /**
     * Fin (Constructor Casero)
     **/

    switch(request) {
        case 'getUser':{ //Suscribir usuario logueado a Premium
            FOF.Users.getUserData(callbacks,dependency);
            break;
        }
        default:{//No se le ha pasado el parametro request o la peticion no es valida
            console.log('Param Request Empty or not valid');
        }
    }


    },
    getUserData : function(callbacks,dependency){
        
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