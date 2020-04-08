var QRCode;
! function () {
	function t(t) {
		this.mode = r.MODE_8BIT_BYTE, this.data = t, this.parsedData = [];
		for (var e = 0, o = this.data.length; e < o; e++) {
			var i = [],
				n = this.data.charCodeAt(e);
			n > 65536 ? (i[0] = 240 | (1835008 & n) >>> 18, i[1] = 128 | (258048 & n) >>> 12, i[2] = 128 | (4032 & n) >>> 6, i[3] = 128 | 63 & n) : n > 2048 ? (i[0] = 224 | (61440 & n) >>> 12, i[1] = 128 | (4032 & n) >>> 6, i[2] = 128 | 63 & n) : n > 128 ? (i[0] = 192 | (1984 & n) >>> 6, i[1] = 128 | 63 & n) : i[0] = n, this.parsedData.push(i)
		}
		this.parsedData = Array.prototype.concat.apply([], this.parsedData), this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239))
	}

	function e(t, e) {
		this.typeNumber = t, this.errorCorrectLevel = e, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = []
	}
	t.prototype = {
		getLength: function (t) {
			return this.parsedData.length
		},
		write: function (t) {
			for (var e = 0, r = this.parsedData.length; e < r; e++) t.put(this.parsedData[e], 8)
		}
	}, e.prototype = {
		addData: function (e) {
			var r = new t(e);
			this.dataList.push(r), this.dataCache = null
		},
		isDark: function (t, e) {
			if (t < 0 || this.moduleCount <= t || e < 0 || this.moduleCount <= e) throw new Error(t + "," + e);
			return this.modules[t][e]
		},
		getModuleCount: function () {
			return this.moduleCount
		},
		make: function () {
			this.makeImpl(!1, this.getBestMaskPattern())
		},
		makeImpl: function (t, r) {
			this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
			for (var o = 0; o < this.moduleCount; o++) {
				this.modules[o] = new Array(this.moduleCount);
				for (var i = 0; i < this.moduleCount; i++) this.modules[o][i] = null
			}
			this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(t, r), this.typeNumber >= 7 && this.setupTypeNumber(t), null == this.dataCache && (this.dataCache = e.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, r)
		},
		setupPositionProbePattern: function (t, e) {
			for (var r = -1; r <= 7; r++)
				if (!(t + r <= -1 || this.moduleCount <= t + r))
					for (var o = -1; o <= 7; o++) e + o <= -1 || this.moduleCount <= e + o || (this.modules[t + r][e + o] = 0 <= r && r <= 6 && (0 == o || 6 == o) || 0 <= o && o <= 6 && (0 == r || 6 == r) || 2 <= r && r <= 4 && 2 <= o && o <= 4)
		},
		getBestMaskPattern: function () {
			for (var t = 0, e = 0, r = 0; r < 8; r++) {
				this.makeImpl(!0, r);
				var o = f.getLostPoint(this);
				(0 == r || t > o) && (t = o, e = r)
			}
			return e
		},
		createMovieClip: function (t, e, r) {
			var o = t.createEmptyMovieClip(e, r);
			this.make();
			for (var i = 0; i < this.modules.length; i++)
				for (var n = 1 * i, a = 0; a < this.modules[i].length; a++) {
					var s = 1 * a;
					this.modules[i][a] && (o.beginFill(0, 100), o.moveTo(s, n), o.lineTo(s + 1, n), o.lineTo(s + 1, n + 1), o.lineTo(s, n + 1), o.endFill())
				}
			return o
		},
		setupTimingPattern: function () {
			for (var t = 8; t < this.moduleCount - 8; t++) null == this.modules[t][6] && (this.modules[t][6] = t % 2 == 0);
			for (var e = 8; e < this.moduleCount - 8; e++) null == this.modules[6][e] && (this.modules[6][e] = e % 2 == 0)
		},
		setupPositionAdjustPattern: function () {
			for (var t = f.getPatternPosition(this.typeNumber), e = 0; e < t.length; e++)
				for (var r = 0; r < t.length; r++) {
					var o = t[e],
						i = t[r];
					if (null == this.modules[o][i])
						for (var n = -2; n <= 2; n++)
							for (var a = -2; a <= 2; a++) this.modules[o + n][i + a] = -2 == n || 2 == n || -2 == a || 2 == a || 0 == n && 0 == a
				}
		},
		setupTypeNumber: function (t) {
			for (var e = f.getBCHTypeNumber(this.typeNumber), r = 0; r < 18; r++) {
				var o = !t && 1 == (e >> r & 1);
				this.modules[Math.floor(r / 3)][r % 3 + this.moduleCount - 8 - 3] = o
			}
			for (r = 0; r < 18; r++) {
				o = !t && 1 == (e >> r & 1);
				this.modules[r % 3 + this.moduleCount - 8 - 3][Math.floor(r / 3)] = o
			}
		},
		setupTypeInfo: function (t, e) {
			for (var r = this.errorCorrectLevel << 3 | e, o = f.getBCHTypeInfo(r), i = 0; i < 15; i++) {
				var n = !t && 1 == (o >> i & 1);
				i < 6 ? this.modules[i][8] = n : i < 8 ? this.modules[i + 1][8] = n : this.modules[this.moduleCount - 15 + i][8] = n
			}
			for (i = 0; i < 15; i++) {
				n = !t && 1 == (o >> i & 1);
				i < 8 ? this.modules[8][this.moduleCount - i - 1] = n : i < 9 ? this.modules[8][15 - i - 1 + 1] = n : this.modules[8][15 - i - 1] = n
			}
			this.modules[this.moduleCount - 8][8] = !t
		},
		mapData: function (t, e) {
			for (var r = -1, o = this.moduleCount - 1, i = 7, n = 0, a = this.moduleCount - 1; a > 0; a -= 2)
				for (6 == a && a--;;) {
					for (var s = 0; s < 2; s++)
						if (null == this.modules[o][a - s]) {
							var h = !1;
							n < t.length && (h = 1 == (t[n] >>> i & 1)), f.getMask(e, o, a - s) && (h = !h), this.modules[o][a - s] = h, -1 == --i && (n++, i = 7)
						} if ((o += r) < 0 || this.moduleCount <= o) {
						o -= r, r = -r;
						break
					}
				}
		}
	}, e.PAD0 = 236, e.PAD1 = 17, e.createData = function (t, r, o) {
		for (var i = m.getRSBlocks(t, r), n = new _, a = 0; a < o.length; a++) {
			var s = o[a];
			n.put(s.mode, 4), n.put(s.getLength(), f.getLengthInBits(s.mode, t)), s.write(n)
		}
		var h = 0;
		for (a = 0; a < i.length; a++) h += i[a].dataCount;
		if (n.getLengthInBits() > 8 * h) throw new Error("code length overflow. (" + n.getLengthInBits() + ">" + 8 * h + ")");
		for (n.getLengthInBits() + 4 <= 8 * h && n.put(0, 4); n.getLengthInBits() % 8 != 0;) n.putBit(!1);
		for (; !(n.getLengthInBits() >= 8 * h || (n.put(e.PAD0, 8), n.getLengthInBits() >= 8 * h));) n.put(e.PAD1, 8);
		return e.createBytes(n, i)
	}, e.createBytes = function (t, e) {
		for (var r = 0, o = 0, i = 0, n = new Array(e.length), a = new Array(e.length), s = 0; s < e.length; s++) {
			var h = e[s].dataCount,
				l = e[s].totalCount - h;
			o = Math.max(o, h), i = Math.max(i, l), n[s] = new Array(h);
			for (var u = 0; u < n[s].length; u++) n[s][u] = 255 & t.buffer[u + r];
			r += h;
			var g = f.getErrorCorrectPolynomial(l),
				d = new p(n[s], g.getLength() - 1).mod(g);
			a[s] = new Array(g.getLength() - 1);
			for (u = 0; u < a[s].length; u++) {
				var c = u + d.getLength() - a[s].length;
				a[s][u] = c >= 0 ? d.get(c) : 0
			}
		}
		var m = 0;
		for (u = 0; u < e.length; u++) m += e[u].totalCount;
		var _ = new Array(m),
			v = 0;
		for (u = 0; u < o; u++)
			for (s = 0; s < e.length; s++) u < n[s].length && (_[v++] = n[s][u]);
		for (u = 0; u < i; u++)
			for (s = 0; s < e.length; s++) u < a[s].length && (_[v++] = a[s][u]);
		return _
	};
	for (var r = {
			MODE_NUMBER: 1,
			MODE_ALPHA_NUM: 2,
			MODE_8BIT_BYTE: 4,
			MODE_KANJI: 8
		}, o = {
			L: 1,
			M: 0,
			Q: 3,
			H: 2
		}, i = 0, n = 1, a = 2, s = 3, h = 4, l = 5, u = 6, g = 7, f = {
			PATTERN_POSITION_TABLE: [
				[],
				[6, 18],
				[6, 22],
				[6, 26],
				[6, 30],
				[6, 34],
				[6, 22, 38],
				[6, 24, 42],
				[6, 26, 46],
				[6, 28, 50],
				[6, 30, 54],
				[6, 32, 58],
				[6, 34, 62],
				[6, 26, 46, 66],
				[6, 26, 48, 70],
				[6, 26, 50, 74],
				[6, 30, 54, 78],
				[6, 30, 56, 82],
				[6, 30, 58, 86],
				[6, 34, 62, 90],
				[6, 28, 50, 72, 94],
				[6, 26, 50, 74, 98],
				[6, 30, 54, 78, 102],
				[6, 28, 54, 80, 106],
				[6, 32, 58, 84, 110],
				[6, 30, 58, 86, 114],
				[6, 34, 62, 90, 118],
				[6, 26, 50, 74, 98, 122],
				[6, 30, 54, 78, 102, 126],
				[6, 26, 52, 78, 104, 130],
				[6, 30, 56, 82, 108, 134],
				[6, 34, 60, 86, 112, 138],
				[6, 30, 58, 86, 114, 142],
				[6, 34, 62, 90, 118, 146],
				[6, 30, 54, 78, 102, 126, 150],
				[6, 24, 50, 76, 102, 128, 154],
				[6, 28, 54, 80, 106, 132, 158],
				[6, 32, 58, 84, 110, 136, 162],
				[6, 26, 54, 82, 110, 138, 166],
				[6, 30, 58, 86, 114, 142, 170]
			],
			G15: 1335,
			G18: 7973,
			G15_MASK: 21522,
			getBCHTypeInfo: function (t) {
				for (var e = t << 10; f.getBCHDigit(e) - f.getBCHDigit(f.G15) >= 0;) e ^= f.G15 << f.getBCHDigit(e) - f.getBCHDigit(f.G15);
				return (t << 10 | e) ^ f.G15_MASK
			},
			getBCHTypeNumber: function (t) {
				for (var e = t << 12; f.getBCHDigit(e) - f.getBCHDigit(f.G18) >= 0;) e ^= f.G18 << f.getBCHDigit(e) - f.getBCHDigit(f.G18);
				return t << 12 | e
			},
			getBCHDigit: function (t) {
				for (var e = 0; 0 != t;) e++, t >>>= 1;
				return e
			},
			getPatternPosition: function (t) {
				return f.PATTERN_POSITION_TABLE[t - 1]
			},
			getMask: function (t, e, r) {
				switch (t) {
					case i:
						return (e + r) % 2 == 0;
					case n:
						return e % 2 == 0;
					case a:
						return r % 3 == 0;
					case s:
						return (e + r) % 3 == 0;
					case h:
						return (Math.floor(e / 2) + Math.floor(r / 3)) % 2 == 0;
					case l:
						return e * r % 2 + e * r % 3 == 0;
					case u:
						return (e * r % 2 + e * r % 3) % 2 == 0;
					case g:
						return (e * r % 3 + (e + r) % 2) % 2 == 0;
					default:
						throw new Error("bad maskPattern:" + t)
				}
			},
			getErrorCorrectPolynomial: function (t) {
				for (var e = new p([1], 0), r = 0; r < t; r++) e = e.multiply(new p([1, d.gexp(r)], 0));
				return e
			},
			getLengthInBits: function (t, e) {
				if (1 <= e && e < 10) switch (t) {
					case r.MODE_NUMBER:
						return 10;
					case r.MODE_ALPHA_NUM:
						return 9;
					case r.MODE_8BIT_BYTE:
					case r.MODE_KANJI:
						return 8;
					default:
						throw new Error("mode:" + t)
				} else if (e < 27) switch (t) {
					case r.MODE_NUMBER:
						return 12;
					case r.MODE_ALPHA_NUM:
						return 11;
					case r.MODE_8BIT_BYTE:
						return 16;
					case r.MODE_KANJI:
						return 10;
					default:
						throw new Error("mode:" + t)
				} else {
					if (!(e < 41)) throw new Error("type:" + e);
					switch (t) {
						case r.MODE_NUMBER:
							return 14;
						case r.MODE_ALPHA_NUM:
							return 13;
						case r.MODE_8BIT_BYTE:
							return 16;
						case r.MODE_KANJI:
							return 12;
						default:
							throw new Error("mode:" + t)
					}
				}
			},
			getLostPoint: function (t) {
				for (var e = t.getModuleCount(), r = 0, o = 0; o < e; o++)
					for (var i = 0; i < e; i++) {
						for (var n = 0, a = t.isDark(o, i), s = -1; s <= 1; s++)
							if (!(o + s < 0 || e <= o + s))
								for (var h = -1; h <= 1; h++) i + h < 0 || e <= i + h || 0 == s && 0 == h || a == t.isDark(o + s, i + h) && n++;
						n > 5 && (r += 3 + n - 5)
					}
				for (o = 0; o < e - 1; o++)
					for (i = 0; i < e - 1; i++) {
						var l = 0;
						t.isDark(o, i) && l++, t.isDark(o + 1, i) && l++, t.isDark(o, i + 1) && l++, t.isDark(o + 1, i + 1) && l++, 0 != l && 4 != l || (r += 3)
					}
				for (o = 0; o < e; o++)
					for (i = 0; i < e - 6; i++) t.isDark(o, i) && !t.isDark(o, i + 1) && t.isDark(o, i + 2) && t.isDark(o, i + 3) && t.isDark(o, i + 4) && !t.isDark(o, i + 5) && t.isDark(o, i + 6) && (r += 40);
				for (i = 0; i < e; i++)
					for (o = 0; o < e - 6; o++) t.isDark(o, i) && !t.isDark(o + 1, i) && t.isDark(o + 2, i) && t.isDark(o + 3, i) && t.isDark(o + 4, i) && !t.isDark(o + 5, i) && t.isDark(o + 6, i) && (r += 40);
				var u = 0;
				for (i = 0; i < e; i++)
					for (o = 0; o < e; o++) t.isDark(o, i) && u++;
				return r += 10 * (Math.abs(100 * u / e / e - 50) / 5)
			}
		}, d = {
			glog: function (t) {
				if (t < 1) throw new Error("glog(" + t + ")");
				return d.LOG_TABLE[t]
			},
			gexp: function (t) {
				for (; t < 0;) t += 255;
				for (; t >= 256;) t -= 255;
				return d.EXP_TABLE[t]
			},
			EXP_TABLE: new Array(256),
			LOG_TABLE: new Array(256)
		}, c = 0; c < 8; c++) d.EXP_TABLE[c] = 1 << c;
	for (c = 8; c < 256; c++) d.EXP_TABLE[c] = d.EXP_TABLE[c - 4] ^ d.EXP_TABLE[c - 5] ^ d.EXP_TABLE[c - 6] ^ d.EXP_TABLE[c - 8];
	for (c = 0; c < 255; c++) d.LOG_TABLE[d.EXP_TABLE[c]] = c;

	function p(t, e) {
		if (null == t.length) throw new Error(t.length + "/" + e);
		for (var r = 0; r < t.length && 0 == t[r];) r++;
		this.num = new Array(t.length - r + e);
		for (var o = 0; o < t.length - r; o++) this.num[o] = t[o + r]
	}

	function m(t, e) {
		this.totalCount = t, this.dataCount = e
	}

	function _() {
		this.buffer = [], this.length = 0
	}
	p.prototype = {
		get: function (t) {
			return this.num[t]
		},
		getLength: function () {
			return this.num.length
		},
		multiply: function (t) {
			for (var e = new Array(this.getLength() + t.getLength() - 1), r = 0; r < this.getLength(); r++)
				for (var o = 0; o < t.getLength(); o++) e[r + o] ^= d.gexp(d.glog(this.get(r)) + d.glog(t.get(o)));
			return new p(e, 0)
		},
		mod: function (t) {
			if (this.getLength() - t.getLength() < 0) return this;
			for (var e = d.glog(this.get(0)) - d.glog(t.get(0)), r = new Array(this.getLength()), o = 0; o < this.getLength(); o++) r[o] = this.get(o);
			for (o = 0; o < t.getLength(); o++) r[o] ^= d.gexp(d.glog(t.get(o)) + e);
			return new p(r, 0).mod(t)
		}
	}, m.RS_BLOCK_TABLE = [
		[1, 26, 19],
		[1, 26, 16],
		[1, 26, 13],
		[1, 26, 9],
		[1, 44, 34],
		[1, 44, 28],
		[1, 44, 22],
		[1, 44, 16],
		[1, 70, 55],
		[1, 70, 44],
		[2, 35, 17],
		[2, 35, 13],
		[1, 100, 80],
		[2, 50, 32],
		[2, 50, 24],
		[4, 25, 9],
		[1, 134, 108],
		[2, 67, 43],
		[2, 33, 15, 2, 34, 16],
		[2, 33, 11, 2, 34, 12],
		[2, 86, 68],
		[4, 43, 27],
		[4, 43, 19],
		[4, 43, 15],
		[2, 98, 78],
		[4, 49, 31],
		[2, 32, 14, 4, 33, 15],
		[4, 39, 13, 1, 40, 14],
		[2, 121, 97],
		[2, 60, 38, 2, 61, 39],
		[4, 40, 18, 2, 41, 19],
		[4, 40, 14, 2, 41, 15],
		[2, 146, 116],
		[3, 58, 36, 2, 59, 37],
		[4, 36, 16, 4, 37, 17],
		[4, 36, 12, 4, 37, 13],
		[2, 86, 68, 2, 87, 69],
		[4, 69, 43, 1, 70, 44],
		[6, 43, 19, 2, 44, 20],
		[6, 43, 15, 2, 44, 16],
		[4, 101, 81],
		[1, 80, 50, 4, 81, 51],
		[4, 50, 22, 4, 51, 23],
		[3, 36, 12, 8, 37, 13],
		[2, 116, 92, 2, 117, 93],
		[6, 58, 36, 2, 59, 37],
		[4, 46, 20, 6, 47, 21],
		[7, 42, 14, 4, 43, 15],
		[4, 133, 107],
		[8, 59, 37, 1, 60, 38],
		[8, 44, 20, 4, 45, 21],
		[12, 33, 11, 4, 34, 12],
		[3, 145, 115, 1, 146, 116],
		[4, 64, 40, 5, 65, 41],
		[11, 36, 16, 5, 37, 17],
		[11, 36, 12, 5, 37, 13],
		[5, 109, 87, 1, 110, 88],
		[5, 65, 41, 5, 66, 42],
		[5, 54, 24, 7, 55, 25],
		[11, 36, 12],
		[5, 122, 98, 1, 123, 99],
		[7, 73, 45, 3, 74, 46],
		[15, 43, 19, 2, 44, 20],
		[3, 45, 15, 13, 46, 16],
		[1, 135, 107, 5, 136, 108],
		[10, 74, 46, 1, 75, 47],
		[1, 50, 22, 15, 51, 23],
		[2, 42, 14, 17, 43, 15],
		[5, 150, 120, 1, 151, 121],
		[9, 69, 43, 4, 70, 44],
		[17, 50, 22, 1, 51, 23],
		[2, 42, 14, 19, 43, 15],
		[3, 141, 113, 4, 142, 114],
		[3, 70, 44, 11, 71, 45],
		[17, 47, 21, 4, 48, 22],
		[9, 39, 13, 16, 40, 14],
		[3, 135, 107, 5, 136, 108],
		[3, 67, 41, 13, 68, 42],
		[15, 54, 24, 5, 55, 25],
		[15, 43, 15, 10, 44, 16],
		[4, 144, 116, 4, 145, 117],
		[17, 68, 42],
		[17, 50, 22, 6, 51, 23],
		[19, 46, 16, 6, 47, 17],
		[2, 139, 111, 7, 140, 112],
		[17, 74, 46],
		[7, 54, 24, 16, 55, 25],
		[34, 37, 13],
		[4, 151, 121, 5, 152, 122],
		[4, 75, 47, 14, 76, 48],
		[11, 54, 24, 14, 55, 25],
		[16, 45, 15, 14, 46, 16],
		[6, 147, 117, 4, 148, 118],
		[6, 73, 45, 14, 74, 46],
		[11, 54, 24, 16, 55, 25],
		[30, 46, 16, 2, 47, 17],
		[8, 132, 106, 4, 133, 107],
		[8, 75, 47, 13, 76, 48],
		[7, 54, 24, 22, 55, 25],
		[22, 45, 15, 13, 46, 16],
		[10, 142, 114, 2, 143, 115],
		[19, 74, 46, 4, 75, 47],
		[28, 50, 22, 6, 51, 23],
		[33, 46, 16, 4, 47, 17],
		[8, 152, 122, 4, 153, 123],
		[22, 73, 45, 3, 74, 46],
		[8, 53, 23, 26, 54, 24],
		[12, 45, 15, 28, 46, 16],
		[3, 147, 117, 10, 148, 118],
		[3, 73, 45, 23, 74, 46],
		[4, 54, 24, 31, 55, 25],
		[11, 45, 15, 31, 46, 16],
		[7, 146, 116, 7, 147, 117],
		[21, 73, 45, 7, 74, 46],
		[1, 53, 23, 37, 54, 24],
		[19, 45, 15, 26, 46, 16],
		[5, 145, 115, 10, 146, 116],
		[19, 75, 47, 10, 76, 48],
		[15, 54, 24, 25, 55, 25],
		[23, 45, 15, 25, 46, 16],
		[13, 145, 115, 3, 146, 116],
		[2, 74, 46, 29, 75, 47],
		[42, 54, 24, 1, 55, 25],
		[23, 45, 15, 28, 46, 16],
		[17, 145, 115],
		[10, 74, 46, 23, 75, 47],
		[10, 54, 24, 35, 55, 25],
		[19, 45, 15, 35, 46, 16],
		[17, 145, 115, 1, 146, 116],
		[14, 74, 46, 21, 75, 47],
		[29, 54, 24, 19, 55, 25],
		[11, 45, 15, 46, 46, 16],
		[13, 145, 115, 6, 146, 116],
		[14, 74, 46, 23, 75, 47],
		[44, 54, 24, 7, 55, 25],
		[59, 46, 16, 1, 47, 17],
		[12, 151, 121, 7, 152, 122],
		[12, 75, 47, 26, 76, 48],
		[39, 54, 24, 14, 55, 25],
		[22, 45, 15, 41, 46, 16],
		[6, 151, 121, 14, 152, 122],
		[6, 75, 47, 34, 76, 48],
		[46, 54, 24, 10, 55, 25],
		[2, 45, 15, 64, 46, 16],
		[17, 152, 122, 4, 153, 123],
		[29, 74, 46, 14, 75, 47],
		[49, 54, 24, 10, 55, 25],
		[24, 45, 15, 46, 46, 16],
		[4, 152, 122, 18, 153, 123],
		[13, 74, 46, 32, 75, 47],
		[48, 54, 24, 14, 55, 25],
		[42, 45, 15, 32, 46, 16],
		[20, 147, 117, 4, 148, 118],
		[40, 75, 47, 7, 76, 48],
		[43, 54, 24, 22, 55, 25],
		[10, 45, 15, 67, 46, 16],
		[19, 148, 118, 6, 149, 119],
		[18, 75, 47, 31, 76, 48],
		[34, 54, 24, 34, 55, 25],
		[20, 45, 15, 61, 46, 16]
	], m.getRSBlocks = function (t, e) {
		var r = m.getRsBlockTable(t, e);
		if (null == r) throw new Error("bad rs block @ typeNumber:" + t + "/errorCorrectLevel:" + e);
		for (var o = r.length / 3, i = [], n = 0; n < o; n++)
			for (var a = r[3 * n + 0], s = r[3 * n + 1], h = r[3 * n + 2], l = 0; l < a; l++) i.push(new m(s, h));
		return i
	}, m.getRsBlockTable = function (t, e) {
		switch (e) {
			case o.L:
				return m.RS_BLOCK_TABLE[4 * (t - 1) + 0];
			case o.M:
				return m.RS_BLOCK_TABLE[4 * (t - 1) + 1];
			case o.Q:
				return m.RS_BLOCK_TABLE[4 * (t - 1) + 2];
			case o.H:
				return m.RS_BLOCK_TABLE[4 * (t - 1) + 3];
			default:
				return
		}
	}, _.prototype = {
		get: function (t) {
			var e = Math.floor(t / 8);
			return 1 == (this.buffer[e] >>> 7 - t % 8 & 1)
		},
		put: function (t, e) {
			for (var r = 0; r < e; r++) this.putBit(1 == (t >>> e - r - 1 & 1))
		},
		getLengthInBits: function () {
			return this.length
		},
		putBit: function (t) {
			var e = Math.floor(this.length / 8);
			this.buffer.length <= e && this.buffer.push(0), t && (this.buffer[e] |= 128 >>> this.length % 8), this.length++
		}
	};
	var v = [
		[17, 14, 11, 7],
		[32, 26, 20, 14],
		[53, 42, 32, 24],
		[78, 62, 46, 34],
		[106, 84, 60, 44],
		[134, 106, 74, 58],
		[154, 122, 86, 64],
		[192, 152, 108, 84],
		[230, 180, 130, 98],
		[271, 213, 151, 119],
		[321, 251, 177, 137],
		[367, 287, 203, 155],
		[425, 331, 241, 177],
		[458, 362, 258, 194],
		[520, 412, 292, 220],
		[586, 450, 322, 250],
		[644, 504, 364, 280],
		[718, 560, 394, 310],
		[792, 624, 442, 338],
		[858, 666, 482, 382],
		[929, 711, 509, 403],
		[1003, 779, 565, 439],
		[1091, 857, 611, 461],
		[1171, 911, 661, 511],
		[1273, 997, 715, 535],
		[1367, 1059, 751, 593],
		[1465, 1125, 805, 625],
		[1528, 1190, 868, 658],
		[1628, 1264, 908, 698],
		[1732, 1370, 982, 742],
		[1840, 1452, 1030, 790],
		[1952, 1538, 1112, 842],
		[2068, 1628, 1168, 898],
		[2188, 1722, 1228, 958],
		[2303, 1809, 1283, 983],
		[2431, 1911, 1351, 1051],
		[2563, 1989, 1423, 1093],
		[2699, 2099, 1499, 1139],
		[2809, 2213, 1579, 1219],
		[2953, 2331, 1663, 1273]
	];

	function C() {
		var t = !1,
			e = navigator.userAgent;
		if (/android/i.test(e)) {
			t = !0;
			var r = e.toString().match(/android ([0-9]\.[0-9])/i);
			r && r[1] && (t = parseFloat(r[1]))
		}
		return t
	}
	var w = function () {
			var t = function (t, e) {
				this._el = t, this._htOption = e
			};
			return t.prototype.draw = function (t) {
				var e = this._htOption,
					r = this._el,
					o = t.getModuleCount();
				Math.floor(e.width / o), Math.floor(e.height / o);

				function i(t, e) {
					var r = document.createElementNS("http://www.w3.org/2000/svg", t);
					for (var o in e) e.hasOwnProperty(o) && r.setAttribute(o, e[o]);
					return r
				}
				this.clear();
				var n = i("svg", {
					viewBox: "0 0 " + String(o) + " " + String(o),
					width: "100%",
					height: "100%",
					fill: e.colorLight
				});
				n.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), r.appendChild(n), n.appendChild(i("rect", {
					fill: e.colorLight,
					width: "100%",
					height: "100%"
				})), n.appendChild(i("rect", {
					fill: e.colorDark,
					width: "1",
					height: "1",
					id: "template"
				}));
				for (var a = 0; a < o; a++)
					for (var s = 0; s < o; s++)
						if (t.isDark(a, s)) {
							var h = i("use", {
								x: String(s),
								y: String(a)
							});
							h.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"), n.appendChild(h)
						}
			}, t.prototype.clear = function () {
				for (; this._el.hasChildNodes();) this._el.removeChild(this._el.lastChild)
			}, t
		}(),
		D = "svg" === document.documentElement.tagName.toLowerCase() ? w : "undefined" == typeof CanvasRenderingContext2D ? function () {
			var t = function (t, e) {
				this._el = t, this._htOption = e
			};
			return t.prototype.draw = function (t) {
				for (var e = this._htOption, r = this._el, o = t.getModuleCount(), i = Math.floor(e.width / o), n = Math.floor(e.height / o), a = ['<table style="border:0;border-collapse:collapse;">'], s = 0; s < o; s++) {
					a.push("<tr>");
					for (var h = 0; h < o; h++) a.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + i + "px;height:" + n + "px;background-color:" + (t.isDark(s, h) ? e.colorDark : e.colorLight) + ';"></td>');
					a.push("</tr>")
				}
				a.push("</table>"), r.innerHTML = a.join("");
				var l = r.childNodes[0],
					u = (e.width - l.offsetWidth) / 2,
					g = (e.height - l.offsetHeight) / 2;
				u > 0 && g > 0 && (l.style.margin = g + "px " + u + "px")
			}, t.prototype.clear = function () {
				this._el.innerHTML = ""
			}, t
		}() : function () {
			function t() {
				this._elImage.src = this._elCanvas.toDataURL("image/png"), this._elImage.style.display = "block", this._elCanvas.style.display = "none"
			}

		
		  

			if (this._android && this._android <= 2.1) {
				var e = 1 / window.devicePixelRatio,
					r = CanvasRenderingContext2D.prototype.drawImage;
				CanvasRenderingContext2D.prototype.drawImage = function (t, o, i, n, a, s, h, l, u) {
					if ("nodeName" in t && /img/i.test(t.nodeName))
						for (var g = arguments.length - 1; g >= 1; g--) arguments[g] = arguments[g] * e;
					else void 0 === l && (arguments[1] *= e, arguments[2] *= e, arguments[3] *= e, arguments[4] *= e);
					r.apply(this, arguments)
				}
			}

			function o(t, e) {
				var r = this;
				if (r._fFail = e, r._fSuccess = t, null === r._bSupportDataURI) {
					var o = document.createElement("img"),
						i = function () {
							r._bSupportDataURI = !1, r._fFail && r._fFail.call(r)
						};
					return o.onabort = i, o.onerror = i, o.onload = function () {
						r._bSupportDataURI = !0, r._fSuccess && r._fSuccess.call(r)
					}, void(o.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")
				}!0 === r._bSupportDataURI && r._fSuccess ? r._fSuccess.call(r) : !1 === r._bSupportDataURI && r._fFail && r._fFail.call(r)
			}
			var i = function (t, e) {
				this._bIsPainted = !1, this._android = C(), this._htOption = e, this._elCanvas = document.createElement("canvas"), this._elCanvas.width = e.width, this._elCanvas.height = e.height, t.appendChild(this._elCanvas), this._el = t, this._oContext = this._elCanvas.getContext("2d"), this._bIsPainted = !1, this._elImage = document.createElement("img"), this._elImage.alt = "Scan me!", this._elImage.style.display = "none", this._el.appendChild(this._elImage), this._bSupportDataURI = null
			};
			return i.prototype.draw = function (t) {
				var e = this._elImage,
					r = this._oContext,
					o = this._htOption,
					i = t.getModuleCount(),
					n = o.width / i,
					a = o.height / i,
					s = Math.round(n),
					h = Math.round(a);
				e.style.display = "none", this.clear();
				for (var l = 0; l < i; l++)
					for (var u = 0; u < i; u++) {
						var g = t.isDark(l, u),
							f = u * n,
							d = l * a;
						r.strokeStyle = g ? o.colorDark : o.colorLight, r.lineWidth = 1, r.fillStyle = g ? o.colorDark : o.colorLight, r.fillRect(f, d, n, a), r.strokeRect(Math.floor(f) + .5, Math.floor(d) + .5, s, h), r.strokeRect(Math.ceil(f) - .5, Math.ceil(d) - .5, s, h)
					}
				this._bIsPainted = !0
			}, i.prototype.makeImage = function () {
				this._bIsPainted && o.call(this, t)
			}, i.prototype.isPainted = function () {
				return this._bIsPainted
			}, i.prototype.clear = function () {
				this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1
			}, i.prototype.round = function (t) {
				return t ? Math.floor(1e3 * t) / 1e3 : t
			}, i
		}();

	function A(t, e) {
		for (var r = 1, i = function (t) {
				var e = encodeURI(t).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
				return e.length + (e.length != t ? 3 : 0)
			}(t), n = 0, a = v.length; n <= a; n++) {
			var s = 0;
			switch (e) {
				case o.L:
					s = v[n][0];
					break;
				case o.M:
					s = v[n][1];
					break;
				case o.Q:
					s = v[n][2];
					break;
				case o.H:
					s = v[n][3]
			}
			if (i <= s) break;
			r++
		}
		if (r > v.length) throw new Error("Too long data");
		return r
	}(QRCode = function (t, e) {
		if (this._htOption = {
				width: 1000,
				height: 1000,
				typeNumber: 4,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: o.H
			}, "string" == typeof e && (e = {
				text: e
			}), e)
			for (var r in e) this._htOption[r] = e[r];
		"string" == typeof t && (t = document.getElementById(t)), this._htOption.useSVG && (D = w), this._android = C(), this._el = t, this._oQRCode = null, this._oDrawing = new D(this._el, this._htOption), this._htOption.text && this.makeCode(this._htOption.text)
	}).prototype.makeCode = function (t) {
		this._oQRCode = new e(A(t, this._htOption.correctLevel), this._htOption.correctLevel), this._oQRCode.addData(t), this._oQRCode.make(), this._el.title = t, this._oDrawing.draw(this._oQRCode), this.makeImage()
	}, QRCode.prototype.makeImage = function () {
		"function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage()
	}, QRCode.prototype.clear = function () {
		this._oDrawing.clear()
	}, QRCode.CorrectLevel = o
}();

