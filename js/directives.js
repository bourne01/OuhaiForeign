courseMod
    .directive('addSubCourse',function($compile){
        return{
            template:'<li role="presentation" class="active" id="'+scope.courseTabId+'" ng-click="getTabId()"><a href="#courseinfo" aria-controls="profile" role="tab" data-toggle="tab">子课程</a></li>',
            link:function(scope,element){
                //记录当前活动标签id,默认为课程信息标签
                scope.courseTabId = 'courseinfo';
                //添加子课
                scope.getTabId = function(){
                    console.log('i....')
                }
                var objMainCourse = angular.element('li#courseinfo');                
                element.on('click',function(){
                    var objLis = angular.element('.basic-tabs li');
                    var liLen = objLis.length;
                    var newTabId = 'subcourse'+(liLen-2);
                    angular.element('#'+scope.courseTabId).removeClass('active');                   
                    scope.$apply(function(){
                        var tabHtml = $compile(template)(scope);
                        objMainCourse.after();
                    })
                    scope.courseTabId = newTabId;
                })            
            }
        }
    })