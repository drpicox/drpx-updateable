drpx-updateable
===========

Simple Angular tool to eventually broadcast message when a component is updated.

Why? Because in some cases we need to perform some complex derived computations and we want to keep all recalculation process simple, safe, and efficient.

Updateable is designed to:

- maintain always data integrity: because update does not provides extra information about what is changed, all must be recomputed (in angular style), so only one point to maintain

- scalable functionality: because update does not provides information about which operation is done, all must be recomputed so it does not matter if new method/option/whatever is added

- efficient: updateable runs asyncronous debounced, so even if multiple calls to update are performed (ex: a bulk addition of data) event is triggered once, so only one recomputation is required

- integrated with digest loop: all updates are performed inside a digest loop, no need for $scope.$apply() or whatever,

- almost no garbage left: update events are handled by angular $broadcast, so controllers/... can handle it by listenting from their own $scope which listener is destroyed along its $scope when it is not longer required

- simplicity: just do $scope.$on('yourEvent', function() { ... }) and recompute what you need, no more register/unregister/...


Install
-------

```bash
$ bower install --save drpx-updateable
```

add to your module the dependence:

```javascript
    angular.module('yourModule', ['drpxUpdateable']);
```

include the javascript library in your application:

```html
<script src="bower_components/drpx-updateable/drpx-updateable.js"></script>
```


How to use
----------

Inside your service state:

```javscript
    yourServiceFactory.$inject = ['drpxUpdateable'];
    function yourServiceFactory  ( drpxUpdateable ) {
        var service = {
            change: change,
            // your other methods

            update: drpxUpdateable('yourUpdate')
        }

        function change(...) {
            // do your changes
            service.update();
        }

        return service;
    }
```

Check A: Listen for changes in your controller:

```javscript
    YourController.$inject = ['yourService','$scope'];
    function YourController  ( yourService , $scope ) {
        $scope.$on('yourUpdate', update.bind(this));

        function update() {
            this.data = yourService.data;            
        }
    }
```

Check B: Listen for changes in your derived service /store:

```javscript
    yourDerivedServiceFactory.$inject = ['yourService','$rootScope'];
    function yourDerivedServiceFactory  ( yourService , $rootScope ) {
        var service = {
            data: null,
            // your other methods
        }

        $rootScope.$on('yourUpdate', update);
        update();

        function update() {
            service.data = yourService.computeDerived();
        }

        return service;
    }
```


Note
----

Implementation takes advantage of current angular event implementation. It means that you have to recall the name of the event broadcasted and you should have a good event name nomenclature. It should be no necessary to put event constants inside a variable, for example: `yourService.updateEvent` or `EVENTS.yourUpdate`, because Javascript does not checks if that property exists and no wanrning should be raised if it changes. So, if you have a good nomenclature you should use string directly. My recommendation is event name like: `'{moduleName}.{serviceName}Update'`.
