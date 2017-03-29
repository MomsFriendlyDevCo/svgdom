const {invent, extend} = require('./utils/objectCreationUtils')
const EventTarget = require('./class/EventTarget')
const SVGPoint = require('./class/SVGPoint')
const SVGMatrix = require('./class/SVGMatrix')
const {SVGElement, Node, TextNode} = require('./class/Node')
const sizeOf = require('image-size');

var HTMLImageElement  = invent({
  name: 'HTMLImageElement',
  create: function(){
    Node.call(this, 'img')
    this.width = 0
    this.height = 0
    this.naturalWidth = 0
    this.naturalHeight = 0
  },
  inherit: Node,
  props: {
    src: {
      get: function() {
        return this.attrs.get('src')
      },
      set: function(val) {
        this.attrs.set('src', val)
        sizeOf(val, function (err, size) {
          if(err){
            this.dispatchEvent(new Event('error', this))
            return
          }

          this.width = this.naturalWidth = size.width
          this.height = this.naturalHeight = size.height

          this.dispatchEvent(new Event('load', this))
        }.bind(this));
      }
    },
    height: {
      get: function() {
        return this.attrs.get('height')
      },
      set: function(val) {
        this.attrs.set('height', val)
      }
    },
    height: {
      get: function() {
        return this.attrs.get('height')
      },
      set: function(val) {
        this.attrs.set('height', val)
      }
    },
  }
})

var Event = invent({
  name: 'Event',
  create: function(type){
    this.type = type
    this.cancelable = false
    this.defaultPrevented = false
  },
  extend: {
    preventDefault: function(){
      this.defaultPrevented = true
    }
  }
})

var CustomEvent = invent({
  name: 'CustomEvent',
  create: function(name, props = {}) {
    Event.call(this, name)

    this.detail = props.detail || null
    this.cancelable = props.cancelable || false
  },
  inherit: Event
})

var Document = invent({
  name: 'Document',
  create: function(root) {
    Node.call(this, '#document')
    this.nodeType = 9
    var root = this.createElement(root)
    this.appendChild(root)
    root.ownerDocument = this
    this.documentElement = root
  },
  inherit: Node,
  extend: {
    createElementNS: function(ns, name){
      return new SVGElement(name, {
        attrs: {xmlns: ns}
      })
    },
    createElement: function(name) {
      return new SVGElement(name, {ownerDocument: this})
    },
    createTextNode: function(text) {
      return new TextNode('#text', {data:text})
    },
    createAttribute: function(name) {
      return new AttributeNode(name)
    }
  }
})

var Window = invent({
  create: function() {
    EventTarget.call(this)
    this.document = new Document('svg')
  },
  inherit: EventTarget
})



extend(Window, {
  Node: Node,
  TextNode: TextNode,
  SVGElement: SVGElement,
  CustomEvent: CustomEvent,
  Event: Event,
  SVGMatrix: SVGMatrix,
  SVGPoint: SVGPoint,
  Image: HTMLImageElement,
  HTMLImageElement: HTMLImageElement,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  pageXOffset: 0,
  pageYOffset: 0
})

module.exports = new Window