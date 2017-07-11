/**
 * 基础信息模块
 */
var baseMod = angular.module('BaseMod',[]);
// console.log(baseMod);
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
        $scope.termIdList = [];//保存已经选中的学期
        $scope.classList = ['一年级1班','一年级2班','一年级3班','一年级4班',
                                '一年级5班','一年级6班','一年级7班','一年级8班',
                                '二年级1班','二年级2班','二年级3班','二年级4班',
                                '二年级5班','二年级6班','二年级7班','二年级8班'];
        $scope.chkClassIdList = [];//被选中的适合班级
        $scope.selectedClassList = [];//已选择该课程的班级

    }])
    /**
     * 控制器适用于选课页面的coursetake.html
     */
    .controller('CourseTakeCtrl',['$scope','$http',function($scope,$http){
        //获取选课计划信息
        var url = 'p/xkp!query.action';
        var params = {'start':0,'limit':10};
        $http({'url':url,'params':params})
            .then(function(){
                
            },function(){

            })

    }])
