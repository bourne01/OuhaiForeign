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
                var objMainCourse = angular.element('li#courseinfo');                
                element.on('click',function(){
                    var objLis = angular.element('.basic-tabs li');
                    var liLen = objLis.length;
                    var newTabId = 'subcourse'+(liLen-2);
                    angular.element('#'+scope.courseTabId).removeClass('active');
                    //利用compile服务重新编译DOM                   
                    scope.$apply(function(){
                        var tabHtml = '<li role="presentation" class="active" id="'+newTabId+'" ng-click="switchTab($event)"><a href="" aria-controls="profile" role="tab" data-toggle="tab">子课程</a></li>';
                        var tabHtml = $compile(tabHtml)(scope);
                        objMainCourse.after(tabHtml);
                    })
                    scope.courseTabId = newTabId;
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
                scope.isClick = false;
                scope.termIdList = []//保存已经选中的学期
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