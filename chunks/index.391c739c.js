import{useContext as e,useState as t,useRef as n,useEffect as r}from"react";import{I as o,u as s,E as i,F as a,a as c}from"./index.e4d9a916.js";import"react/jsx-runtime";import"events";import"buffer";import"@lifesg/react-design-system/media";import"@lifesg/react-design-system/alert";import"@lifesg/react-design-system/text";import"@lifesg/react-design-system/color";import"styled-components";import"@lifesg/react-design-system/modal";import"@lifesg/react-design-system/button";import"react-dom/server";import"@lifesg/react-design-system";import"@lifesg/react-design-system/toggle";import"@lifesg/react-design-system/form";import"@lifesg/react-design-system/checkbox";import"@lifesg/react-design-system/input-textarea";import"@lifesg/react-icons/cross";import"@lifesg/react-design-system/icon-button";import"@lifesg/react-design-system/input-select";import"@lifesg/react-design-system/radio-button";function u(e,t){return function(){return e.apply(t,arguments)}}const{toString:l}=Object.prototype,{getPrototypeOf:f}=Object,d=(p=Object.create(null),e=>{const t=l.call(e);return p[t]||(p[t]=t.slice(8,-1).toLowerCase())});var p;const h=e=>(e=e.toLowerCase(),t=>d(t)===e),m=e=>t=>typeof t===e,{isArray:g}=Array,y=m("undefined");const E=h("ArrayBuffer");const b=m("string"),w=m("function"),R=m("number"),O=e=>null!==e&&"object"==typeof e,S=e=>{if("object"!==d(e))return!1;const t=f(e);return!(null!==t&&t!==Object.prototype&&null!==Object.getPrototypeOf(t)||Symbol.toStringTag in e||Symbol.iterator in e)},A=h("Date"),T=h("File"),v=h("Blob"),N=h("FileList"),C=h("URLSearchParams");function j(e,t,{allOwnKeys:n=!1}={}){if(null==e)return;let r,o;if("object"!=typeof e&&(e=[e]),g(e))for(r=0,o=e.length;r<o;r++)t.call(null,e[r],r,e);else{const o=n?Object.getOwnPropertyNames(e):Object.keys(e),s=o.length;let i;for(r=0;r<s;r++)i=o[r],t.call(null,e[i],i,e)}}function P(e,t){t=t.toLowerCase();const n=Object.keys(e);let r,o=n.length;for(;o-- >0;)if(r=n[o],t===r.toLowerCase())return r;return null}const U="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:global,_=e=>!y(e)&&e!==U;const x=(D="undefined"!=typeof Uint8Array&&f(Uint8Array),e=>D&&e instanceof D);var D;const L=h("HTMLFormElement"),F=(({hasOwnProperty:e})=>(t,n)=>e.call(t,n))(Object.prototype),B=h("RegExp"),I=(e,t)=>{const n=Object.getOwnPropertyDescriptors(e),r={};j(n,((n,o)=>{!1!==t(n,o,e)&&(r[o]=n)})),Object.defineProperties(e,r)},k="abcdefghijklmnopqrstuvwxyz",M="0123456789",z={DIGIT:M,ALPHA:k,ALPHA_DIGIT:k+k.toUpperCase()+M};const q=h("AsyncFunction");var H={isArray:g,isArrayBuffer:E,isBuffer:function(e){return null!==e&&!y(e)&&null!==e.constructor&&!y(e.constructor)&&w(e.constructor.isBuffer)&&e.constructor.isBuffer(e)},isFormData:e=>{let t;return e&&("function"==typeof FormData&&e instanceof FormData||w(e.append)&&("formdata"===(t=d(e))||"object"===t&&w(e.toString)&&"[object FormData]"===e.toString()))},isArrayBufferView:function(e){let t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&E(e.buffer),t},isString:b,isNumber:R,isBoolean:e=>!0===e||!1===e,isObject:O,isPlainObject:S,isUndefined:y,isDate:A,isFile:T,isBlob:v,isRegExp:B,isFunction:w,isStream:e=>O(e)&&w(e.pipe),isURLSearchParams:C,isTypedArray:x,isFileList:N,forEach:j,merge:function e(){const{caseless:t}=_(this)&&this||{},n={},r=(r,o)=>{const s=t&&P(n,o)||o;S(n[s])&&S(r)?n[s]=e(n[s],r):S(r)?n[s]=e({},r):g(r)?n[s]=r.slice():n[s]=r};for(let e=0,t=arguments.length;e<t;e++)arguments[e]&&j(arguments[e],r);return n},extend:(e,t,n,{allOwnKeys:r}={})=>(j(t,((t,r)=>{n&&w(t)?e[r]=u(t,n):e[r]=t}),{allOwnKeys:r}),e),trim:e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""),stripBOM:e=>(65279===e.charCodeAt(0)&&(e=e.slice(1)),e),inherits:(e,t,n,r)=>{e.prototype=Object.create(t.prototype,r),e.prototype.constructor=e,Object.defineProperty(e,"super",{value:t.prototype}),n&&Object.assign(e.prototype,n)},toFlatObject:(e,t,n,r)=>{let o,s,i;const a={};if(t=t||{},null==e)return t;do{for(o=Object.getOwnPropertyNames(e),s=o.length;s-- >0;)i=o[s],r&&!r(i,e,t)||a[i]||(t[i]=e[i],a[i]=!0);e=!1!==n&&f(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},kindOf:d,kindOfTest:h,endsWith:(e,t,n)=>{e=String(e),(void 0===n||n>e.length)&&(n=e.length),n-=t.length;const r=e.indexOf(t,n);return-1!==r&&r===n},toArray:e=>{if(!e)return null;if(g(e))return e;let t=e.length;if(!R(t))return null;const n=new Array(t);for(;t-- >0;)n[t]=e[t];return n},forEachEntry:(e,t)=>{const n=(e&&e[Symbol.iterator]).call(e);let r;for(;(r=n.next())&&!r.done;){const n=r.value;t.call(e,n[0],n[1])}},matchAll:(e,t)=>{let n;const r=[];for(;null!==(n=e.exec(t));)r.push(n);return r},isHTMLForm:L,hasOwnProperty:F,hasOwnProp:F,reduceDescriptors:I,freezeMethods:e=>{I(e,((t,n)=>{if(w(e)&&-1!==["arguments","caller","callee"].indexOf(n))return!1;const r=e[n];w(r)&&(t.enumerable=!1,"writable"in t?t.writable=!1:t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+n+"'")}))}))},toObjectSet:(e,t)=>{const n={},r=e=>{e.forEach((e=>{n[e]=!0}))};return g(e)?r(e):r(String(e).split(t)),n},toCamelCase:e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,(function(e,t,n){return t.toUpperCase()+n})),noop:()=>{},toFiniteNumber:(e,t)=>(e=+e,Number.isFinite(e)?e:t),findKey:P,global:U,isContextDefined:_,ALPHABET:z,generateString:(e=16,t=z.ALPHA_DIGIT)=>{let n="";const{length:r}=t;for(;e--;)n+=t[Math.random()*r|0];return n},isSpecCompliantForm:function(e){return!!(e&&w(e.append)&&"FormData"===e[Symbol.toStringTag]&&e[Symbol.iterator])},toJSONObject:e=>{const t=new Array(10),n=(e,r)=>{if(O(e)){if(t.indexOf(e)>=0)return;if(!("toJSON"in e)){t[r]=e;const o=g(e)?[]:{};return j(e,((e,t)=>{const s=n(e,r+1);!y(s)&&(o[t]=s)})),t[r]=void 0,o}}return e};return n(e,0)},isAsyncFn:q,isThenable:e=>e&&(O(e)||w(e))&&w(e.then)&&w(e.catch)};function J(e,t,n,r,o){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack,this.message=e,this.name="AxiosError",t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),o&&(this.response=o)}H.inherits(J,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:H.toJSONObject(this.config),code:this.code,status:this.response&&this.response.status?this.response.status:null}}});const W=J.prototype,V={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach((e=>{V[e]={value:e}})),Object.defineProperties(J,V),Object.defineProperty(W,"isAxiosError",{value:!0}),J.from=(e,t,n,r,o,s)=>{const i=Object.create(W);return H.toFlatObject(e,i,(function(e){return e!==Error.prototype}),(e=>"isAxiosError"!==e)),J.call(i,e.message,t,n,r,o),i.cause=e,i.name=e.name,s&&Object.assign(i,s),i};function K(e){return H.isPlainObject(e)||H.isArray(e)}function G(e){return H.endsWith(e,"[]")?e.slice(0,-2):e}function $(e,t,n){return e?e.concat(t).map((function(e,t){return e=G(e),!n&&t?"["+e+"]":e})).join(n?".":""):t}const Z=H.toFlatObject(H,{},null,(function(e){return/^is[A-Z]/.test(e)}));function X(e,t,n){if(!H.isObject(e))throw new TypeError("target must be an object");t=t||new FormData;const r=(n=H.toFlatObject(n,{metaTokens:!0,dots:!1,indexes:!1},!1,(function(e,t){return!H.isUndefined(t[e])}))).metaTokens,o=n.visitor||u,s=n.dots,i=n.indexes,a=(n.Blob||"undefined"!=typeof Blob&&Blob)&&H.isSpecCompliantForm(t);if(!H.isFunction(o))throw new TypeError("visitor must be a function");function c(e){if(null===e)return"";if(H.isDate(e))return e.toISOString();if(!a&&H.isBlob(e))throw new J("Blob is not supported. Use a Buffer instead.");return H.isArrayBuffer(e)||H.isTypedArray(e)?a&&"function"==typeof Blob?new Blob([e]):Buffer.from(e):e}function u(e,n,o){let a=e;if(e&&!o&&"object"==typeof e)if(H.endsWith(n,"{}"))n=r?n:n.slice(0,-2),e=JSON.stringify(e);else if(H.isArray(e)&&function(e){return H.isArray(e)&&!e.some(K)}(e)||(H.isFileList(e)||H.endsWith(n,"[]"))&&(a=H.toArray(e)))return n=G(n),a.forEach((function(e,r){!H.isUndefined(e)&&null!==e&&t.append(!0===i?$([n],r,s):null===i?n:n+"[]",c(e))})),!1;return!!K(e)||(t.append($(o,n,s),c(e)),!1)}const l=[],f=Object.assign(Z,{defaultVisitor:u,convertValue:c,isVisitable:K});if(!H.isObject(e))throw new TypeError("data must be an object");return function e(n,r){if(!H.isUndefined(n)){if(-1!==l.indexOf(n))throw Error("Circular reference detected in "+r.join("."));l.push(n),H.forEach(n,(function(n,s){!0===(!(H.isUndefined(n)||null===n)&&o.call(t,n,H.isString(s)?s.trim():s,r,f))&&e(n,r?r.concat(s):[s])})),l.pop()}}(e),t}function Q(e){const t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,(function(e){return t[e]}))}function Y(e,t){this._pairs=[],e&&X(e,this,t)}const ee=Y.prototype;function te(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}function ne(e,t,n){if(!t)return e;const r=n&&n.encode||te,o=n&&n.serialize;let s;if(s=o?o(t,n):H.isURLSearchParams(t)?t.toString():new Y(t,n).toString(r),s){const t=e.indexOf("#");-1!==t&&(e=e.slice(0,t)),e+=(-1===e.indexOf("?")?"?":"&")+s}return e}ee.append=function(e,t){this._pairs.push([e,t])},ee.toString=function(e){const t=e?function(t){return e.call(this,t,Q)}:Q;return this._pairs.map((function(e){return t(e[0])+"="+t(e[1])}),"").join("&")};var re=class{constructor(){this.handlers=[]}use(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(e){H.forEach(this.handlers,(function(t){null!==t&&e(t)}))}},oe={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1};var se={isBrowser:!0,classes:{URLSearchParams:"undefined"!=typeof URLSearchParams?URLSearchParams:Y,FormData:"undefined"!=typeof FormData?FormData:null,Blob:"undefined"!=typeof Blob?Blob:null},isStandardBrowserEnv:(()=>{let e;return("undefined"==typeof navigator||"ReactNative"!==(e=navigator.product)&&"NativeScript"!==e&&"NS"!==e)&&("undefined"!=typeof window&&"undefined"!=typeof document)})(),isStandardBrowserWebWorkerEnv:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&"function"==typeof self.importScripts,protocols:["http","https","file","blob","url","data"]};function ie(e){function t(e,n,r,o){let s=e[o++];const i=Number.isFinite(+s),a=o>=e.length;if(s=!s&&H.isArray(r)?r.length:s,a)return H.hasOwnProp(r,s)?r[s]=[r[s],n]:r[s]=n,!i;r[s]&&H.isObject(r[s])||(r[s]=[]);return t(e,n,r[s],o)&&H.isArray(r[s])&&(r[s]=function(e){const t={},n=Object.keys(e);let r;const o=n.length;let s;for(r=0;r<o;r++)s=n[r],t[s]=e[s];return t}(r[s])),!i}if(H.isFormData(e)&&H.isFunction(e.entries)){const n={};return H.forEachEntry(e,((e,r)=>{t(function(e){return H.matchAll(/\w+|\[(\w*)]/g,e).map((e=>"[]"===e[0]?"":e[1]||e[0]))}(e),r,n,0)})),n}return null}const ae={"Content-Type":void 0};const ce={transitional:oe,adapter:["xhr","http"],transformRequest:[function(e,t){const n=t.getContentType()||"",r=n.indexOf("application/json")>-1,o=H.isObject(e);o&&H.isHTMLForm(e)&&(e=new FormData(e));if(H.isFormData(e))return r&&r?JSON.stringify(ie(e)):e;if(H.isArrayBuffer(e)||H.isBuffer(e)||H.isStream(e)||H.isFile(e)||H.isBlob(e))return e;if(H.isArrayBufferView(e))return e.buffer;if(H.isURLSearchParams(e))return t.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();let s;if(o){if(n.indexOf("application/x-www-form-urlencoded")>-1)return function(e,t){return X(e,new se.classes.URLSearchParams,Object.assign({visitor:function(e,t,n,r){return se.isNode&&H.isBuffer(e)?(this.append(t,e.toString("base64")),!1):r.defaultVisitor.apply(this,arguments)}},t))}(e,this.formSerializer).toString();if((s=H.isFileList(e))||n.indexOf("multipart/form-data")>-1){const t=this.env&&this.env.FormData;return X(s?{"files[]":e}:e,t&&new t,this.formSerializer)}}return o||r?(t.setContentType("application/json",!1),function(e,t,n){if(H.isString(e))try{return(t||JSON.parse)(e),H.trim(e)}catch(e){if("SyntaxError"!==e.name)throw e}return(n||JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){const t=this.transitional||ce.transitional,n=t&&t.forcedJSONParsing,r="json"===this.responseType;if(e&&H.isString(e)&&(n&&!this.responseType||r)){const n=!(t&&t.silentJSONParsing)&&r;try{return JSON.parse(e)}catch(e){if(n){if("SyntaxError"===e.name)throw J.from(e,J.ERR_BAD_RESPONSE,this,null,this.response);throw e}}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:se.classes.FormData,Blob:se.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};H.forEach(["delete","get","head"],(function(e){ce.headers[e]={}})),H.forEach(["post","put","patch"],(function(e){ce.headers[e]=H.merge(ae)}));var ue=ce;const le=H.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]);const fe=Symbol("internals");function de(e){return e&&String(e).trim().toLowerCase()}function pe(e){return!1===e||null==e?e:H.isArray(e)?e.map(pe):String(e)}function he(e,t,n,r,o){return H.isFunction(r)?r.call(this,t,n):(o&&(t=n),H.isString(t)?H.isString(r)?-1!==t.indexOf(r):H.isRegExp(r)?r.test(t):void 0:void 0)}class me{constructor(e){e&&this.set(e)}set(e,t,n){const r=this;function o(e,t,n){const o=de(t);if(!o)throw new Error("header name must be a non-empty string");const s=H.findKey(r,o);(!s||void 0===r[s]||!0===n||void 0===n&&!1!==r[s])&&(r[s||t]=pe(e))}const s=(e,t)=>H.forEach(e,((e,n)=>o(e,n,t)));return H.isPlainObject(e)||e instanceof this.constructor?s(e,t):H.isString(e)&&(e=e.trim())&&!/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())?s((e=>{const t={};let n,r,o;return e&&e.split("\n").forEach((function(e){o=e.indexOf(":"),n=e.substring(0,o).trim().toLowerCase(),r=e.substring(o+1).trim(),!n||t[n]&&le[n]||("set-cookie"===n?t[n]?t[n].push(r):t[n]=[r]:t[n]=t[n]?t[n]+", "+r:r)})),t})(e),t):null!=e&&o(t,e,n),this}get(e,t){if(e=de(e)){const n=H.findKey(this,e);if(n){const e=this[n];if(!t)return e;if(!0===t)return function(e){const t=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let r;for(;r=n.exec(e);)t[r[1]]=r[2];return t}(e);if(H.isFunction(t))return t.call(this,e,n);if(H.isRegExp(t))return t.exec(e);throw new TypeError("parser must be boolean|regexp|function")}}}has(e,t){if(e=de(e)){const n=H.findKey(this,e);return!(!n||void 0===this[n]||t&&!he(0,this[n],n,t))}return!1}delete(e,t){const n=this;let r=!1;function o(e){if(e=de(e)){const o=H.findKey(n,e);!o||t&&!he(0,n[o],o,t)||(delete n[o],r=!0)}}return H.isArray(e)?e.forEach(o):o(e),r}clear(e){const t=Object.keys(this);let n=t.length,r=!1;for(;n--;){const o=t[n];e&&!he(0,this[o],o,e,!0)||(delete this[o],r=!0)}return r}normalize(e){const t=this,n={};return H.forEach(this,((r,o)=>{const s=H.findKey(n,o);if(s)return t[s]=pe(r),void delete t[o];const i=e?function(e){return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,((e,t,n)=>t.toUpperCase()+n))}(o):String(o).trim();i!==o&&delete t[o],t[i]=pe(r),n[i]=!0})),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){const t=Object.create(null);return H.forEach(this,((n,r)=>{null!=n&&!1!==n&&(t[r]=e&&H.isArray(n)?n.join(", "):n)})),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map((([e,t])=>e+": "+t)).join("\n")}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static concat(e,...t){const n=new this(e);return t.forEach((e=>n.set(e))),n}static accessor(e){const t=(this[fe]=this[fe]={accessors:{}}).accessors,n=this.prototype;function r(e){const r=de(e);t[r]||(!function(e,t){const n=H.toCamelCase(" "+t);["get","set","has"].forEach((r=>{Object.defineProperty(e,r+n,{value:function(e,n,o){return this[r].call(this,t,e,n,o)},configurable:!0})}))}(n,e),t[r]=!0)}return H.isArray(e)?e.forEach(r):r(e),this}}me.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]),H.freezeMethods(me.prototype),H.freezeMethods(me);var ge=me;function ye(e,t){const n=this||ue,r=t||n,o=ge.from(r.headers);let s=r.data;return H.forEach(e,(function(e){s=e.call(n,s,o.normalize(),t?t.status:void 0)})),o.normalize(),s}function Ee(e){return!(!e||!e.__CANCEL__)}function be(e,t,n){J.call(this,null==e?"canceled":e,J.ERR_CANCELED,t,n),this.name="CanceledError"}H.inherits(be,J,{__CANCEL__:!0});var we=se.isStandardBrowserEnv?{write:function(e,t,n,r,o,s){const i=[];i.push(e+"="+encodeURIComponent(t)),H.isNumber(n)&&i.push("expires="+new Date(n).toGMTString()),H.isString(r)&&i.push("path="+r),H.isString(o)&&i.push("domain="+o),!0===s&&i.push("secure"),document.cookie=i.join("; ")},read:function(e){const t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}};function Re(e,t){return e&&!/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)?function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}(e,t):t}var Oe=se.isStandardBrowserEnv?function(){const e=/(msie|trident)/i.test(navigator.userAgent),t=document.createElement("a");let n;function r(n){let r=n;return e&&(t.setAttribute("href",r),r=t.href),t.setAttribute("href",r),{href:t.href,protocol:t.protocol?t.protocol.replace(/:$/,""):"",host:t.host,search:t.search?t.search.replace(/^\?/,""):"",hash:t.hash?t.hash.replace(/^#/,""):"",hostname:t.hostname,port:t.port,pathname:"/"===t.pathname.charAt(0)?t.pathname:"/"+t.pathname}}return n=r(window.location.href),function(e){const t=H.isString(e)?r(e):e;return t.protocol===n.protocol&&t.host===n.host}}():function(){return!0};function Se(e,t){let n=0;const r=function(e,t){e=e||10;const n=new Array(e),r=new Array(e);let o,s=0,i=0;return t=void 0!==t?t:1e3,function(a){const c=Date.now(),u=r[i];o||(o=c),n[s]=a,r[s]=c;let l=i,f=0;for(;l!==s;)f+=n[l++],l%=e;if(s=(s+1)%e,s===i&&(i=(i+1)%e),c-o<t)return;const d=u&&c-u;return d?Math.round(1e3*f/d):void 0}}(50,250);return o=>{const s=o.loaded,i=o.lengthComputable?o.total:void 0,a=s-n,c=r(a);n=s;const u={loaded:s,total:i,progress:i?s/i:void 0,bytes:a,rate:c||void 0,estimated:c&&i&&s<=i?(i-s)/c:void 0,event:o};u[t?"download":"upload"]=!0,e(u)}}const Ae={http:null,xhr:"undefined"!=typeof XMLHttpRequest&&function(e){return new Promise((function(t,n){let r=e.data;const o=ge.from(e.headers).normalize(),s=e.responseType;let i;function a(){e.cancelToken&&e.cancelToken.unsubscribe(i),e.signal&&e.signal.removeEventListener("abort",i)}H.isFormData(r)&&(se.isStandardBrowserEnv||se.isStandardBrowserWebWorkerEnv?o.setContentType(!1):o.setContentType("multipart/form-data;",!1));let c=new XMLHttpRequest;if(e.auth){const t=e.auth.username||"",n=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";o.set("Authorization","Basic "+btoa(t+":"+n))}const u=Re(e.baseURL,e.url);function l(){if(!c)return;const r=ge.from("getAllResponseHeaders"in c&&c.getAllResponseHeaders());!function(e,t,n){const r=n.config.validateStatus;n.status&&r&&!r(n.status)?t(new J("Request failed with status code "+n.status,[J.ERR_BAD_REQUEST,J.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n)):e(n)}((function(e){t(e),a()}),(function(e){n(e),a()}),{data:s&&"text"!==s&&"json"!==s?c.response:c.responseText,status:c.status,statusText:c.statusText,headers:r,config:e,request:c}),c=null}if(c.open(e.method.toUpperCase(),ne(u,e.params,e.paramsSerializer),!0),c.timeout=e.timeout,"onloadend"in c?c.onloadend=l:c.onreadystatechange=function(){c&&4===c.readyState&&(0!==c.status||c.responseURL&&0===c.responseURL.indexOf("file:"))&&setTimeout(l)},c.onabort=function(){c&&(n(new J("Request aborted",J.ECONNABORTED,e,c)),c=null)},c.onerror=function(){n(new J("Network Error",J.ERR_NETWORK,e,c)),c=null},c.ontimeout=function(){let t=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded";const r=e.transitional||oe;e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),n(new J(t,r.clarifyTimeoutError?J.ETIMEDOUT:J.ECONNABORTED,e,c)),c=null},se.isStandardBrowserEnv){const t=(e.withCredentials||Oe(u))&&e.xsrfCookieName&&we.read(e.xsrfCookieName);t&&o.set(e.xsrfHeaderName,t)}void 0===r&&o.setContentType(null),"setRequestHeader"in c&&H.forEach(o.toJSON(),(function(e,t){c.setRequestHeader(t,e)})),H.isUndefined(e.withCredentials)||(c.withCredentials=!!e.withCredentials),s&&"json"!==s&&(c.responseType=e.responseType),"function"==typeof e.onDownloadProgress&&c.addEventListener("progress",Se(e.onDownloadProgress,!0)),"function"==typeof e.onUploadProgress&&c.upload&&c.upload.addEventListener("progress",Se(e.onUploadProgress)),(e.cancelToken||e.signal)&&(i=t=>{c&&(n(!t||t.type?new be(null,e,c):t),c.abort(),c=null)},e.cancelToken&&e.cancelToken.subscribe(i),e.signal&&(e.signal.aborted?i():e.signal.addEventListener("abort",i)));const f=function(e){const t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return t&&t[1]||""}(u);f&&-1===se.protocols.indexOf(f)?n(new J("Unsupported protocol "+f+":",J.ERR_BAD_REQUEST,e)):c.send(r||null)}))}};H.forEach(Ae,((e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch(e){}Object.defineProperty(e,"adapterName",{value:t})}}));var Te=e=>{e=H.isArray(e)?e:[e];const{length:t}=e;let n,r;for(let o=0;o<t&&(n=e[o],!(r=H.isString(n)?Ae[n.toLowerCase()]:n));o++);if(!r){if(!1===r)throw new J(`Adapter ${n} is not supported by the environment`,"ERR_NOT_SUPPORT");throw new Error(H.hasOwnProp(Ae,n)?`Adapter '${n}' is not available in the build`:`Unknown adapter '${n}'`)}if(!H.isFunction(r))throw new TypeError("adapter is not a function");return r};function ve(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new be(null,e)}function Ne(e){ve(e),e.headers=ge.from(e.headers),e.data=ye.call(e,e.transformRequest),-1!==["post","put","patch"].indexOf(e.method)&&e.headers.setContentType("application/x-www-form-urlencoded",!1);return Te(e.adapter||ue.adapter)(e).then((function(t){return ve(e),t.data=ye.call(e,e.transformResponse,t),t.headers=ge.from(t.headers),t}),(function(t){return Ee(t)||(ve(e),t&&t.response&&(t.response.data=ye.call(e,e.transformResponse,t.response),t.response.headers=ge.from(t.response.headers))),Promise.reject(t)}))}const Ce=e=>e instanceof ge?e.toJSON():e;function je(e,t){t=t||{};const n={};function r(e,t,n){return H.isPlainObject(e)&&H.isPlainObject(t)?H.merge.call({caseless:n},e,t):H.isPlainObject(t)?H.merge({},t):H.isArray(t)?t.slice():t}function o(e,t,n){return H.isUndefined(t)?H.isUndefined(e)?void 0:r(void 0,e,n):r(e,t,n)}function s(e,t){if(!H.isUndefined(t))return r(void 0,t)}function i(e,t){return H.isUndefined(t)?H.isUndefined(e)?void 0:r(void 0,e):r(void 0,t)}function a(n,o,s){return s in t?r(n,o):s in e?r(void 0,n):void 0}const c={url:s,method:s,data:s,baseURL:i,transformRequest:i,transformResponse:i,paramsSerializer:i,timeout:i,timeoutMessage:i,withCredentials:i,adapter:i,responseType:i,xsrfCookieName:i,xsrfHeaderName:i,onUploadProgress:i,onDownloadProgress:i,decompress:i,maxContentLength:i,maxBodyLength:i,beforeRedirect:i,transport:i,httpAgent:i,httpsAgent:i,cancelToken:i,socketPath:i,responseEncoding:i,validateStatus:a,headers:(e,t)=>o(Ce(e),Ce(t),!0)};return H.forEach(Object.keys(Object.assign({},e,t)),(function(r){const s=c[r]||o,i=s(e[r],t[r],r);H.isUndefined(i)&&s!==a||(n[r]=i)})),n}const Pe="1.4.0",Ue={};["object","boolean","number","function","string","symbol"].forEach(((e,t)=>{Ue[e]=function(n){return typeof n===e||"a"+(t<1?"n ":" ")+e}}));const _e={};Ue.transitional=function(e,t,n){function r(e,t){return"[Axios v1.4.0] Transitional option '"+e+"'"+t+(n?". "+n:"")}return(n,o,s)=>{if(!1===e)throw new J(r(o," has been removed"+(t?" in "+t:"")),J.ERR_DEPRECATED);return t&&!_e[o]&&(_e[o]=!0,console.warn(r(o," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(n,o,s)}};var xe={assertOptions:function(e,t,n){if("object"!=typeof e)throw new J("options must be an object",J.ERR_BAD_OPTION_VALUE);const r=Object.keys(e);let o=r.length;for(;o-- >0;){const s=r[o],i=t[s];if(i){const t=e[s],n=void 0===t||i(t,s,e);if(!0!==n)throw new J("option "+s+" must be "+n,J.ERR_BAD_OPTION_VALUE)}else if(!0!==n)throw new J("Unknown option "+s,J.ERR_BAD_OPTION)}},validators:Ue};const De=xe.validators;class Le{constructor(e){this.defaults=e,this.interceptors={request:new re,response:new re}}request(e,t){"string"==typeof e?(t=t||{}).url=e:t=e||{},t=je(this.defaults,t);const{transitional:n,paramsSerializer:r,headers:o}=t;let s;void 0!==n&&xe.assertOptions(n,{silentJSONParsing:De.transitional(De.boolean),forcedJSONParsing:De.transitional(De.boolean),clarifyTimeoutError:De.transitional(De.boolean)},!1),null!=r&&(H.isFunction(r)?t.paramsSerializer={serialize:r}:xe.assertOptions(r,{encode:De.function,serialize:De.function},!0)),t.method=(t.method||this.defaults.method||"get").toLowerCase(),s=o&&H.merge(o.common,o[t.method]),s&&H.forEach(["delete","get","head","post","put","patch","common"],(e=>{delete o[e]})),t.headers=ge.concat(s,o);const i=[];let a=!0;this.interceptors.request.forEach((function(e){"function"==typeof e.runWhen&&!1===e.runWhen(t)||(a=a&&e.synchronous,i.unshift(e.fulfilled,e.rejected))}));const c=[];let u;this.interceptors.response.forEach((function(e){c.push(e.fulfilled,e.rejected)}));let l,f=0;if(!a){const e=[Ne.bind(this),void 0];for(e.unshift.apply(e,i),e.push.apply(e,c),l=e.length,u=Promise.resolve(t);f<l;)u=u.then(e[f++],e[f++]);return u}l=i.length;let d=t;for(f=0;f<l;){const e=i[f++],t=i[f++];try{d=e(d)}catch(e){t.call(this,e);break}}try{u=Ne.call(this,d)}catch(e){return Promise.reject(e)}for(f=0,l=c.length;f<l;)u=u.then(c[f++],c[f++]);return u}getUri(e){return ne(Re((e=je(this.defaults,e)).baseURL,e.url),e.params,e.paramsSerializer)}}H.forEach(["delete","get","head","options"],(function(e){Le.prototype[e]=function(t,n){return this.request(je(n||{},{method:e,url:t,data:(n||{}).data}))}})),H.forEach(["post","put","patch"],(function(e){function t(t){return function(n,r,o){return this.request(je(o||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:n,data:r}))}}Le.prototype[e]=t(),Le.prototype[e+"Form"]=t(!0)}));var Fe=Le;class Be{constructor(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");let t;this.promise=new Promise((function(e){t=e}));const n=this;this.promise.then((e=>{if(!n._listeners)return;let t=n._listeners.length;for(;t-- >0;)n._listeners[t](e);n._listeners=null})),this.promise.then=e=>{let t;const r=new Promise((e=>{n.subscribe(e),t=e})).then(e);return r.cancel=function(){n.unsubscribe(t)},r},e((function(e,r,o){n.reason||(n.reason=new be(e,r,o),t(n.reason))}))}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;const t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}static source(){let e;return{token:new Be((function(t){e=t})),cancel:e}}}var Ie=Be;const ke={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(ke).forEach((([e,t])=>{ke[t]=e}));var Me=ke;const ze=function e(t){const n=new Fe(t),r=u(Fe.prototype.request,n);return H.extend(r,Fe.prototype,n,{allOwnKeys:!0}),H.extend(r,n,null,{allOwnKeys:!0}),r.create=function(n){return e(je(t,n))},r}(ue);ze.Axios=Fe,ze.CanceledError=be,ze.CancelToken=Ie,ze.isCancel=Ee,ze.VERSION=Pe,ze.toFormData=X,ze.AxiosError=J,ze.Cancel=ze.CanceledError,ze.all=function(e){return Promise.all(e)},ze.spread=function(e){return function(t){return e.apply(null,t)}},ze.isAxiosError=function(e){return H.isObject(e)&&!0===e.isAxiosError},ze.mergeConfig=je,ze.AxiosHeaders=ge,ze.formToJSON=e=>ie(H.isHTMLForm(e)?new FormData(e):e),ze.HttpStatusCode=Me,ze.default=ze;var qe=ze;const He=15e3,Je={"Content-Type":"application/json",Accept:"application/json"};class We{_client;constructor(e,t=He,n=Je,r,o){const s=qe.create({baseURL:e,timeout:t,headers:{...n},withCredentials:r,...o});s.interceptors.response.use(this._handleSuccess,this._handleError),this._client=s}async get(e,t){return(await this._client.get(e,t)).data}async getFull(e,t){return await this._client.get(e,t)}async post(e,t,n){return(await this._client.post(e,t,n)).data}async put(e,t,n){return(await this._client.put(e,t,n)).data}async patch(e,t,n){return(await this._client.patch(e,t,n)).data}async delete(e,t){return(await this._client.delete(e,t)).data}getClient(){return this._client}_handleSuccess(e){return e}_handleError(e){return"ECONNABORTED"===e.code?Promise.reject("timeout"):Promise.reject({...e.response.data,httpStatus:e.response.status})}}const Ve=u=>{const{accepts:l,compress:f,dimensions:d,editImage:p,maxSizeInKb:h,onChange:m,outputType:g,upload:y,value:E}=u,{images:b,setImages:w,setErrorCount:R}=e(o),O=s(b),[S,A]=t(0),T=s(E),v=n();r((()=>{v.current=Array(5).fill(0).map((()=>Math.random().toString(36).slice(2))).join("")}),[]),r((()=>{b.forEach(((e,t)=>{const n=O?.[t];if(e.status!==n?.status||e.dataURL!==n.dataURL)switch(e.status){case i.INJECTED:a.dataUrlToBlob(e.dataURL).then((n=>{w((r=>{const o=[...r];return o[t]={...e,file:new File([n],e.name),status:i.NONE},o}))})).catch((()=>{w((e=>e.filter(((e,n)=>n!==t))))}));break;case i.NONE:a.getMimeType(e.file).then((n=>{n&&l.map(a.fileExtensionToMimeType).includes(n)?(w((r=>{const o=[...r];return o[t]={...e,name:a.deduplicateFileName(b.map((({name:e})=>e)),t,e.name),type:n,status:"schema"!==e.addedFrom?e.status:i.UPLOADED},o})),"schema"!==e.addedFrom&&(f?j(t,e):C(t,e))):w((n=>{const r=[...n];return r[t]={...e,status:i.ERROR_FORMAT},r}))}));break;case i.TO_RECOMPRESS:P(t,e);break;case i.COMPRESSED:case i.CONVERTED:case i.RECOMPRESSED:p||w((e=>{const n=[...e];return n[t]={...n[t],status:i.UPLOAD_READY},n}));break;case i.UPLOAD_READY:U(t,e)}}))}),[b.map((({status:e})=>e)).join(","),b.map((({dataURL:e})=>e)).join(",")]),r((()=>{let e=0;b.forEach((t=>{(t.type&&!l.map(a.fileExtensionToMimeType).includes(t.type)||[i.ERROR_GENERIC,i.ERROR_SIZE].includes(t.status))&&e++})),R((t=>Math.max(0,t+e-S))),A(e),m({target:{value:b.filter((({status:e})=>e===i.UPLOADED)).map((({dataURL:e,drawingDataURL:t,name:n,uploadResponse:r})=>({fileName:n,dataURL:t||e,uploadResponse:r})))}})}),[b.map((e=>e.status)).join(",")]),r((()=>{void 0!==T&&void 0===E&&b.length&&w([])}),[void 0===T,void 0===E,b.length]);const N=(e,t)=>{let n=d.width/e;return t*n>d.height&&(n=d.height/t),n},C=async(e,t)=>{try{const n=await c.convertBlob(t.file,a.fileExtensionToMimeType(g)),r=a.getFilesizeFromBase64(n);w(h&&r>1024*h?t=>{const n=[...t];return n[e]={...t[e],status:i.ERROR_SIZE},n}:t=>{const r=[...t];return r[e]={...t[e],dataURL:n,status:i.CONVERTED},r})}catch(t){w((t=>{const n=[...t];return n[e]={...t[e],status:i.ERROR_GENERIC},n}))}},j=async(e,t)=>{try{const n=await a.fileToDataUrl(t.file),r=await c.dataUrlToImage(n),o={w:r.naturalWidth,h:r.naturalHeight},s=N(o.w,o.h);let u=await c.resampleImage(r,{scale:s});if(h&&(u=await c.compressImage(u,{fileSize:h})),h&&u.size>1024*h)w((t=>{const n=[...t];return n[e]={...t[e],status:i.ERROR_SIZE},n}));else{const t=await a.fileToDataUrl(u);w((n=>{const r=[...n];return r[e]={...n[e],dataURL:t,status:i.COMPRESSED},r}))}}catch(t){w((t=>{const n=[...t];return n[e]={...t[e],status:i.ERROR_GENERIC},n}))}},P=async(e,t)=>{if(t.drawingDataURL)try{const n=await c.dataUrlToImage(t.drawingDataURL),r={w:n.naturalWidth,h:n.naturalHeight},o=N(r.w,r.h);let s=await c.resampleImage(n,{scale:o});if(s=await c.compressImage(s,{fileSize:h}),s.size>1024*h){const t=[...b];t[e]={...b[e],status:i.ERROR_SIZE},w(t)}else{const t=await a.fileToDataUrl(s),n=[...b];n[e]={...b[e],drawingDataURL:t,status:i.RECOMPRESSED},w(n)}}catch(t){w((t=>{const n=[...t];return n[e]={...t[e],status:i.ERROR_GENERIC},n}))}},U=async(e,t)=>{try{let n;if(w((t=>{const n=[...t];return n[e]={...t[e],status:i.UPLOADING},n})),y?.method&&y?.url){const r=new FormData;r.append("dataURL",t.drawingDataURL||t.dataURL||""),r.append("sessionId",v.current||""),r.append("slot",`${t.slot}`),n=await new We("",void 0,void 0,!0)[y.method](y.url,r,{onUploadProgress:t=>{const{loaded:n,total:r}=t,o=Math.floor(100*n/r);w((t=>{const n=[...t];return n[e]={...t[e],uploadProgress:o},n}))}})}w((t=>{const r=[...t];return r[e]={...t[e],uploadResponse:n,status:i.UPLOADED},r}))}catch(t){w((t=>{const n=[...t];return n[e]={...t[e],status:i.ERROR_GENERIC},n}))}};return null};export{Ve as default};
//# sourceMappingURL=index.391c739c.js.map