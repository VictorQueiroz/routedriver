# routedriver

This module was made to be used as a wrapper. Based on AngularJS 1.x router (ngRoute).

### Installation
```
bower install --save routedriver
```

### Usage
```
var router = new window.router.Router();
router.when('/home/index/{username}/page/{pageNumber?}', {
  templateUrl: 'home/index.html'
});

router.prepare(router.parse('/home/index/witcher_blade_2000/page/1'));
router.commit();
```
