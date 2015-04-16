angular.module('keyboard').directive('kbKey', ['kbAction', 'kbKey', '$document', function(kbAction, kbKey, $document) {

  var documentIsObserved, keys = []
  function observeDocument() {
    if (documentIsObserved) {
      return
    }

    documentIsObserved = true

    $document.bind('keydown', function(e){
      // Don't catch keys that were in inputs.
      var $target = angular.element(e.target);
      var inputTypes = /text|search|tel|url|email|password|/i;
      if (e.target.nodeName === "INPUT" && inputTypes.test($target.attr('type'))){
        return;
      }
      if (e.target.nodeName === "TEXTAREA"){
        return;
      }
      
      for (var i = keys.length - 1; i >= 0; i--){
        if (keys[i].kbKey.equals(new kbKey(e))) {
          e.preventDefault()
          kbAction.doActionForElement(keys[i].element)
        }
      }
    });
  }

  return {
    require: 'kbKey',
    controller: function() { this.keys = keys },
    compile: function() {
      observeDocument()
      return function (scope, element, attrs, controller) {
        var shortcutKeySets = scope.$eval(attrs.kbItemKey || attrs.kbKey);
        if (!Array.isArray(shortcutKeySets)) {
            shortcutKeySets = [shortcutKeySets]
        }

        shortcutKeySets.forEach(function(key) {
            controller.keys.push({
              kbKey: new kbKey(key),
              element: element,
            })
        })
      }
    },
  }
  
}])