$(function() {
	setTimeout(function() { $("#hideMe").fadeOut(1500); }, 3000)
	
	})



!function(a){"use strict";function b(a,b){function c(a){return b.bgcolor&&(a.style.backgroundColor=b.bgcolor),b.width&&(a.style.width=b.width+"px"),b.height&&(a.style.height=b.height+"px"),b.style&&Object.keys(b.style).forEach(function(c){a.style[c]=b.style[c]}),a}return b=b||{},Promise.resolve(a).then(function(a){return h(a,b.filter,!0)}).then(i).then(j).then(c).then(function(c){return k(c,b.width||p.width(a),b.height||p.height(a))})}function c(a,b){return g(a,b||{}).then(function(b){return b.getContext("2d").getImageData(0,0,p.width(a),p.height(a)).data})}function d(a,b){return g(a,b||{}).then(function(a){return a.toDataURL()})}function e(a,b){return b=b||{},g(a,b).then(function(a){return a.toDataURL("image/jpeg",b.quality||1)})}function f(a,b){return g(a,b||{}).then(p.canvasToBlob)}function g(a,c){function d(a){var b=document.createElement("canvas");if(b.width=c.width||p.width(a),b.height=c.height||p.height(a),c.bgcolor){var d=b.getContext("2d");d.fillStyle=c.bgcolor,d.fillRect(0,0,b.width,b.height)}return b}return b(a,c).then(p.makeImage).then(p.delay(100)).then(function(b){var c=d(a);return c.getContext("2d").drawImage(b,0,0),c})}function h(a,b,c){function d(a){return a instanceof HTMLCanvasElement?p.makeImage(a.toDataURL()):a.cloneNode(!1)}function e(a,b,c){function d(a,b,c){var d=Promise.resolve();return b.forEach(function(b){d=d.then(function(){return h(b,c)}).then(function(b){b&&a.appendChild(b)})}),d}var e=a.childNodes;return 0===e.length?Promise.resolve(b):d(b,p.asArray(e),c).then(function(){return b})}function f(a,b){function c(){function c(a,b){function c(a,b){p.asArray(a).forEach(function(c){b.setProperty(c,a.getPropertyValue(c),a.getPropertyPriority(c))})}a.cssText?b.cssText=a.cssText:c(a,b)}c(window.getComputedStyle(a),b.style)}function d(){function c(c){function d(a,b,c){function d(a){var b=a.getPropertyValue("content");return a.cssText+" content: "+b+";"}function e(a){function b(b){return b+": "+a.getPropertyValue(b)+(a.getPropertyPriority(b)?" !important":"")}return p.asArray(a).map(b).join("; ")+";"}var f="."+a+":"+b,g=c.cssText?d(c):e(c);return document.createTextNode(f+"{"+g+"}")}var e=window.getComputedStyle(a,c),f=e.getPropertyValue("content");if(""!==f&&"none"!==f){var g=p.uid();b.className=b.className+" "+g;var h=document.createElement("style");h.appendChild(d(g,c,e)),b.appendChild(h)}}[":before",":after"].forEach(function(a){c(a)})}function e(){a instanceof HTMLTextAreaElement&&(b.innerHTML=a.value),a instanceof HTMLInputElement&&b.setAttribute("value",a.value)}function f(){b instanceof SVGElement&&(b.setAttribute("xmlns","http://www.w3.org/2000/svg"),b instanceof SVGRectElement&&["width","height"].forEach(function(a){var c=b.getAttribute(a);c&&b.style.setProperty(a,c)}))}return b instanceof Element?Promise.resolve().then(c).then(d).then(e).then(f).then(function(){return b}):b}return c||!b||b(a)?Promise.resolve(a).then(d).then(function(c){return e(a,c,b)}).then(function(b){return f(a,b)}):Promise.resolve()}function i(a){return r.resolveAll().then(function(b){var c=document.createElement("style");return a.appendChild(c),c.appendChild(document.createTextNode(b)),a})}function j(a){return s.inlineAll(a).then(function(){return a})}function k(a,b,c){return Promise.resolve(a).then(function(a){return a.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),(new XMLSerializer).serializeToString(a)}).then(p.escapeXhtml).then(function(a){return'<foreignObject x="0" y="0" width="100%" height="100%">'+a+"</foreignObject>"}).then(function(a){return'<svg xmlns="http://www.w3.org/2000/svg" width="'+b+'" height="'+c+'">'+a+"</svg>"}).then(function(a){return"data:image/svg+xml;charset=utf-8,"+a})}function l(){function a(){var a="application/font-woff",b="image/jpeg";return{woff:a,woff2:a,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:b,jpeg:b,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml"}}function b(a){var b=/\.([^\.\/]*?)$/g.exec(a);return b?b[1]:""}function c(c){var d=b(c).toLowerCase();return a()[d]||""}function d(a){return a.search(/^(data:)/)!==-1}function e(a){return new Promise(function(b){for(var c=window.atob(a.toDataURL().split(",")[1]),d=c.length,e=new Uint8Array(d),f=0;f<d;f++)e[f]=c.charCodeAt(f);b(new Blob([e],{type:"image/png"}))})}function f(a){return a.toBlob?new Promise(function(b){a.toBlob(b)}):e(a)}function g(a,b){var c=document.implementation.createHTMLDocument(),d=c.createElement("base");c.head.appendChild(d);var e=c.createElement("a");return c.body.appendChild(e),d.href=b,e.href=a,e.href}function h(){var a=0;return function(){function b(){return("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)}return"u"+b()+a++}}function i(a){return new Promise(function(b,c){var d=new Image;d.onload=function(){b(d)},d.onerror=c,d.src=a})}function j(a){var b=3e4;return new Promise(function(c){function d(){if(4===g.readyState){if(200!==g.status)return void f("cannot fetch resource: "+a+", status: "+g.status);var b=new FileReader;b.onloadend=function(){var a=b.result.split(/,/)[1];c(a)},b.readAsDataURL(g.response)}}function e(){f("timeout of "+b+"ms occured while fetching resource: "+a)}function f(a){console.error(a),c("")}var g=new XMLHttpRequest;g.onreadystatechange=d,g.ontimeout=e,g.responseType="blob",g.timeout=b,g.open("GET",a,!0),g.send()})}function k(a,b){return"data:"+b+";base64,"+a}function l(a){return a.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1")}function m(a){return function(b){return new Promise(function(c){setTimeout(function(){c(b)},a)})}}function n(a){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}function o(a){return a.replace(/#/g,"%23").replace(/\n/g,"%0A")}function p(a){var b=r(a,"border-left-width"),c=r(a,"border-right-width");return a.scrollWidth+b+c}function q(a){var b=r(a,"border-top-width"),c=r(a,"border-bottom-width");return a.scrollHeight+b+c}function r(a,b){var c=window.getComputedStyle(a).getPropertyValue(b);return parseFloat(c.replace("px",""))}return{escape:l,parseExtension:b,mimeType:c,dataAsUrl:k,isDataUrl:d,canvasToBlob:f,resolveUrl:g,getAndEncode:j,uid:h(),delay:m,asArray:n,escapeXhtml:o,makeImage:i,width:p,height:q}}function m(){function a(a){return a.search(e)!==-1}function b(a){for(var b,c=[];null!==(b=e.exec(a));)c.push(b[1]);return c.filter(function(a){return!p.isDataUrl(a)})}function c(a,b,c,d){function e(a){return new RegExp("(url\\(['\"]?)("+p.escape(a)+")(['\"]?\\))","g")}return Promise.resolve(b).then(function(a){return c?p.resolveUrl(a,c):a}).then(d||p.getAndEncode).then(function(a){return p.dataAsUrl(a,p.mimeType(b))}).then(function(c){return a.replace(e(b),"$1"+c+"$3")})}function d(d,e,f){function g(){return!a(d)}return g()?Promise.resolve(d):Promise.resolve(d).then(b).then(function(a){var b=Promise.resolve(d);return a.forEach(function(a){b=b.then(function(b){return c(b,a,e,f)})}),b})}var e=/url\(['"]?([^'"]+?)['"]?\)/g;return{inlineAll:d,shouldProcess:a,impl:{readUrls:b,inline:c}}}function n(){function a(){return b(document).then(function(a){return Promise.all(a.map(function(a){return a.resolve()}))}).then(function(a){return a.join("\n")})}function b(){function a(a){return a.filter(function(a){return a.type===CSSRule.FONT_FACE_RULE}).filter(function(a){return q.shouldProcess(a.style.getPropertyValue("src"))})}function b(a){var b=[];return a.forEach(function(a){try{p.asArray(a.cssRules||[]).forEach(b.push.bind(b))}catch(c){console.log("Error while reading CSS rules from "+a.href,c.toString())}}),b}function c(a){return{resolve:function(){var b=(a.parentStyleSheet||{}).href;return q.inlineAll(a.cssText,b)},src:function(){return a.style.getPropertyValue("src")}}}return Promise.resolve(p.asArray(document.styleSheets)).then(b).then(a).then(function(a){return a.map(c)})}return{resolveAll:a,impl:{readAll:b}}}function o(){function a(a){function b(b){return p.isDataUrl(a.src)?Promise.resolve():Promise.resolve(a.src).then(b||p.getAndEncode).then(function(b){return p.dataAsUrl(b,p.mimeType(a.src))}).then(function(b){return new Promise(function(c,d){a.onload=c,a.onerror=d,a.src=b})})}return{inline:b}}function b(c){function d(a){var b=a.style.getPropertyValue("background");return b?q.inlineAll(b).then(function(b){a.style.setProperty("background",b,a.style.getPropertyPriority("background"))}).then(function(){return a}):Promise.resolve(a)}return c instanceof Element?d(c).then(function(){return c instanceof HTMLImageElement?a(c).inline():Promise.all(p.asArray(c.childNodes).map(function(a){return b(a)}))}):Promise.resolve(c)}return{inlineAll:b,impl:{newImage:a}}}var p=l(),q=m(),r=n(),s=o(),t={toSvg:b,toPng:d,toJpeg:e,toBlob:f,toPixelData:c,impl:{fontFaces:r,images:s,util:p,inliner:q}};"undefined"!=typeof module?module.exports=t:a.domtoimage=t}(this);

$(document).ready(function(){
  $(".download").on("click",function(){
    
    domtoimage.toPng(document.getElementById('qrcode'), )
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'GagogiQR.png';
        link.href = dataUrl;
        link.click();
    });
    
  })
  
});



