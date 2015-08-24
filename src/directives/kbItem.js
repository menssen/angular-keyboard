/**
 * kb-item
 */
angular.module('keyboard').directive('kbItem', ['kbAction', 'kbKey', 'KbItemController', '$animate', '$log', function(kbAction, kbKey, KbItemController, $animate, $log) {
  return {
    controller: KbItemController,
    require: ['kbItem', '?^kbList', '?^kbSelect'],
    link: function($scope, el, attrs, controllers) {
      var kbItem = controllers[0];
      var kbContainer = controllers[1];
      var isTabbable = (el[0].tagName === 'A' || el[0].tagName === 'BUTTON' || el[0].tagName === 'AREA');
      for (var i = 1; i < controllers.length; i++) {
        if (controllers[i]) {
          kbContainer = controllers[i];
        }
      }
      if (!kbContainer) {
        $log.error("Controller 'kbList' or 'kbSelect', required by directive 'kbItem', can't be found!");
        return;
      }
      var selectedClass = attrs.kbSelectedClass || 'kb-selected';
      var activeClass = attrs.kbActiveClass || 'kb-active';

      kbItem.model = $scope.$eval(attrs.kbItem);
      $scope.$watch(attrs.kbItem, function(model) {
        kbItem.model = model;
      });
      if (typeof kbContainer.active === 'undefined') {
        kbContainer.active = kbItem;
      } else if (kbContainer.isSelected(kbItem.model) && kbContainer.isSelected(kbContainer.active.model) === false) {
        kbContainer.active = kbItem;
      } 
      $scope.$watch(function() {
        return kbContainer.isSelected(kbItem.model);
      }, function(isSelected) {
        if (isSelected) {
          $animate.addClass(el, selectedClass);
        } else {
          $animate.removeClass(el, selectedClass);
        }
      });

      $scope.$watch(function() {
        return kbContainer.active === kbItem;
      }, function(isActive) {
        if (isActive) {
          el.attr('tabindex', 0);
          $animate.addClass(el, activeClass);
          kbContainer.activate(kbItem);
          kbContainer.invoke(kbItem);
        } else {
          $animate.removeClass(el, activeClass);
          if (isTabbable) {
            el.attr('tabindex', -1);
          } else {
            el.removeAttr('tabindex');
          }
        }
      });
      function distance(direction, currentRect, targetRect) {
        if (direction === 'left' && targetRect.left < currentRect.left) {
          return currentRect.left - targetRect.left;
        }
        if (direction === 'up' && targetRect.top < currentRect.top) {
          return currentRect.top - targetRect.top;
        }
        if (direction === 'right' && targetRect.left > currentRect.left) {
          return targetRect.left - currentRect.left;
        }
        if (direction === 'down' && targetRect.top > currentRect.top) {
          return targetRect.top - currentRect.top;
        }
        return 0;
      }
      var directions = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      };
      el.on('keydown', function(e) {
        var changed = false;
        var invoke = false;
        if (!kbContainer.simpleMode && (e.which >= 37 && e.which <= 40) || kbContainer.simpleMode && (e.which == 38 || e.which == 40)) {
          var siblings = kbContainer._getSiblingItems(kbItem);
          var currentRect = el[0].getBoundingClientRect();
          if (siblings.previous && distance(directions[e.which], currentRect, siblings.previous.element[0].getBoundingClientRect())) {
            kbContainer.activate(siblings.previous);
            changed = true;
          }
          if (siblings.next && distance(directions[e.which], currentRect, siblings.next.element[0].getBoundingClientRect())) {
            kbContainer.activate(siblings.next);
            changed = true;
          }
          if (changed === false && (!siblings.next || !siblings.previous)) {
            var key = e.which;
            var trigger = false;
            if (e.which <= 38) {
              key += 2;
            } else {
              key -= 2;
            }
            if (siblings.next && distance(directions[key], currentRect, siblings.next.element[0].getBoundingClientRect())) {
              if (kbContainer.cyclic) {
                kbContainer.activate(kbContainer._last());
                changed = true;
              } else {
                trigger = 'kbReachedBegin';
              }
            }
            if (siblings.previous && distance(directions[key], currentRect, siblings.previous.element[0].getBoundingClientRect())) {
              if (kbContainer.cyclic) {
                kbContainer.activate(kbContainer._first());
                changed = true;
              } else {
                trigger = 'kbReachedEnd';
              }
            }
            if (trigger && kbContainer.attrs[trigger]) {
              angular.element(kbContainer._element).scope().$eval(kbContainer.attrs[trigger], {$event: e});
            }
          }
        } else if (!kbContainer.simpleMode && (e.which === 32 || e.which === 13)) {
          invoke = true;
        } else {
          kbItem.keys.some(function(itemKey) {
            if (itemKey.kbKey.equals(new kbKey(e))) {
              e.preventDefault();
              kbAction.doActionForElement(itemKey.element);
              return true;
            }
          });
        }
        if (changed || invoke) {
          e.preventDefault();
          if (invoke) {
            kbContainer.invoke(kbItem);
            if (attrs.kbInvoke) {
              $scope.$eval(attrs.kbInvoke, {$event: e});
            }
          }
          $scope.$apply();
        }
      });


      el.on('click', function(e) {
        kbContainer.active = kbItem;
        if (attrs.kbInvoke) {
          $scope.$eval(attrs.kbInvoke, {$event: e});
        }
        $scope.$apply();
      });

      $scope.$on('$destroy', function() {
        kbContainer.active = undefined;
      });
    }
  };
}]);