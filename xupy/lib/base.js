"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default={$createApp:function(t){var r={},o=new t;for(var e in o)r[e]=o[e];return Object.getOwnPropertyNames(o.constructor.prototype||[]).forEach(function(t){"constructor"!==t&&(r[t]=function(){o.constructor.prototype[t].apply(o,arguments)})}),r},$createPage:function(t){var r={},o=new t;return r.data=o.data||{},r.$parent=o.$parent,Object.getOwnPropertyNames(o.methods||[]).forEach(function(t){r[t]=o.methods[t]}),Object.getOwnPropertyNames(o.constructor.prototype||[]).forEach(function(t){"constructor"!==t&&(r[t]=o.constructor.prototype[t])}),r},$createComponent:function(t){var r={},o=new t;for(var e in o)r[e]=o[e];return Object.getOwnPropertyNames(o.constructor.prototype||[]).forEach(function(t){"constructor"!==t&&(r[t]=o.constructor.prototype[t])}),r}};