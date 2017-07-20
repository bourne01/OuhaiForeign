courseMod
    .directive('addSubCourse',function($compile){
        return{
            link:function(scope,element){
                //记录当前活动标签id,默认为课程信息标签
                scope.courseTabId = 'courseinfo';
                //添加子课
                scope.switchTab = function(e){
                    angular.element('#'+scope.courseTabId).removeClass('active');
                    scope.courseTabId = e.currentTarget.id;
                    angular.element('#'+scope.courseTabId).addClass('active');
                }
                //关闭子课程
                scope.closeTab = function(tabId){
                    console.log(tabId);
                    angular.element('li#'+tabId).remove();
                }
                //鼠标进入标签出现关闭标签
                scope.showCloseIcon = function(tabId){
                    angular.element('li#'+tabId+" .glyphicon").css({'display':'inline-block'});
                }
                //鼠标进入标签出关闭标签隐藏
                scope.hideCloseIcon = function(tabId){
                    angular.element('li#'+tabId+" .glyphicon").css({'display':'none'});
                    angular.element('li#courseinfo').addClass('active');
                }
                var objMainCourse = angular.element('li#courseinfo');                
                element.on('click',function(){
                    var objLis = angular.element('.basic-tabs li');
                    var liLen = objLis.length;
                    var newTabId = 'subcourse'+(liLen-2);
                    angular.element('#'+scope.courseTabId).removeClass('active');
                    //利用compile服务重新编译DOM                   
                    scope.$apply(function(){
                        var tabHtml = '<li role="presentation" class="active" id="'+newTabId+'" ng-click="switchTab($event)" ng-mouseenter=showCloseIcon("'+newTabId+'") ng-mouseleave=hideCloseIcon("'+newTabId+'")><a href="" aria-controls="profile" role="tab" data-toggle="tab">子课程</a><span class="glyphicon glyphicon-remove" ng-click=closeTab("'+newTabId+'") aria-hidden="true"></span></li>';
                        var tabHtml = $compile(tabHtml)(scope);
                        objMainCourse.after(tabHtml);
                    })
                    scope.courseTabId = newTabId;
                    scope.subCourseMode = true;
                })            
            }
        }
    })

    .directive('configTab',function(){
        return{
            link:function(scope,element){
                //记录当前活动标签id,默认为课程信息标签
                scope.settingTabId = 'courseset';
                //设置标签切换
                scope.switchSetTabs = function(e){
                    angular.element('li#'+scope.settingTabId).removeClass('active');
                    angular.element('div#'+scope.settingTabId).removeClass('active');
                    scope.settingTabId = e.currentTarget.id;
                    angular.element('li#'+scope.settingTabId).addClass('active');
                    angular.element('div#'+scope.settingTabId).addClass('active');
                }
            }
        }
    })
    .directive('checkTerm',function($http){
        return{
            link:function(scope,element,attr){                
                element.on('click',function(){
                    var arrElemIndex = scope.termIdList.indexOf(attr.id);
                    if( arrElemIndex == -1){//列表中未存在该学期ID
                        scope.termIdList.push(attr.id);
                        element.addClass('term-border');
                        element.append('<div class="termchecked"><img src="imgs/home/termchecked.png"></div>');
                    }else{
                        delete scope.termIdList[arrElemIndex];
                        angular.element('#'+attr.id+' .termchecked').remove();
                        element.removeClass('term-border');
                        
                    }
                })
            }
        }
    })
    /**
     * 选中选课的使用班级
     */
    .directive('checkClass',function(){
        return{
            link:function(scope,element,attr){
                //scope.chkClassIdList = [];//被选中的适合班级
                element.on('click',function(){
                        var arrElemIndex = scope.chkClassIdList.indexOf(attr.classid);
                        if( arrElemIndex == -1){//列表中未存在班级ID
                            scope.chkClassIdList.push(attr.classid);
                            scope.chkClassNameList.push(attr.classname);
                            element.append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
                        }else{
                            /* delete scope.chkClassIdList[arrElemIndex];
                            delete scope.chkClassNameList[arrElemIndex]; */
                            scope.chkClassIdList.splice(arrElemIndex,1);
                            scope.chkClassNameList.splice(arrElemIndex,1);
                            if(attr.classid.indexOf('class') == -1)
                                angular.element('#class'+attr.classid+' .glyphicon').remove();
                            else
                                angular.element('#'+attr.classid+' .glyphicon').remove();
                            
                        }
                    })
            }
        }
    })
    /**
     * 适用选课的班级处理
     */
    .directive('dealClass',function(){
        return{
            link:function(scope,element,attr){
                element.on('click',function(){
                    var actType = attr.id;
                    switch(actType){
                        case 'moveclass'://移动班级
                            var chkClassIdLen = scope.chkClassIdList.length;
                            var classIdListAfterAdd = scope.selectedClassIdList;//初始为右侧栏中的班级id
                            var classNameListAfterAdd = scope.selectedClassNameList;//初始为右侧栏中的班级name
                            //在左侧所有班级栏中，当前勾选的班级如果不在右侧的被选中的班级栏中
                            for(var i=0;i<chkClassIdLen;i++){
                                if(scope.selectedClassIdList.indexOf(scope.chkClassIdList[i]) == -1){
                                    classIdListAfterAdd.push(scope.chkClassIdList[i]);
                                    classNameListAfterAdd.push(scope.chkClassNameList[i]);
                                }
                            }
                            scope.selectedClassIdList = classIdListAfterAdd;//向右侧栏中输出
                            scope.selectedClassNameList = classNameListAfterAdd;//向右侧栏中输出
                            for(var i=0;i<scope.chkClassIdList.length;i++){//去掉勾选图标
                                angular.element('#'+scope.chkClassIdList[i]+' .glyphicon').remove();
                            }                                                    
                            break;
                        case 'cancelclass'://从已选择列表中删除班级
                            var selectedClassLen = scope.selectedClassIdList.length;
                            var checkClassLen = scope.chkClassIdList.length;
                            var classIdListAfterCancel = [];//剩余班级id
                            var classNameListAfterCancel = [];//剩余班级名称
                            for(var i=0;i<selectedClassLen;i++){
                                if(scope.chkClassIdList.indexOf(scope.selectedClassIdList[i]) == -1){
                                    classIdListAfterCancel.push(scope.selectedClassIdList[i]);
                                    classNameListAfterCancel.push(scope.selectedClassNameList[i]);                        
                                }
                            }
                            scope.selectedClassIdList = classIdListAfterCancel;
                            scope.selectedClassNameList = classNameListAfterCancel;    
                            break;
                        case 'moveall':
                            for(var i=0;i<scope._classList.length;i++){
                                scope.selectedClassIdList[i] = 'class'+scope._classList[i].id;
                                scope.selectedClassNameList[i] = scope._classList[i].name;
                            }
                            break;
                        case 'cancelall':
                            scope.selectedClassIdList = [];
                            scope.selectedClassNameList = [];
                    }
                    scope.chkClassIdList = [];//初始化
                    scope.chkClassNameList = [];//初始化                   
                })
        }
        }
    })

    //切换选课计划状态
    .directive('changePlanState',function(){
        return{
            link:function(scope,element,attr){
                //scope.coursePlanStateVal = '2';//2表示选课计划状态--开启
                element.on('click',function(){
                    var stateType = attr.id;//状态类型
                    var stateVal = parseInt(attr.stateid);//状态代码值
                    //if(stateType == CourseEditState)
                        if(stateVal == 4){
                            attr.stateid = 1;
                            //element[0].innerText = scope.couEditStateList[attr.stateid];
                            scope.changePlanState(attr.planid,stateType,attr.stateid)
                        }else{
                            stateVal++;
                            attr.stateid = stateVal;
                            //element[0].innerText = scope.couEditStateList[attr.stateid];
                            scope.changePlanState(attr.planid,stateType,attr.stateid)
                        //}
                    //else{

                    }
                })
            }
        }
    })
    
    //切换学生选课任务状态
    .directive('changeTaskState',function(){
        return{
            link:function(scope,element,attr){
                //scope.coursePlanStateVal = '2';//2表示选课计划状态--开启
                element.on('click',function(){
                    var stateType = attr.id;//状态类型
                    var stateVal = parseInt(attr.stateid);//状态代码值
                        if(stateVal == 4){
                            attr.stateid = 1;
                            //element[0].innerText = scope.couEditStateList[attr.stateid];
                            scope.changeTaskState(attr.studentid,attr.planid,attr.stateid)
                        }else{
                            stateVal++;
                            attr.stateid = stateVal;
                            //element[0].innerText = scope.couEditStateList[attr.stateid];
                            scope.changeTaskState(attr.studentid,attr.planid,attr.stateid)
                        }
                })
            }
        }
    })
    //选中所有学生
    .directive('isChecked',function(){
        return{
            link:function(scope,element,attr){
                element.on('click',function($event){
                    var curCheckbox = $event.target;//获取当前被选中的checkbox
                    if(curCheckbox.checked){//选中
                        if(attr.id == 'all'){//全选
                            for(var i=0;i<scope.stuList.length;i++){
                                scope.selectedStuId.push(scope.stuList[i].stuId)    
                            }
                        }else{
                            scope.selectedStuId.push(attr.id);
                        }
                    }else{//取消
                        if(attr.id == 'all'){//全部取消
                            scope.selectedStuId = [];
                        }else{
                            var idx = scope.selectedStuId.indexOf(attr.id);  
                            scope.selectedStuId.splice(idx,1);
                            angular.element('#all')[0].checked = false;//一旦点击被选中的复选框，则取消全选标志
                        }  
                    }
                    console.log(scope.selectedStuId);
                })
            }
        }
    })
    //选中年级
    .directive('isGradeChecked',function(){
        return{
            link:function(scope,element,attr){
                element.on('click',function($event){
                    var curCheckbox = $event.target;//获取当前被选中的checkbox
                    var arrElemIndex = scope.checkedGradeIdList.indexOf(attr.id)
                    if(curCheckbox.checked){//选中
                        if(arrElemIndex == -1){
                            scope.checkedGradeIdList.push(attr.id)
                        }
                       //scope.getClassList('Click',scope.checkedGradeIdList.toString());
                    }else{
                         delete scope.checkedGradeIdList[arrElemIndex];                         
                    }
                    //连接多个年级id
                    var gradeIds = '';
                    for(var i=0;i<scope.checkedGradeIdList.length;i++){
                        if(scope.checkedGradeIdList[i])
                            gradeIds = scope.checkedGradeIdList[i]+','+gradeIds;                           
                    }
                    //去掉末尾','
                    if(gradeIds.substr(gradeIds.length-1,1) == ',')
                        gradeIds = gradeIds.substr(0,gradeIds.length-1);
                    scope.gradeIds = gradeIds;
                    console.log(scope.gradeIds+'in the directive isGradeChecked');
                   scope.getClassList('Click',gradeIds);                   
                })
            }
        }
    })
    //切换课程状态
    .directive('changeCourseState',function(){
        return{
            link:function(scope,element,attr){
                //scope.coursePlanStateVal = '2';//2表示选课计划状态--开启
                element.on('click',function(){
                    console.log('hihi...');
                    var stateType = attr.id;//状态类型
                    var stateVal = parseInt(attr.stateid);//状态代码值
                    if(stateType == 'CourseState'){
                        if(stateVal == 4){
                            attr.stateid = 2;                           
                        }else{
                            stateVal++;
                            attr.stateid = stateVal;                           
                        }
                    }else if(stateType == 'AuditState'){
                        if(stateVal == 2){
                            attr.stateid = 1;
                        }else{
                            stateVal++;
                            attr.stateid = stateVal;                           
                        }                   

                    }
                    scope.changeCourseState(attr.courseid,stateType,attr.stateid);
                })
            }
        }
    })
    //切换学生选中课程状态
    .directive('changeStudentState',function(){
        return{
            link:function(scope,element,attr){
                //scope.coursePlanStateVal = '2';//2表示选课计划状态--开启
                element.on('click',function(){
                    var stateType = attr.id;//状态类型
                    var stateVal = parseInt(attr.stateid);//状态代码值
                    if(stateType == 'CourseState'){
                        if(stateVal == 3){
                            attr.stateid = 1;                           
                        }else{
                            stateVal++;
                            attr.stateid = stateVal;                           
                        }
                    }
                    scope.changeStuCouState(attr.studentid,attr.stateid);
                })
            }
        }
    })