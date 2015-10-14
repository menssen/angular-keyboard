angular.module('keyboard').constant('kbKey', (function() {
  var specialKeys = {
    8: 'BACKSPACE',
    9: 'TAB',
    13: 'ENTER',
    27: 'ESCAPE',
    32: 'SPACE',
    37: 'ARROWLEFT',
    38: 'ARROWUP',
    39: 'ARROWRRIGHT',
    40: 'ARROWDOWN',
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
      if (!this.key || this.key === 'Unidentified') {
        // hack for ie ctrl-/. fix this, or expand to other keys
        if (opts.keyCode === 191) {
          this.key = '/'
        } else if (opts.keyIdentifier) {
          this.key = String.fromCharCode(parseInt(opts.keyIdentifier.substr(2), 16))
        }
      }
      if (this.key === 'º') {
        this.key = ';'
      }
      if (this.key === 'Ü') {
        this.key = '\\'
      }

    } else {
      this.meta = false
      this.ctrl = false
      this.shift = false
      this.alt = false

      //FIXME: breaks if somebody forgets to add a key
      if(!opts){
        console.log("Make sure every key is wrapped in ' (single quotes)")
      }
      var keys = opts.split('+')

      keys.forEach(function(key) {
        if (key.toLowerCase() === 'mod') {
          if (navigator.platform.indexOf('Mac') === -1) {
            me.ctrl = true
          } else {
            me.meta = true
          }
        }
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
      
      return otherKey.key.toLowerCase() === this.key.toLowerCase()
    } },

  })

  return Key
})())
