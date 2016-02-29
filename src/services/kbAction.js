angular.module('keyboard').constant('kbAction', (function() {
  return {
    doActionForElement: function(element) {
      if (  element.attr('kb-key-click') !== void 0
         || element.attr('ng-click')     !== void 0
         || element.attr('ui-sref')      !== void 0
      ) {
        if(element.attr('disabled')){
          return
        } else {
          element.triggerHandler('click')
          return
        }
      }
      if (element.attr('kb-key-focus') !== void 0 && element.attr('disabled') !== 'disabled'){
        if (element.attr('kb-key-focus')) {
          var focus = element.scope().$eval(element.attr('kb-key-focus'))
          if (!focus) {
            focus = []
          }
          if (!Array.isArray(focus)) {
            focus = [focus]
          }
          var el
          for (var x in focus) {
            el = element[0].querySelector(focus[x])
            if (el) {
              break
            }
          }
          if (el) {
            el.focus()
          }
        } else {
          element[0].focus()
        }
        return
      } else {
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
