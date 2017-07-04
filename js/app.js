/**
 *网站的入口应用程序，提供网站全局初始化和页面路由服务
 */
//var flApp = angular.module('flApp',['ui.router','BaseMod','CourseShowMod','CourseTakeMod','EnrollMod','ReviewMod']);
var flApp = angular.module('foreignApp',['ui.router','BaseMod']);
console.log(flApp);
/**
 * 定义全局信息
 */
flApp.run(function($rootScope, $state, $stateParams){

})
/**
 * 配置页面路由信息
 */
flApp.config(function($stateProvider,$urlRouterProvider){
     $urlRouterProvider.otherwise('index');
     $stateProvider
        .state('index',{
            url:'/index',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/test.html'
                }
            }
        })    
})