angular.module('keyboard').directive('kbKey', ['kbAction', 'kbLinkKbKey', 'kbKey', '$document', function(kbAction, kbLinkKbKey, kbKey, $document) {

  var documentIsObserved, keys = []
  function observeDocument() {
    if (documentIsObserved) {
      return
    }

    documentIsObserved = true

    $document.bind('keydown', function(e){
      // Don't catch keys that were in inputs.
      var $target = angular.element(e.target);
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
      return kbLinkKbKey
    },
  }
  
}])
