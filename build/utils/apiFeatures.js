"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var APIFeatures = /*#__PURE__*/function () {
  function APIFeatures(query, queryString) {
    _classCallCheck(this, APIFeatures);
    this.query = query;
    this.queryString = queryString;
  }
  return _createClass(APIFeatures, [{
    key: "filter",
    value: function filter() {
      // Filtering
      var queryObj = _objectSpread({}, this.queryString);
      var excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(function (el) {
        return delete queryObj[el];
      });

      //1.Advanced filtering
      var queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) {
        return "$".concat(match);
      });
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  }, {
    key: "sort",
    value: function sort() {
      if (this.queryString.sort) {
        var sortBy = this.queryString.sort.split(',').join(' ');
        this.query.sort(sortBy);
      } else {
        this.query.sort('-createdAt');
      }
      return this;
    }
  }, {
    key: "limitFields",
    value: function limitFields() {
      if (this.queryString.fields) {
        var fields = this.queryString.fields.split(',').join('');
        this.query.select(fields);
      } else {
        this.query.select('-__v');
      }
      return this;
    }
  }, {
    key: "paginate",
    value: function paginate() {
      var _this$queryString = this.queryString,
        _this$queryString$pag = _this$queryString.page,
        page = _this$queryString$pag === void 0 ? 1 : _this$queryString$pag,
        _this$queryString$lim = _this$queryString.limit,
        limit = _this$queryString$lim === void 0 ? 10 : _this$queryString$lim;
      var skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit * 1);
      return this;
    }
  }]);
}();
module.exports = APIFeatures;