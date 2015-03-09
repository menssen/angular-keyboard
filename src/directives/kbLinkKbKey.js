angular.module('keyboard').factory('kbLinkKbKey', ['kbKey', function(kbKey) {
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
}])
