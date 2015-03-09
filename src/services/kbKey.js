angular.module('keyboard').constant('kbKey', (function() {
  var specialKeys = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    27: 'Escape',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
  };
  var modifiers = ['meta', 'ctrl', 'shift', 'alt']

  function Key(opts) {
    var me = this
    if (typeof opts === 'object') {
      opts = opts.originalEvent || opts
      this.meta = opts.meta || opts.metaKey || false
      this.ctrl = opts.ctrl || opts.ctrlKey || false
      this.shift = opts.shift || opts.shiftKey || false
      this.alt = opts.alt || opts.altKey || false
      this.key = specialKeys[opts.keyCode] || opts.key
      if (!this.key) {
        this.key = String.fromCharCode(parseInt(opts.keyIdentifier.substr(2), 16))
      }
    } else {
      this.meta = false
      this.ctrl = false
      this.shift = false
      this.alt = false

      var keys = opts.split('+')

      keys.forEach(function(key) {
        if (modifiers.indexOf(key.toLowerCase()) !== -1) {
          me[key.toLowerCase()] = true

          return
        }

        me.key = key.toUpperCase()
      })
    }
  }

  Object.defineProperties(Key.prototype, {
    equals: { value: function(otherKey) {
      for (var i = 0; i < modifiers.length; ++i) {
        if (otherKey[modifiers[i]] !== this[modifiers[i]]) {
          return false
        }
      }
      
      return otherKey.key === this.key
    } },

  })

  return Key
})())
