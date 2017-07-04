/**
 * 基础信息模块
 */
var baseMod = angular.module('BaseMod',[]);
console.log(baseMod);
baseMod
    .factory('',function(){
        return;
    })
    .controller('HeaderCtrl',['$scope',function($scope){
        
    }])
    .controller('NavCtrl',['$scope',function($scope){

    }])
    .controller('TestCtrl',['$scope',function($scope){
        $scope.srcClassList = ['one','two','three','four','five'];
        $scope.tarClassList = [];
        $scope.addToTarget = function(srcClass){
            if($scope.tarClassList.indexOf(srcClass) == -1)
            $scope.tarClassList.push(srcClass);
            console.log(srcClass);
        }
    }])
/**
 * 
 */