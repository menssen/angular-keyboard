/**
 * kb-item-key
 */
angular.module('keyboard').directive('kbItemKey', ['kbLinkKbKey', 'kbKey', function(kbLinkKbKey, kbKey) {
    return {
        require: '^kbItem',
        link: kbLinkKbKey,
    }
}]);
