/**
 * kb-item-key
 */
angular.module('keyboard').directive('kbItemKey', ['kbKey', function(kbKey) {
    return {
        require: '^kbItem',
        link: function (scope, element, attrs, controller) {
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
        },
    }
}]);
