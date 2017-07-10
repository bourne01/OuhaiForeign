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
    .controller('CourseTakeCtrl',['$scope','$http',function($scope,$http){
        /*$scope.srcClassList = ['one','two','three','four','five'];
        $scope.tarClassList = [];
        $scope.addToTarget = function(srcClass){
            if($scope.tarClassList.indexOf(srcClass) == -1)
            $scope.tarClassList.push(srcClass);
            console.log(srcClass);
        }*/
        $scope.search = function(){
            console.log('I M search in homepage');
        }
    }])
/**
 * 
 */
var courseMod = angular.module('CourseMod',[]);
courseMod
    .controller('CourseAddCtrl',['$scope',function($scope){
        $scope.saveCourse = function(){
            
        }
    }])