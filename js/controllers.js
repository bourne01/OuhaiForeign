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
/**
 *
 */
var courseMod = angular.module('CourseMod',[]);
courseMod
    .factory('CourseQueryService',['$q','$http',function($q,$http){
        var deferredCourse = $q.defer();
        var url = "selCou!query2.action";
        var params = {};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;        
                if(objData.success){
                    deferredCourse.resolve(objData); 
                }else{
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                }
            },function(){
                console.log()
            })
        return deferredCourse.promise;
    }])
    /**
     * 首页课程管理页面 home.html
     */
    .controller('CourseShowCtrl',['$scope','$http','CourseQueryService',function($scope,$http,CourseQueryService){
         CourseQueryService.then(function(objData){
            if(objData.success){
                $scope.courseList = objData.dataList;
            }else{
                var errTypeList = ['','已知错误','未知错误'];
                alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
            }
        })
        //获取待选课程信息
        $scope.courseStateList = ['','','开启','关闭','完成'];
        $scope.courseAuditList = ['','未审核','已审核'];
        $scope.courseTypeList = [];
        //获取课程类别信息
        var url = 'baseWebDat';
        var params = {'f':'uxCode','codeType':11,'simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                if(typeof(objData.success) !== 'undefined'){
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);                    
                }else{
                    //课程id转换为课程名
                    for(var i=0;i<objData.dataList.length;i++){
                        $scope.courseTypeList[objData.dataList[i].id] = objData.dataList[i].name;                        
                    }
                    $scope.getCourseList();
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        //获取课程信息
        $scope.getCourseList = function(){
            var url = "selCou!query2.action";
            var params = {};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;        
                    if(objData.success){
                        $scope.courseList = objData.dataList;
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){
                    console.log()
                })
        }
        //获取课程详细信息
        $scope.viewCourse = function(courseId){
            $scope.maskPop = {'display':'block'};
            $scope.detailCourse = {'display':'block'};
            var couListLen = $scope.courseList.length;
            for(var i=0;i<couListLen;i++){
                if($scope.courseList[i].selCouId == courseId){
                    var curCourseObj = $scope.courseList[i];
                    break;
                }
                
            }
            $scope.courseNO = curCourseObj.couNO;
            $scope.courseName = curCourseObj.couName;
            $scope.courseMemo = curCourseObj.couExplain;
            $scope.courseType = $scope.courseStateList[curCourseObj.couState]
            $scope.credit1 = curCourseObj.credit1;
            $scope.credit2 = curCourseObj.credit2;
            $scope.credit3 = curCourseObj.credit3;
            $scope.lvRate1 = curCourseObj.lvRate1;
            $scope.lvRate2 = curCourseObj.lvRate2;
            $scope.lvRate3 = curCourseObj.lvRate3;
            $scope.creditMin = curCourseObj.creditMin;
            $scope.manMin = curCourseObj.manMin;
            $scope.manMax = curCourseObj.manMax;
            $scope.boyMin = curCourseObj.boyMin;
            $scope.boyMax = curCourseObj.boyMax;
            $scope.girlMin = curCourseObj.girlMin;
            $scope.girlMax = curCourseObj.girlMax;
            $scope.courseTeacher = curCourseObj.couThrNms;
            $scope.parentName = '无';         
            $scope.socName = curCourseObj.socNms;
            $scope._terms = curCourseObj.termNms;
            $scope._grades = curCourseObj.gradeNms;
            $scope._classes = curCourseObj.claNms;            
            $scope.auditState = $scope.courseAuditList[curCourseObj.audit];
        }
        //关闭课程详细页面
        $scope.closePop = function(){
            $scope.maskPop = {'display':'none'};
            $scope.detailCourse = {'display':'none'};
        }
        //删除待选课程
        $scope.deleteCourse = function(courseId){
            var curCourseObj = [];
            var objList = $scope.courseList;
            var objLen = objList.length;
            for(var i=0;i<objLen;i++){
                if(objList[i].selCouId == courseId){
                    curCourseObj = objList[i];
                }
            }
            if(curCourseObj.couState == 2 || curCourseObj.couState == 3){
                alert('您无法删除本课程，请更改课程状态为完成后，再次删除！');
                return;

            }
            var url = 'selCou!del.action';
            var params = {'selCouIds':courseId};            
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getCourseList();
                        alert('删除课程成功！')                        
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                })
        }
        //设置课程状态
        $scope.changeCourseState = function(courseId,statetype,state){
            var url = 'selCou!chState.action';
            if(statetype == "CourseState")
                var params = {'selCouIds':courseId,"couState":state};
            else
                var params = {'selCouIds':courseId,"audit":state};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getCourseList();                    
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){

                })
        }
         
    }])
    .controller('CourseDealCtrl',['$scope','$http','$stateParams','$state','CourseQueryService',function($scope,$http,$stateParams,$state,CourseQueryService){
        $scope.xkpId = $stateParams.xkpId;//获取参数选课计划id
        $scope.courseId = $stateParams.courseId;
        $scope.parentCourseId = '';//初始化父课程id,在新增模式下为无
        $scope.termIdList = [];//保存已经选中的学期        
        $scope.chkClassIdList = [];//被选中的适合班级的id
        $scope.chkClassNameList = [];//被选中的适合班级的名称
        $scope.selectedClassIdList = [];//已选择该课程的班级id
        $scope.selectedClassNameList = [];//已选择该课程的班级名称
        $scope.socialOrgList = [];
        $scope.gradeIds = '';
        $scope.subCourseMode = false;//设置子课程模式，true为子课程模式，false为普通编辑模式
        //判断是否编辑模式
        $scope.saveCourse = function(){
            var url = 'selCou!newRec.action';
            var params = {
                'xkpId':$scope.xkpId,
                'couType':$scope.courseType,
                'parCouId':$scope.parentCourseId,
                'couNO':$scope.courseNO,
                'couName':$scope.courseName,
                'couExplain':$scope.courseMemo,
                'credit1':$scope.credit1,
                'credit2':$scope.credit2,
                'credit3':$scope.credit3,
                'lvRate1':$scope.lvRate1,
                'lvRate2':$scope.lvRate2,
                'lvRate3':$scope.lvRate3,
                'creditMin':$scope.creditMin,
                'manMin':$scope.manMin,
                'manMax':$scope.manMax,
                'boyMin':$scope.boyMin,
                'boyMax':$scope.boyMax,
                'girlMin':$scope.girlMin,
                'girlMax':$scope.girlMax,
                'couThrIds':$scope.selTeacher,
                'socIds':$scope.socialOrgList.toString(),
                'termIds':$scope.termIdList.toString(),
                'grades':$scope.gradeIds,
                'graCreMins':'',
                'claIds':$scope.selectedClassIdList.toString().replace(/class/g,'')
            }
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $state.go('coursemanage',{'xkpId':$scope.xkpId});
                        alert("新增课程成功！");
                    }else{
                         var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(res){

                })
        }                
        //获取课程类别信息
        var url = 'baseWebDat';
        var params = {'f':'uxCode','codeType':11,'simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);                    
                }else{
                    $scope.courseTypeList = objData.dataList                      
            
                }
            },function(res){
                console.log("无法访问此页面...");
            })
         //获取学期信息
        var url = 'baseWebDat';
        var params = {'f':'uxTerm','simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);                    
                }else{
                    
                    $scope.termList = objData.dataList;
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        //获取教师信息
        var url = 'thr!query.action';
        var params = {};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(objData.success){
                    $scope.teacherList = objData.dataList;                 
                }else{                    
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);  
                    
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        //获取年级信息
        var url = 'baseWebDat';
        var params = {'f':'uxCode','codeType':35,'simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);                    
                }else{
                    $scope.gradeList = objData.dataList;
                    
                }
            },function(res){
                console.log("无法访问此页面...");
            })        
        //基于年级下拉事件获取班级信息
        $scope.checkedGradeIdList = [];
        $scope.getClassList = function(srcType,gradeId){
        if(!gradeId)return;//未选中年级则不输出班级列表
        $scope.gradeIds = gradeId;    
        var url = 'baseWebDat';
        if(srcType == 'Click')
            var params = {'f':'uxCla','simple':0,'grades':gradeId};
        else
            var params ={'f':'uxCla','simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){                    
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                }else{                    
                        $scope._classList = objData.dataList;
                    }
            },function(res){
                console.log("无法访问此页面...");
            })
        }
        /**
         * 以下为编辑模式独有的操作
         */
        $scope.modifyCourse = function(){
            if($scope.subCourseMode){
                var url = 'selCou!newRec.action'; //新增子课程
                $scope.courseId = '';
            }else
                var url = 'selCou!edit.action';//编辑现有课程            
            //用户对以下几个修改项做默认处理，则进行如下
            if(!$scope.selTeacher){
                if($scope.curEditableObj.couThrIds)
                    $scope.selTeacher = $scope.curEditableObj.couThrIds;
                else
                    $scope.selTeacher = '';
            }
            if($scope.termIdList == false){
                if($scope.curEditableObj.termIds)
                    $scope.termIdList = $scope.curEditableObj.termIds;
                else
                    $scope.termIdList = '';
            }
            if($scope.socialOrgList == false){
                if($scope.curEditableObj.socIds)
                    $scope.socialOrgList = $scope.curEditableObj.socIds;
                else
                    $scope.socialOrgList = '';
            }
            if(!$scope.gradeIds){
                if($scope.curEditableObj.grades)
                    $scope.gradeIds = $scope.curEditableObj.grades;
                else
                    $scope.gradeIds = '';
            }
            if($scope.selectedClassIdList == false){
                if($scope.curEditableObj.claIds)
                    $scope.selectedClassIdList = $scope.curEditableObj.claIds;
                else
                    $scope.selectedClassIdList = '';
            }           
            var params = {
                'xkpId':$scope.xkpId,
                'selCouId':$scope.courseId,
                'couType':$scope.courseType,
                'parCouId':$scope.parentCourseId,
                'couNO':$scope.courseNO,
                'couName':$scope.courseName,
                'couExplain':$scope.courseMemo,
                'credit1':$scope.credit1,
                'credit2':$scope.credit2,
                'credit3':$scope.credit3,
                'lvRate1':$scope.lvRate1,
                'lvRate2':$scope.lvRate2,
                'lvRate3':$scope.lvRate3,
                'creditMin':$scope.creditMin,
                'manMin':$scope.manMin,
                'manMax':$scope.manMax,
                'boyMin':$scope.boyMin,
                'boyMax':$scope.boyMax,
                'girlMin':$scope.girlMin,
                'girlMax':$scope.girlMax,
                'couThrIds':$scope.selTeacher,
                'socIds':$scope.socialOrgList.toString(),
                'termIds':$scope.termIdList.toString(),
                'grades':$scope.gradeIds,
                'claIds':$scope.selectedClassIdList.toString().replace(/class/g,'')
            }
             $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $state.go('coursemanage',{xkpId:$scope.xkpId});
                        alert("修改课程成功！");
                    }else{
                         var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(res){

                })
        }
        if($scope.courseId){//编辑模式
            var editableObj = {};
            CourseQueryService.then(function(data){
                $scope.courseList = data.dataList;
                var objList = $scope.courseList;
                var objLen = objList.length;
                for(var i=0;i<objLen;i++){
                    if(objList[i].selCouId == $scope.courseId){
                        editableObj = objList[i];
                    }
                }
                //$scope.parentCourseId = $scope.courseId;
                if(editableObj.parCouId)//子课程编辑
                    $scope.parentCourseId = editableObj.parCouId;
                else
                    $scope.parentCourseId = $scope.courseId;//添加子课程
                $scope.curEditableObj = editableObj;   
                $scope.courseType = editableObj.couType.toString();
                //$scope.parentCourseId  = editableObj.parCouId;
                $scope.courseNO = editableObj.couNO;
                $scope.courseName = editableObj.couName;
                $scope.courseMemo = editableObj.couExplain;
                $scope.credit1 = editableObj.credit1;
                $scope.credit2 = editableObj.credit2;
                $scope.credit3 = editableObj.credit3;
                $scope.lvRate1 = editableObj.lvRate1;
                $scope.lvRate2 = editableObj.lvRate2;
                $scope.lvRate3 = editableObj.lvRate3;
                $scope.creditMin = editableObj.creditMin;
                $scope.manMin = editableObj.manMin;
                $scope.manMax = editableObj.manMax;
                $scope.boyMin = editableObj.boyMin;
                $scope.boyMax = editableObj.boyMax;
                $scope.girlMin = editableObj.girlMin;
                $scope.girlMax = editableObj.girlMax;
                $scope.selTeacher = editableObj.couThrIds;
                /* $scope.socialOrgList  = editableObj.socIds;
                $scope.termIdList = editableObj.termIds;
                $scope.gradeIds = editableObj.gradeNms;
                $scope.selectedClassIdList = editableObj.claIds; */
                },function(data){

                })           
            
        }
    }])
    /**
     * 控制器适用于管理页面coursemanage.html
     */
    .controller('CourseManageCtrl',['$stateParams','$scope','$http',function($stateParams,$scope,$http){
        $scope.xkpId = $stateParams.xkpId;//获取参数选课计划id
        //获取待选课程信息
        $scope.courseStateList = ['','','开启','关闭','完成'];
        $scope.courseAuditList = ['','未审核','已审核'];
        $scope.courseTypeList = [];
        //获取课程类别信息
        var url = 'baseWebDat';
        var params = {'f':'uxCode','codeType':11,'simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                if(typeof(objData.success) !== 'undefined'){
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);                    
                }else{
                    //课程id转换为课程名
                    for(var i=0;i<objData.dataList.length;i++){
                        $scope.courseTypeList[objData.dataList[i].id] = objData.dataList[i].name;                        
                    }
                    $scope.getCourseList();
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        //获取课程信息
        $scope.getCourseList = function(){
            var url = "selCou!query2.action";
            var params = {};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;        
                    if(objData.success){
                        $scope.courseList = objData.dataList;
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){
                    console.log()
                })
        }
        //设置课程状态
        $scope.changeCourseState = function(courseId,statetype,state){
            var url = 'selCou!chState.action';
            if(statetype == "CourseState")
                var params = {'selCouIds':courseId,"couState":state};
            else
                var params = {'selCouIds':courseId,"audit":state};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getCourseList();                    
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){

                })
        }
        //删除待选课程
        $scope.deleteCourse = function(courseId){
            var curCourseObj = [];
            var objList = $scope.courseList;
            var objLen = objList.length;
            for(var i=0;i<objLen;i++){
                if(objList[i].selCouId == courseId){
                    curCourseObj = objList[i];
                }
            }
            if(curCourseObj.couState == 2 || curCourseObj.couState == 3){
                alert('您无法删除本课程，请更改课程状态为完成后，再次删除！');
                return;

            }
            var url = 'selCou!del.action';
            var params = {'selCouIds':courseId};            
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getCourseList();
                        alert('删除课程成功！')                        
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                })
        }
        /**
         * 评价课程
         */
        //获取系统定义的评语等级
        $scope.thrCommentLevelList = [];
        $scope.getCommentLevelList = function(){            
            var url = 'baseWebDat?f=uxCode&codeType=82'
            var params = {};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    $scope.thrCommentLevelList = objData;                         
                },function(){

                })
        }
        $scope.getCommentLevelList();
        $scope.remarkValueList = [];//评语等级对应的数值
        $scope.remarkNameList = [];//评语等级的名称
        $scope.curSelCouId = '';//当前选课课程id
        $scope.curTermId = '';//当前选课的学期id
        //打开评语弹窗并作初始化
        $scope.reviewCourse = function(couName,termId,selCouId){
            for(var i=1;i<$scope.thrCommentLevelList.length;i++){
                if($scope.remarkValueList.indexOf($scope.thrCommentLevelList[i][0]) == -1)
                    $scope.remarkValueList.push($scope.thrCommentLevelList[i][0]);
                if($scope.remarkNameList.indexOf($scope.thrCommentLevelList[i][1]) == -1)
                    $scope.remarkNameList.push($scope.thrCommentLevelList[i][1]);
            }
            $scope.editableReview = {'display':'block'};
            $scope.maskPop = {'display':'block'}
            $scope.curSelCouId = selCouId;
            $scope.curTermId = termId;
            $scope.curCouName = couName;//课程名称
        }
        //关闭弹窗
         $scope.closePop = function(){            
            $scope.maskPop = {'display':'none'};
            $scope.editableReview = {'display':'none'};
        }
        $scope.saveReview = function(){
            var url = 'selCouEval!upRec.action';//管理员操作评价记录
            //var url = 'selCouEval!myEval.action';//教师自评、机构评价
            //var url = 'selCouEval!memEval.action';//专业委员评价
            var params = {
                'selCouId':$scope.curSelCouId,
                'termId':$scope.curTermId,
                'selfEval':$scope.thrRemarkLv,
                'selfEvalTxt':$scope.thrContent,
                'socEval':$scope.socRemarkLv,
                'socEvalTxt':$scope.socContent,
                'schEval':$scope.schRemarkLv,
                'schEvalTxt':$scope.schContent
            }
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.editableReview = {'display':'none'};
                        $scope.maskPop = {'display':'none'}
                        alert('评语操作成功！');
                        
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }               
                },function(){

                })            
        }               
        }])
        
    /**
     * 控制器适用于选课页面的coursetake.html
     */
    .controller('CourseTakeCtrl',['$rootScope','$scope','$http','$state',function($rootScope,$scope,$http,$state){
        //获取学期信息
        var url = 'term!query.action';
        var params = {};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(objData.success){
                    console.log(objData.dataList);
                    $scope.termList = objData.dataList;
                }else{
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        $scope.couEditStateList = ['','未开放','开放新增/编辑','开放编辑','关闭'];
        $scope.xkpStateList = ['','未开启','开启','关闭 ','完成']
        //获取选课计划信息
        $scope.getCoursePlanList = function(){
            var url = 'xkp!query.action';
            var params = {};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    console.log(objData);
                    if(objData.success){
                        $scope.coursePlanList = objData.dataList;
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                            alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){

                })
        }
        $scope.getCoursePlanList();
        //新增选课计划弹窗开启
        $scope.addCoursePlan = function(){            
            $scope.maskPop = {'display':'block'};
            $scope.newlyAddPop = {'display':'block'};
        }
        //新增选课计划弹窗关闭
        $scope.closePop = function(){            
            $scope.maskPop = {'display':'none'};
            $scope.newlyAddPop = {'display':'none'};
        }
        //保存新增的选课计划
        $scope.saveCoursePlan = function(){
            var url = "xkp!newRec.action";
            var params = {
                'termId':$scope.termSel,
                'planNO':$scope.planNO,
                'planName':$scope.planName,
                'planMeno':$scope.planMemo,
                'planStart':$scope.planOnTime,
                'planEnd':$scope.planOffTime,
                'planDone':$scope.planDoneTime,
                'credit1':$scope.credit1,
                'credit2':$scope.credit2,
                'credit3':$scope.credit3,
                'lvRate1':$scope.lvRate1,
                'lvRate2':$scope.lvRate2,
                'lvRate3':$scope.lvRate3,
                'couEditState':$scope.couEditState,
                'xkpState':$scope.xkpState
            }
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success)
                    {
                        $scope.getCoursePlanList();
                        alert("新增选课计划成功");
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(res){
                    console.log("无法访问此页面...");
                })
        }        
        //编辑选课计划
        $scope.modifyCoursePlan = function(planId){
            var editableObj = {};
            var objList = $scope.coursePlanList
            var objLen = objList.length;
            for(var i=0;i<objLen;i++){
                if(objList[i].xkpId == planId){
                    editableObj = objList[i];
                }
            }
            $scope.planName = editableObj.planName;
            $scope.termSel =  editableObj.termId.toString();
            $scope.planNO = editableObj.planNO;
            $scope.planMemo = editableObj.planMeno;
            $scope.planOnTime = editableObj.planStart;
            $scope.planOffTime = editableObj.planEnd;
            $scope.planDoneTime = editableObj.planDone;
            $scope.credit1 = editableObj.credit1;
            $scope.credit2 = editableObj.credit2;
            $scope.credit3 = editableObj.credit3;
            $scope.lvRate1 = editableObj.lvRate1;
            $scope.lvRate2 = editableObj.lvRate2;
            $scope.lvRate3 = editableObj.lvRate3;
            $scope.couEditState = editableObj.couEditState;
            $scope.xkpState = editableObj.xkpState;
            $scope.addCoursePlan();
        }
        //删除选课计划
         $scope.deleteCoursePlan = function(planId){
            var curPlanObj = [];
            var objList = $scope.coursePlanList
            var objLen = objList.length;
            for(var i=0;i<objLen;i++){
                if(objList[i].xkpId == planId){
                    curPlanObj = objList[i];
                }
            }
            if(curPlanObj.couEditState != 4|| curPlanObj.xkpState !=4){
                alert('您无法删除本选课计划，请分别更改课程状态为关闭和选课状态为完成后，再次删除！');
                return;

            }
            var url = 'xkp!del.action';
            var params = {'xkpIds':planId};            
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getCoursePlanList();
                        alert('删除课程计划成功！')                        
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                })
        }
        //设置课程计划状态
        $scope.changePlanState = function(planId,statetype,state){
            var url = 'xkp!chState.action';
            if(statetype == "CourseEditState")
                var params = {'xkpId':planId,"couEditState":state};
            else
                var params = {'xkpId':planId,"xkpState":state};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getCoursePlanList();                    
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){

                })
        }
    }])
    /**
     * 控制器适用于选课页面的taskmanage.html
     */
    .controller('TaskManageCtrl',['$stateParams','$scope','$http','$state',function($stateParams,$scope,$http,$state){       
        $scope.xkpId = $stateParams.xkpId;//获取参数选课计划id
        $scope.stuTaskStateList = ['','未开启','开启','关闭 ','完成']
        //获取学期信息
        var url = 'baseWebDat';
        var params = {'f':'uxTerm','simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);                    
                }else{
                    
                    $scope.termList = objData.dataList;
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        //获取年级信息
        var url = 'baseWebDat';
        var params = {'f':'uxCode','codeType':35,'simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);                    
                }else{
                    $scope.gradeList = objData.dataList;
                    
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        //基于年级下拉事件获取班级信息
        $scope.getClassList = function(srcType){      
        var url = 'baseWebDat';
        if(srcType == 'Click')
            var params = {'f':'uxCla','simple':0,'grades':$scope.selGrade};
        else
            var params ={'f':'uxCla','simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){                    
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                }else{
                    if(srcType == 'Click')
                        $scope.classList = objData.dataList;
                    else
                        $scope._classList = objData.dataList;
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        }
        $scope.getClassList();//默认下拉列表         
        $scope.couEditStateList = ['','未开放','开放新增/编辑','开放编辑','关闭'];
        $scope.xkpStateList = ['','未开启','开启','关闭 ','完成']
        //获取选课计划信息
        var url = 'xkp!query.action';
        var params = {};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(objData.success){
                    $scope.coursePlanList = objData.dataList;
                }else{
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                }
            },function(){

            })
        //获取学生基本信息
        var url = 'stu!query.action';
        var params = {};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(objData.success){
                    $scope.stuList = objData.dataList;
                }else{
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                }
            },function(){

        })
        //获取选课任务信息
        $scope.getTaskList = function(){
            var url = 'xkTask!query2.action';
            var params = {};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    console.log(objData);
                    if(objData.success){
                        $scope.stuTaskList = objData.dataList;
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                            alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){

                })
        }
        $scope.getTaskList();
        //编辑学生选课任务弹窗开启
        $scope.editStuTask = function(){            
            $scope.maskPop = {'display':'block'};
            $scope.newlyAddPop = {'display':'block'};
        }
        //新增学生选课任务弹窗关闭
        $scope.closePop = function(){            
            $scope.maskPop = {'display':'none'};
            $scope.newlyAddPop = {'display':'none'};
        }
        //保存新增的学生选课任务
        /**
         * saveType：1为来自学生列表的全新添加,2为来自修改
         */
        $scope.selectedStuId = []//存放被选中的复选框中的stuId   
        $scope.saveStuTask = function(saveType){
            var url = "xkTask!newRec.action";
            if(saveType == 'Add'){
                var params = {
                    'xkpId':$scope.xkpId,
                    'stuIds':$scope.selectedStuId.toString()
                }
            }else{
                var params = {
                    'xkpId':$scope.xkpId,
                    'stuIds':$scope.stuIds,
                    'claIds':$scope.claIds,
                    'grades':$scope.grades,
                    'startTime':$scope.startTime,
                    'endTime':$scope.endTime,
                    'overTime':$scope.overTime,
                    'taskState':$scope.taskState,          
                }
            }
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success)
                    {
                        $scope.getTaskList();
                        alert("成功新增了1条选课任务");
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(res){
                    console.log("无法访问此页面...");
                })
        }        
        //编辑学生选课任务
        $scope.modifyStuTask = function(studentid){
            var editableObj = {};
            var objList = $scope.stuTaskList;
            var objLen = objList.length;
            for(var i=0;i<objLen;i++){
                if(objList[i].stuId == studentid){
                    editableObj = objList[i];
                }
            }
            $scope.planName = editableObj.planName;
            $scope.stuName = editableObj.stuName;
            $scope.stuNO = editableObj.stuNO;
            $scope.stuIds = editableObj.stuId;
            $scope.claIds =  editableObj.stuClaId;
            $scope.grades = editableObj.stuGrade;
            $scope.startTime = editableObj.startTime;
            $scope.endTime = editableObj.endTime;
            $scope.overTime = editableObj.overTime;
            $scope.taskState = editableObj.stuState;
            $scope.editStuTask(); 
        }
        //保存被修改的学生选课信息
        $scope.saveEditedTask = function(){
            var url = 'xkTask!edit.action';
            var params = {
                    'xkpId':$scope.xkpId,
                    'stuIds':$scope.stuIds,
                    'claIds':$scope.claIds,
                    'grades':$scope.grades,
                    'startTime':$scope.startTime,
                    'endTime':$scope.endTime,
                    'overTime':$scope.overTime,
                    'taskState':$scope.taskEditState,          
                }
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success)
                    {
                        $scope.getTaskList();
                        alert("修改选课任务成功！");
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(res){
                    console.log("无法访问此页面...");
                })
        }
        //删除选学生选课任务
         $scope.deleteStuTask = function(studentid){
            /* var curPlanObj = [];
            var objList = $scope.getTaskList;
            var objLen = objList.length;
            for(var i=0;i<objLen;i++){
                if(objList[i].xkpId == planId){
                    curPlanObj = objList[i];
                }
            }
            if(curPlanObj.couEditState != 4|| curPlanObj.xkpState !=4){
                alert('您无法删除本选课计划，请分别更改课程状态为关闭和选课状态为完成后，再次删除！');
                return;

            } */
            var url = 'xkTask!del.action';
            var params = {'xkpId':$scope.xkpId,'stuIds':studentid};            
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getTaskList();
                        alert('删除选课任务成功！')                        
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                })
        }
        //设置选课任务状态
        $scope.changeTaskState = function(studentid,planId,state){
            var url = 'xkTask!edit.action';
            var params = {'stuIds':studentid,'xkpId':planId,"taskState":state};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getTaskList();                    
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){

                })
        }
        //从右侧学生列表中添加学生选课任务
        $scope.addToTaskList = function(){
            var url = '';
            var params = {};
            $http({})
                .then(function(res){

                },function(){

                })
        }
    }])
    /**
     * 控制器适用于选课页面的courseresult.html
     */
    .controller('CourseResultCtrl',['$stateParams','$scope','$http','$state',function($stateParams,$scope,$http,$state){       
        $scope.selCouId = $stateParams.courseId;//获取参数选课id
        $scope.stuTaskStateList = ['','未开启','开启','关闭 ','完成']
        //获取学期信息
        var url = 'baseWebDat';
        var params = {'f':'uxTerm','simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);                    
                }else{
                    
                    $scope.termList = objData.dataList;
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        //获取年级信息
        var url = 'baseWebDat';
        var params = {'f':'uxCode','codeType':35,'simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);                    
                }else{
                    $scope.gradeList = objData.dataList;
                    
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        //获取学生基本信息
        $scope.getStuList = function(){        
            var url = 'stu!query.action';
            var params = {};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    console.log(objData);
                    if(objData.success){
                        $scope.stuList = objData.dataList;
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){

            })
        }
         $scope.getStuList();//默认显示的学生列表
         //基于年级下拉事件获取班级信息
        $scope.getClassList = function(srcType){      
        var url = 'baseWebDat';
        if(srcType == 'Click')
            var params = {'f':'uxCla','simple':0,'grades':$scope.selGrade};
        else
            var params ={'f':'uxCla','simple':0};
        $http({'method':'get','url':url,'params':params})
            .then(function(res){
                var objData = res.data;
                console.log(objData);
                if(typeof(objData.success) !== 'undefined'){                    
                    var errTypeList = ['','已知错误','未知错误'];
                    alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                }else{
                    if(srcType == 'Click')
                        $scope.classList = objData.dataList;
                    else
                        $scope._classList = objData.dataList;
                }
            },function(res){
                console.log("无法访问此页面...");
            })
        }
        $scope.getClassList();//默认下拉列表              
        //添加学生选课
        $scope.addStuCourse = function(){
            $scope.maskPop = {'display':'block'};
            $scope.selCourse = {'display':'block'};
        }
        //获取选课任务信息
        $scope.getStuCouResult = function(){
            var url = 'stuCou!query2.action';
            var params = {'selCouId':$scope.selCouId};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    console.log(objData);
                    if(objData.success){
                        $scope.stuCourseList = objData.dataList;
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                            alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){

                })
        }
        $scope.getStuCouResult();
        //获取系统定义的评语等级
        $scope.getCommentLevelList = function(commentType){
            if(commentType == 'Teacher'){
                var url = 'baseWebDat?f=uxCode&codeType=81';
            }else{
                var url = 'baseWebDat?f=uxCode&codeType=82'
            }
            var params = {};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(commentType == 'Teacher'){
                        $scope.thrCommentLevelList = objData;
                    }else{
                        $scope.stuCommentLevelList = objData;
                    }               
                },function(){

                })
        }
        $scope.getCommentLevelList('Teacher');//教师对学生的评语等级
        $scope.getCommentLevelList('Student');//学生对老师的评语等级
        //查看学生选课结果的详情
        $scope.detailStuCourse = function(stuCouId){
            var url = 'stuCou!query3.action';
            var params = {'stuCouId':stuCouId};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        var objStuCourse = objData.dataList[0];
                        //教师对学生评价等级
                        for(var i=0;i<$scope.thrCommentLevelList.length;i++){
                            if($scope.thrCommentLevelList[i][0] == objStuCourse.evalStu)
                                $scope._evalStu = $scope.thrCommentLevelList[i][1];
                            }
                        //学生对课程评价等级
                        for(var i=0;i<$scope.stuCommentLevelList.length;i++){
                            if($scope.stuCommentLevelList[i][0] == objStuCourse.evalCou)
                                $scope._evalCou = $scope.stuCommentLevelList[i][1];
                            }
                        $scope._stuName = objStuCourse.stuName;
                        $scope._stuNO = objStuCourse.stuNO;
                        $scope._stuSex = objStuCourse.stuSex;
                        $scope._className = objStuCourse.claName;
                        $scope._grade = objStuCourse.ctuGradeNm;
                        $scope._term = objStuCourse.termName;
                        $scope._couName = objStuCourse.couName;
                        $scope._coutype = objStuCourse.couTypeNm;
                        $scope._couNO = objStuCourse.couNO;
                        $scope._creatTotal = objStuCourse.creditTotal;
                        $scope._couState = $scope.stuCouStateList[objStuCourse.state];
                        $scope._evalCouTxt = objStuCourse.evalCouTxt;//学生对课程评语内容
                        $scope._evalStuTxt = objStuCourse.evalStuTxt;//教师对学生评语内容
                        $scope._evalStuTime = objStuCourse.evalStuTime;//教师对学生评价时间
                        $scope._evalCouTime = objStuCourse.evalCouTime;//学生对课程评价时间
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                })
            $scope.maskPop = {'display':'block'};
            $scope.newlyAddPop = {'display':'block'};
        }
        //新增学生选课任务弹窗关闭
        $scope.closePop = function(){            
            $scope.maskPop = {'display':'none'};
            $scope.newlyAddPop = {'display':'none'};
            $scope.selCourse = {'display':'none'};
            $scope.stuRemark = {'display':'none'}
        }
        /**
         * saveType：1为来自学生列表的全新添加,2为来自修改
         */
        $scope.selectedStuId = []//存放被选中的复选框中的stuId
        $scope.selectedStuList = [];//存放被选中的学生对象
        $scope.tipsDisplay = {'display':'block','color':'#ddd'};//默认显示提示文字
        /**
         * 从学生列表中添加学生到新增选课结果的学生名单框中
         */
        $scope.addCourseStu = function(){
            if($scope.selectedStuId == false){
                alert('您未选中任何学生！');
                return;
            }
            for(var i=0;i<$scope.stuList.length;i++)
                for(var j=0;j<$scope.selectedStuId.length;j++){
                    if($scope.stuList[i].stuId == $scope.selectedStuId[j])
                        $scope.selectedStuList.push($scope.stuList[i]);
                }
            if($scope.selectedStuList.length !=0){
                $scope.tipsDisplay = {'display':'none'};
            }
        }
        /**
         * 保存教师对于学生的评价
         */
        $scope.saveStuRemark = function(){
            //var url = "stuCouEval!thrEvalStu.action";//教师对学生的评价
            var url = 'stuCouEval!upRec.action';//管理员评价            
            var params = {
                    'stuCouId':$scope.stuCouId,
                    'evalStu':$scope.radioRemarkLv,
                    'evalStuTxt':$scope.remarkContent,
                    'credit':$scope.studentcredit
                }            
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success)
                    {
                        //$scope.getStuCouResult();
                        $scope.maskPop = {'display':'none'}
                        $scope.stuRemark = {'display':'none'};
                        alert("评价学生成功！");                        
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                    
                },function(res){
                    console.log("无法访问此页面...");                    
                })
                $scope.radioRemarkLv = '';//初始化，表示默认不选中任何评价等级
                $scope.remarkContent = '';
                $scope.studentcredit = '';
        }      
        /**
         * 教师对学生进行评价
         */
        $scope.remarkValueList = [];//评语等级对应的数值
        $scope.remarkNameList = [];//评语等级的名称
        $scope.addStuRemark = function(stuId){
            for(var i=1;i<$scope.thrCommentLevelList.length;i++){
                if($scope.remarkValueList.indexOf($scope.thrCommentLevelList[i][0]) == -1)
                    $scope.remarkValueList.push($scope.thrCommentLevelList[i][0]);
                if($scope.remarkNameList.indexOf($scope.thrCommentLevelList[i][1]) == -1)
                    $scope.remarkNameList.push($scope.thrCommentLevelList[i][1]);
            }
            $scope.maskPop = {'display':'block'}
            $scope.stuRemark = {'display':'block'};
            $scope.stuCouId = stuId;            
        }
        //删除选中的学生
        $scope.removeStu = function(stuId){
            for(var i=0;i<$scope.selectedStuList.length;i++){
                if($scope.selectedStuList[i].stuId = stuId){
                    $scope.selectedStuList.splice(i,1);
                }
            }
            if($scope.selectedStuList == false){
                $scope.tipsDisplay = {'display':'block'};
            }
        }
        //保存新增的学生选课结果
        $scope.saveStuCouResult = function(){
            var url = "stuCou!newRec.action";            
            var params = {
                    'selCouId':$scope.selCouId,
                    'stuIds':$scope.selectedStuId.toString()
                }            
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success)
                    {
                        $scope.getStuCouResult();
                        alert("成功新增了1条学生选课结果");
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(res){
                    console.log("无法访问此页面...");
                })
        }   
        //删除选学生选课结果
         $scope.deleteStuCourse = function(stuCouIds){            
            var url = 'stuCou!del.action';
            var params = {'stuCouIds':stuCouIds};            
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getStuCouResult();
                        alert('删除学生选课结果成功！')                        
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                })
        }
        //设置被学生选中的课程状态
        $scope.stuCouStateList = ['','预选','选中','确认'];
        $scope.couStateList = ['','','开启','关闭 ','完成'];
        $scope.changeStuCouState = function(stuIds,state){
            var url = 'stuCou!chState.action';
            var params = {'stuIds':stuIds,'selCouId':$scope.selCouId,"state":state};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getStuCouResult();                  
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){

                })
        }       
    }])
    /**
     * 控制器适用于管理页面coursereviewhtml
     */
    .controller('CourseReviewCtrl',['$stateParams','$scope','$http',function($stateParams,$scope,$http){
        $scope.xkpId = $stateParams.xkpId;//获取参数选课计划id
        //获取待选课程信息
        $scope.courseStateList = ['','','开启','关闭','完成'];
        $scope.courseAuditList = ['','未审核','已审核'];
        $scope.courseTypeList = [];       
        //获取课程信息
        $scope.getReviewList = function(){
            var url = "selCouEval!query2.action";
            var params = {};
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;        
                    if(objData.success){
                        $scope._reviewList = objData.dataList;
                        //获取系统定义的评语等级
                        var url = 'baseWebDat?f=uxCode&codeType=82';
                        var params = {};
                        $http({'method':'get','url':url,'params':params})
                            .then(function(res){
                                var objData = res.data;
                                $scope.thrCommentLevelList = objData;
                                rvListLen = $scope._reviewList.length;
                                var _remarkNameList = [];
                                for(var j=0;j<$scope.thrCommentLevelList.length;j++){
                                    _remarkNameList.push($scope.thrCommentLevelList[j][1]);
                                }
                        for(var i=0;i<rvListLen;i++){
                            $scope._reviewList[i].schEval = _remarkNameList[parseInt($scope._reviewList[i].schEval)/2-1];
                            $scope._reviewList[i].socEval = _remarkNameList[parseInt($scope._reviewList[i].socEval)/2-1];
                            $scope._reviewList[i].selfEval = _remarkNameList[parseInt($scope._reviewList[i].selfEval)/2-1];
                        }
                        $scope.reviewList = $scope._reviewList;
                        $scope._reviewList = {};                                  
                            },function(){

                            })                        
                       
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                },function(){
                    console.log()
                })
        }
        $scope.getReviewList();//获取评语列表
        //新增待选课程的评语
        $scope.addCouReview = function(){
            
        }       
        //删除待选课程的评语
        $scope.deleteCouReview = function(courseId){
            var curCourseObj = [];
            var objList = $scope.reviewList;
            var objLen = objList.length;
            for(var i=0;i<objLen;i++){
                if(objList[i].selCouId == courseId){
                    curCourseObj = objList[i];
                }
            }
            if(curCourseObj.couState == 2 || curCourseObj.couState == 3){
                alert('您无法删除本课程，请更改课程状态为完成后，再次删除！');
                return;

            }
            var url = 'selCou!del.action';
            var params = {'selCouIds':courseId};            
            $http({'method':'get','url':url,'params':params})
                .then(function(res){
                    var objData = res.data;
                    if(objData.success){
                        $scope.getCourseList();
                        alert('删除课程成功！')                        
                    }else{
                        var errTypeList = ['','已知错误','未知错误'];
                        alert('错误类型：'+errTypeList[objData.type]+',错误信息：'+objData.message);
                    }
                })
        }        
        $scope.remarkNameList = [];//评语等级的名称      
        //修改待选课程的评语
        $scope.modifyCouReview = function(){

        }
        //查看待选课程评语
        $scope.detailCouReview = function(courseId,courseName,termName,courseTeacher){
            $scope.maskPop = {'display':'block'};
            $scope.detailReview = {'display':'block'};
            for(var i=0;i<$scope.thrCommentLevelList.length;i++){                
                if($scope.remarkNameList.indexOf($scope.thrCommentLevelList[i][1]) == -1)
                    $scope.remarkNameList.push($scope.thrCommentLevelList[i][1]);
            }          
            
            $scope._courseName = courseName;
            $scope._termName = termName;
            $scope._courseTeacher = courseTeacher;                    
                   
            //根据课程id找出课程评价
            for(var i=0;i<$scope.reviewList.length;i++)
                if($scope.reviewList[i].selCouIds = courseId){
                    var objCouReview = $scope.reviewList[i];
                    break;
                }
            //把评价数字转化为文本
            $scope.thrRemarkLv = objCouReview.selfEval
            $scope.socRemarkLv = objCouReview.socEval
            $scope.schRemarkLv = objCouReview.schEval;
            //评价内容
            $scope.thrRemark = objCouReview.selfEvalTxt;
            $scope.socRemark = objCouReview.socEvalTxt;
            $scope.schRemark = objCouReview.schEvalTxt;
        }
        $scope.closePop = function(){
            $scope.maskPop = {'display':'none'};
            $scope.detailReview = {'display':'none'};
        }               
        }])
        