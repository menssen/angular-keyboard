angular.module('keyboard').constant('kbAction', (function() {
  return {
    doActionForElement: function(element) {
      var action;
      var eventAction = function(event){
        return function(){
          if(event === 'focus'){
            element[0].focus();
            return
          }
          element.triggerHandler(event);
        };
      };

      if (  element.attr('kb-key-click') !== void 0
         || element.attr('ng-click')     !== void 0
         || element.attr('ui-sref')      !== void 0
      ) {
        element.triggerHandler('click')
        return
      }

      if (element.attr('kb-key-focus') !== void 0) {
        element[0].focus()
        return
      }

      if (element.attr('kb-key-navigate')) {
        window.location = element.attr('kb-key-navigate')
        return
      }

      if (element.attr('href')) {
        window.location = element.attr('href')
        return
      }

      if (element.attr('kb-key-action')) {
        element.scope().$eval(element.attr('kb-key-action'))
      }
    },
  }
})())
