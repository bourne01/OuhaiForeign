/**
 *网站的入口应用程序，提供网站全局初始化和页面路由服务
 */
//var flApp = angular.module('flApp',['ui.router','BaseMod','CourseShowMod','CourseTakeMod','EnrollMod','ReviewMod']);
//var flApp = angular.module('foreignApp',['ui.router','angularFileUpload','BaseMod','CourseMod']);
var flApp = angular.module('foreignApp',['ui.router','BaseMod','CourseMod']);
// console.log(flApp);
/**
 * 定义全局信息
 */

flApp.run(function($rootScope, $state, $stateParams){
    $rootScope.getEditObject = function(objId,objList){
        var objLen = objList.length;
        for(var i=0;i<objLen;i++){
            if(objList[i].id == objId){
                return objList[i];
            }
        }
    }
    $rootScope.getNowFormatDate = function(data,num) {
    	var date = new Date(data);
    	date.setDate(date.getDate() + num); //设置天数+100天
    	var seperator1 = "-";
    	var seperator2 = ":";
    	var month = date.getMonth() + 1;
    	var strDate = date.getDate();
    	if(month >= 1 && month <= 9) {
    		month = "0" + month;
    	}
    	if(strDate >= 0 && strDate <= 9) {
    		strDate = "0" + strDate;
    	}
    	var currentdate;
    	currentdate = date.getFullYear()
    	currentdate += seperator1
    	currentdate += month
    	currentdate += seperator1
    	currentdate += strDate
    	currentdate += " " + date.getHours()
    	currentdate += seperator2
    	currentdate += date.getMinutes()
    	currentdate += seperator2
    	currentdate += date.getSeconds();
    	return currentdate;
    }
    $rootScope.changeState = function(url,$http,stateVal,stateName,element){
      $http.get(url).success(function (data) {
        if(data.success){
          $('#msg span').text('修改成功！');
          $('#msg').fadeIn(setTimeout("$('#msg').fadeOut()",500));
          element.attr('state',stateVal).html(stateName);
        }else{
          $('#msg span').text(data.message);
          $('#msg').fadeIn(setTimeout("$('#msg').fadeOut()",500));
        }
      });
    }
    $rootScope.searchFil = function(url){
      var search1 = $.trim($('.search1').val());
      var search2 = $.trim($('.search2').val());
      var newUrl;
      if (search1 == '' & search2 == '') {
        //如果没有输入具体的编号名称 就用左边的条件进行筛选
        for (var i = 0; i < $('.fil-wrap .form-group').length; i++) {
          var parent = $('.fil-wrap .form-group').eq(i).find('select');
          var value = $.trim(parent.val());
          var name = parent.attr('data-name');
          if (value != '' & value.indexOf('{')<0) {
            //给查询条件加分隔符
            if (url.indexOf('?')>0) {
              url += '&';
            }else{
              url += '?';
            }
            url += name + '='+value;
          }
        }
      }else{
        //输入了具体的编号名称，就根据编号名称筛选，忽略左边的条件
        for (var i = 0; i < $('.fil-wrap .search input').length; i++) {
          var parent = $('.fil-wrap .search input').eq(i);
          var value = $.trim(parent.val());
          var name = parent.attr('data-name');
          //给查询条件加分隔符
          if (value != '') {
            if (url.indexOf('?')>0) {
              url += '&';
            }else{
              url += '?';
            }
            url += name+'='+value;
          }
        }
      }
      newUrl = url;
      return newUrl;
    }
})
/**
 * 配置页面路由信息
 */
flApp.config(function($stateProvider,$urlRouterProvider){
     $urlRouterProvider.otherwise('home');
     $stateProvider
        /*.state('index',{
            url:'/index',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/home.html'
                }
            }
        })*/
        .state('home',{
            url:'/home',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/home.html'
                }
            }
        })
        .state('homeicon',{
            url:'/homeicon',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/homeicon.html'
                }
            }
        })
        .state('courseadd',{
            url:'/courseadd?xkpId',
            params:{xkpd:null},
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/courseadd.html'
                }
            }
        })
        .state('courseedit',{
            url:'/courseedit?courseId&xkpId',
            params:{courseId:null,xkpd:null},
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/courseedit.html'
                }
            }
        })
        .state('courseresult',{
            url:'/courseresult?courseId',
            params:{courseId:null},
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/courseresult.html'
                }
            }
        })

        .state('coursetake',{
            url:'/coursetake',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/coursetake.html'
                }
            }
        })
        .state('coursereview',{
            url:'/coursereview',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/coursereview.html'
                }
            }
        })
        .state('coursemanage',{
            url:'/coursemanage?xkpId',
            params:{xkpId:null},
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/coursemanage.html'
                }
            }
        })
        .state('taskmanage',{
            url:'/taskmanage?xkpId',
            params:{xkpId:null},
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/taskmanage.html'
                }
            }
        })
        .state('claList',{
            url:'/claList',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/claList.html'
                }
            }
        })
        .state('claStudent',{
            url:'/claStudent?claid&graid&claname&graname',
            params:{claid:null,graid:null,graname:null},
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/claStudent.html'
                }
            }
        })
        .state('student',{
            url:'/student',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/student.html'
                }
            }
        })
        .state('teacherList',{
            url:'/teacherList',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/teacherList.html'
                }
            }
        })
        .state('societyList',{
            url:'/societyList',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/societyList.html'
                }
            }
        })
        .state('termList',{
            url:'/termList',
            views:{
                'header':{
                    templateUrl:'tpls/header.html'
                },
                'navside':{
                    templateUrl:'tpls/navside.html'
                },
                '':{
                    templateUrl:'tpls/termList.html'
                }
            }
        })
})
