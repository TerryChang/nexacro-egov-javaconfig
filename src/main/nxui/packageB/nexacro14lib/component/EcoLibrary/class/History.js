/**
 * @fileoverview History
 */

if ( !JsNamespace.exist("Eco.History") )
{
	if ( nexacro.Browser == "Runtime" )
	{
		// TO-DO
	}
	else
	{
		/**
		 * @namespace
		 * @name Eco.History
		 * @memberof! <global>
		 */
		JsNamespace.declare("Eco.History", {
		
		    hashcnt : 0,
			
			init: function(historyChangeListener, historyChangeListenerScope)
			{
				var me = Eco.History;
				var initialHash = me.getLocationHash();
				me.currentHash = initialHash;
				
				me.historyChangeListener = historyChangeListener;
				me.historyChangeListenerScope = historyChangeListenerScope;
				var global_context =JsNamespace.getGlobalContext();
				global_context = window.top;
								
				//alert(" global_context : " + global_context);
				//브라우저 backpace키 차단
				 document.onkeydown = function(e){
					  key = (e) ? e.keyCode : event.keyCode;
					  if(key==8){
					   if(e){
					    e.preventDefault();
					   }
					   else{
					  //  event.keyCode = 0;
					    //event.returnValue = false;
					   }
					  }
					 }
				/*global_context.addEventListener("keydown", function(e){
					
					keyCode: 8
					keyIdentifier: "U+0008"
					
					alert(" global_context.addEventListene : " + e.keyCode );
					    if(e.keyCode === 8 && document.activeElement !== 'text') {
					        e.preventDefault();
					        alert('Prevent page from going back');
					    }
					});*/
				
				
				if ( "onhashchange" in global_context )
				{
				
					if ( global_context.addEventListener ) 
					{  
						global_context.addEventListener('hashchange', me.checkLocationHash, false);				
					}
					else
					{
						global_context.attachEvent('onhashchange', me.checkLocationHash);
					}
				}
				else
				{
					global_context.setInterval(function() {
						me.checkLocationHash();
					}, 50);
				}
			},
			
			getLocationHash: function() 
			{
			    var global_context = JsNamespace.getGlobalContext();
			    	global_context = window.top;
				return global_context.location.hash.slice(1);
			},
			
			checkLocationHash: function()
			{				
				var me = Eco.History;
				var hash = me.getLocationHash();
				
				if ( hash == me.currentHash )
				{
					return;
				}
				
				me.currentHash = hash;
				
				var data = me.getData(hash);
								
				me.historyChangeListener.call(me.historyChangeListenerScope, hash, data);
			},
			
			setLocationHash: function(hash, data)
			{
				var me = Eco.History;

				sessionStorage.setItem(hash, Eco.Json.encode(data));
				
				me.currentHash = hash;

			    var global_context = JsNamespace.getGlobalContext();			    
			        	global_context = window.top;
			    
	
			    if (Eco.isEmpty(hash))
			    {
			    	
			    	// # 을 제거하려면 아래를 true 로 변경한다.
			    	var removeFragment = true;
			    	//console.log("removeFragment: " +removeFragment);
			    	if ( removeFragment )
			    	{
	
				    	if ( 'pushState' in global_context.history )
				    	{
				    	//trace("pushState ");
	
				    		global_context.history.pushState("", document.title, global_context.location.pathname
	                                + global_context.location.search);
				    	}
				    	else
				    	{
				    	
				    		
				    	//	console.log("global_context.location.href >>>>>>");
				    		global_context.location.href = "index.html";
				    	}			    		
			    	}
			    	else
			    	{
			    	  // console.log('333333333333');
			    		//alert("3");
			    	}
			    }
			    else
			    {
			  
			    	global_context.location.hash= hash;
			  
			    }
			  
			},
			
			back: function(nNo) 
			{
			//  trace(" back : ");
				var global_context = JsNamespace.getGlobalContext();
				//global_context = window.top;
				if(Eco.isEmpty(nNo))
				{
					nNo = -1;
				}	
				global_context.history.go(nNo);
			},

			forward: function()
			{
			//	trace(" forword : ");
				var global_context = JsNamespace.getGlobalContext();
				//global_context = window.top;
				global_context.history.go(1);
			},
			
			getData: function(hash)
			{
				var data = sessionStorage.getItem(hash);
				if ( !Eco.isEmpty(data) )
				{
					data = Eco.Json.decode(data);
				}
				return data;
			}
			
		});

		/** HTML5 sessionStorage
		 * @build       2009-08-20 23:35:12
		 * @author      Andrea Giammarchi
		 * @license     Mit Style License
		 * @project     http://code.google.com/p/sessionstorage/
		 */		
		if (typeof sessionStorage === "undefined") {
			(function (j) {
				var k = j;
				try {
					while (k !== k.top) {
						k = k.top
					}
				} catch (i) {}
				var f = (function (e, n) {
					return {
						decode: function (o, p) {
							return this.encode(o, p)
						},
						encode: function (y, u) {
							for (var p = y.length, w = u.length, o = [], x = [], v = 0, s = 0, r = 0, q = 0, t; v < 256; ++v) {
								x[v] = v
							}
							for (v = 0; v < 256; ++v) {
								s = (s + (t = x[v]) + y.charCodeAt(v % p)) % 256;
								x[v] = x[s];
								x[s] = t
							}
							for (s = 0; r < w; ++r) {
								v = r % 256;
								s = (s + (t = x[v])) % 256;
								p = x[v] = x[s];
								x[s] = t;
								o[q++] = e(u.charCodeAt(r) ^ x[(p + t) % 256])
							}
							return o.join("")
						},
						key: function (q) {
							for (var p = 0, o = []; p < q; ++p) {
								o[p] = e(1 + ((n() * 255) << 0))
							}
							return o.join("")
						}
					}
				})(j.String.fromCharCode, j.Math.random);
				var a = (function (n) {
					function o(r, q, p) {
						this._i = (this._data = p || "").length;
						if (this._key = q) {
							this._storage = r
						} else {
							this._storage = {
								_key: r || ""
							};
							this._key = "_key"
						}
					}
					o.prototype.c = String.fromCharCode(1);
					o.prototype._c = ".";
					o.prototype.clear = function () {
						this._storage[this._key] = this._data
					};
					o.prototype.del = function (p) {
						var q = this.get(p);
						if (q !== null) {
							this._storage[this._key] = this._storage[this._key].replace(e.call(this, p, q), "")
						}
					};
					o.prototype.escape = n.escape;
					o.prototype.get = function (q) {
						var s = this._storage[this._key],
							t = this.c,
							p = s.indexOf(q = t.concat(this._c, this.escape(q), t, t), this._i),
							r = null;
						if (-1 < p) {
							p = s.indexOf(t, p + q.length - 1) + 1;
							r = s.substring(p, p = s.indexOf(t, p));
							r = this.unescape(s.substr(++p, r))
						}
						return r
					};
					o.prototype.key = function () {
						var u = this._storage[this._key],
							v = this.c,
							q = v + this._c,
							r = this._i,
							t = [],
							s = 0,
							p = 0;
						while (-1 < (r = u.indexOf(q, r))) {
							t[p++] = this.unescape(u.substring(r += 2, s = u.indexOf(v, r)));
							r = u.indexOf(v, s) + 2;
							s = u.indexOf(v, r);
							r = 1 + s + 1 * u.substring(r, s)
						}
						return t
					};
					o.prototype.set = function (p, q) {
						this.del(p);
						this._storage[this._key] += e.call(this, p, q)
					};
					o.prototype.unescape = n.unescape;

					function e(p, q) {
						var r = this.c;
						return r.concat(this._c, this.escape(p), r, r, (q = this.escape(q)).length, r, q)
					}
					return o
				})(j);
				if (Object.prototype.toString.call(j.opera) === "[object Opera]") {
					history.navigationMode = "compatible";
					a.prototype.escape = j.encodeURIComponent;
					a.prototype.unescape = j.decodeURIComponent
				}

				function l() {
					function r() {
						s.cookie = ["sessionStorage=" + j.encodeURIComponent(h = f.key(128))].join(";");
						g = f.encode(h, g);
						a = new a(k, "name", k.name)
					}
					var e = k.name,
						s = k.document,
						n = /\bsessionStorage\b=([^;]+)(;|$)/,
						p = n.exec(s.cookie),
						q;
					if (p) {
						h = j.decodeURIComponent(p[1]);
						g = f.encode(h, g);
						a = new a(k, "name");
						for (var t = a.key(), q = 0, o = t.length, u = {}; q < o; ++q) {
							if ((p = t[q]).indexOf(g) === 0) {
								b.push(p);
								u[p] = a.get(p);
								a.del(p)
							}
						}
						a = new a.constructor(k, "name", k.name);
						if (0 < (this.length = b.length)) {
							for (q = 0, o = b.length, c = a.c, p = []; q < o; ++q) {
								p[q] = c.concat(a._c, a.escape(t = b[q]), c, c, (t = a.escape(u[t])).length, c, t)
							}
							k.name += p.join("")
						}
					} else {
						r();
						if (!n.exec(s.cookie)) {
							b = null
						}
					}
				}
				l.prototype = {
					length: 0,
					key: function (e) {
						if (typeof e !== "number" || e < 0 || b.length <= e) {
							throw "Invalid argument"
						}
						return b[e]
					},
					getItem: function (e) {
						e = g + e;
						if (d.call(m, e)) {
							return m[e]
						}
						var n = a.get(e);
						if (n !== null) {
							n = m[e] = f.decode(h, n)
						}
						return n
					},
					setItem: function (e, n) {
						this.removeItem(e);
						e = g + e;
						a.set(e, f.encode(h, m[e] = "" + n));
						this.length = b.push(e)
					},
					removeItem: function (e) {
						var n = a.get(e = g + e);
						if (n !== null) {
							delete m[e];
							a.del(e);
							this.length = b.remove(e)
						}
					},
					clear: function () {
						a.clear();
						m = {};
						b.length = 0
					}
				};
				var g = k.document.domain,
					b = [],
					m = {}, d = m.hasOwnProperty,
					h;
				b.remove = function (n) {
					var e = this.indexOf(n);
					if (-1 < e) {
						this.splice(e, 1)
					}
					return this.length
				};
				if (!b.indexOf) {
					b.indexOf = function (o) {
						for (var e = 0, n = this.length; e < n; ++e) {
							if (this[e] === o) {
								return e
							}
						}
						return -1
					}
				}
				if (k.sessionStorage) {
					l = function () {};
					l.prototype = k.sessionStorage
				}
				l = new l;
				if (b !== null) {
					j.sessionStorage = l
				}
				})(JsNamespace.getGlobalContext())
			//})(window.parent)
			//})(JsNamespace.getGlobalContext())
		};

	} // end if else - nexacro.Browser == "Runtime"
}
