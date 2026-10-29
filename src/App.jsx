import React, { useState, useEffect, useMemo, createContext, useContext } from "react";


const SYMBOL_DATA = "data:image/png;base64,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";
const SYMBOL_WHITE_DATA = "data:image/png;base64,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";
const WORDMARK_WHITE_DATA = "data:image/png;base64,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";
const WORDMARK_BLUE_DATA = "data:image/png;base64,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";

const LangContext = createContext({ lang: "es", setLang: () => {} });

import { Lock, Check, Utensils, Star, ChevronRight, X, LogOut, ShieldCheck, Plus, QrCode, Sparkles, Instagram, MapPin, Pencil, Save, Crown, Clock, MessageCircle, Gift, ChevronDown } from "lucide-react";
import { sb } from "./lib/storagePolyfill";

// --- QR Code Generator library (MIT License, Kazuhiko Arase) ---
// Se ejecuta 100% en el navegador, sin llamadas externas.
//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin, alt, title) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
        alt = opts.alt;
        title = opts.title;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      // Compose alt property surrogate
      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
      alt.text = alt.text || null;
      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

      // Compose title property surrogate
      title = (typeof title === 'string') ? {text: title} : title || {};
      title.text = title.text || null;
      title.id = (title.text) ? title.id || 'qrcode-title' : null;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
      qrSvg += '>';
      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
          escapeXml(title.text) + '</title>' : '';
      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
          escapeXml(alt.text) + '</description>' : '';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += '/>';

      return img;
    };

    var escapeXml = function(s) {
      var escaped = '';
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charAt(i);
        switch(c) {
        case '<': escaped += '&lt;'; break;
        case '>': escaped += '&gt;'; break;
        case '&': escaped += '&amp;'; break;
        case '"': escaped += '&quot;'; break;
        default : escaped += c; break;
        }
      }
      return escaped;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
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
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

// --- Fin de la librería QR ---

// Cuando quieras activar el cobro real con Stripe para el upgrade a Residente, cambia esto a true e integra el cobro.
const SHOW_PLANS = false;

// La administración del Club vive ahora en el panel principal (www.xtudyclub.com/admin/club). Cuando
// VITE_UNIFIED_ADMIN_URL está configurada, «Acceso administrador» lleva allá; sin ella, sigue el administrador anterior.
const UNIFIED_ADMIN_URL = (import.meta.env.VITE_UNIFIED_ADMIN_URL || `${(import.meta.env.VITE_PLATFORM_URL || "https://www.xtudyclub.com").replace(/\/$/, "")}/admin/club`).trim();

const TIERS = [
  { id: "guest", name: { es: "Explorador", en: "Explorer", fr: "Explorateur", de: "Entdecker" }, price: 0, order: 0, tagline: { es: "Para cualquier estudiante", en: "For any student", fr: "Pour tout étudiant", de: "Für jeden Studenten" } },
  { id: "resident", name: { es: "Residente Xtudy", en: "Xtudy Resident", fr: "Résident Xtudy", de: "Xtudy-Bewohner" }, price: 49, order: 1, tagline: { es: "Acceso a todos los restaurantes", en: "Access to every restaurant", fr: "Accès à tous les restaurants", de: "Zugang zu allen Restaurants" } },
];

// Nivel especial solo para restaurantes: no está ligado a ninguna membresía.
// Sirve para mostrar "Próximamente" con candado, sin importar el nivel del estudiante.
const SOON_TIER_ID = "soon";
const SOON_ORDER = 999;

// El panel de administrador siempre se muestra en español, así que aquí usamos
// nombres fijos (no bilingües) solo para esa parte de la app.
const RESTAURANT_TIER_OPTIONS = [
  { id: "guest", name: "Explorador" },
  { id: "resident", name: "Residente Xtudy" },
  { id: "soon", name: "Próximamente" },
];

const DEFAULT_RESTAURANTS = [
  { id: "r1", name: "Dogos Bravo", category: "Hot dogs", discountPercent: 15, code: "BRAVO15", tier: "guest", address: "Av. General Ramón Corona 2419, San Juan de Ocotán, 45019 Zapopan, Jal." },
  { id: "r2", name: "Café Vaivén", category: "Cafetería", discountPercent: 10, code: "VAIVEN10", tier: "guest", address: "P.º Solares 30, San Juan de Ocotán, 49015 Zapopan, Jal." },
  { id: "r3", name: "Pizza Rebelde", category: "Pizza", discount: "20% en pizzas medianas", code: "BARRIO20", tier: "guest", address: "Av. Ejemplo 123, Guadalajara" },
  { id: "r4", name: "Exprime GDL", category: "Jugos", discountPercent: 10, code: "FRESCA10", tier: "guest", address: "Av. Ejemplo 456, Guadalajara" },
  { id: "r5", name: "Sanopecado", category: "Comida saludable", discount: "Descuento por confirmar", code: "SANO01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r6", name: "Yogocup", category: "Yogurt helado", discount: "Descuento por confirmar", code: "YOGO01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r7", name: "Santo Coyote", category: "Mexicana", discount: "Descuento por confirmar", code: "COYOTE01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r8", name: "Carl's Jr", category: "Hamburguesas", discount: "Descuento por confirmar", code: "CARLS01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r9", name: "Sushi Central", category: "Sushi", discount: "Descuento por confirmar", code: "SUSHIC01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r10", name: "Quilombo", category: "Parrilla argentina", discount: "Descuento por confirmar", code: "QUILOM01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r11", name: "Papa Cabaña La Ola", category: "Mariscos", discount: "Descuento por confirmar", code: "PAPAOLA01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r12", name: "Quin Oriental", category: "Comida asiática", discount: "Descuento por confirmar", code: "QUIN01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r13", name: "Los Chilaquiles", category: "Desayunos", discount: "Descuento por confirmar", code: "CHILAQ01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r14", name: "Punto Ostra", category: "Ostras / Mariscos", discount: "Descuento por confirmar", code: "OSTRA01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r15", name: "Genki Poke", category: "Poke", discount: "Descuento por confirmar", code: "GENKI01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r16", name: "Domino's", category: "Pizza", discount: "Descuento por confirmar", code: "DOMINO01", tier: "soon", address: "Pendiente de confirmar dirección" },
  { id: "r17", name: "Little Caesars", category: "Pizza", discount: "Descuento por confirmar", code: "LITTLEC01", tier: "soon", address: "Pendiente de confirmar dirección" },
];

// Códigos de país para el teléfono. México va primero por ser la mayoría de los estudiantes.
const COUNTRY_CODES = [
  { code: "+52", label: "🇲🇽 +52 México", name: "México", digits: 10 },
  { code: "+1", label: "🇺🇸 +1 EE.UU. / Canadá", name: "EE.UU./Canadá", digits: 10 },
  { code: "+57", label: "🇨🇴 +57 Colombia", name: "Colombia", digits: 10 },
  { code: "+54", label: "🇦🇷 +54 Argentina", name: "Argentina", digits: 10 },
  { code: "+56", label: "🇨🇱 +56 Chile", name: "Chile", digits: 9 },
  { code: "+51", label: "🇵🇪 +51 Perú", name: "Perú", digits: 9 },
  { code: "+34", label: "🇪🇸 +34 España", name: "España", digits: 9 },
  { code: "+55", label: "🇧🇷 +55 Brasil", name: "Brasil", digits: 11 },
  { code: "+49", label: "🇩🇪 +49 Alemania", name: "Alemania", digits: null },
  { code: "+33", label: "🇫🇷 +33 Francia", name: "Francia", digits: 9 },
  { code: "+44", label: "🇬🇧 +44 Reino Unido", name: "Reino Unido", digits: 10 },
  { code: "+39", label: "🇮🇹 +39 Italia", name: "Italia", digits: null },
  { code: "+86", label: "🇨🇳 +86 China", name: "China", digits: 11 },
  { code: "+91", label: "🇮🇳 +91 India", name: "India", digits: 10 },
  { code: "+81", label: "🇯🇵 +81 Japón", name: "Japón", digits: null },
  { code: "+82", label: "🇰🇷 +82 Corea del Sur", name: "Corea del Sur", digits: null },
  { code: "other", label: "🌎 Otro país", name: "tu país", digits: null },
];

const DEFAULT_UNIVERSITIES = [
  { name: "Universidad de Guadalajara (UDG)", tipo: "Pública" },
  { name: "CUCEI – Cs. Exactas e Ingenierías (UDG)", tipo: "Pública" },
  { name: "CUCEA – Cs. Económico Administrativas (UDG)", tipo: "Pública" },
  { name: "CUCS – Cs. de la Salud (UDG)", tipo: "Pública" },
  { name: "CUAAD – Arte, Arquitectura y Diseño (UDG)", tipo: "Pública" },
  { name: "CUCBA – Cs. Biológicas y Agropecuarias (UDG)", tipo: "Pública" },
  { name: "CUCSH – Cs. Sociales y Humanidades (UDG)", tipo: "Pública" },
  { name: "Instituto Tecnológico José Mario Molina Pasquel y Henríquez", tipo: "Pública" },
  { name: "CETI – Centro de Enseñanza Técnica Industrial", tipo: "Pública" },
  { name: "TecNM Campus Guadalajara (ITTG)", tipo: "Pública" },
  { name: "Universidad Tecnológica de Jalisco (UTJ)", tipo: "Pública" },
  { name: "ITESO", tipo: "Privada" },
  { name: "Tecnológico de Monterrey – Campus Guadalajara", tipo: "Privada" },
  { name: "Universidad Autónoma de Guadalajara (UAG)", tipo: "Privada" },
  { name: "UNIVA – Universidad del Valle de Atemajac", tipo: "Privada" },
  { name: "Universidad Panamericana (UP) – Campus GDL", tipo: "Privada" },
  { name: "Universidad Marista de Guadalajara", tipo: "Privada" },
  { name: "Universidad del Valle de México (UVM) – Zapopan", tipo: "Privada" },
  { name: "Universidad Vizcaya de las Américas", tipo: "Privada" },
  { name: "Universidad Cuauhtémoc – Plantel Guadalajara", tipo: "Privada" },
  { name: "Otra universidad", tipo: "Otra" },
];


function tierOrder(id) {
  if (id === "soon") return SOON_ORDER;
  return TIERS.find((t) => t.id === id)?.order ?? 0;
}

// Le da formato automático al descuento: si hay un porcentaje numérico, arma el
// texto solo (bilingüe). Si no, usa el texto libre o un mensaje por defecto.
// Traduce un texto a uno de los 4 idiomas que soporta la app.
function tr(lang, es, en, fr, de) {
  if (lang === "es") return es;
  if (lang === "fr") return fr;
  if (lang === "de") return de;
  return en;
}

// Aliados y beneficios (se editan en el panel principal). Cada texto se captura una vez y se guarda traducido:
// r.i18n[campo] = { text (original), src, es, en, fr, de, status, manual }. Las traducciones ya vienen guardadas
// (no se generan en cada visita). Si falta la de ESE texto, se muestra el original y se indica su idioma.
// Una traducción solo vale si es del texto actual (la huella `hash` la calcula el panel; aquí basta con `status`).
function txtShown(r, field, lang) {
  const e = r.i18n && r.i18n[field];
  if (!e || typeof e.text !== "string" || !e.text.trim()) return { text: "", lang: null };
  if (lang === e.src) return { text: e.text, lang: e.src };
  const manualHere = e.manual && lang === (e.src === "es" ? "en" : "es");
  const v = (e.status === "ok" || manualHere) ? e[lang] : "";
  return v && v.trim() ? { text: v, lang } : { text: e.text, lang: e.src };
}
const txt = (r, field, lang) => txtShown(r, field, lang).text;
const LANG_NAME = { es: ["español", "Spanish", "espagnol", "Spanisch"], en: ["inglés", "English", "anglais", "Englisch"] };
// Indicación discreta cuando un texto todavía se muestra en su idioma original.
function OrigLang({ shown, lang }) {
  if (!shown.lang || shown.lang === lang || !LANG_NAME[shown.lang]) return null;
  return <span style={styles.origLang}> · {tr(lang, "en ", "in ", "en ", "auf ")}{tr(lang, ...LANG_NAME[shown.lang])}</span>;
}
const CATEGORY_LABELS = {
  restaurants: ["Restaurantes", "Restaurants", "Restaurants", "Restaurants"],
  cafes: ["Cafeterías", "Cafés", "Cafés", "Cafés"],
  bars: ["Bares", "Bars", "Bars", "Bars"],
  nightclubs: ["Antros", "Nightclubs", "Boîtes de nuit", "Clubs"],
  esim: ["eSIM y conectividad", "eSIM & connectivity", "eSIM et connectivité", "eSIM & Konnektivität"],
  airlines: ["Aerolíneas", "Airlines", "Compagnies aériennes", "Fluggesellschaften"],
  travel: ["Viajes y transporte", "Travel & transport", "Voyages et transport", "Reisen & Transport"],
  health: ["Salud y bienestar", "Health & wellness", "Santé et bien-être", "Gesundheit & Wellness"],
  sports: ["Deporte", "Sports", "Sport", "Sport"],
  entertainment: ["Entretenimiento", "Entertainment", "Divertissement", "Unterhaltung"],
  shopping: ["Compras", "Shopping", "Shopping", "Shopping"],
  other: ["Otros", "Other", "Autres", "Sonstiges"],
};
// Categoría traducida; la subcategoría escrita antes (ej. «Hot dogs») se conserva en español.
function categoryText(r, lang) {
  const labels = CATEGORY_LABELS[r.categoryId];
  if (!labels) return r.category || "";
  const main = tr(lang, ...labels);
  const sub = (r.category || "").trim();
  return sub && sub !== labels[0] ? `${main} · ${sub}` : main;
}
const partnerKind = (r) => (r.kind === "online" || r.kind === "both" ? r.kind : "physical");
// Borradores y beneficios vencidos no se muestran a los estudiantes.
function isPublishedPartner(r) {
  if (r.status === "draft") return false;
  const v = (r.validUntil || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(new Date());
    if (v < today) return false;
  }
  return true;
}

function formatDiscount(r, lang) {
  const typed = r.benefitType && r.benefitType !== "percent" ? txt(r, "benefit", lang) : "";
  if (typed) return typed;
  if (r.discountPercent !== undefined && r.discountPercent !== null && r.discountPercent !== "") {
    return tr(lang, `${r.discountPercent}% de descuento`, `${r.discountPercent}% off`, `${r.discountPercent}% de réduction`, `${r.discountPercent}% Rabatt`);
  }
  if (r.discount) return r.discount;
  return tr(lang, "Descuento por confirmar", "Discount to be confirmed", "Réduction à confirmer", "Rabatt wird noch bestätigt");
}

// Devuelve la lista de sucursales de un restaurante, sin importar si se guardó
// con el campo nuevo (branches: [...]) o el viejo (branch: "texto único").
// Así, restaurantes ya existentes en la base de datos siguen funcionando igual.
function getBranches(r) {
  if (Array.isArray(r.branches) && r.branches.length > 0) return r.branches;
  if (r.branch) return [{ name: r.branch, address: r.address || "" }];
  return [];
}

// Arma el link de "Ver ubicación" de una sucursal específica: usa su link de
// Google Maps si lo tiene, o arma una búsqueda con nombre + dirección como respaldo.
function getBranchUrl(restaurantName, branch) {
  if (branch.mapsLink && branch.mapsLink.trim()) return branch.mapsLink.trim();
  if (branch.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName + " " + branch.name + ", " + branch.address)}`;
  }
  return null;
}

// Arma el link de "Ver ubicación" general del restaurante. Prioridad:
// 1) Si el admin pegó un link de Google Maps directo a nivel restaurante, se usa tal cual.
// 2) Si solo hay una sucursal, se usa el link de esa sucursal.
// 3) Si no hay sucursales pero sí dirección normal, se arma la búsqueda de siempre.
// (Si hay varias sucursales con links distintos, cada una se muestra por separado
// en la tarjeta — no se pueden combinar links ya hechos en uno solo.)
// Lee el horario en el idioma actual; si no está traducido a ese idioma,
// muestra el de español en su lugar (mejor eso que no mostrar nada).
function trHours(hours, lang) {
  if (!hours) return "";
  if (typeof hours === "string") return hours; // por si quedó algo del formato viejo
  return hours[lang] || hours.es || "";
}

function getLocationUrl(r) {
  if (r.mapsLink && r.mapsLink.trim()) return r.mapsLink.trim();
  const branches = getBranches(r);
  if (branches.length === 1) return getBranchUrl(r.name, branches[0]);
  if (r.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ", " + r.address)}`;
  }
  return null;
}

// Arma el link de WhatsApp para reservar, con un mensaje ya escrito que dice
// que la persona viene del Club Xtudy. Siempre en español, ya que son
// restaurantes mexicanos.
function getReservationUrl(phone) {
  if (!phone || !phone.trim()) return null;
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  const message = "Hola, soy parte de Students Club y me gustaría hacer una reservación";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

// Sube el logo de un restaurante al espacio de almacenamiento y regresa el link
// público para guardarlo. Solo funciona si quien lo llama tiene sesión de admin.
function QrError() {
  const { lang } = useContext(LangContext);
  return <div role="alert" style={{ fontSize: 11, color: "#B3261E" }}>{tr(lang, "No se pudo generar el código QR.", "The QR code could not be generated.", "Impossible de générer le code QR.", "Der QR-Code konnte nicht erstellt werden.")}</div>;
}

function QRCode({ value, size = 140 }) {
  const data = useMemo(() => {
    try {
      const qr = qrcode(0, "L");
      qr.addData(String(value || ""));
      qr.make();
      const count = qr.getModuleCount();
      let d = "";
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (qr.isDark(r, c)) d += `M${c + 2} ${r + 2}h1v1h-1z`;
        }
      }
      return { count, d };
    } catch (e) {
      return null;
    }
  }, [value]);

  if (!data) return <QrError />;

  const quiet = 2;
  const total = data.count + quiet * 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges">
      <rect width={total} height={total} fill="#ffffff" />
      <path d={data.d} fill="#0B1F2B" />
    </svg>
  );
}

async function storageGet(key, shared) {
  try {
    const res = await window.storage.get(key, shared);
    return res ? res.value : null;
  } catch {
    return null;
  }
}

function persist(fn) {
  // fire-and-forget: never blocks the UI, never leaves the user stuck
  Promise.resolve().then(fn).catch((e) => console.error("storage error", e));
}

// Estas 3 funciones usan funciones seguras en Supabase (RPC) en vez de leer
// la tabla directamente, para no exponer todas las cuentas ni el código real.
// Entrar con el correo: lo resuelve el servidor del sitio (el navegador ya no lee cuentas de Supabase directamente).
async function loginByEmail(email) {
  try {
    const res = await fetch(`${PLATFORM_URL}/api/club/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const j = await res.json().catch(() => ({}));
    if (res.ok && j.account) return { status: "ok", account: j.account };
    return { status: j.status || (res.status === 404 ? "not_found" : "error") };
  } catch {
    return { status: "error" };
  }
}

export default function ClubDescuentos() {
  const [view, setView] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [restaurants, setRestaurants] = useState(DEFAULT_RESTAURANTS);
  const [universities, setUniversities] = useState(DEFAULT_UNIVERSITIES);

  const [form, setForm] = useState({ name: "", email: "", phone: "", countryCode: "+52", studentId: "", university: DEFAULT_UNIVERSITIES[0].name, isXtudy: "no", residentCode: "", profile: "student", proCode: "", proError: "" });
  const [formError, setFormError] = useState("");
  // Registro del equipo Xtudy (empleado o colaborador): el código lo valida el servidor y decide el tipo.
  const [team, setTeam] = useState({ open: false, code: "", kind: null, status: "", busy: false });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  const [lang, setLangState] = useState("es");
  const setLang = (l) => {
    setLangState(l);
    persist(() => window.storage.set("my-lang", l, false));
  };

  const [verifyParams] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const m = params.get("m");
      const r = params.get("r");
      return m && r ? { m, r, p: params.get("p") || "" } : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const myEmail = await storageGet("my-email", false);
        const savedLang = await storageGet("my-lang", false);
        if (["es", "en", "fr", "de"].includes(savedLang)) setLangState(savedLang);
        const list = await storageGet("restaurants-list", true);
        let restList = DEFAULT_RESTAURANTS;
        if (list) { try { restList = JSON.parse(list); setRestaurants(restList); } catch {} }

        const unis = await storageGet("universities-list", true);
        if (unis) { try { setUniversities(JSON.parse(unis)); } catch {} }

        // El administrador anterior de esta app se retiró: el Club se administra en el panel de Xtudy (/admin/club).

        // QR anteriores (llevaban el número de miembro): se llevan a la validación de comercios de Xtudy, donde un empleado
        // autorizado ve el estado actual y confirma el canje. Abrirlos no canjea nada.
        if (verifyParams) {
          window.location.replace(`${PLATFORM_URL}/c/m/${encodeURIComponent(verifyParams.m)}`);
          return;
        }

        if (myEmail) {
          const r = await loginByEmail(myEmail);
          if (r.status === "ok") { setAccount(r.account); setView("dashboard"); }
        }
        // Desde el sitio principal (xtudyclub.com): «Iniciar sesión en Xtudy Club» abre directo el acceso de miembros
        // y el idioma elegido allá se conserva.
        const entry = new URLSearchParams(window.location.search);
        const entryLang = entry.get("lang");
        if (["es", "en", "fr", "de"].includes(entryLang)) setLangState(entryLang);
        if (!myEmail && entry.get("login") === "1") setView("login");
        // «Únete gratis a Xtudy Club» en el inicio del sitio: abre directo el registro.
        else if (!myEmail && entry.get("signup") === "1") setView("register");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const checkTeamCode = async () => {
    const code = team.code.trim();
    if (!code) { setTeam((t) => ({ ...t, status: "empty" })); return; }
    setTeam((t) => ({ ...t, busy: true, status: "" }));
    try {
      const r = await fetch(`${PLATFORM_URL}/api/club/team/check`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, email: form.email.trim().toLowerCase() || undefined }) });
      const j = await r.json().catch(() => ({}));
      if (j.status === "ok" && (j.kind === "employee" || j.kind === "collaborator")) setTeam((t) => ({ ...t, busy: false, kind: j.kind, status: "ok" }));
      else setTeam((t) => ({ ...t, busy: false, kind: null, status: j.status || "error" }));
    } catch {
      setTeam((t) => ({ ...t, busy: false, kind: null, status: "error" }));
    }
  };

  const handleRegister = async () => {
    setFormError("");
    const isTeam = Boolean(team.kind);
    const isPro = !isTeam && form.profile === "professional";
    if (isPro && !form.proCode.trim()) { setForm((f) => ({ ...f, proError: "empty" })); return; }
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || (!isTeam && !isPro && !form.studentId.trim())) {
      setFormError(tr(lang, "Completa todos los campos para continuar.", "Fill in all the fields to continue.", "Remplis tous les champs pour continuer.", "Fülle alle Felder aus, um fortzufahren."));
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(form.email.trim())) {
      setFormError(tr(lang, "Escribe un correo electrónico válido (ej. nombre@correo.com).", "Enter a valid email (e.g. name@email.com).", "Saisis un e-mail valide (ex. nom@email.com).", "Gib eine gültige E-Mail-Adresse ein (z. B. name@mail.com)."));
      return;
    }
    const phoneDigits = form.phone.replace(/\D/g, "");
    const countryInfo = COUNTRY_CODES.find((c) => c.code === form.countryCode);
    if (countryInfo && countryInfo.digits) {
      if (phoneDigits.length !== countryInfo.digits) {
        setFormError(tr(lang, `El teléfono debe tener ${countryInfo.digits} dígitos para ${countryInfo.name}.`, `The phone number must have ${countryInfo.digits} digits for ${countryInfo.name}.`, `Le numéro doit comporter ${countryInfo.digits} chiffres pour ${countryInfo.name}.`, `Die Telefonnummer muss für ${countryInfo.name} ${countryInfo.digits} Ziffern haben.`));
        return;
      }
    } else if (phoneDigits.length < 6 || phoneDigits.length > 15) {
      setFormError(tr(lang, "Escribe un número de teléfono válido.", "Enter a valid phone number.", "Saisis un numéro de téléphone valide.", "Gib eine gültige Telefonnummer ein."));
      return;
    }
    if (isTeam || isPro) {
      // La cuenta del equipo o del residente profesionista la crea el servidor (valida el código y decide el tipo).
      setTeam((t) => ({ ...t, busy: true }));
      try {
        const r = await fetch(`${PLATFORM_URL}/api/club/team/register`, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: (isPro ? form.proCode : team.code).trim(), as: isPro ? "professional" : "team", name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: `${form.countryCode === "other" ? "" : form.countryCode + " "}${form.phone.trim()}` }) });
        const j = await r.json().catch(() => ({}));
        if (j.status === "ok" && j.account) {
          setTeam({ open: false, code: "", kind: null, status: "", busy: false });
          setAccount(j.account);
          setView("dashboard");
          persist(() => window.storage.set("my-email", j.account.email, false));
          return;
        }
        if (j.status === "exists") { setTeam((t) => ({ ...t, busy: false })); setFormError("duplicate-email"); return; }
        if (["invalid", "expired", "inactive", "too_many"].includes(j.status)) {
          setTeam((t) => ({ ...t, busy: false, ...(isPro ? {} : { kind: null, status: j.status }) }));
          // Profesionista: el código no sirve → se explica junto al campo y se conservan los datos capturados.
          if (isPro) setForm((f) => ({ ...f, proError: j.status }));
          return;
        }
        setTeam((t) => ({ ...t, busy: false }));
        setFormError(j.status === "bad_request"
          ? tr(lang, "Revisa tus datos: nombre, correo y teléfono.", "Check your details: name, email and phone.", "Vérifie tes informations : nom, e-mail et téléphone.", "Prüfe deine Angaben: Name, E-Mail und Telefon.")
          : tr(lang, "No pudimos crear tu cuenta en este momento. Intenta de nuevo.", "We couldn't create your account right now. Please try again.", "Impossible de créer ton compte pour le moment. Réessaie.", "Dein Konto konnte gerade nicht erstellt werden. Bitte versuche es erneut."));
      } catch {
        setTeam((t) => ({ ...t, busy: false }));
        setFormError(tr(lang, "Sin conexión. Revisa tu internet e intenta de nuevo.", "No connection. Check your internet and try again.", "Pas de connexion. Vérifie ton internet et réessaie.", "Keine Verbindung. Prüfe dein Internet und versuche es erneut."));
      }
      return;
    }
    // Estudiante: la cuenta la crea el servidor (el código de residentes se valida allá, nunca en el navegador).
    try {
      const r = await fetch(`${PLATFORM_URL}/api/club/register`, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: `${form.countryCode === "other" ? "" : form.countryCode + " "}${form.phone.trim()}`,
          studentId: form.studentId.trim(), university: form.university, isXtudy: form.isXtudy, residentCode: form.isXtudy === "si" ? form.residentCode : "" }) });
      const j = await r.json().catch(() => ({}));
      if (j.status === "ok" && j.account) {
        setAccount(j.account);
        setView("dashboard");
        persist(() => window.storage.set("my-email", j.account.email, false));
        return;
      }
      if (j.status === "exists") { setFormError("duplicate-email"); return; }
      if (j.status === "resident_code") { setFormError(tr(lang, "El código de residente Xtudy no es correcto. Verifícalo con administración.", "The Xtudy resident code isn't correct. Check it with administration.", "Le code résident Xtudy n'est pas correct. Vérifie-le auprès de l'administration.", "Der Xtudy-Bewohner-Code ist nicht korrekt. Prüfe ihn bei der Verwaltung.")); return; }
      if (j.status === "too_many") { setFormError(tr(lang, ...TEAM_CODE_MSG.too_many)); return; }
      setFormError(j.status === "bad_request"
        ? tr(lang, "Revisa tus datos y vuelve a intentar.", "Check your details and try again.", "Vérifie tes informations et réessaie.", "Prüfe deine Angaben und versuche es erneut.")
        : tr(lang, "No pudimos crear tu cuenta en este momento. Intenta de nuevo.", "We couldn't create your account right now. Please try again.", "Impossible de créer ton compte pour le moment. Réessaie.", "Dein Konto konnte gerade nicht erstellt werden. Bitte versuche es erneut."));
    } catch {
      setFormError(tr(lang, "Sin conexión. Revisa tu internet e intenta de nuevo.", "No connection. Check your internet and try again.", "Pas de connexion. Vérifie ton internet et réessaie.", "Keine Verbindung. Prüfe dein Internet und versuche es erneut."));
    }
  };

  // Cambiar de nivel desde el navegador ya no es posible (lo decide el servidor); se conserva la firma por compatibilidad.
  const changeTier = () => {};

  const logout = () => {
    persist(() => window.storage.delete("my-email", false));
    // La próxima entrada al perfil es una visita nueva (vuelve la celebración VIP una vez).
    try { Object.keys(sessionStorage).filter((k) => k.startsWith("vip-cel:")).forEach((k) => sessionStorage.removeItem(k)); } catch { /* sin almacenamiento */ }
    CELEBRATED.clear();
    setAccount(null);
    setView("landing");
  };

  const handleLogin = () => {
    setLoginError("");
    const email = loginEmail.trim().toLowerCase();
    if (!email) {
      setLoginError(tr(lang, "Escribe el correo con el que te registraste.", "Enter the email you signed up with.", "Saisis l'e-mail avec lequel tu t'es inscrit.", "Gib die E-Mail ein, mit der du dich registriert hast."));
      return;
    }
    (async () => {
      const r = await loginByEmail(email);
      if (r.status === "ok") {
        setAccount(r.account);
        setView("dashboard");
        persist(() => window.storage.set("my-email", r.account.email, false));
        return;
      }
      setLoginError(r.status === "not_found"
        ? tr(lang, "No encontramos una cuenta con ese correo. ¿Ya te registraste?", "We couldn't find an account with that email. Have you signed up?", "Aucun compte avec cet e-mail. Tu t'es déjà inscrit ?", "Kein Konto mit dieser E-Mail gefunden. Hast du dich schon registriert?")
        : r.status === "too_many" ? tr(lang, ...TEAM_CODE_MSG.too_many)
        : tr(lang, "Ocurrió un problema al leer tu cuenta. Intenta de nuevo.", "There was a problem reading your account. Please try again.", "Un problème est survenu en lisant ton compte. Réessaie.", "Beim Lesen deines Kontos ist ein Problem aufgetreten. Bitte versuche es erneut."));
    })();
  };


  // Una visita por vista del Club; abrir el registro es «inicio de registro» (el registro completado lo cuenta el servidor).
  useEffect(() => {
    if (loading || verifyParams) return;
    sendHit("pageview", view === "dashboard" ? "perfil" : view);
    if (view === "register") sendHit("signup_start", view);
  }, [view, loading]);

  if (loading) {
    return (
      <div style={styles.loadingWrap}><style>{fontImport}</style><div style={styles.stamp} /></div>
    );
  }

  if (verifyParams) {
    return (
      <div style={styles.app}>
        <style>{fontImport}</style>
        <div style={styles.checkinWrap}>
          <div style={styles.checkinCard}>
            <div style={styles.checkinPoweredBy}>
              <span>Powered by</span>
              <img src={SYMBOL_DATA} alt="Xtudy" style={{ height: 14 }} />
              <span style={{ fontWeight: 700, color: colors.ink }}>Xtudy</span>
            </div>
            <p style={styles.formSub}>{tr(lang, "Abriendo la validación de Xtudy…", "Opening Xtudy validation…", "Ouverture de la validation Xtudy…", "Xtudy-Prüfung wird geöffnet…")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
    <div style={styles.app}>
      <style>{fontImport}</style>
      <AppHeader />

      {view === "landing" && (
        <Landing onStart={() => setView("register")} onAdmin={() => window.location.assign(UNIFIED_ADMIN_URL)} onLogin={() => { setLoginError(""); setLoginEmail(""); setView("login"); }} />
      )}

      {view === "register" && (
        <Register form={form} setForm={setForm} team={team} setTeam={setTeam} onCheckTeam={checkTeamCode} onSubmit={handleRegister} error={formError} onBack={() => setView("landing")} universities={universities} onGoToLogin={(email) => { setFormError(""); setLoginError(""); setLoginEmail(email); setView("login"); }} onClearError={() => setFormError("")} />
      )}

      {view === "login" && (
        <Login email={loginEmail} setEmail={setLoginEmail} onSubmit={handleLogin} error={loginError} onBack={() => setView("landing")} />
      )}

      {view === "dashboard" && account && (
        <Dashboard account={account} restaurants={restaurants} onChangeTier={changeTier} onLogout={logout} />
      )}


      <MeasureToggle />
    </div>
    </LangContext.Provider>
  );
}

function AppHeader() {
  return (
    <div className="page-container" style={styles.appHeader}>
      <div />
      <img src={WORDMARK_WHITE_DATA} alt="Xtudy" style={styles.headerWordmark} />
      <div style={styles.headerRight}>
        <a href="https://www.instagram.com/xtudy.mx" target="_blank" rel="noopener noreferrer" style={styles.igLink} aria-label="Instagram de Xtudy">
          <Instagram size={17} />
        </a>
        <LangToggle />
      </div>
    </div>
  );
}

function LangToggle() {
  const { lang, setLang } = useContext(LangContext);
  const langs = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
  ];
  return (
    <div style={styles.langToggle}>
      {langs.map((l) => (
        <button key={l.code} style={{ ...styles.langBtn, ...(lang === l.code ? styles.langBtnActive : {}) }} onClick={() => setLang(l.code)}>{l.label}</button>
      ))}
    </div>
  );
}

function FomoBanner() {
  const { lang } = useContext(LangContext);
  return (
    <div style={styles.fomoBanner}>
      <Sparkles size={14} color={colors.blue} />
      <span>
        {tr(lang,
          (<>Ya hay estudiantes de GDL ahorrando cada semana en restaurantes. <b>No te quedes fuera.</b></>),
          (<>Students in GDL are already saving every week at local restaurants. <b>Don't miss out.</b></>),
          (<>Des étudiants de GDL économisent déjà chaque semaine dans les restaurants. <b>Ne rate pas ça.</b></>),
          (<>Studenten in GDL sparen schon jede Woche in Restaurants. <b>Verpass es nicht.</b></>)
        )}
      </span>
    </div>
  );
}

function Landing({ onStart, onAdmin, onLogin }) {
  const { lang } = useContext(LangContext);
  return (
    <div className="page-container" style={styles.landingWrap}>
      <div style={styles.bigLogoWrap}>
        <div style={styles.bigWordmarkText}>
          <span style={{ fontWeight: 400 }}>Students</span><span style={{ fontWeight: 700, color: colors.blue }}>Club</span>
        </div>
      </div>
      <div style={styles.poweredByRow}>
        <div style={styles.poweredByBadgeSmall}>
          Powered by Xtudy
        </div>
      </div>
      <FomoBanner />
      <div style={styles.trianglePatch} />
      <div className="landing-grid" style={styles.landingContent}>
        <div style={styles.landingHero}>
          <div style={styles.eyebrow}>{tr(lang, "CLUB DE ESTUDIANTES", "STUDENT CLUB", "CLUB ÉTUDIANT", "STUDENTENCLUB")}</div>
          <h1 style={styles.h1}>
            {lang === "es"
              ? (<>Descuentos que <span style={styles.accentText}>sí</span> vas a usar.</>)
              : lang === "fr"
              ? (<>Des réductions que tu vas <span style={styles.accentText}>vraiment</span> utiliser.</>)
              : lang === "de"
              ? (<>Rabatte, die du <span style={styles.accentText}>wirklich</span> nutzt.</>)
              : (<>Discounts you'll <span style={styles.accentText}>actually</span> use.</>)}
          </h1>
          <p style={styles.heroSub}>
            {tr(lang,
              "Regístrate gratis y desbloquea descuentos reales en restaurantes de Guadalajara. Sé parte de la mejor comunidad estudiantil de México.",
              "Sign up for free and unlock real discounts at restaurants in Guadalajara. Be part of the best student community in Mexico.",
              "Inscris-toi gratuitement et débloque de vraies réductions dans les restaurants de Guadalajara. Rejoins la meilleure communauté étudiante du Mexique.",
              "Registriere dich kostenlos und schalte echte Rabatte in Restaurants in Guadalajara frei. Werde Teil der besten Studentencommunity Mexikos."
            )}
          </p>
          <div style={styles.unlimitedPill}>
            <Sparkles size={13} color={colors.blue} />
            {tr(lang, "Úsalos las veces que quieras, sin límite", "Use them as many times as you want, no limit", "Utilise-les autant de fois que tu veux, sans limite", "Nutze sie so oft du willst, ohne Limit")}
          </div>
          <div style={styles.heroBtnRow}>
            <button style={styles.ctaBtn} onClick={onStart}>
              {tr(lang, "Registrarme gratis", "Sign up for free", "M'inscrire gratuitement", "Kostenlos registrieren")} <ChevronRight size={18} strokeWidth={2.5} />
            </button>
            <button style={styles.loginLink} onClick={onLogin}>
              {tr(lang, "Ya tengo cuenta — iniciar sesión", "I already have an account — log in", "J'ai déjà un compte — se connecter", "Ich habe schon ein Konto — anmelden")}
            </button>
          </div>
        </div>

        <div style={styles.cardMock}>
          <div style={styles.membershipCard}>
            <div style={styles.cardPoweredBy}>Powered by</div>
            <div style={styles.cardTop}>
              <img src={WORDMARK_BLUE_DATA} alt="Xtudy" style={styles.cardBrandImg} />
              <Star size={18} color={colors.blue} fill={colors.blue} />
            </div>
            <div style={styles.cardName}>{tr(lang, "Tu nombre aquí", "Your name here", "Ton nom ici", "Dein Name hier")}</div>
            <div style={styles.cardUni}>{tr(lang, "Tu universidad", "Your university", "Ton université", "Deine Universität")}</div>
            <div style={styles.stampsRow}>
              {TIERS.map((t, i) => (
                <div key={t.id} style={{ ...styles.stampDot, ...(i === 0 ? styles.stampDotFilled : {}) }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.landingLinks}>
        <button style={styles.adminLink} onClick={onAdmin}><ShieldCheck size={13} /> {tr(lang, "Acceso administrador", "Admin access", "Accès administrateur", "Administratorzugang")}</button>
      </div>
    </div>
  );
}

function Login({ email, setEmail, onSubmit, error, onBack }) {
  const { lang } = useContext(LangContext);
  return (
    <div style={styles.centerWrap}>
      <div style={styles.panel}>
        <button style={styles.backLink} onClick={onBack}><X size={16} /></button>
        <img src={SYMBOL_DATA} alt="Xtudy" style={styles.panelSymbol} />
        <div style={styles.eyebrow}>{tr(lang, "BIENVENIDO DE VUELTA", "WELCOME BACK", "CONTENT DE TE REVOIR", "WILLKOMMEN ZURÜCK")}</div>
        <h2 style={styles.h2}>{tr(lang, "Iniciar sesión", "Log in", "Se connecter", "Anmelden")}</h2>
        <p style={styles.formSub}>
          {tr(lang,
            "Escribe el correo con el que te registraste — no necesitas contraseña.",
            "Type the email you registered with — no password needed.",
            "Écris l'e-mail avec lequel tu t'es inscrit — pas besoin de mot de passe.",
            "Gib die E-Mail-Adresse ein, mit der du dich registriert hast — kein Passwort nötig."
          )}
        </p>
        <div style={styles.form}>
          <label style={styles.label}>{tr(lang, "Correo electrónico", "Email", "E-mail", "E-Mail")}
            <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tr(lang, "tucorreo@ejemplo.com", "youremail@example.com", "tonemail@exemple.com", "deine-email@beispiel.com")} />
          </label>
          {error && <div style={styles.errorText}>{error}</div>}
          <button type="button" style={styles.ctaBtn} onClick={onSubmit}>{tr(lang, "Entrar", "Log in", "Entrer", "Anmelden")}</button>
        </div>
      </div>
    </div>
  );
}

const TEAM_KIND_NAME = { employee: ["Empleado Xtudy", "Xtudy Employee", "Employé Xtudy", "Xtudy-Mitarbeiter"], collaborator: ["Colaborador Xtudy", "Xtudy Collaborator", "Collaborateur Xtudy", "Xtudy-Partner"] };
const TEAM_CODE_MSG = {
  empty: ["Escribe tu código.", "Enter your code.", "Saisis ton code.", "Gib deinen Code ein."],
  invalid: ["Ese código no es válido. Revísalo o continúa con el registro normal.", "That code isn't valid. Check it or continue with the regular sign-up.", "Ce code n'est pas valide. Vérifie-le ou continue avec l'inscription normale.", "Dieser Code ist ungültig. Prüfe ihn oder fahre mit der normalen Registrierung fort."],
  expired: ["Ese código ya venció. Pide uno vigente a Xtudy o continúa con el registro normal.", "That code has expired. Ask Xtudy for a current one or continue with the regular sign-up.", "Ce code a expiré. Demande-en un valide à Xtudy ou continue avec l'inscription normale.", "Dieser Code ist abgelaufen. Frag Xtudy nach einem gültigen oder fahre mit der normalen Registrierung fort."],
  inactive: ["Ese código ya no está activo. Pide uno vigente a Xtudy o continúa con el registro normal.", "That code is no longer active. Ask Xtudy for a current one or continue with the regular sign-up.", "Ce code n'est plus actif. Demande-en un valide à Xtudy ou continue avec l'inscription normale.", "Dieser Code ist nicht mehr aktiv. Frag Xtudy nach einem gültigen oder fahre mit der normalen Registrierung fort."],
  too_many: ["Demasiados intentos. Espera un momento e inténtalo de nuevo.", "Too many attempts. Wait a moment and try again.", "Trop de tentatives. Attends un moment et réessaie.", "Zu viele Versuche. Warte kurz und versuche es erneut."],
  error: ["No pudimos comprobar el código. Revisa tu conexión e intenta de nuevo.", "We couldn't check the code. Check your connection and try again.", "Impossible de vérifier le code. Vérifie ta connexion et réessaie.", "Der Code konnte nicht geprüft werden. Prüfe deine Verbindung und versuche es erneut."],
};

// «¿Eres parte del equipo Xtudy?»: opcional y visible desde el inicio del registro. Con un código válido, el registro
// ya no pide datos de estudiante. El código se valida en el servidor (nunca está en esta app).
function TeamCodeBox({ team, setTeam, onCheck, lang }) {
  const T = (...a) => tr(lang, ...a);
  if (team.kind) return (
    <div style={styles.teamOk} role="status">
      <strong>✓ {T("Código de equipo válido", "Valid team code", "Code d'équipe valide", "Gültiger Team-Code")} · {T(...TEAM_KIND_NAME[team.kind])}</strong>
      <span>{T("Solo necesitamos tus datos para crear tu cuenta y tu tarjeta. Tendrás los descuentos de Explorador y de Residente.", "We only need your details to create your account and card. You'll get both Explorer and Resident discounts.", "Il nous faut seulement tes informations pour créer ton compte et ta carte. Tu auras les réductions Explorateur et Résident.", "Wir brauchen nur deine Daten für dein Konto und deine Karte. Du bekommst die Rabatte für Entdecker und Bewohner.")}</span>
      <button type="button" style={styles.teamLink} onClick={() => setTeam({ open: false, code: "", kind: null, status: "", busy: false })}>{T("No soy del equipo: registro de estudiante", "I'm not on the team: student sign-up", "Je ne fais pas partie de l'équipe : inscription étudiant", "Ich gehöre nicht zum Team: Studierenden-Registrierung")}</button>
    </div>
  );
  if (!team.open) return (
    <button type="button" style={styles.teamToggle} onClick={() => setTeam((t) => ({ ...t, open: true }))}>
      {T("¿Eres parte del equipo Xtudy? Ingresa tu código.", "Are you part of the Xtudy team? Enter your code.", "Tu fais partie de l'équipe Xtudy ? Saisis ton code.", "Gehörst du zum Xtudy-Team? Gib deinen Code ein.")}
    </button>
  );
  const msg = team.status && team.status !== "ok" ? TEAM_CODE_MSG[team.status] || TEAM_CODE_MSG.error : null;
  return (
    <form style={styles.teamBox} onSubmit={(e) => { e.preventDefault(); if (!team.busy) onCheck(); }}>
      <label style={styles.label} htmlFor="team-code">{T("Código de equipo Xtudy", "Xtudy team code", "Code d'équipe Xtudy", "Xtudy-Team-Code")}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input id="team-code" style={{ ...styles.input, flex: 1 }} value={team.code} onChange={(e) => setTeam((t) => ({ ...t, code: e.target.value, status: "" }))} autoComplete="off" autoCapitalize="characters" maxLength={40} aria-invalid={Boolean(msg)} />
        <button type="submit" style={{ ...styles.ctaBtn, width: "auto", marginTop: 0, padding: "0 18px" }} disabled={team.busy}>{team.busy ? "…" : T("Validar", "Check", "Valider", "Prüfen")}</button>
      </div>
      {msg && <div style={styles.errorText} role="alert">{T(...msg)}</div>}
      <button type="button" style={styles.teamLink} onClick={() => setTeam({ open: false, code: "", kind: null, status: "", busy: false })}>{T("Continuar con el registro normal", "Continue with the regular sign-up", "Continuer avec l'inscription normale", "Mit der normalen Registrierung fortfahren")}</button>
    </form>
  );
}

function Register({ form, setForm, team, setTeam, onCheckTeam, onSubmit, error, onBack, universities, onGoToLogin, onClearError }) {
  const { lang } = useContext(LangContext);
  const isTeam = Boolean(team && team.kind);
  const isPro = !isTeam && form.profile === "professional";
  const publicas = universities.filter((u) => u.tipo === "Pública");
  const privadas = universities.filter((u) => u.tipo === "Privada");
  const otras = universities.filter((u) => u.tipo === "Otra");
  return (
    <div style={styles.centerWrap}>
      <div style={styles.panel}>
        <button style={styles.backLink} onClick={onBack}><X size={16} /></button>
        <img src={SYMBOL_DATA} alt="Xtudy" style={styles.panelSymbol} />
        <div style={styles.eyebrow}>{tr(lang, "PASO 1 DE 1", "STEP 1 OF 1", "ÉTAPE 1 SUR 1", "SCHRITT 1 VON 1")}</div>
        <h2 style={styles.h2}>{tr(lang, "Crea tu cuenta", "Create your account", "Crée ton compte", "Erstelle dein Konto")}</h2>
        {!isTeam && <p style={styles.formSub}>{tr(lang,
          "Toma menos de un minuto. Empiezas como Explorador al instante — y si vives con Xtudy, activas tu nivel Residente ahora mismo.",
          "Takes less than a minute. You start as an Explorer right away — and if you live with Xtudy, you activate your Resident tier now.",
          "Ça prend moins d'une minute. Tu commences comme Explorateur tout de suite — et si tu vis avec Xtudy, active ton niveau Résident dès maintenant.",
          "Dauert weniger als eine Minute. Du startest sofort als Entdecker — und wenn du bei Xtudy wohnst, aktivierst du jetzt deine Bewohner-Stufe."
        )}</p>}
        <TeamCodeBox team={team} setTeam={setTeam} onCheck={onCheckTeam} lang={lang} />
        <div style={styles.form}>
          {!isTeam && (
            <div style={styles.label} role="radiogroup" aria-label={tr(lang, "Tu perfil", "Your profile", "Ton profil", "Dein Profil")}>
              {tr(lang, "Tu perfil", "Your profile", "Ton profil", "Dein Profil")}
              <div style={styles.radioRow}>
                <button type="button" role="radio" aria-checked={!isPro} style={{ ...styles.radioBtn, ...(!isPro ? styles.radioBtnActive : {}) }} onClick={() => setForm({ ...form, profile: "student", proError: "" })}>{tr(lang, "Estudiante", "Student", "Étudiant", "Studierende")}</button>
                <button type="button" role="radio" aria-checked={isPro} style={{ ...styles.radioBtn, ...(isPro ? styles.radioBtnActive : {}) }} onClick={() => setForm({ ...form, profile: "professional" })}>{tr(lang, "Profesionista", "Professional", "Professionnel", "Berufstätig")}</button>
              </div>
            </div>
          )}
          <label style={styles.label}>{tr(lang, "Nombre completo", "Full name", "Nom complet", "Vollständiger Name")}
            <input style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={tr(lang, "Ej. Ana Torres", "E.g. Ana Torres", "Ex. Ana Torres", "Z.B. Ana Torres")} />
          </label>
          <label style={styles.label}>{tr(lang, "Correo electrónico", "Email", "E-mail", "E-Mail")}
            <input style={styles.input} type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if (error === "duplicate-email") onClearError(); }} placeholder={tr(lang, "tucorreo@ejemplo.com", "youremail@example.com", "tonemail@exemple.com", "deine-email@beispiel.com")} />
          </label>
          <label style={styles.label}>{tr(lang, "Teléfono", "Phone", "Téléphone", "Telefon")}
            <div style={styles.phoneRow}>
              <select style={styles.countrySelect} value={form.countryCode} onChange={(e) => setForm({ ...form, countryCode: e.target.value })}>
                {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <input style={{ ...styles.input, flex: 1 }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={tr(lang, "Número de teléfono", "Phone number", "Numéro de téléphone", "Telefonnummer")} />
            </div>
          </label>
          {isPro && (
            <label style={styles.label}>{tr(lang, "Código de residente profesionista", "Resident professional code", "Code résident professionnel", "Code für berufstätige Bewohner")}
              <input style={styles.input} value={form.proCode} onChange={(e) => setForm({ ...form, proCode: e.target.value, proError: "" })} autoComplete="off" autoCapitalize="characters" maxLength={40} aria-invalid={Boolean(form.proError)} placeholder={tr(lang, "Pídelo a tu administración Xtudy", "Ask your Xtudy administration", "Demande-le à ton administration Xtudy", "Frag deine Xtudy-Verwaltung danach")} />
              {form.proError && <span role="alert" style={styles.errorText}>{tr(lang, ...(TEAM_CODE_MSG[form.proError] || TEAM_CODE_MSG.error)).replace(/ o continúa con el registro normal\.| or continue with the regular sign-up\.| ou continue avec l'inscription normale\.| oder fahre mit der normalen Registrierung fort\./, ".")} {tr(lang, "Tus datos se conservan; corrige el código o elige «Estudiante».", "Your details are kept; fix the code or choose “Student”.", "Tes données sont conservées ; corrige le code ou choisis « Étudiant ».", "Deine Angaben bleiben erhalten; korrigiere den Code oder wähle „Studierende“.")}</span>}
              <span style={{ ...styles.partnerFine, margin: 0 }}>{tr(lang, "Sin universidad ni matrícula. Activa tu membresía de residente profesionista; no crea una reserva.", "No university or student ID needed. It activates your resident professional membership; it doesn't create a booking.", "Ni université ni numéro d'étudiant. Il active ton adhésion de résident professionnel ; il ne crée pas de réservation.", "Keine Universität oder Matrikelnummer nötig. Er aktiviert deine Mitgliedschaft als berufstätiger Bewohner; es entsteht keine Buchung.")}</span>
            </label>
          )}
          {!isTeam && !isPro && <>
          <label style={styles.label}>{tr(lang, "Matrícula / ID de estudiante", "Student ID", "Numéro d'étudiant", "Studentenausweis-Nummer")}
            <input style={styles.input} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder={tr(lang, "Ej. A01234567", "E.g. A01234567", "Ex. A01234567", "Z.B. A01234567")} />
          </label>
          <label style={styles.label}>{tr(lang, "Universidad", "University", "Université", "Universität")}
            <select style={styles.input} value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })}>
              <optgroup label={tr(lang, "Públicas", "Public", "Publiques", "Öffentlich")}>{publicas.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}</optgroup>
              <optgroup label={tr(lang, "Privadas", "Private", "Privées", "Privat")}>{privadas.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}</optgroup>
              <optgroup label={tr(lang, "Otra", "Other", "Autre", "Andere")}>{otras.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}</optgroup>
            </select>
          </label>
          <label style={styles.label}>{tr(lang, "¿Eres cliente de Xtudy?", "Are you an Xtudy tenant?", "Es-tu locataire chez Xtudy ?", "Bist du Xtudy-Bewohner?")}
            <div style={styles.radioRow}>
              <button type="button" style={{ ...styles.radioBtn, ...(form.isXtudy === "si" ? styles.radioBtnActive : {}) }} onClick={() => setForm({ ...form, isXtudy: "si" })}>{tr(lang, "Sí", "Yes", "Oui", "Ja")}</button>
              <button type="button" style={{ ...styles.radioBtn, ...(form.isXtudy === "no" ? styles.radioBtnActive : {}) }} onClick={() => setForm({ ...form, isXtudy: "no" })}>No</button>
            </div>
          </label>
          {form.isXtudy === "si" && (
            <label style={styles.label}>{tr(lang, "Código de residente Xtudy", "Xtudy resident code", "Code résident Xtudy", "Xtudy-Bewohner-Code")}
              <input style={styles.input} value={form.residentCode} onChange={(e) => setForm({ ...form, residentCode: e.target.value })} placeholder={tr(lang, "Pídelo a tu administración Xtudy", "Ask your Xtudy administration", "Demande-le à ton administration Xtudy", "Frag deine Xtudy-Verwaltung danach")} />
            </label>
          )}
          </>}
          <p style={styles.termsNotice}>
            {tr(lang, "Al crear tu cuenta, aceptas nuestros ", "By creating your account, you accept our ", "En créant ton compte, tu acceptes nos ", "Mit der Erstellung deines Kontos akzeptierst du unsere ")}
            <a href={`${import.meta.env.BASE_URL}terminos-y-condiciones.pdf`} target="_blank" rel="noopener noreferrer" style={styles.termsLink}>
              {tr(lang, "Términos y Condiciones y el Aviso de Privacidad", "Terms and Conditions and Privacy Notice", "Conditions Générales et l'Avis de Confidentialité", "Nutzungsbedingungen und Datenschutzhinweis")}
            </a>
            {tr(lang, " de Students Club.", " of Students Club.", " de Students Club.", " von Students Club.")}
          </p>
          {error === "duplicate-email" ? (
            <div style={styles.duplicateEmailBox}>
              <p style={styles.duplicateEmailText}>
                {tr(lang, "Ya tienes una cuenta con este correo.", "You already have an account with this email.", "Tu as déjà un compte avec cet e-mail.", "Du hast bereits ein Konto mit dieser E-Mail-Adresse.")}
              </p>
              <button type="button" style={styles.ctaBtn} onClick={() => onGoToLogin(form.email.trim())}>
                {tr(lang, "Iniciar sesión", "Log in", "Se connecter", "Anmelden")}
              </button>
            </div>
          ) : (
            <>
              {error && <div style={styles.errorText}>{error}</div>}
              <button type="button" style={styles.ctaBtn} onClick={onSubmit} disabled={Boolean(team && team.busy)}>{team && team.busy ? "…" : tr(lang, "Crear mi cuenta", "Create my account", "Créer mon compte", "Mein Konto erstellen")}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}




// ---------------------------------------------------------------------------
// Catálogo de beneficios: tarjeta compacta + ventana de detalles
// ---------------------------------------------------------------------------
// Los códigos promocionales no viajan en la lista pública: se piden al servidor del sitio principal, que comprueba
// la cuenta y el nivel del miembro antes de entregarlos.
const PLATFORM_URL = (import.meta.env.VITE_PLATFORM_URL || "https://www.xtudyclub.com").replace(/\/$/, "");

// Medición anónima del Club: automática, sin preguntas y sin datos personales. Solo la sección, la vista, el dominio de
// origen en la entrada, si la vista es la ENTRADA al sitio y un identificador ALEATORIO de este navegador (`xtudy_vid`,
// almacenamiento local; no se deriva de IP ni del dispositivo y el servidor solo guarda su huella). Respeta «No medir»,
// GPC y Do Not Track. Tráfico interno: `?no_medir=1` / `?medir=1`, la cookie sin identificador `xtudy_excluir=1` de
// *.xtudyclub.com (la pone el panel) y las cuentas marcadas «Cuenta interna: excluir de analítica».
const MEASURE_KEY = "xtudy_medicion";
const VID_KEY = "xtudy_vid";
const EXCL_KEY = "xtudy_excluir";
const OWN_HOSTS = /(^|\.)xtudyclub\.com$|(^|\.)students-club\.com$|^localhost$/;
const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch {} };
function visitorId() {
  try {
    let v = localStorage.getItem(VID_KEY);
    if (!v || !/^[A-Za-z0-9_-]{16,64}$/.test(v)) {
      v = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(VID_KEY, v);
    }
    return v;
  } catch { return null; }
}
function excludedReason() {
  const v = lsGet(EXCL_KEY);
  if (v === "browser" || v === "admin" || v === "internal_account") return v;
  if (v !== "permitido" && document.cookie.split("; ").includes(`${EXCL_KEY}=1`)) return "browser";
  return null;
}
const measureOff = () => { if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") return true; return lsGet(MEASURE_KEY) === "no" || excludedReason() !== null; };
function beacon(body) {
  try { if (!navigator.sendBeacon?.(`${PLATFORM_URL}/api/t`, new Blob([body], { type: "text/plain" }))) fetch(`${PLATFORM_URL}/api/t`, { method: "POST", body, keepalive: true, mode: "no-cors" }); } catch {}
}
// Excluir / volver a incluir este navegador. Solo viaja el identificador aleatorio (nunca correo ni nombre).
function setExclusion(on, why = "browser") {
  lsSet(EXCL_KEY, on ? why : "permitido");
  const host = window.location.hostname;
  const domain = /(^|\.)xtudyclub\.com$/.test(host) ? "; domain=.xtudyclub.com" : /(^|\.)students-club\.com$/.test(host) ? "; domain=.students-club.com" : "";
  document.cookie = `${EXCL_KEY}=${on ? "1" : ""}; path=/; max-age=${on ? 63072000 : 0}; SameSite=Lax${domain}${window.location.protocol === "https:" ? "; Secure" : ""}`;
  const v = visitorId();
  if (v) beacon(JSON.stringify({ k: on ? "exclude" : "include", v, why, u: `${window.location.origin}/` }));
}
// Cuenta interna (decidido en el servidor): excluir; si dejó de serlo, volver a medir solo lo que esta marca excluyó.
function applyInternalAccount(internal) {
  const cur = lsGet(EXCL_KEY);
  if (internal && cur !== "internal_account" && cur !== "admin" && cur !== "browser") setExclusion(true, "internal_account");
  else if (!internal && cur === "internal_account") setExclusion(false);
}
(function applyQueryFlag() {
  try {
    const u = new URL(window.location.href);
    const off = u.searchParams.get("no_medir") === "1", on = u.searchParams.get("medir") === "1";
    if (!off && !on) return;
    setExclusion(off);
    u.searchParams.delete("no_medir"); u.searchParams.delete("medir");
    window.history.replaceState(window.history.state, "", u.pathname + u.search + u.hash);
  } catch {}
})();
let firstHit = true;
function sendHit(kind, view) {
  if (measureOff()) return;
  let r = "", external = true;
  try { if (document.referrer) { const ref = new URL(document.referrer); r = ref.origin; external = !OWN_HOSTS.test(ref.hostname); } } catch {}
  const entry = kind === "pageview" && firstHit && external;
  if (kind === "pageview") firstHit = false;
  const u = new URL(window.location.origin + window.location.pathname.replace(/\/$/, "") + (view && view !== "landing" ? `/${view}` : ""));
  const q = new URLSearchParams(window.location.search);
  for (const k of ["utm_source", "utm_medium", "utm_campaign"]) if (q.get(k)) u.searchParams.set(k, q.get(k));
  const v = visitorId();
  beacon(JSON.stringify({ k: kind, s: "club", u: u.toString(), r: entry ? r : "", e: entry ? 1 : 0, ...(v ? { v } : {}) }));
}
// Control discreto (no es una pregunta): desactivar o reactivar la medición anónima en este navegador.
function MeasureToggle() {
  const { lang } = useContext(LangContext);
  const [off, setOff] = useState(null);
  useEffect(() => { setOff(measureOff()); }, []);
  if (off === null) return null;
  const flip = () => { lsSet(MEASURE_KEY, off ? null : "no"); if (off && excludedReason()) setExclusion(false); setOff(measureOff()); };
  return (
    <p style={{ fontSize: 12, color: "#8ea4b8", textAlign: "center", margin: "18px 0 8px" }}>
      {off ? tr(lang, "La medición anónima está desactivada en este navegador.", "Anonymous measurement is turned off in this browser.", "La mesure anonyme est désactivée dans ce navigateur.", "Die anonyme Messung ist in diesem Browser deaktiviert.")
           : tr(lang, "Medimos visitas de forma anónima con un identificador aleatorio de este navegador, sin cookies de seguimiento ni datos personales.", "We measure visits anonymously with a random identifier stored in this browser, without tracking cookies or personal data.", "Nous mesurons les visites de façon anonyme avec un identifiant aléatoire de ce navigateur, sans cookies de suivi ni données personnelles.", "Wir messen Besuche anonym mit einer zufälligen Kennung dieses Browsers, ohne Tracking-Cookies oder personenbezogene Daten.")}{" "}
      <button type="button" onClick={flip} style={{ background: "none", border: 0, padding: 0, color: "inherit", textDecoration: "underline", cursor: "pointer", font: "inherit" }}>
        {off ? tr(lang, "Volver a medir", "Measure again", "Mesurer à nouveau", "Wieder messen") : tr(lang, "No medir mis visitas", "Don't measure my visits", "Ne pas mesurer mes visites", "Meine Besuche nicht messen")}
      </button>
    </p>
  );
}
const normText = (t) => (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
// «1. Haz esto 2. Haz aquello» → pasos. Si no hay numeración, el texto completo es un paso.
function toSteps(text) {
  const t = (text || "").trim();
  if (!t) return [];
  const parts = t.split(/(?:^|\s)\d{1,2}[.)]\s+/).map((x) => x.trim()).filter(Boolean);
  return parts.length >= 2 ? parts : [t];
}
// «Pasos de activación» y «Cómo utilizarlo» en una sola secuencia, sin repetir lo que ya se dijo.
function mergedSteps(r, lang) {
  const out = [];
  for (const step of [...toSteps(txt(r, "activationSteps", lang)), ...toSteps(txt(r, "howToUse", lang))]) {
    const n = normText(step);
    if (!n) continue;
    const dup = out.findIndex((o) => normText(o).includes(n) || n.includes(normText(o)));
    if (dup === -1) out.push(step);
    else if (n.length > normText(out[dup]).length) out[dup] = step;
  }
  return out;
}
// --- Promociones por comercio (V19) ---------------------------------------------------------------------------
// Un comercio tiene una sola ficha y una o varias promociones (para exploradores o para residentes y colaboradores).
// La lista pública NO trae datos de canje de las promociones restringidas: el servidor los entrega solo a quien tiene acceso.
// Un registro anterior (sin «promotions») se convierte aquí en una promoción, sin perder nada.
function promotionsOf(r) {
  if (Array.isArray(r.promotions)) return r.promotions;
  const tier = r.tier === "free" ? "guest" : r.tier;
  return [{
    id: `${r.id}-p1`, legacy: true, audience: tier === "resident" ? "resident" : "guest", status: tier === "soon" ? "soon" : "active",
    benefitType: r.benefitType, discountPercent: r.discountPercent, discount: r.discount, validUntil: r.validUntil, promoHours: r.promoHours,
    i18n: r.i18n || {}, hasPromoCode: Boolean(r.hasPromoCode || r.promoCode),
  }];
}
const todayMx = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(new Date());
const promoIsLive = (p) => p.status === "active" && !(/^\d{4}-\d{2}-\d{2}$/.test(p.validUntil || "") && p.validUntil < todayMx());
const canUsePromo = (level, p) => p.audience === "guest" || level === "resident";
const promoTitle = (p, lang) => txt(p, "title", lang) || formatDiscount(p, lang);
const promoHoursOf = (r, p, lang) => txt(p, "hours", lang) || trHours(p.promoHours || (p.legacy ? r.promoHours : null), lang);
const AUDIENCE_LOCK = ["Residentes y equipo Xtudy", "Residents & Xtudy team", "Résidents et équipe Xtudy", "Bewohner & Xtudy-Team"];

// Una sola restricción esencial en la tarjeta (el resto va en los detalles).
function essentialRestriction(r, p, lang) {
  if (p && p.audience === "resident") return tr(lang, ...AUDIENCE_LOCK);
  if (partnerKind(r) !== "online" && r.isFranchise) {
    const b = branchesFor(r, p);
    if (b.length === 1) return tr(lang, `Sucursal ${b[0].name}`, `${b[0].name} branch`, `Succursale ${b[0].name}`, `Filiale ${b[0].name}`);
  }
  return "";
}
// Sucursales donde aplica la promoción (vacío = todas las del comercio).
function branchesFor(r, p) {
  const all = getBranches(r);
  const names = (p && p.branchNames) || [];
  return names.length ? all.filter((b) => names.includes(b.name)) : all;
}
const mainCategory = (r, lang) => {
  const labels = CATEGORY_LABELS[r.categoryId];
  return labels ? tr(lang, ...labels) : (r.category || "");
};

function PartnerLogo({ r, size = 44 }) {
  if (r.logoUrl) return <img src={r.logoUrl} alt="" style={{ ...styles.benefitLogo, height: size, maxWidth: size * 2.2 }} />;
  const initials = (r.name || "").replace(/[^\p{L}\p{N} ]/gu, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <span aria-hidden style={{ ...styles.benefitMono, width: size, height: size }}>{initials}</span>;
}

function BenefitCard({ r, p, more, lang, onPrimary, onDetails }) {
  const online = partnerKind(r) === "online";
  const restriction = essentialRestriction(r, p, lang);
  return (
    <article style={styles.benefitCard}>
      <div style={styles.benefitTop}>
        <PartnerLogo r={r} />
        <div style={{ minWidth: 0 }}>
          <div style={styles.restCategory}>{mainCategory(r, lang)}</div>
          <h4 style={styles.benefitName}>{r.name}</h4>
        </div>
      </div>
      <div style={styles.benefitDeal}>{formatDiscount(p, lang)}</div>
      <div style={styles.benefitChipRow}>
        {restriction && <span style={styles.benefitChip}>{restriction}</span>}
        {more > 0 && <span style={{ ...styles.benefitChip, marginLeft: restriction ? 6 : 0, background: "#F1F5F9" }}>{tr(lang, `+${more} promoción${more > 1 ? "es" : ""}`, `+${more} more`, `+${more} autre${more > 1 ? "s" : ""}`, `+${more} weitere`)}</span>}
      </div>
      <div style={styles.benefitActions}>
        <button type="button" style={styles.benefitPrimary} onClick={onPrimary}>
          {online ? <>{tr(lang, "Usar beneficio", "Use perk", "Utiliser l'avantage", "Vorteil nutzen")} <ChevronRight size={14} /></> : <><QrCode size={14} /> {tr(lang, "Mostrar QR", "Show QR", "Afficher le QR", "QR anzeigen")}</>}
        </button>
        <button type="button" style={styles.benefitSecondary} onClick={onDetails}>{tr(lang, "Ver detalles", "View details", "Voir les détails", "Details ansehen")}</button>
      </div>
    </article>
  );
}

// Tarjeta sin canje: «solo para residentes y colaboradores» (bloqueada por tu nivel) o «Próximamente» (aún no se puede usar).
// Mostrar el logo no habilita ningún código, QR ni canje.
function LockedCard({ r, p, kind, lang }) {
  const soon = kind === "soon";
  return (
    <article style={styles.lockedCard} aria-label={`${r.name} · ${soon ? tr(lang, "Próximamente", "Coming soon", "Bientôt", "Demnächst") : tr(lang, ...AUDIENCE_LOCK)}`}>
      <div style={styles.lockedLogoBox}>{r.logoUrl ? <img src={r.logoUrl} alt="" style={styles.lockedLogoImg} /> : <PartnerLogo r={r} size={40} />}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={styles.restCategory}>{mainCategory(r, lang)}</div>
        <div style={styles.lockedName}>{r.name}</div>
        {!soon && p && <div style={styles.lockedNotice}>{formatDiscount(p, lang)}</div>}
        <div style={{ marginTop: 6 }}>
          {soon
            ? <span style={styles.tagSoon}>{tr(lang, "Próximamente", "Coming soon", "Bientôt disponible", "Demnächst")}</span>
            : <span style={styles.tagLocked}><Lock size={11} /> {tr(lang, ...AUDIENCE_LOCK)}</span>}
        </div>
      </div>
      {soon && <Lock size={14} color="#9AAEC0" aria-hidden style={{ flexShrink: 0, alignSelf: "flex-start" }} />}
    </article>
  );
}

function useNarrow() {
  const q = "(max-width: 640px)";
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const f = () => setNarrow(m.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  return narrow;
}

// Detalles de canje de una promoción: se piden al servidor, que comprueba la cuenta y el nivel en CADA apertura.
function useRedeemDetails(r, p, level, account, preloaded) {
  const allowed = p && canUsePromo(level, p);
  const ready = p && allowed && preloaded ? preloaded[`${r.id}:${p.id}`] : null;
  const [st, setSt] = useState(() => (ready ? { state: "ok", data: ready } : { state: "idle", data: null }));
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!p || !allowed) { setSt({ state: allowed === false ? "denied" : "idle", data: null }); return; }
    if (ready && tick === 0) { setSt({ state: "ok", data: ready }); return; }
    let alive = true;
    setSt({ state: "loading", data: null });
    fetch(`${PLATFORM_URL}/api/club/benefit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: account.email, memberId: account.memberId, id: r.id, promotionId: p.legacy ? undefined : p.id }) })
      .then(async (res) => {
        const j = await res.json().catch(() => ({}));
        if (!alive) return;
        if (res.ok) setSt({ state: "ok", data: j });
        else setSt({ state: res.status === 403 ? "denied" : "error", data: null });
      })
      .catch(() => alive && setSt({ state: "error", data: null }));
    return () => { alive = false; };
  }, [r.id, p && p.id, allowed, account.email, account.memberId, tick, ready]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...st, retry: () => setTick((t) => t + 1) };
}

function BenefitDetails({ r, promos, initialId, mode, lang, level, account, preloaded, onClose }) {
  const narrow = useNarrow();
  const closeRef = React.useRef(null);
  const boxRef = React.useRef(null);
  const [selId, setSelId] = useState(initialId);
  const [copied, setCopied] = useState(false);
  const base = promos.find((x) => x.id === selId) || promos[0];
  const allowed = canUsePromo(level, base);
  const redeem = useRedeemDetails(r, base, level, account, preloaded);
  // Con acceso confirmado, los textos completos vienen del servidor; mientras tanto, el aviso público.
  const p = redeem.state === "ok" && redeem.data && redeem.data.i18n ? { ...base, i18n: { ...base.i18n, ...redeem.data.i18n } } : base;
  const online = partnerKind(r) === "online";
  const physical = !online;
  const code = redeem.state === "ok" ? (redeem.data.promoCode || "") : "";
  const link = redeem.state === "ok" ? (redeem.data.benefitUrl || redeem.data.websiteUrl || "") : "";
  // QR de ESTA promoción en ESTE comercio: abre la confirmación directa de Xtudy (lo entrega el servidor solo con acceso).
  const qrUrl = physical && redeem.state === "ok" && redeem.data.qr !== false ? (redeem.data.qrUrl || "") : "";

  // Bloquea el fondo (la página no se mueve), enfoca «Cerrar», Esc cierra y Tab no sale de la ventana.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "Tab" && boxRef.current) {
        const f = boxRef.current.querySelectorAll('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const copy = () => navigator.clipboard?.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {});
  const steps = allowed ? mergedSteps(p, lang) : [];
  const stepsShown = [txtShown(p, "activationSteps", lang), txtShown(p, "howToUse", lang)].find((x) => x.text) || { lang: null };
  const benefitShown = txtShown(p, "benefit", lang);
  const conditions = allowed ? txtShown(p, "conditions", lang) : { text: "" };
  const coverage = allowed ? txtShown(p, "coverage", lang) : { text: "" };
  const branches = branchesFor(r, p);
  const hours = allowed ? promoHoursOf(r, p, lang) : "";
  const restriction = essentialRestriction(r, p, lang);
  const T = (es, en, fr, de) => tr(lang, es, en, fr, de);

  return (
    <div style={styles.modalOverlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={boxRef} role="dialog" aria-modal="true" aria-labelledby="benefit-title" style={narrow ? styles.sheet : styles.modal}>
        <div style={styles.modalHead}>
          <PartnerLogo r={r} size={48} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={styles.restCategory}>{categoryText(r, lang)}</div>
            <h3 id="benefit-title" style={styles.modalTitle}>{r.name}</h3>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} style={styles.modalClose} aria-label={T("Cerrar", "Close", "Fermer", "Schließen")}><X size={20} /></button>
        </div>
        <div style={styles.modalBody}>
          {promos.length > 1 && (
            <section style={styles.modalSection}>
              <h4 style={styles.modalH}>{T("Elige una promoción", "Choose a promotion", "Choisis une promotion", "Wähle ein Angebot")}</h4>
              <div role="radiogroup" style={{ display: "grid", gap: 6 }}>
                {promos.map((x) => {
                  const on = x.id === base.id, ok = canUsePromo(level, x);
                  return (
                    <button key={x.id} type="button" role="radio" aria-checked={on} onClick={() => setSelId(x.id)} style={{ ...styles.promoChoice, ...(on ? styles.promoChoiceOn : {}) }}>
                      <span style={{ flex: 1, textAlign: "left" }}>{promoTitle(x, lang)}{txt(x, "title", lang) ? <span style={styles.promoChoiceSub}> · {formatDiscount(x, lang)}</span> : null}</span>
                      {!ok && <span style={styles.tagLocked}><Lock size={11} /> {T(...AUDIENCE_LOCK)}</span>}
                    </button>
                  );
                })}
              </div>
              <p style={styles.partnerFine}>{T("Son alternativas: elige una por visita. No se acumulan, salvo que sus condiciones lo indiquen.", "These are alternatives: choose one per visit. They can't be combined unless their conditions say so.", "Ce sont des alternatives : choisis-en une par visite. Elles ne se cumulent pas, sauf si leurs conditions l'indiquent.", "Das sind Alternativen: wähle eine pro Besuch. Sie sind nicht kombinierbar, außer die Bedingungen erlauben es.")}</p>
            </section>
          )}

          {txt(p, "title", lang) && <div style={styles.modalH}>{txt(p, "title", lang)}</div>}
          <div style={styles.modalDeal}>{formatDiscount(p, lang)}{benefitShown.text && p.benefitType && p.benefitType !== "percent" ? <OrigLang shown={benefitShown} lang={lang} /> : null}</div>
          {restriction && <div style={styles.benefitChipRow}><span style={styles.benefitChip}>{restriction}</span></div>}

          {!allowed && (
            <section style={styles.lockedBox}>
              <Lock size={16} />
              <span>{T("Esta promoción es para residentes y para el equipo Xtudy. Si eres parte del equipo, ingresa tu código en tu perfil para desbloquearla.", "This promotion is for residents and the Xtudy team. If you're on the team, enter your code in your profile to unlock it.", "Cette promotion est réservée aux résidents et à l'équipe Xtudy. Si tu fais partie de l'équipe, saisis ton code dans ton profil pour la débloquer.", "Dieses Angebot ist für Bewohner und das Xtudy-Team. Wenn du zum Team gehörst, gib deinen Code in deinem Profil ein, um es freizuschalten.")}</span>
            </section>
          )}

          {allowed && redeem.state === "loading" && <p style={styles.modalText}>{T("Comprobando tu acceso…", "Checking your access…", "Vérification de ton accès…", "Dein Zugang wird geprüft…")}</p>}
          {allowed && redeem.state === "error" && (
            <p style={styles.modalText}>{T("No pudimos confirmar tu acceso. Intenta de nuevo en un momento.", "We couldn't confirm your access. Please try again in a moment.", "Impossible de confirmer ton accès. Réessaie dans un instant.", "Dein Zugang konnte nicht bestätigt werden. Bitte versuche es gleich noch einmal.")}{" "}
              <button type="button" style={{ ...styles.benefitSecondary, display: "inline-flex", minHeight: 32 }} onClick={redeem.retry}>{T("Reintentar", "Retry", "Réessayer", "Erneut versuchen")}</button></p>
          )}
          {allowed && redeem.state === "denied" && <p style={styles.modalText}>{T("Esta promoción es solo para miembros con el nivel requerido.", "This promotion is only for members with the required tier.", "Cette promotion est réservée aux membres du niveau requis.", "Dieses Angebot ist nur für Mitglieder mit der erforderlichen Stufe.")}</p>}

          {qrUrl && mode === "qr" && <QrBlock key={`qr-${base.id}`} url={qrUrl} T={T} label={`${r.name} · ${promoTitle(p, lang)}`} onShown={() => qrShown(account, r.id, base.id)} />}

          {code && (
            <section style={styles.modalSection}>
              <h4 style={styles.modalH}>{T("Código promocional", "Promo code", "Code promo", "Gutscheincode")}</h4>
              <div style={styles.codeRow}>
                <code style={styles.codeBox}>{code}</code>
                <button type="button" style={styles.benefitSecondary} onClick={copy}>{copied ? T("¡Copiado!", "Copied!", "Copié !", "Kopiert!") : T("Copiar", "Copy", "Copier", "Kopieren")}</button>
              </div>
            </section>
          )}

          {online && /^https?:\/\//.test(link) && (
            <a href={link} target="_blank" rel="noopener noreferrer" style={styles.goBtn}>
              {T("Ir al servicio", "Go to the service", "Accéder au service", "Zum Dienst")} <ChevronRight size={16} />
            </a>
          )}

          {steps.length > 0 && (
            <section style={styles.modalSection}>
              <h4 style={styles.modalH}>{T("Cómo utilizarlo", "How to use it", "Comment l'utiliser", "So nutzt du es")}<OrigLang shown={stepsShown} lang={lang} /></h4>
              {steps.length > 1 ? <ol style={styles.stepList}>{steps.map((st, i) => <li key={i}>{st}</li>)}</ol> : <p style={styles.modalText}>{steps[0]}</p>}
            </section>
          )}

          {allowed && (conditions.text || p.validUntil || (r.needsReservation && r.reservationPhone)) && (
            <section style={styles.modalSection}>
              <h4 style={styles.modalH}>{T("Condiciones y vigencia", "Conditions and validity", "Conditions et validité", "Bedingungen und Gültigkeit")}{conditions.text && <OrigLang shown={conditions} lang={lang} />}</h4>
              {conditions.text && <p style={styles.modalText}>{conditions.text}</p>}
              {p.validUntil && <p style={styles.modalText}>{T("Vigente hasta", "Valid until", "Valable jusqu'au", "Gültig bis")} {p.validUntil}</p>}
              {partnerKind(r) !== "online" && r.needsReservation !== false && getReservationUrl(r.reservationPhone) && (
                <a href={getReservationUrl(r.reservationPhone)} target="_blank" rel="noopener noreferrer" style={styles.whatsappBtn}
                  onClick={() => { post("/api/club/wa-click", { email: account.email, memberId: account.memberId, id: r.id }).catch(() => {}); }}>
                  <MessageCircle size={15} /> {r.reservationRequired === false ? T("Reservación recomendada · WhatsApp", "Reservation recommended · WhatsApp", "Réservation recommandée · WhatsApp", "Reservierung empfohlen · WhatsApp") : T("Se requiere reservación · WhatsApp", "Reservation required · WhatsApp", "Réservation requise · WhatsApp", "Reservierung erforderlich · WhatsApp")}
                </a>
              )}
            </section>
          )}

          {(online || partnerKind(r) === "both") && coverage.text && (
            <section style={styles.modalSection}>
              <h4 style={styles.modalH}>{T("Cobertura", "Coverage", "Couverture", "Abdeckung")}<OrigLang shown={coverage} lang={lang} /></h4>
              <p style={styles.modalText}>{coverage.text}</p>
            </section>
          )}

          {physical && (branches.length > 0 || getLocationUrl(r) || hours) && (
            <section style={styles.modalSection}>
              <h4 style={styles.modalH}>{branches.length > 1 ? T("Sucursales", "Branches", "Succursales", "Filialen") : T("Ubicación y horario", "Location and hours", "Adresse et horaires", "Standort und Zeiten")}</h4>
              {hours && <p style={styles.modalText}><Clock size={12} /> {hours}</p>}
              {r.isFranchise && branches.length > 0 ? branches.map((b, i) => (
                <div key={i} style={{ marginTop: 6 }}>
                  {getBranchUrl(r.name, b)
                    ? <a href={getBranchUrl(r.name, b)} target="_blank" rel="noopener noreferrer" style={styles.locationLink}><MapPin size={13} /> {b.name}{b.address ? ` · ${b.address}` : ""}</a>
                    : <span style={styles.modalText}>{b.name}</span>}
                  {trHours(b.hours, lang) && <div style={styles.promoHoursRow}><Clock size={11} /> {trHours(b.hours, lang)}</div>}
                </div>
              )) : getLocationUrl(r) && <a href={getLocationUrl(r)} target="_blank" rel="noopener noreferrer" style={styles.locationLink}><MapPin size={13} /> {r.address || T("Ver ubicación", "View location", "Voir l'emplacement", "Standort ansehen")}</a>}
            </section>
          )}

          {qrUrl && mode !== "qr" && <QrBlock key={base.id} url={qrUrl} T={T} label={`${r.name} · ${promoTitle(p, lang)}`} collapsed onShown={() => qrShown(account, r.id, base.id)} />}
        </div>
      </div>
    </div>
  );
}

// «QR generado»: aviso sin esperar respuesta (una vez por promoción en esta visita).
const QR_SHOWN = new Set();
function qrShown(account, id, promotionId) {
  const k = `${id}:${promotionId}`;
  if (QR_SHOWN.has(k)) return;
  QR_SHOWN.add(k);
  post("/api/club/qr-shown", { email: account.email, memberId: account.memberId, id, promotionId }).catch(() => {});
}
function QrBlock({ url, T, label, collapsed, onShown }) {
  const [open, setOpen] = useState(!collapsed);
  useEffect(() => { if (open && onShown) onShown(); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section style={styles.modalSection}>
      {open ? (
        <div style={styles.qrBox}>
          <QRCode value={url} size={190} />
          {label && <strong style={{ fontSize: 13.5, color: colors.ink, textAlign: "center" }}>{label}</strong>}
          <span style={styles.qrHint}>{T("Muéstralo en el comercio. Lo escanean con la cámara de cualquier celular y ven al instante si este beneficio es válido. Es solo para esta promoción.", "Show it at the business. They scan it with any phone camera and see right away whether this perk is valid. It's only for this promotion.", "Montre-le au commerce. Ils le scannent avec l'appareil photo de n'importe quel téléphone et voient tout de suite si cet avantage est valable. Il ne sert que pour cette promotion.", "Zeige ihn im Geschäft. Er wird mit jeder Handykamera gescannt und zeigt sofort, ob dieser Vorteil gültig ist. Er gilt nur für dieses Angebot.")}</span>
        </div>
      ) : (
        <button type="button" style={styles.benefitPrimary} onClick={() => setOpen(true)}><QrCode size={14} /> {T("Mostrar QR", "Show QR", "Afficher le QR", "QR anzeigen")}</button>
      )}
    </section>
  );
}

// --- Nivel efectivo, código de colaborador y Tarjeta Dorada -------------------------------------------------------
const post = (path, body) => fetch(`${PLATFORM_URL}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  .then(async (res) => ({ ok: res.ok, status: res.status, j: await res.json().catch(() => ({})) }));

// El nivel lo decide el servidor (residente, colaborador o explorador). Mientras responde, se usa el de la cuenta.
function useMember(account) {
  const { lang } = useContext(LangContext);
  const [me, setMe] = useState(null);
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    setFailed(false);
    // Perfil y detalles de todos los beneficios a los que tiene acceso en una sola petición: abrir «Detalles» o «Mostrar QR»
    // después no espera al servidor. Al actualizar (refresh) se conserva lo anterior hasta que llega lo nuevo.
    const load = (attempt) => post("/api/club/me", { email: account.email, memberId: account.memberId, include: ["benefits"], lang })
      .then((r) => { if (!alive) return; if (r.ok) { setMe(r.j); applyInternalAccount(Boolean(r.j.analyticsInternal)); } else if (r.status >= 500 && attempt === 0) setTimeout(() => alive && load(1), 1200); else setFailed(true); })
      .catch(() => { if (!alive) return; if (attempt === 0) setTimeout(() => alive && load(1), 1200); else setFailed(true); });
    load(0);
    return () => { alive = false; };
  }, [account.email, account.memberId, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  return { me, failed, refresh: () => setTick((t) => t + 1) };
}

// Código de ACCESO (no es el código para invitar amigos): activa una membresía en una cuenta existente. El servidor lo valida
// (con límite de intentos) y solo AGREGA accesos: nunca quita una membresía de equipo, de profesionista ni la distinción VIP.
//  · as="resident"      residente estudiante (código de residentes del Club)
//  · as="professional"  residente profesionista
//  · as="team"          equipo Xtudy: empleados y colaboradores de Xtudy (no personal de comercios aliados)
function AccessCodeForm({ account, lang, onDone, as }) {
  const [code, setCode] = useState("");
  const [st, setSt] = useState({ state: "idle" });
  const T = (...a) => tr(lang, ...a);
  const submit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSt({ state: "sending" });
    try {
      const r = await post("/api/club/collaborator", { email: account.email, memberId: account.memberId, code: code.trim(), as });
      const s = r.j.status || (r.status === 429 ? "too_many" : "error");
      setSt({ state: s });
      if (s === "ok" || s === "already") { setCode(""); onDone(s, as); }
    } catch { setSt({ state: "error" }); }
  };
  const copy = {
    resident: {
      label: T("Código de residente Xtudy", "Xtudy resident code", "Code résident Xtudy", "Xtudy-Bewohner-Code"),
      hint: T("Te lo da Xtudy cuando confirmas tu reserva. Conservas tu cuenta, tus datos y tus beneficios.", "Xtudy gives it to you when your booking is confirmed. You keep your account, your details and your benefits.", "Xtudy te le donne lorsque ta réservation est confirmée. Tu gardes ton compte, tes données et tes avantages.", "Xtudy gibt ihn dir, wenn deine Buchung bestätigt ist. Du behältst dein Konto, deine Daten und deine Vorteile."),
    },
    professional: {
      label: T("Código de residente profesionista", "Resident professional code", "Code résident professionnel", "Code für berufstätige Bewohner"),
      hint: T("Para residentes de Xtudy que no son estudiantes: sin universidad ni matrícula. No crea una reserva.", "For Xtudy residents who aren't students: no university or student ID needed. It doesn't create a booking.", "Pour les résidents Xtudy qui ne sont pas étudiants : ni université ni numéro d'étudiant. Il ne crée pas de réservation.", "Für Xtudy-Bewohner, die keine Studierenden sind: keine Universität oder Matrikelnummer nötig. Es entsteht keine Buchung."),
    },
    team: {
      label: T("Código de equipo Xtudy", "Xtudy team code", "Code d'équipe Xtudy", "Xtudy-Team-Code"),
      hint: T("Para empleados y colaboradores de Xtudy (no para personal de comercios aliados). Conservas tu cuenta, tus datos y tus beneficios.", "For Xtudy employees and collaborators (not staff of partner businesses). You keep your account, your details and your benefits.", "Pour les employés et collaborateurs de Xtudy (pas le personnel des commerces partenaires). Tu gardes ton compte, tes données et tes avantages.", "Für Mitarbeiter und Partner von Xtudy (nicht für Personal von Partnergeschäften). Du behältst dein Konto, deine Daten und deine Vorteile."),
    },
  }[as];
  const msg = {
    invalid: T("Ese código no es válido. Revísalo e intenta de nuevo.", "That code isn't valid. Check it and try again.", "Ce code n'est pas valide. Vérifie-le et réessaie.", "Dieser Code ist ungültig. Prüfe ihn und versuche es erneut."),
    expired: T("Ese código ya venció. Pide uno vigente a Xtudy.", "That code has expired. Ask Xtudy for a current one.", "Ce code a expiré. Demande-en un valide à Xtudy.", "Dieser Code ist abgelaufen. Frag Xtudy nach einem gültigen."),
    inactive: T("Ese código ya no está activo. Pide uno vigente a Xtudy.", "That code is no longer active. Ask Xtudy for a current one.", "Ce code n'est plus actif. Demande-en un valide à Xtudy.", "Dieser Code ist nicht mehr aktiv. Frag Xtudy nach einem gültigen."),
    too_many: T("Demasiados intentos. Espera un rato antes de volver a intentar.", "Too many attempts. Please wait a while before trying again.", "Trop de tentatives. Attends un peu avant de réessayer.", "Zu viele Versuche. Bitte warte etwas, bevor du es erneut versuchst."),
    error: T("No pudimos validar el código. Intenta de nuevo en un momento.", "We couldn't check the code. Please try again in a moment.", "Impossible de vérifier le code. Réessaie dans un instant.", "Der Code konnte nicht geprüft werden. Bitte versuche es gleich noch einmal."),
  }[st.state];
  const id = `access-code-${as}`;
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 6 }}>
      <label style={{ ...styles.label, color: "#CFE6F5" }} htmlFor={id}>{copy.label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input id={id} style={{ ...styles.input, minWidth: 0 }} value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" autoCapitalize="characters" maxLength={40} />
        <button type="submit" style={{ ...styles.benefitPrimary, width: "auto", minWidth: 96 }} disabled={st.state === "sending"}>{st.state === "sending" ? T("Validando…", "Checking…", "Vérification…", "Prüfen…") : T("Validar", "Check", "Valider", "Prüfen")}</button>
      </div>
      <p style={{ ...styles.partnerFine, color: "#B9D3E6", margin: 0 }}>{copy.hint}</p>
      {msg && <p role="alert" style={{ margin: 0, fontSize: 13.5, color: "#FFD5D0" }}>{msg}</p>}
    </form>
  );
}

// «¿Tienes un código de acceso?»: acceso SECUNDARIO y plegado. Solo ofrece lo que corresponde al estado real del miembro:
// a quien ya es residente (estudiante o profesionista) no le pregunta si es residente, y a quien ya es del equipo no le
// pide su código de equipo. Si ya tiene todo, no se muestra. La distinción VIP es independiente y no se toca.
function AccessPanel({ me, account, lang, onDone }) {
  const T = (...a) => tr(lang, ...a);
  const isResident = Boolean(me.resident || me.professional);
  const isTeam = me.team === "employee" || me.team === "collaborator";
  const options = [!isResident && "resident", !isTeam && "team"].filter(Boolean);
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState(null);
  const [resKind, setResKind] = useState("resident");
  const [done, setDone] = useState(null);
  const current = options.length === 1 ? options[0] : options.includes(choice) ? choice : null;
  if (!options.length && !done) return null;
  const finished = (status, as) => {
    const msgs = {
      resident: [T("¡Listo! Ya eres Residente Xtudy: tienes los descuentos de Explorador y de Residente.", "Done! You're now an Xtudy Resident: you get both Explorer and Resident discounts.", "C'est fait ! Tu es maintenant Résident Xtudy : tu as les réductions Explorateur et Résident.", "Fertig! Du bist jetzt Xtudy-Bewohner: Du bekommst die Rabatte für Entdecker und Bewohner."), T("Ya eras Residente Xtudy.", "You were already an Xtudy Resident.", "Tu étais déjà Résident Xtudy.", "Du warst bereits Xtudy-Bewohner.")],
      professional: [T("¡Listo! Ya eres Residente profesionista: tienes los descuentos de Explorador y de Residente.", "Done! You're now a Resident professional: you get both Explorer and Resident discounts.", "C'est fait ! Tu es maintenant Résident professionnel : tu as les réductions Explorateur et Résident.", "Fertig! Du bist jetzt berufstätiger Bewohner: Du bekommst die Rabatte für Entdecker und Bewohner."), T("Ya eras Residente profesionista.", "You were already a Resident professional.", "Tu étais déjà Résident professionnel.", "Du warst bereits berufstätiger Bewohner.")],
      team: [T("¡Listo! Ya eres parte del equipo Xtudy en el Club: tienes los descuentos de Explorador y de Residente.", "Done! You're now part of the Xtudy team in the Club: you get both Explorer and Resident discounts.", "C'est fait ! Tu fais maintenant partie de l'équipe Xtudy dans le Club : tu as les réductions Explorateur et Résident.", "Fertig! Du gehörst jetzt im Club zum Xtudy-Team: Du bekommst die Rabatte für Entdecker und Bewohner."), T("Ya eras parte del equipo Xtudy en el Club.", "You were already part of the Xtudy team in the Club.", "Tu faisais déjà partie de l'équipe Xtudy dans le Club.", "Du gehörst im Club bereits zum Xtudy-Team.")],
    }[as];
    setDone(status === "ok" ? msgs[0] : msgs[1]);
    setChoice(null);
    onDone();
  };
  const pill = (active) => ({ ...styles.accessPill, ...(active ? styles.accessPillActive : {}) });
  return (
    <div style={styles.accessWrap}>
      {done && <p role="status" style={{ margin: "0 0 6px", fontSize: 13.5, color: "#BFF0C8", textAlign: "center" }}><Check size={13} /> {done}</p>}
      {options.length > 0 && (
        <button type="button" style={styles.accessToggle} aria-expanded={open} aria-controls="access-panel" onClick={() => setOpen((o) => !o)}>
          {T("¿Tienes un código de acceso?", "Have an access code?", "Tu as un code d'accès ?", "Hast du einen Zugangscode?")}
          <ChevronDown size={15} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} aria-hidden="true" />
        </button>
      )}
      {open && options.length > 0 && (
        <div id="access-panel" style={styles.accessBox}>
          <p style={{ ...styles.partnerFine, color: "#B9D3E6", margin: 0 }}>{T("Activa tu membresía con el código que te dio Xtudy. No es el código para invitar a tus amigos.", "Activate your membership with the code Xtudy gave you. It isn't the code for inviting friends.", "Active ton adhésion avec le code que Xtudy t'a donné. Ce n'est pas le code pour inviter tes amis.", "Aktiviere deine Mitgliedschaft mit dem Code von Xtudy. Das ist nicht der Code zum Einladen von Freunden.")}</p>
          {options.length > 1 && (
            <div role="radiogroup" aria-label={T("Tipo de acceso", "Access type", "Type d'accès", "Zugangsart")} style={styles.accessPills}>
              <button type="button" role="radio" aria-checked={current === "resident"} style={pill(current === "resident")} onClick={() => setChoice("resident")}>{T("Soy residente de Xtudy", "I'm an Xtudy resident", "Je suis résident Xtudy", "Ich bin Xtudy-Bewohner")}</button>
              <button type="button" role="radio" aria-checked={current === "team"} style={pill(current === "team")} onClick={() => setChoice("team")}>{T("Soy parte del equipo Xtudy", "I'm on the Xtudy team", "Je fais partie de l'équipe Xtudy", "Ich gehöre zum Xtudy-Team")}</button>
            </div>
          )}
          {options.length === 1 && <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>{current === "resident" ? T("Soy residente de Xtudy", "I'm an Xtudy resident", "Je suis résident Xtudy", "Ich bin Xtudy-Bewohner") : T("Soy parte del equipo Xtudy", "I'm on the Xtudy team", "Je fais partie de l'équipe Xtudy", "Ich gehöre zum Xtudy-Team")}</p>}
          {current === "resident" && (
            <>
              <div role="radiogroup" aria-label={T("Tipo de residente", "Resident type", "Type de résident", "Bewohnerart")} style={styles.accessPills}>
                <button type="button" role="radio" aria-checked={resKind === "resident"} style={pill(resKind === "resident")} onClick={() => setResKind("resident")}>{T("Estudiante", "Student", "Étudiant", "Studierende")}</button>
                <button type="button" role="radio" aria-checked={resKind === "professional"} style={pill(resKind === "professional")} onClick={() => setResKind("professional")}>{T("Profesionista", "Professional", "Professionnel", "Berufstätig")}</button>
              </div>
              <AccessCodeForm key={resKind} account={account} lang={lang} onDone={finished} as={resKind} />
            </>
          )}
          {current === "team" && <AccessCodeForm account={account} lang={lang} onDone={finished} as="team" />}
        </div>
      )}
    </div>
  );
}

const GOLD_CONDITIONS_TX = [
  "Hasta 5 noches sin costo de renta por año calendario (el año de tu fecha de entrada), en una sola reserva, sujetas a disponibilidad. Se renueva cada 1 de enero y las noches no se acumulan entre años. Si tu estancia tiene menos de 5 noches no hay devolución ni saldo a favor; si tiene más, pagas la renta de las noches restantes. Solo cubre renta: no el depósito en garantía ni otros cargos. No se combina con otros códigos de descuento. Las estancias más cortas que el mínimo habitual requieren revisión de Xtudy.",
  "Up to 5 rent-free nights per calendar year (the year of your move-in date), in a single booking, subject to availability. It renews every January 1 and nights don't carry over between years. If your stay is shorter than 5 nights there is no refund or credit; if longer, you pay rent for the remaining nights. Rent only: it doesn't cover the security deposit or other charges. It can't be combined with other discount codes. Stays shorter than the usual minimum require review by Xtudy.",
  "Jusqu'à 5 nuits sans loyer par année civile (l'année de ta date d'arrivée), dans une seule réservation, sous réserve de disponibilité. Renouvelé chaque 1er janvier ; les nuits ne se cumulent pas d'une année à l'autre. Si ton séjour dure moins de 5 nuits, il n'y a ni remboursement ni crédit ; s'il est plus long, tu paies le loyer des nuits restantes. Loyer uniquement : ni le dépôt de garantie ni d'autres frais. Non cumulable avec d'autres codes de réduction. Les séjours plus courts que le minimum habituel nécessitent une validation de Xtudy.",
  "Bis zu 5 mietfreie Nächte pro Kalenderjahr (das Jahr deines Einzugsdatums), in einer einzigen Buchung, je nach Verfügbarkeit. Erneuert sich jeden 1. Januar; Nächte werden nicht ins nächste Jahr übertragen. Ist dein Aufenthalt kürzer als 5 Nächte, gibt es keine Erstattung oder Gutschrift; ist er länger, zahlst du die Miete der restlichen Nächte. Nur Miete: keine Kaution oder sonstigen Kosten. Nicht mit anderen Rabattcodes kombinierbar. Aufenthalte unter dem üblichen Minimum werden von Xtudy geprüft.",
];
const TICKET_STATUS = {
  available: ["Disponible", "Available", "Disponible", "Verfügbar"],
  applied: ["Apartado por una reserva en proceso", "Held by a booking in progress", "Réservé par une réservation en cours", "Für eine laufende Buchung reserviert"],
  redeemed: ["Utilizado", "Used", "Utilisé", "Genutzt"],
  revoked: ["No disponible", "Not available", "Indisponible", "Nicht verfügbar"],
  inactive: ["No disponible", "Not available", "Indisponible", "Nicht verfügbar"],
};

// --- V20 · Tarjeta, VIP y Wallet ---------------------------------------------------------------------------------------
const VIP_TITLE = ["Un reconocimiento especial para ti", "A special recognition for you", "Une reconnaissance spéciale pour toi", "Eine besondere Anerkennung für dich"];
const VIP_MESSAGE = [
  "Ser parte de nuestra lista VIP es para siempre. Disfruta de hasta 5 noches de hospedaje sin costo de renta cada año calendario, sujetas a disponibilidad. Reserva en nuestra página con tu código personal.",
  "Being on our VIP list is forever. Enjoy up to 5 nights of accommodation with no rent every calendar year, subject to availability. Book on our website with your personal code.",
  "Faire partie de notre liste VIP, c'est pour toujours. Profite de jusqu'à 5 nuits d'hébergement sans loyer chaque année civile, sous réserve de disponibilité. Réserve sur notre site avec ton code personnel.",
  "Auf unserer VIP-Liste bist du für immer. Genieße jedes Kalenderjahr bis zu 5 Übernachtungen ohne Miete, je nach Verfügbarkeit. Buche auf unserer Website mit deinem persönlichen Code.",
];
// Si el beneficio ya se usó, venció o se revocó, no se anuncian noches disponibles.
const VIP_MESSAGE_PLAIN = [
  "Ha sido un honor recibirte en Xtudy. Eres parte de nuestra lista VIP.",
  "It has been an honor to host you at Xtudy. You're on our VIP list.",
  "Ce fut un honneur de t'accueillir chez Xtudy. Tu fais partie de notre liste VIP.",
  "Es war uns eine Ehre, dich bei Xtudy zu begrüßen. Du bist auf unserer VIP-Liste.",
];
const LEVEL_NAME = {
  guest: ["Explorador", "Explorer", "Explorateur", "Entdecker"],
  resident: ["Residente Xtudy", "Xtudy Resident", "Résident Xtudy", "Xtudy-Bewohner"],
  professional: ["Residente profesionista", "Resident professional", "Résident professionnel", "Berufstätiger Bewohner"],
  team: ["Equipo Xtudy", "Xtudy team", "Équipe Xtudy", "Xtudy-Team"],
  employee: ["Empleado Xtudy", "Xtudy Employee", "Employé Xtudy", "Xtudy-Mitarbeiter"],
  collaborator: ["Colaborador Xtudy", "Xtudy Collaborator", "Collaborateur Xtudy", "Xtudy-Partner"],
};
const prefersReducedMotion = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; } };

// Ventana accesible reutilizable: modal en escritorio, panel desde abajo en móvil; Esc cierra, el fondo no se mueve.
function Sheet({ title, onClose, children, labelledBy = "sheet-title" }) {
  const narrow = useNarrow();
  const boxRef = React.useRef(null), closeRef = React.useRef(null);
  const { lang } = useContext(LangContext);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "Tab" && boxRef.current) {
        const f = boxRef.current.querySelectorAll('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [onClose]);
  return (
    <div style={styles.modalOverlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={boxRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy} style={narrow ? styles.sheet : styles.modal}>
        <div style={styles.modalHead}>
          <h3 id={labelledBy} style={{ ...styles.modalTitle, flex: 1 }}>{title}</h3>
          <button ref={closeRef} type="button" onClick={onClose} style={styles.modalClose} aria-label={tr(lang, "Cerrar", "Close", "Fermer", "Schließen")}><X size={20} /></button>
        </div>
        <div style={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

// Celebración VIP: partículas doradas suaves (≈2.6 s), sin sonido, sin bloquear nada (pointer-events: none) y sin destellos.
function VipCelebration({ special, onDone }) {
  const ref = React.useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return undefined;
    const ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);
    const palette = ["#E8D5A8", "#D9C08E", "#C9A96A", "#F3E7C9", "#B8935A"];
    const bursts = special ? [[0.3, 0.32, 0], [0.7, 0.28, 380], [0.5, 0.22, 760]] : [[0.5, 0.3, 0], [0.34, 0.36, 420]];
    const parts = [];
    const spawn = (bx, by) => {
      const n = special ? 46 : 34;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.3, v = 1.4 + Math.random() * 2.4;
        parts.push({ x: bx * W, y: by * H, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.6, life: 0, max: 70 + Math.random() * 40, r: 1.4 + Math.random() * 1.8, col: palette[i % palette.length] });
      }
    };
    const timers = bursts.map(([x, y, at]) => setTimeout(() => spawn(x, y), at));
    let raf = 0; const start = performance.now(); const total = special ? 3200 : 2600;
    const tick = (t) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.life++; p.vy += 0.035; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy;
        const alpha = Math.max(0, 1 - p.life / p.max) * 0.9;
        if (alpha <= 0) continue;
        ctx.globalAlpha = alpha; ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (t - start < total) raf = requestAnimationFrame(tick); else onDone();
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, [special, onDone]);
  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 60 }} />;
}

// Se muestra una vez por visita (pestaña nueva o regreso al perfil), nunca por re-renderizados ni al abrir detalles.
const CELEBRATED = new Set();
function useVipCelebration(me, account) {
  const [show, setShow] = useState(null);
  useEffect(() => {
    if (!me || !me.gold || !me.prefs) return;
    const key = `vip-cel:${account.memberId}`;
    if (CELEBRATED.has(key)) return;
    CELEBRATED.add(key);
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch { /* sin almacenamiento: basta la marca en memoria */ }
    const first = !me.prefs.vipWelcomed;
    if (first) post("/api/club/prefs", { email: account.email, memberId: account.memberId, vipWelcomed: true }).catch(() => {});
    if (!me.prefs.celebrate || prefersReducedMotion()) { if (first) setShow({ special: true, staticOnly: true }); return; }
    setShow({ special: first, flip: true });
  }, [me && me.gold, me && me.prefs && me.prefs.celebrate]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (show && show.special && !show.done) { const t = setTimeout(() => setShow((s) => (s ? { ...s, staticOnly: true, done: true } : s)), 4200); return () => clearTimeout(t); } return undefined; }, [show && show.special, show && show.done]); // eslint-disable-line react-hooks/exhaustive-deps
  return [show, () => setShow((s) => (s && s.special ? { ...s, staticOnly: true } : null))];
}

function MemberCard({ account, lang, levelId, vip, teamToo }) {
  const T = (...a) => tr(lang, ...a);
  // Equipo Xtudy: sin universidad (no son estudiantes). Un residente que también es del equipo muestra ambos.
  const subline = account.memberType === "team" ? T("Equipo Xtudy", "Xtudy team", "Équipe Xtudy", "Xtudy-Team") : account.memberType === "professional" ? "Xtudy Club" : account.university;
  const levelText = `${T(...LEVEL_NAME[levelId])}${teamToo ? ` · ${T(...LEVEL_NAME[teamToo])}` : ""}`;
  if (vip) return (
    <div style={styles.vipCard}>
      <div style={styles.vipSheen} aria-hidden="true" />
      <div style={styles.vipTop}>
        <img src={WORDMARK_WHITE_DATA} alt="Xtudy" style={{ height: 20, width: "auto" }} />
        <span style={styles.vipBadge}>✦ Xtudy VIP</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={styles.vipName}>{account.name}</div>
        <div style={styles.vipUni}>{subline}</div>
        <div style={styles.vipRule} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={styles.vipLabel}>{T("Nivel actual", "Current tier", "Niveau actuel", "Aktuelle Stufe")}</span>
          <span style={styles.vipLevel}>{levelText}</span>
        </div>
        <div style={styles.vipMember}>{account.memberId}</div>
      </div>
    </div>
  );
  const level = levelId;
  return (
    <div style={{ ...styles.membershipCardBig, ...(level !== "guest" ? styles.membershipCardResident : {}) }}>
      {level !== "guest" && (
        <>
          <div style={styles.residentWatermarkWrap}>
            <svg width="100" height="100%" viewBox="0 0 90 200" preserveAspectRatio="none" style={styles.residentWatermarkSvg} aria-hidden="true">
              <path d="M0 0 L45 100 L0 200 L20 200 L65 100 L20 0 Z" fill={colors.blue} /><path d="M55 0 L100 100 L55 200 L75 200 L100 155 L100 45 L75 0 Z" fill={colors.blue} />
            </svg>
          </div>
          <span style={styles.residentBadge}><Crown size={11} /> {T(...LEVEL_NAME[level])}</span>
        </>
      )}
      <div style={{ ...styles.cardPoweredBy, position: "relative", zIndex: 1 }}>Powered by</div>
      <div style={{ ...styles.cardTop, position: "relative", zIndex: 1 }}><img src={WORDMARK_BLUE_DATA} alt="Xtudy" style={styles.cardBrandImg} /><Star size={18} color={colors.blue} fill={colors.blue} /></div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={styles.cardName}>{account.name}</div>
        <div style={styles.cardUni}>{subline}</div>
        <div style={styles.cardTierRow}>
          <span style={styles.cardTierLabel}>{T("Nivel actual", "Current tier", "Niveau actuel", "Aktuelle Stufe")}</span>
          <span style={styles.cardTierValue}>{levelText}</span>
        </div>
        <div style={styles.stampsRow}>{TIERS.map((t) => <div key={t.id} style={{ ...styles.stampDot, ...(t.order <= (level !== "guest" ? 1 : 0) ? styles.stampDotFilled : {}) }} />)}</div>
      </div>
    </div>
  );
}

const isApple = () => /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent || "");
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent || "") || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// Botones de Wallet: solo aparecen si el servidor tiene la plataforma configurada (nunca un botón que falle).
function WalletButtons({ me, account, lang }) {
  const T = (...a) => tr(lang, ...a);
  const [busy, setBusy] = useState(null), [err, setErr] = useState("");
  if (!me || !me.wallet || (!me.wallet.apple && !me.wallet.google)) return null;
  const go = async (platform) => {
    setBusy(platform); setErr("");
    try {
      const r = await post("/api/club/wallet", { email: account.email, memberId: account.memberId, platform });
      if (r.ok && r.j.url) { window.location.href = r.j.url; return; }
      setErr(T("No pudimos preparar tu tarjeta para Wallet. Intenta de nuevo.", "We couldn't prepare your Wallet card. Please try again.", "Impossible de préparer ta carte pour Wallet. Réessaie.", "Deine Wallet-Karte konnte nicht vorbereitet werden. Bitte erneut versuchen."));
    } catch { setErr(T("Sin conexión. Intenta de nuevo.", "No connection. Please try again.", "Pas de connexion. Réessaie.", "Keine Verbindung. Bitte erneut versuchen.")); }
    setBusy(null);
  };
  const showApple = me.wallet.apple && isApple(), showGoogle = me.wallet.google && !isIOS();
  return (
    <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {showApple && <button type="button" style={styles.walletBtn} disabled={Boolean(busy)} onClick={() => go("apple")}>{busy === "apple" ? T("Preparando…", "Preparing…", "Préparation…", "Wird vorbereitet…") : T("Agregar a Apple Wallet", "Add to Apple Wallet", "Ajouter à Apple Wallet", "Zu Apple Wallet hinzufügen")}</button>}
        {showGoogle && <button type="button" style={styles.walletBtn} disabled={Boolean(busy)} onClick={() => go("google")}>{busy === "google" ? T("Preparando…", "Preparing…", "Préparation…", "Wird vorbereitet…") : T("Agregar a Google Wallet", "Add to Google Wallet", "Ajouter à Google Wallet", "Zu Google Wallet hinzufügen")}</button>}
      </div>
      {!showApple && !showGoogle && <p style={{ ...styles.partnerFine, color: "#CFE6F5", textAlign: "center", margin: 0 }}>{T("Para guardarla en Wallet, abre Xtudy Club desde tu teléfono.", "To save it to Wallet, open Xtudy Club on your phone.", "Pour l'enregistrer dans Wallet, ouvre Xtudy Club sur ton téléphone.", "Um sie in Wallet zu speichern, öffne Xtudy Club auf deinem Handy.")}</p>}
      {err && <p role="alert" style={{ margin: 0, color: "#FFD5D0", fontSize: 13.5 }}>{err}</p>}
    </div>
  );
}

// La tarjeta de MEMBRESÍA: su QR solo confirma que la membresía está vigente (no sabe qué comercio ni qué promoción).
// Los descuentos usan el QR de cada promoción («Mostrar QR» en el comercio).
function CardQrSheet({ me, account, lang, levelId, vip, onClose }) {
  const T = (...a) => tr(lang, ...a);
  return (
    <Sheet title={T("Tu tarjeta de membresía", "Your membership card", "Ta carte de membre", "Deine Mitgliedskarte")} onClose={onClose} labelledBy="card-qr-title">
      {me && me.card ? (
        <div style={{ display: "grid", gap: 12, justifyItems: "center", textAlign: "center" }}>
          <div style={{ background: "#fff", padding: 12, borderRadius: 14, border: `1px solid ${colors.line}` }}><QRCode value={me.card.qr} size={220} /></div>
          <div><div style={{ fontWeight: 700, fontSize: 18 }}>{account.name}</div><div style={styles.partnerFine}>{T(...LEVEL_NAME[levelId])}{vip ? " · Xtudy VIP" : ""} · {me.card.memberId}</div></div>
          <p style={styles.modalText}>{T("Este QR solo confirma tu membresía. No aplica un descuento por sí solo.", "This QR only confirms your membership. It doesn't apply a discount on its own.", "Ce QR confirme seulement ton adhésion. Il n'applique pas de réduction à lui seul.", "Dieser QR bestätigt nur deine Mitgliedschaft. Er gewährt allein keinen Rabatt.")}</p>
          <div style={styles.cardHint}><span style={styles.partnerFine}>{T("Para usar un descuento: elige el comercio en tus beneficios y pulsa «Mostrar QR». Ese QR es el de la promoción.", "To use a discount: choose the business in your perks and tap \"Show QR\". That QR is the promotion's.", "Pour utiliser une réduction : choisis le commerce dans tes avantages et appuie sur « Afficher le QR ». Ce QR est celui de la promotion.", "Für einen Rabatt: Wähle das Geschäft in deinen Vorteilen und tippe auf „QR anzeigen“. Das ist der QR des Angebots.")}</span></div>
          <p style={styles.partnerFine}>{T("Los servicios en línea se usan desde tu perfil, con su código o enlace.", "Online services are used from your profile, with their code or link.", "Les services en ligne s'utilisent depuis ton profil, avec leur code ou lien.", "Online-Dienste nutzt du über dein Profil, mit ihrem Code oder Link.")}</p>
        </div>
      ) : <p style={styles.modalText}>{T("Cargando tu tarjeta… Se necesita conexión para mostrarla.", "Loading your card… A connection is needed to show it.", "Chargement de ta carte… Une connexion est nécessaire.", "Deine Karte wird geladen… Dafür ist eine Verbindung nötig.")}</p>}
    </Sheet>
  );
}

function VipSheet({ me, account, lang, onClose, onPrefs }) {
  const T = (...a) => tr(lang, ...a);
  const t = me.ticket;
  const thisYear = t && t.years ? t.years[0] : null;
  const available = Boolean(t && t.vipActive && t.years && t.years.some((y) => y.status === "available"));
  const [copied, setCopied] = useState(false);
  const [celebrate, setCelebrate] = useState(me.prefs ? me.prefs.celebrate : true);
  const [req, setReq] = useState({ open: false, checkIn: "", checkOut: "", property: "", message: "", state: "idle" });
  const send = async (e) => {
    e.preventDefault();
    setReq((r) => ({ ...r, state: "sending" }));
    try {
      const r = await post("/api/club/ticket-request", { email: account.email, memberId: account.memberId, checkIn: req.checkIn, checkOut: req.checkOut, property: req.property, message: req.message });
      setReq((x) => ({ ...x, state: r.ok ? "sent" : (r.j.error || "error") }));
    } catch { setReq((x) => ({ ...x, state: "error" })); }
  };
  const toggle = async () => {
    const v = !celebrate; setCelebrate(v);
    await post("/api/club/prefs", { email: account.email, memberId: account.memberId, celebrate: v }).catch(() => {});
    onPrefs();
  };
  const reqMsg = {
    sent: T("Recibimos tu solicitud. Xtudy la revisará y te contactará; aún no está confirmada.", "We received your request. Xtudy will review it and contact you; it isn't confirmed yet.", "Nous avons reçu ta demande. Xtudy l'examinera et te contactera ; elle n'est pas encore confirmée.", "Wir haben deine Anfrage erhalten. Xtudy prüft sie und meldet sich; sie ist noch nicht bestätigt."),
    dates: T("Revisa las fechas: la salida debe ser posterior a la llegada y ambas en el futuro.", "Check the dates: check-out must be after check-in and both in the future.", "Vérifie les dates : le départ doit être après l'arrivée et les deux dans le futur.", "Prüfe die Daten: Abreise nach Anreise und beide in der Zukunft."),
    too_many: T("Ya tienes solicitudes pendientes de revisión.", "You already have requests pending review.", "Tu as déjà des demandes en attente.", "Du hast bereits offene Anfragen."),
    not_available: T("Tu beneficio de ese año no está disponible para nuevas solicitudes.", "Your benefit for that year isn't available for new requests.", "Ton avantage de cette année n'est pas disponible pour de nouvelles demandes.", "Dein Vorteil für dieses Jahr ist für neue Anfragen nicht verfügbar."),
    error: T("No pudimos enviar la solicitud. Intenta de nuevo.", "We couldn't send the request. Please try again.", "Impossible d'envoyer la demande. Réessaie.", "Die Anfrage konnte nicht gesendet werden. Bitte erneut versuchen."),
  }[req.state === "not_found" ? "error" : req.state];
  return (
    <Sheet title={T(...VIP_TITLE)} onClose={onClose} labelledBy="vip-title">
      <p style={styles.modalText}>{T(...(t && t.vipActive ? VIP_MESSAGE : VIP_MESSAGE_PLAIN))}</p>
      {t && (
        <section style={styles.vipBenefit}>
          <h4 style={styles.modalH}>{T("Tu beneficio anual · hasta 5 noches sin costo de renta", "Your yearly benefit · up to 5 rent-free nights", "Ton avantage annuel · jusqu'à 5 nuits sans loyer", "Dein jährlicher Vorteil · bis zu 5 mietfreie Nächte")}</h4>
          <div style={styles.yearRow}>
            {(t.years || []).map((y) => (
              <div key={y.year} style={styles.yearPill}>
                <strong>{y.year}</strong>
                <span style={{ color: y.status === "available" ? "#1F7A3D" : y.status === "applied" ? colors.blue : colors.muted }}>{T(...(TICKET_STATUS[y.status] || TICKET_STATUS.inactive))}</span>
              </div>
            ))}
          </div>
          <p style={styles.partnerFine}>{T("El beneficio corresponde al año de tu fecha de entrada y se renueva cada 1 de enero.", "The benefit belongs to the year of your move-in date and renews every January 1.", "L'avantage correspond à l'année de ta date d'arrivée et se renouvelle chaque 1er janvier.", "Der Vorteil gilt für das Jahr deines Einzugsdatums und erneuert sich jeden 1. Januar.")}</p>
          {t.vipActive && (
            <>
              <h4 style={styles.modalH}>{T("Tu código personal", "Your personal code", "Ton code personnel", "Dein persönlicher Code")}</h4>
              <div style={styles.codeRow}>
                <code style={styles.codeBox}>{t.code}</code>
                <button type="button" style={styles.benefitSecondary} onClick={() => navigator.clipboard?.writeText(t.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {})}>{copied ? T("¡Copiado!", "Copied!", "Copié !", "Kopiert!") : T("Copiar", "Copy", "Copier", "Kopieren")}</button>
              </div>
              <p style={styles.modalText}>{T("Elige tus fechas en nuestra página y, antes de pagar, escribe tu código en «Código promocional». Cubre la renta de hasta 5 noches de una sola reserva; el depósito y otros cargos no cambian.", "Choose your dates on our website and, before paying, enter your code under “Promo code”. It covers rent for up to 5 nights of a single booking; the deposit and other charges don't change.", "Choisis tes dates sur notre site et, avant de payer, saisis ton code dans « Code promo ». Il couvre le loyer de 5 nuits maximum d'une seule réservation ; le dépôt et les autres frais ne changent pas.", "Wähle deine Daten auf unserer Website und gib vor dem Bezahlen deinen Code unter „Gutscheincode“ ein. Er deckt die Miete für bis zu 5 Nächte einer einzigen Buchung; Kaution und andere Kosten ändern sich nicht.")}</p>
              {available && <a href={`${PLATFORM_URL}/${lang === "es" ? "es" : "en"}/explorar`} target="_blank" rel="noopener noreferrer" style={styles.goBtn}>{T("Consultar disponibilidad y reservar", "Check availability and book", "Voir les disponibilités et réserver", "Verfügbarkeit prüfen und buchen")} <ChevronRight size={16} /></a>}
            </>
          )}
          <p style={styles.partnerFine}>{T(...GOLD_CONDITIONS_TX)}</p>
          {available && (req.open ? (
            <form onSubmit={send} style={{ display: "grid", gap: 8 }}>
              <h4 style={styles.modalH}>{T("Solicitar revisión para una estancia corta", "Request review for a short stay", "Demander une validation pour un court séjour", "Prüfung für kurzen Aufenthalt anfragen")}</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <label style={{ ...styles.label, flex: 1, minWidth: 140 }}>{T("Llegada", "Check-in", "Arrivée", "Anreise")}<input type="date" required style={styles.input} value={req.checkIn} onChange={(e) => setReq({ ...req, checkIn: e.target.value })} /></label>
                <label style={{ ...styles.label, flex: 1, minWidth: 140 }}>{T("Salida", "Check-out", "Départ", "Abreise")}<input type="date" required style={styles.input} value={req.checkOut} onChange={(e) => setReq({ ...req, checkOut: e.target.value })} /></label>
              </div>
              <label style={styles.label}>{T("Propiedad (opcional)", "Property (optional)", "Logement (facultatif)", "Unterkunft (optional)")}<input style={styles.input} maxLength={120} value={req.property} onChange={(e) => setReq({ ...req, property: e.target.value })} /></label>
              <label style={styles.label}>{T("Mensaje (opcional)", "Message (optional)", "Message (facultatif)", "Nachricht (optional)")}<textarea style={{ ...styles.input, minHeight: 70 }} maxLength={600} value={req.message} onChange={(e) => setReq({ ...req, message: e.target.value })} /></label>
              <button type="submit" style={styles.benefitPrimary} disabled={req.state === "sending" || req.state === "sent"}>{req.state === "sending" ? T("Enviando…", "Sending…", "Envoi…", "Senden…") : T("Enviar solicitud", "Send request", "Envoyer la demande", "Anfrage senden")}</button>
              {reqMsg && <p role="status" style={styles.modalText}>{reqMsg}</p>}
            </form>
          ) : <button type="button" style={styles.benefitSecondary} onClick={() => setReq({ ...req, open: true })}>{T("¿Tu estancia es más corta que el mínimo? Solicita una revisión", "Is your stay shorter than the minimum? Request a review", "Ton séjour est plus court que le minimum ? Demande une validation", "Kürzer als das Minimum? Prüfung anfragen")}</button>)}
          {thisYear && !t.vipActive && <p style={styles.modalText}>{T("Tu beneficio anual no está disponible en este momento.", "Your yearly benefit isn't available right now.", "Ton avantage annuel n'est pas disponible pour le moment.", "Dein jährlicher Vorteil ist derzeit nicht verfügbar.")}</p>}
        </section>
      )}
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: colors.ink, borderTop: `1px solid ${colors.line}`, paddingTop: 12 }}>
        <input type="checkbox" checked={celebrate} onChange={toggle} /> {T("Mostrar una pequeña celebración al entrar", "Show a small celebration when I sign in", "Afficher une petite célébration à l'arrivée", "Beim Öffnen eine kleine Feier zeigen")}
      </label>
    </Sheet>
  );
}

// Porcentaje con el formato de cada idioma: «5%» (es/en), «7,5 %» (fr/de).
const fmtPct = (lang, n) => {
  const v = Number(n);
  return lang === "fr" || lang === "de" ? `${String(v).replace(".", ",")} %` : `${v}%`;
};
const LOCALE = { es: "es-MX", en: "en-US", fr: "fr-FR", de: "de-DE" };

// Código personal de referidos (residentes estudiantes y profesionistas). El descuento es para la PERSONA INVITADA, con el
// porcentaje real que configuró Xtudy (5% por defecto). Quien comparte no recibe dinero, comisión ni descuento. El enlace
// solo precarga el código: el servidor lo valida al aplicarlo en la reserva. Si el código está inactivo o vencido no se
// invita a compartirlo: solo un estado discreto.
function ReferralStrip({ referral, lang }) {
  const T = (...a) => tr(lang, ...a);
  const [open, setOpen] = useState(false);
  const btnRef = React.useRef(null);
  if (!referral) return null;
  if (referral.status !== "active" || !referral.code) {
    return (
      <p style={styles.referralOff} role="note">
        <Gift size={13} aria-hidden="true" /> {referral.status === "expired"
          ? T("Tu código para invitar amigos venció.", "Your code for inviting friends has expired.", "Ton code pour inviter des amis a expiré.", "Dein Code zum Einladen von Freunden ist abgelaufen.")
          : T("Tu código para invitar amigos no está disponible por ahora.", "Your code for inviting friends isn't available right now.", "Ton code pour inviter des amis n'est pas disponible pour le moment.", "Dein Code zum Einladen von Freunden ist derzeit nicht verfügbar.")}
      </p>
    );
  }
  const p = fmtPct(lang, referral.pct);
  const close = () => { setOpen(false); setTimeout(() => btnRef.current && btnRef.current.focus({ preventScroll: true }), 0); };
  return (
    <>
      <section style={styles.referralStrip} aria-labelledby="ref-title">
        <span style={styles.referralIcon} aria-hidden="true"><Gift size={18} /></span>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}>
          <h3 id="ref-title" style={styles.referralTitle}>{T(`Regala un ${p} de descuento a un amigo`, `Give a friend ${p} off`, `Offre ${p} de réduction à un ami`, `Schenke einem Freund ${p} Rabatt`)}</h3>
          <p style={styles.referralText}>{T("Para la renta de su próxima estancia con Xtudy.", "On the rent for their next stay with Xtudy.", "Sur le loyer de son prochain séjour chez Xtudy.", "Auf die Miete seines nächsten Aufenthalts bei Xtudy.")}</p>
        </div>
        <button ref={btnRef} type="button" style={styles.referralCta} onClick={() => setOpen(true)}>{T("Compartir mi código", "Share my code", "Partager mon code", "Meinen Code teilen")}</button>
      </section>
      {open && <ReferralSheet referral={referral} lang={lang} onClose={close} />}
    </>
  );
}

function ReferralSheet({ referral, lang, onClose }) {
  const T = (...a) => tr(lang, ...a);
  const [copied, setCopied] = useState(null);
  const p = fmtPct(lang, referral.pct);
  const message = T(
    `¡Te comparto un ${p} de descuento en la renta de tu estancia con Xtudy! Reserva con mi código ${referral.code}: ${referral.shareUrl}. Aplica solo a renta, no al depósito. Sujeto a condiciones.`,
    `I'm sharing ${p} off the rent for your stay with Xtudy! Book with my code ${referral.code}: ${referral.shareUrl}. Rent only, not the deposit. Terms apply.`,
    `Je te partage ${p} de réduction sur le loyer de ton séjour chez Xtudy ! Réserve avec mon code ${referral.code} : ${referral.shareUrl}. Uniquement sur le loyer, pas sur le dépôt. Sous conditions.`,
    `Ich schenke dir ${p} Rabatt auf die Miete deines Aufenthalts bei Xtudy! Buche mit meinem Code ${referral.code}: ${referral.shareUrl}. Nur auf die Miete, nicht auf die Kaution. Es gelten Bedingungen.`);
  const copy = (what, text) => {
    const ok = () => { setCopied(what); setTimeout(() => setCopied((c) => (c === what ? null : c)), 1800); };
    try { navigator.clipboard.writeText(text).then(ok, () => setCopied("fail")); } catch { setCopied("fail"); }
  };
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const share = async () => {
    try { await navigator.share({ title: "Xtudy", text: message }); } catch (e) { if (e && e.name !== "AbortError") copy("message", message); }
  };
  const label = (what, idle) => (copied === what ? T("¡Copiado!", "Copied!", "Copié !", "Kopiert!") : idle);
  const until = referral.validUntil ? new Date(`${referral.validUntil}T12:00:00`).toLocaleDateString(LOCALE[lang] || "es-MX", { day: "numeric", month: "long", year: "numeric" }) : null;
  return (
    <Sheet title={T("Comparte tu código", "Share your code", "Partage ton code", "Teile deinen Code")} onClose={onClose} labelledBy="ref-sheet-title">
      <p style={styles.modalText}>{T(`Tu amigo recibe ${p} de descuento en la renta de toda su estancia al reservar con tu código.`, `Your friend gets ${p} off the rent for their whole stay when booking with your code.`, `Ton ami reçoit ${p} de réduction sur le loyer de tout son séjour en réservant avec ton code.`, `Dein Freund erhält ${p} Rabatt auf die Miete seines gesamten Aufenthalts, wenn er mit deinem Code bucht.`)}</p>
      <div style={styles.codeRow}>
        <code style={styles.codeBox}>{referral.code}</code>
        <button type="button" style={styles.benefitSecondary} onClick={() => copy("code", referral.code)}>{label("code", T("Copiar", "Copy", "Copier", "Kopieren"))}</button>
      </div>
      <label style={styles.label}>{T("Enlace de reserva con tu código", "Booking link with your code", "Lien de réservation avec ton code", "Buchungslink mit deinem Code")}
        <div style={{ display: "flex", gap: 8 }}>
          <input readOnly value={referral.shareUrl} onFocus={(e) => e.currentTarget.select()} style={{ ...styles.input, minWidth: 0, fontSize: 13 }} />
          <button type="button" style={{ ...styles.benefitSecondary, flex: "none" }} onClick={() => copy("link", referral.shareUrl)}>{label("link", T("Copiar enlace", "Copy link", "Copier le lien", "Link kopieren"))}</button>
        </div>
      </label>
      <label style={styles.label}>{T("Mensaje listo para compartir", "Ready-to-share message", "Message prêt à partager", "Nachricht zum Teilen")}
        <textarea readOnly value={message} rows={4} onFocus={(e) => e.currentTarget.select()} style={{ ...styles.input, resize: "none", fontSize: 13.5, lineHeight: 1.45 }} />
      </label>
      <div style={{ display: "grid", gap: 8, gridTemplateColumns: canShare ? "1fr 1fr" : "1fr" }}>
        {canShare && <button type="button" style={styles.benefitPrimary} onClick={share}>{T("Compartir", "Share", "Partager", "Teilen")}</button>}
        <button type="button" style={canShare ? { ...styles.benefitSecondary, minHeight: 44 } : styles.benefitPrimary} onClick={() => copy("message", message)}>{label("message", T("Copiar mensaje", "Copy message", "Copier le message", "Nachricht kopieren"))}</button>
      </div>
      {copied === "fail" && <p role="alert" style={{ ...styles.modalText, fontSize: 13 }}>{T("No pudimos copiar automáticamente. Mantén presionado el texto para copiarlo.", "We couldn't copy automatically. Press and hold the text to copy it.", "Impossible de copier automatiquement. Appuie longuement sur le texte pour le copier.", "Automatisches Kopieren nicht möglich. Halte den Text gedrückt, um ihn zu kopieren.")}</p>}
      <div style={{ borderTop: `1px solid ${colors.line}`, paddingTop: 10, display: "grid", gap: 4 }}>
        <h4 style={styles.modalH}>{T("Condiciones", "Terms", "Conditions", "Bedingungen")}</h4>
        <p style={{ ...styles.modalText, fontSize: 13, color: colors.muted }}>{T(
          `El descuento es para la persona que invitas: ${p} en la renta de toda su estancia. No aplica al depósito ni a otros cargos, ni a renovaciones. No sirve para tu propia reserva y no se combina con otros códigos ni con el beneficio VIP. Tú no recibes dinero, comisión ni descuento por compartirlo. El descuento se confirma al aplicarlo en la reserva.`,
          `The discount is for the person you invite: ${p} off the rent for their whole stay. It doesn't apply to the deposit, other charges or renewals. It can't be used for your own booking and can't be combined with other codes or the VIP benefit. You don't receive money, a commission or a discount for sharing it. The discount is confirmed when it's applied to the booking.`,
          `La réduction est pour la personne que tu invites : ${p} sur le loyer de tout son séjour. Elle ne s'applique ni au dépôt, ni aux autres frais, ni aux renouvellements. Elle n'est pas valable pour ta propre réservation et ne se cumule ni avec d'autres codes ni avec l'avantage VIP. Tu ne reçois ni argent, ni commission, ni réduction en la partageant. La réduction est confirmée lorsqu'elle est appliquée à la réservation.`,
          `Der Rabatt ist für die Person, die du einlädst: ${p} auf die Miete ihres gesamten Aufenthalts. Er gilt nicht für die Kaution, sonstige Kosten oder Verlängerungen. Er gilt nicht für deine eigene Buchung und ist nicht mit anderen Codes oder dem VIP-Vorteil kombinierbar. Du erhältst für das Teilen weder Geld noch Provision noch Rabatt. Der Rabatt wird beim Anwenden in der Buchung bestätigt.`)}
          {until ? ` ${T(`Válido hasta el ${until}.`, `Valid until ${until}.`, `Valable jusqu'au ${until}.`, `Gültig bis ${until}.`)}` : ""}</p>
      </div>
    </Sheet>
  );
}

// Si no se pudo confirmar el nivel: tarjeta neutra con el nombre (sin nivel, distinción ni permisos provisionales).
function NeutralCard({ account, lang }) {
  return (
    <div style={{ ...styles.membershipCardBig, background: "#fff" }}>
      <div style={{ ...styles.cardTop, position: "relative" }}><img src={WORDMARK_BLUE_DATA} alt="Xtudy" style={styles.cardBrandImg} /></div>
      <div style={styles.cardName}>{account.name}</div>
      <div style={styles.cardTierRow}><span style={styles.cardTierLabel}>{tr(lang, "Nivel actual", "Current tier", "Niveau actuel", "Aktuelle Stufe")}</span><span style={styles.cardTierValue}>{tr(lang, "Por confirmar", "To be confirmed", "À confirmer", "Wird bestätigt")}</span></div>
    </div>
  );
}
// Mientras el servidor confirma el nivel y la distinción: tarjeta neutra (sin nivel ni textos de permisos).
function CardSkeleton({ lang }) {
  return (
    <div style={{ ...styles.membershipCardBig, background: "#fff" }} aria-busy="true" aria-label={tr(lang, "Cargando tu membresía", "Loading your membership", "Chargement de ton adhésion", "Deine Mitgliedschaft wird geladen")}>
      <div className="xc-skel-light" style={{ height: 22, width: 110, borderRadius: 6, marginBottom: 26 }} />
      <div className="xc-skel-light" style={{ height: 22, width: "62%", borderRadius: 6, marginBottom: 10 }} />
      <div className="xc-skel-light" style={{ height: 14, width: "40%", borderRadius: 6, marginBottom: 26 }} />
      <div className="xc-skel-light" style={{ height: 14, width: "100%", borderRadius: 6 }} />
    </div>
  );
}
function GridSkeleton() {
  return <div style={styles.benefitGrid} aria-hidden="true">{[0, 1, 2].map((i) => <div key={i} className="xc-skel" style={{ height: 168, borderRadius: 16 }} />)}</div>;
}

function Dashboard({ account, restaurants, onChangeTier, onLogout }) {
  const { lang } = useContext(LangContext);
  const { me, failed, refresh } = useMember(account);
  // Hasta que el servidor confirma nivel y distinción no se muestra ninguna membresía (ni permisos) provisional.
  const loadingMe = !me && !failed;
  const level = me ? me.level : "guest";
  // Equipo Xtudy (empleado o colaborador): lo decide el servidor; no es un permiso del panel ni lo hace residente.
  const team = me && (me.team === "employee" || me.team === "collaborator") ? me.team : null;
  const resident = me ? me.resident : false;
  const gold = Boolean(me && me.gold);
  // Mientras el servidor responde, una cuenta del equipo no se muestra como «Explorador».
  const professional = Boolean(me && me.professional);
  const residentLevel = professional ? "professional" : resident ? "resident" : null;
  const cardTier = !me && account.memberType === "team" ? "team" : team && !residentLevel ? team : residentLevel || "guest";
  const [qrOpen, setQrOpen] = useState(false);
  const [vipOpen, setVipOpen] = useState(false);
  const [celebration, endCelebrationRaw] = useVipCelebration(me, account);
  const endCelebration = React.useCallback(() => { endCelebrationRaw(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Una tarjeta por comercio. Desbloqueadas: con al menos una promoción vigente a tu alcance.
  const visible = restaurants.filter(isPublishedPartner).map((r) => {
    const promos = promotionsOf(r);
    const live = promos.filter(promoIsLive);
    const usable = live.filter((p) => canUsePromo(level, p));
    return { r, live, usable, soon: promos.filter((p) => p.status === "soon") };
  });
  const unlocked = visible.filter((x) => x.usable.length);
  const lockedByTier = visible.filter((x) => !x.usable.length && x.live.length);
  const comingSoon = visible.filter((x) => !x.live.length && x.soon.length);
  // Detalles de un beneficio: ventana aparte (no alarga la cuadrícula). Al cerrar se regresa al mismo botón y posición.
  const [detail, setDetail] = useState(null);
  const openDetails = (id, promoId, mode, trigger) => setDetail({ id, promoId, mode, trigger });
  const closeDetails = () => {
    const t = detail?.trigger;
    setDetail(null);
    if (t && t.focus) setTimeout(() => t.focus({ preventScroll: true }), 0);
  };
  const open = detail ? unlocked.find((x) => x.r.id === detail.id) : null;


  return (
    <div className="page-container" style={styles.dashWrap}>
      <div style={styles.dashHeader}>
        <div>
          <div style={styles.memberBadge}><Check size={12} /> {tr(lang, "Eres parte de Students Club", "You're part of Students Club", "Tu fais partie de Students Club", "Du bist Teil von Students Club")}</div>
          <h2 style={styles.h2}>{tr(lang, "Hola", "Hi", "Salut", "Hallo")}, {account.name.split(" ")[0]}</h2>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}><LogOut size={15} /> {tr(lang, "Salir", "Log out", "Se déconnecter", "Abmelden")}</button>
      </div>

      {loadingMe ? <CardSkeleton lang={lang} /> : !me ? <NeutralCard account={account} lang={lang} /> : (
        <div className={celebration && celebration.flip ? "xc-vip-reveal" : undefined}>
          <MemberCard account={account} lang={lang} levelId={cardTier} vip={gold} teamToo={residentLevel ? team : null} />
        </div>
      )}
      {failed && !me && (
        <p role="alert" style={styles.loadNotice}>{tr(lang, "No pudimos confirmar tu nivel en este momento. Mostramos solo los beneficios para todos.", "We couldn't confirm your tier right now. We're only showing benefits open to everyone.", "Impossible de confirmer ton niveau pour le moment. Nous n'affichons que les avantages ouverts à tous.", "Deine Stufe konnte gerade nicht bestätigt werden. Wir zeigen nur Vorteile für alle.")}{" "}
          <button type="button" style={styles.vipLink} onClick={refresh}>{tr(lang, "Reintentar", "Retry", "Réessayer", "Erneut versuchen")}</button></p>
      )}
      {gold && (
        <div style={styles.vipLine}>
          <span>✦ {tr(lang, "Estás en nuestra lista VIP.", "You're on our VIP list.", "Tu fais partie de notre liste VIP.", "Du bist auf unserer VIP-Liste.")}</span>
          <button type="button" style={styles.vipLink} onClick={() => setVipOpen(true)}>{tr(lang, "¿Qué significa?", "What does it mean?", "Qu'est-ce que ça veut dire ?", "Was bedeutet das?")}</button>
        </div>
      )}
      {celebration && !celebration.staticOnly && <VipCelebration special={celebration.special} onDone={endCelebration} />}
      {celebration && celebration.special && !celebration.done && (
        <div role="status" style={styles.vipToast}>✦ {tr(lang, "¡Bienvenido a la lista VIP de Xtudy!", "Welcome to the Xtudy VIP list!", "Bienvenue dans la liste VIP de Xtudy !", "Willkommen auf der VIP-Liste von Xtudy!")}</div>
      )}
      <div style={styles.cardActions}>
        <button type="button" style={styles.cardQrBtn} onClick={() => setQrOpen(true)}><QrCode size={16} /> {tr(lang, "Mi tarjeta de membresía", "My membership card", "Ma carte de membre", "Meine Mitgliedskarte")}</button>
        <WalletButtons me={me} account={account} lang={lang} />
      </div>
      {/* Debajo de la tarjeta y del mensaje VIP: invitación compacta para compartir el descuento y, aparte y plegado, el acceso secundario con código. */}
      {me && me.referral && <ReferralStrip referral={me.referral} lang={lang} />}
      {me && <AccessPanel me={me} account={account} lang={lang} onDone={refresh} />}
      {qrOpen && <CardQrSheet me={me} account={account} lang={lang} levelId={cardTier} vip={gold} onClose={() => setQrOpen(false)} />}
      {vipOpen && me && <VipSheet me={me} account={account} lang={lang} onClose={() => setVipOpen(false)} onPrefs={refresh} />}

      {SHOW_PLANS && account.tier === "guest" && (
        <>
          <div style={styles.tierUpgradeRow}>
            {TIERS.map((t) => (
              <button key={t.id} onClick={() => t.id !== "resident" || window.confirm(tr(lang, "¿Confirmar upgrade a Residente Xtudy por $49/mes? (modo de prueba, sin cobro real)", "Confirm upgrade to Xtudy Resident for $49/mo? (test mode, no real charge)", "Confirmer la mise à niveau vers Résident Xtudy pour 49 $/mois ? (mode test, aucun frais réel)", "Upgrade auf Xtudy-Bewohner für 49 $/Monat bestätigen? (Testmodus, keine echte Abbuchung)")) ? onChangeTier(t.id) : null} style={{ ...styles.tierCard, ...(account.tier === t.id ? styles.tierCardActive : {}) }}>
                <span style={styles.tierCardPrice}>{t.price === 0 ? tr(lang, "Gratis", "Free", "Gratuit", "Kostenlos") : tr(lang, `$${t.price}/mes`, `$${t.price}/mo`, `${t.price} $/mois`, `${t.price} $/Monat`)}</span>
                <span style={styles.tierCardName}>{t.name[lang]}</span>
                <span style={styles.tierCardTag}>{t.tagline[lang]}</span>
                {account.tier === t.id && <span style={styles.currentBadge}>{tr(lang, "Plan actual", "Current plan", "Plan actuel", "Aktueller Plan")}</span>}
              </button>
            ))}
          </div>
          <p style={styles.demoNote}>{tr(lang,
            "Nota: en esta versión de prueba, el upgrade es instantáneo y sin cobro real — sirve para validar el interés. El cobro con tarjeta se integra después con Stripe.",
            "Note: in this test version, the upgrade is instant with no real charge — it's here to validate interest. Card payments will be added later with Stripe.",
            "Remarque : dans cette version de test, la mise à niveau est instantanée et sans frais réels — elle sert à valider l'intérêt. Le paiement par carte sera intégré plus tard avec Stripe.",
            "Hinweis: In dieser Testversion erfolgt das Upgrade sofort und ohne echte Abbuchung — es dient nur zur Interessensvalidierung. Die Kartenzahlung wird später mit Stripe integriert.")}</p>
        </>
      )}

      <h3 style={styles.sectionTitle}><Utensils size={16} /> {tr(lang, "Tus descuentos desbloqueados", "Your unlocked discounts", "Tes réductions débloquées", "Deine freigeschalteten Rabatte")}</h3>

      {loadingMe ? <GridSkeleton /> : <div style={styles.benefitGrid}>
        {unlocked.map(({ r, usable }) => {
          const p = usable.find((x) => x.audience === (level === "resident" ? "resident" : "guest")) || usable[0];
          return (
            <BenefitCard key={r.id} r={r} p={p} more={usable.length - 1} lang={lang}
              onPrimary={(e) => openDetails(r.id, p.id, partnerKind(r) === "online" ? "use" : "qr", e.currentTarget)}
              onDetails={(e) => openDetails(r.id, p.id, "details", e.currentTarget)} />
          );
        })}
        {unlocked.length === 0 && <p style={styles.emptyText}>{tr(lang, "Aún no tienes descuentos activos.", "You don't have any active discounts yet.", "Tu n'as pas encore de réductions actives.", "Du hast noch keine aktiven Rabatte.")}</p>}
      </div>}
      {open && (
        <BenefitDetails r={open.r} promos={open.live} initialId={detail.promoId} mode={detail.mode} lang={lang} level={level} account={account} preloaded={me && me.benefits} onClose={closeDetails} />
      )}

      {!loadingMe && lockedByTier.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}><Lock size={15} /> {tr(lang, "Para residentes y equipo Xtudy", "For residents & the Xtudy team", "Pour résidents et équipe Xtudy", "Für Bewohner & Xtudy-Team")}</h3>
          <div style={styles.lockedGrid}>
            {lockedByTier.map(({ r, live }) => <LockedCard key={r.id} r={r} p={live[0]} kind="tier" lang={lang} />)}
          </div>
        </>
      )}

      {comingSoon.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}>{tr(lang, "Próximamente", "Coming soon", "Bientôt disponible", "Demnächst")}</h3>
          <div style={styles.lockedGrid}>
            {comingSoon.map(({ r }) => <LockedCard key={r.id} r={r} kind="soon" lang={lang} />)}
          </div>
        </>
      )}
    </div>
  );
}

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;600;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
*, *::before, *::after { box-sizing: border-box; }
input, select, button { max-width: 100%; }
img { max-width: 100%; height: auto; }

.page-container {
  width: 98%;
  max-width: 1700px;
  margin: 0 auto;
}

.landing-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
}

@keyframes xc-shimmer { 0% { background-position: -320px 0; } 100% { background-position: 320px 0; } }
.xc-skel { background: linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.06) 100%); background-size: 640px 100%; animation: xc-shimmer 1.3s linear infinite; }
.xc-skel-light { background: linear-gradient(90deg, #EEF3F7 0%, #F8FAFC 50%, #EEF3F7 100%); background-size: 640px 100%; animation: xc-shimmer 1.3s linear infinite; }
@keyframes xc-reveal { 0% { transform: perspective(1100px) rotateY(-90deg) translateY(6px) scale(0.96); opacity: 0.2; } 55% { transform: perspective(1100px) rotateY(8deg) translateY(-10px) scale(1.02); opacity: 1; } 78% { transform: perspective(1100px) rotateY(-3deg) translateY(2px) scale(0.995); } 100% { transform: perspective(1100px) rotateY(0deg) translateY(0) scale(1); } }
.xc-vip-reveal { animation: xc-reveal 1050ms cubic-bezier(.2,.75,.25,1) both; transform-origin: 50% 60%; }
@media (prefers-reduced-motion: reduce) { .xc-skel, .xc-skel-light { animation: none; } .xc-vip-reveal { animation: none; } }

@media (min-width: 900px) {
  .landing-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 60px;
    align-items: center;
  }
}
`;

const colors = {
  navy: "#08304F",
  navyDeep: "#051F35",
  blue: "#0082CB",
  blueLight: "#4FC3F7",
  card: "#FFFFFF",
  ink: "#0B1F2B",
  muted: "#6B7280",
  line: "#DCE6ED",
};

const styles = {
  app: { minHeight: "100vh", background: colors.navy, fontFamily: "'Inter', sans-serif", color: colors.card, padding: "24px 8px 60px", position: "relative" },
  loadingWrap: { minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: colors.navy },
  stamp: { width: 40, height: 40, borderRadius: "50%", border: `3px dashed ${colors.blue}`, animation: "spin 1.2s linear infinite" },
  landingWrap: { position: "relative", minHeight: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "2vh" },
  landingContent: {},
  trianglePatch: { position: "absolute", top: "-10%", right: "-6%", width: "38%", height: "70%", background: colors.blue, opacity: 0.16, clipPath: "polygon(100% 0, 0 0, 100% 100%)", pointerEvents: "none" },
  fomoBanner: { display: "flex", alignItems: "center", gap: 8, background: "rgba(0,130,203,0.12)", border: `1px solid ${colors.blue}`, borderRadius: 10, padding: "9px 12px", fontSize: 12, color: "#CFE6F5", marginBottom: 18 },
  landingHero: { textAlign: "left", padding: "12px 4px 28px", position: "relative", zIndex: 1, maxWidth: 640 },
  eyebrow: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 2, color: colors.blueLight, marginBottom: 10, fontWeight: 500 },
  h1: { fontFamily: "'Host Grotesk', sans-serif", fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.1, margin: "0 0 14px", color: colors.card, fontWeight: 800 },
  accentText: { color: colors.blueLight },
  heroSub: { fontSize: "clamp(15px, 1.1vw, 17px)", lineHeight: 1.6, color: "#CFE0EC", margin: "0 0 22px", maxWidth: 460 },
  ctaBtn: { display: "inline-flex", alignItems: "center", gap: 8, background: colors.blue, color: "#fff", border: "none", borderRadius: 999, padding: "13px 22px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  heroBtnRow: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 },
  loginLink: { background: "none", border: "none", color: "#9FC0D6", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline", padding: 0 },
  ctaBtnSmall: { display: "inline-flex", alignItems: "center", gap: 6, background: colors.blue, color: "#fff", border: "none", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  unlimitedPill: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,130,203,0.14)", border: `1px solid ${colors.blue}`, color: "#CFE0EC", fontSize: 12.5, fontWeight: 600, borderRadius: 999, padding: "6px 12px", marginBottom: 18 },
  cardMock: { display: "flex", justifyContent: "center", margin: "8px 0 24px", position: "relative", zIndex: 1, width: "100%" },
  membershipCard: { background: colors.card, borderRadius: 20, padding: 26, width: "100%", maxWidth: 340, color: colors.ink, boxShadow: "0 12px 30px rgba(0,0,0,0.3)" },
  membershipCardBig: { background: colors.card, borderRadius: 18, padding: 22, color: colors.ink, boxShadow: "0 12px 30px rgba(0,0,0,0.3)", maxWidth: 420, margin: "0 auto 22px", position: "relative" },
  membershipCardResident: { border: `1.5px solid ${colors.blue}` },
  residentWatermarkWrap: { position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden" },
  residentWatermarkSvg: { position: "absolute", right: -3, top: 0, opacity: 0.07 },
  residentBadge: { position: "absolute", top: -9, right: 16, background: colors.blue, color: "#fff", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4, zIndex: 2 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cardBrand: { fontFamily: "'Host Grotesk', sans-serif", fontWeight: 800, letterSpacing: 1, fontSize: 13, color: colors.navy },
  cardBrandImg: { height: 20, width: "auto" },
  cardPoweredBy: { fontSize: 9.5, fontWeight: 600, color: "#9AA5AD", marginBottom: 4 },
  panelSymbol: { height: 26, width: "auto", marginBottom: 10 },
  appHeader: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", marginBottom: 18 },
  headerSymbol: { height: 22, width: "auto" },
  headerWordmark: { height: 22, width: "auto", justifySelf: "center" },
  headerWordmarkText: { justifySelf: "center", fontFamily: "'Host Grotesk', sans-serif", fontSize: 16, color: "#fff", letterSpacing: 0.2, marginRight: 14 },
  headerRight: { display: "flex", alignItems: "center", gap: 12, justifySelf: "end" },
  igLink: { display: "flex", alignItems: "center", justifyContent: "center", color: "#CFE0EC", opacity: 0.9 },
  bigLogoWrap: { display: "flex", justifyContent: "center", padding: "6px 0 4px" },
  bigLogoImg: { height: "clamp(48px, 7vw, 72px)", width: "auto", maxWidth: "90%" },
  bigWordmarkText: { fontFamily: "'Host Grotesk', sans-serif", fontSize: "clamp(28px, 5vw, 40px)", color: "#fff", letterSpacing: 0.2 },
  poweredByRow: { display: "flex", justifyContent: "center", marginBottom: 14 },
  poweredByBadge: { display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: "#CFE0EC", fontSize: 11.5, fontWeight: 600, borderRadius: 999, padding: "6px 14px", textAlign: "center" },
  poweredByBadgeSmall: { display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", color: "#9FC0D6", fontSize: 9.5, fontWeight: 600, borderRadius: 999, padding: "3px 10px", textAlign: "center" },
  langToggle: { display: "flex", gap: 2, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: 3 },
  langBtn: { border: "none", background: "none", color: "#9FC0D6", fontSize: 10.5, fontWeight: 700, padding: "4px 7px", borderRadius: 999, cursor: "pointer" },
  langBtnActive: { background: colors.blue, color: "#fff" },
  cardName: { fontFamily: "'Host Grotesk', sans-serif", fontSize: 19, fontWeight: 700 },
  cardUni: { fontSize: 12.5, color: colors.muted, marginTop: 2 },
  cardTierRow: { display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: `1px solid ${colors.line}` },
  cardTierLabel: { fontSize: 11.5, color: colors.muted },
  cardTierValue: { fontSize: 13.5, fontWeight: 600, color: colors.blue },
  stampsRow: { display: "flex", gap: 8, marginTop: 14 },
  stampDot: { width: 16, height: 16, borderRadius: "50%", border: `2px solid ${colors.blue}` },
  stampDotFilled: { background: colors.blue },
  landingLinks: { display: "flex", flexDirection: "column", gap: 4, alignItems: "center", marginTop: 6, position: "relative", zIndex: 1 },
  adminLink: { display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#8FB8D6", fontSize: 12, cursor: "pointer", padding: "6px 0" },
  centerWrap: { maxWidth: 440, margin: "20px auto 0" },
  panel: { background: colors.card, color: colors.ink, borderRadius: 18, padding: "26px 22px", position: "relative", boxShadow: "0 14px 34px rgba(0,0,0,0.35)" },
  backLink: { position: "absolute", top: 16, right: 16, background: "none", border: "none", color: colors.muted, cursor: "pointer" },
  h2: { fontFamily: "'Host Grotesk', sans-serif", fontSize: 24, margin: "0 0 6px", fontWeight: 800, textTransform: "uppercase", textDecoration: "underline", textDecorationColor: colors.blue, textDecorationThickness: "2px", textUnderlineOffset: "4px" },
  formSub: { fontSize: 13.5, color: colors.muted, margin: "0 0 18px" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: colors.muted, fontWeight: 500 },
  input: { width: "100%", padding: "11px 12px", borderRadius: 10, border: `1px solid ${colors.line}`, fontSize: 14.5, fontFamily: "'Inter', sans-serif", color: colors.ink, background: "#fff" },
  phoneRow: { display: "flex", gap: 8 },
  countrySelect: { padding: "11px 8px", borderRadius: 10, border: `1px solid ${colors.line}`, fontSize: 13, fontFamily: "'Inter', sans-serif", color: colors.ink, background: "#fff", maxWidth: 130 },
  radioRow: { display: "flex", gap: 8 },
  radioBtn: { flex: 1, padding: "9px 0", borderRadius: 10, border: `1px solid ${colors.line}`, background: "#fff", cursor: "pointer", fontSize: 13.5, color: colors.ink },
  radioBtnActive: { background: colors.blue, color: "#fff", borderColor: colors.blue },
  errorText: { fontSize: 12.5, color: "#B3261E" },
  yearRow: { display: "flex", gap: 8, flexWrap: "wrap", margin: "4px 0 6px" },
  yearPill: { display: "grid", gap: 2, background: "#F6F1E6", border: "1px solid #E4D5B4", borderRadius: 12, padding: "8px 12px", minWidth: 130, fontSize: 13.5 },
  referralStrip: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", maxWidth: 420, margin: "6px auto 8px", padding: "12px 14px", borderRadius: 14, background: "linear-gradient(135deg, rgba(0,130,203,0.28), rgba(79,195,247,0.10))", border: "1px solid rgba(79,195,247,0.35)" },
  referralIcon: { flex: "none", width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.12)", color: "#BFE6FB" },
  referralTitle: { margin: 0, fontFamily: "'Host Grotesk', sans-serif", fontSize: 15.5, fontWeight: 800, color: "#fff", lineHeight: 1.25 },
  referralText: { margin: "2px 0 0", fontSize: 12.5, lineHeight: 1.4, color: "#CFE6F5" },
  referralCta: { flex: "none", marginLeft: "auto", background: "#fff", color: colors.navy, border: "none", borderRadius: 999, minHeight: 40, padding: "8px 16px", fontSize: 13.5, fontWeight: 800, cursor: "pointer" },
  referralOff: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, maxWidth: 420, margin: "4px auto 6px", fontSize: 12.5, color: "#9FB7C9", textAlign: "center" },
  accessWrap: { maxWidth: 420, margin: "2px auto 10px", display: "grid", justifyItems: "center" },
  accessToggle: { display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#B9D3E6", fontSize: 13, cursor: "pointer", padding: "8px 6px", minHeight: 36 },
  accessBox: { display: "grid", gap: 10, width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 14, padding: 14 },
  accessPills: { display: "flex", gap: 6, flexWrap: "wrap" },
  accessPill: { flex: "1 1 140px", background: "transparent", color: "#E3F0F9", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, minHeight: 38, padding: "7px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  accessPillActive: { background: "#fff", color: colors.navy, borderColor: "#fff" },
  loadNotice: { textAlign: "center", fontSize: 13.5, color: "#FFE2A8", margin: "8px 0" },
  teamToggle: { display: "block", width: "100%", textAlign: "left", background: "#F2F8FD", border: `1px dashed ${colors.blue}`, borderRadius: 12, color: colors.navy, fontSize: 13.5, fontWeight: 600, padding: "11px 14px", margin: "0 0 16px", cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  teamBox: { display: "grid", gap: 8, background: "#F2F8FD", border: `1px solid ${colors.line}`, borderRadius: 12, padding: 12, margin: "0 0 16px" },
  teamOk: { display: "grid", gap: 6, background: "#E7F5EC", border: "1px solid #9FD3B0", color: "#1F5B33", borderRadius: 12, padding: 12, margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.45 },
  teamLink: { justifySelf: "start", background: "none", border: "none", padding: 0, color: colors.blue, textDecoration: "underline", fontSize: 12.5, cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  dashWrap: {},
  dashHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  memberBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,130,203,0.18)", border: `1px solid ${colors.blue}`, color: colors.blueLight, fontSize: 11.5, fontWeight: 600, borderRadius: 999, padding: "4px 10px", marginBottom: 8 },
  logoutBtn: { display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: colors.card, borderRadius: 10, padding: "8px 12px", fontSize: 12.5, cursor: "pointer" },
  tierUpgradeRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 8 },
  tierCard: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 14, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 4, cursor: "pointer", textAlign: "left", color: colors.card, position: "relative" },
  tierCardActive: { background: "rgba(0,130,203,0.22)", border: `1px solid ${colors.blue}` },
  tierCardPrice: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, color: colors.blueLight, fontWeight: 500 },
  tierCardName: { fontFamily: "'Host Grotesk', sans-serif", fontSize: 15, fontWeight: 700 },
  tierCardTag: { fontSize: 11, color: "#CFE0EC" },
  currentBadge: { position: "absolute", top: 10, right: 10, fontSize: 9.5, background: colors.blue, padding: "2px 7px", borderRadius: 999, fontWeight: 600 },
  demoNote: { fontSize: 12, color: "#9FC0D6", margin: "6px 0 26px", lineHeight: 1.5 },
  couponBanner: { display: "flex", gap: 10, alignItems: "flex-start", background: "linear-gradient(135deg, rgba(0,130,203,0.16), rgba(0,130,203,0.05))", border: `1px solid ${colors.blue}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 },
  couponTitle: { fontSize: 13, fontWeight: 700, color: colors.card, marginBottom: 6 },
  couponCodeRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  couponCode: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700, color: colors.navy, background: "#fff", padding: "4px 10px", borderRadius: 999, letterSpacing: 0.5 },
  couponPct: { fontSize: 12, fontWeight: 700, color: "#fff", background: colors.blue, padding: "4px 10px", borderRadius: 999 },
  couponHint: { fontSize: 11.5, color: "#CFE0EC", marginTop: 6 },
  exportRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 },
  exportBtn: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.25)", color: colors.card, borderRadius: 10, padding: "9px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
  sectionTitle: { display: "flex", alignItems: "center", gap: 7, fontFamily: "'Host Grotesk', sans-serif", fontSize: 15.5, margin: "22px 0 12px", fontWeight: 700 },
  offersHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, margin: "22px 0 12px" },
  locationLink: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: colors.blue, fontWeight: 600, textDecoration: "none", marginTop: 2 },
  restGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, alignItems: "start" },
  restCard: { background: colors.card, color: colors.ink, borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 4 },
  restCardLocked: { background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.25)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" },
  restCategory: { fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  restCardHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 2 },
  restLogo: { width: "auto", maxWidth: 96, height: 40, padding: "3px 5px", boxSizing: "border-box", background: "#fff", borderRadius: 8, objectFit: "contain", border: `1px solid ${colors.line}`, flexShrink: 0 },
  franchiseCheckLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#fff", gridColumn: "1 / -1" },
  termsNotice: { fontSize: 11.5, color: colors.muted, lineHeight: 1.5, margin: "2px 0 0" },
  termsLink: { color: colors.blue, fontWeight: 600, textDecoration: "underline" },
  duplicateEmailBox: { background: "#FEF3E2", border: "1px solid #F0C674", borderRadius: 10, padding: "12px 14px" },
  duplicateEmailText: { fontSize: 13.5, color: "#7A5A0A", margin: "0 0 10px" },
  branchListWrap: { marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.15)" },
  branchLinksRow: { display: "flex", flexDirection: "column", gap: 2, marginBottom: 2 },
  branchRow: { display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "center" },
  franchiseBadge: { fontSize: 11, fontWeight: 700, color: "#fff", background: colors.blue, padding: "5px 9px", borderRadius: 8, display: "inline-block", marginTop: 3, marginBottom: 2 },
  onlineBox: { display: "grid", gap: 6, margin: "6px 0" },
  onlineBadge: { fontSize: 11, fontWeight: 700, color: colors.blue, textTransform: "uppercase", letterSpacing: 0.3 },
  promoCodeBtn: { justifySelf: "start", border: `1.5px dashed ${colors.blue}`, background: "#F3F9FE", color: colors.navy, borderRadius: 10, padding: "6px 10px", fontSize: 13, cursor: "pointer" },
  partnerText: { fontSize: 12.5, color: colors.ink, lineHeight: 1.45, marginTop: 4 },
  partnerFine: { fontSize: 11, color: colors.muted, lineHeight: 1.4, marginTop: 2 },
  benefitGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))", gap: 14, alignItems: "stretch" },
  lockedGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12, marginBottom: 8 },
  lockedCard: { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 14, padding: 12, minWidth: 0 },
  lockedLogoBox: { width: 64, height: 52, flexShrink: 0, display: "grid", placeItems: "center", background: "#fff", borderRadius: 10, padding: 6, boxSizing: "border-box", border: `1px solid ${colors.line}` },
  lockedLogoImg: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: "saturate(0.85)" },
  lockedName: { fontFamily: "'Host Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  lockedNotice: { fontSize: 13, color: "#CFE6F5", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  tagSoon: { display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 0.3, color: "#CFE6F5", border: "1px solid rgba(207,230,245,0.45)", borderRadius: 999, padding: "2px 9px" },
  tagLocked: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: colors.navy, background: "#E6F1FB", borderRadius: 999, padding: "2px 9px", maxWidth: "100%", boxSizing: "border-box", lineHeight: 1.3 },
  promoChoice: { display: "flex", alignItems: "center", gap: 8, width: "100%", background: "#fff", color: colors.ink, border: `1px solid ${colors.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 44 },
  promoChoiceOn: { border: `2px solid ${colors.blue}`, background: "#F2F8FD" },
  promoChoiceSub: { fontWeight: 500, color: colors.muted },
  lockedBox: { display: "flex", gap: 10, alignItems: "flex-start", background: "#F1F5F9", color: colors.ink, borderRadius: 10, padding: "10px 12px", fontSize: 14, lineHeight: 1.45 },
  membershipCardGold: { background: "linear-gradient(135deg, #FFF6DA 0%, #F2D27A 45%, #E2B44B 100%)", border: "1.5px solid #B8860B", boxShadow: "0 10px 30px rgba(184,134,11,0.28)" },
  goldBadge: { background: "linear-gradient(135deg, #B8860B, #8A6508)", color: "#fff" },
  goldPanel: { background: "#FFFBEF", color: colors.ink, border: "1.5px solid #E2B44B", borderRadius: 16, padding: 16, margin: "12px 0 4px", display: "grid", gap: 10, maxWidth: 620 },
  goldTitle: { margin: 0, display: "flex", alignItems: "center", gap: 6, fontFamily: "'Host Grotesk', sans-serif", fontSize: 17, color: "#7A5600" },
  goldText: { margin: 0, fontSize: 15, lineHeight: 1.5 },
  ticketBox: { display: "grid", gap: 8, background: "#fff", border: "1px dashed #C99A2E", borderRadius: 12, padding: 12 },
  vipCard: { position: "relative", overflow: "hidden", maxWidth: 420, margin: "0 auto 14px", borderRadius: 18, padding: 22, color: "#F4EBD8", background: "linear-gradient(150deg, #0B2A45 0%, #0A1F35 55%, #12324F 100%)", border: "1px solid rgba(217,192,142,0.55)", boxShadow: "0 10px 26px rgba(0,0,0,0.28)" },
  vipSheen: { position: "absolute", inset: 0, background: "linear-gradient(115deg, transparent 0%, rgba(232,213,168,0.10) 38%, rgba(232,213,168,0.02) 52%, transparent 70%)", pointerEvents: "none" },
  vipTop: { position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  vipBadge: { fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: "#E8D5A8", border: "1px solid rgba(232,213,168,0.7)", borderRadius: 999, padding: "3px 10px", background: "rgba(232,213,168,0.08)" },
  vipName: { fontFamily: "'Host Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "#FFFFFF" },
  vipUni: { fontSize: 12.5, color: "#C9D6E2", marginTop: 2 },
  vipRule: { height: 1, background: "linear-gradient(90deg, rgba(217,192,142,0.75), rgba(217,192,142,0.1))", margin: "14px 0 10px" },
  vipLabel: { fontSize: 11.5, color: "#C9D6E2" },
  vipLevel: { fontSize: 13.5, fontWeight: 700, color: "#E8D5A8" },
  vipMember: { marginTop: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, letterSpacing: 1.5, color: "#AFC0CF" },
  vipLine: { display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap", fontSize: 14, color: "#E8D5A8", margin: "0 auto 10px", textAlign: "center" },
  vipLink: { background: "none", border: "none", color: "#CFE6F5", textDecoration: "underline", fontSize: 14, cursor: "pointer", padding: "6px 4px", minHeight: 32 },
  vipToast: { position: "fixed", left: "50%", top: 18, transform: "translateX(-50%)", zIndex: 61, background: "#0B2A45", color: "#F4EBD8", border: "1px solid rgba(217,192,142,0.7)", borderRadius: 999, padding: "10px 18px", fontSize: 14.5, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", pointerEvents: "none", maxWidth: "calc(100vw - 32px)", textAlign: "center" },
  vipBenefit: { display: "grid", gap: 8, background: "#FBF7EE", border: "1px solid #E6D8B8", borderRadius: 12, padding: 12 },
  cardActions: { display: "grid", gap: 10, justifyItems: "center", margin: "4px auto 8px", maxWidth: 420 },
  cardQrBtn: { display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: colors.navy, border: "none", borderRadius: 999, minHeight: 44, padding: "10px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  walletBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#000", color: "#fff", border: "1px solid #3a3a3a", borderRadius: 10, minHeight: 44, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  cardHint: { background: "#F2F6F9", borderRadius: 10, padding: "8px 12px", display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", justifyContent: "center" },
  benefitCard: { background: colors.card, color: colors.ink, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 8, minHeight: 236 },
  benefitTop: { display: "flex", alignItems: "center", gap: 12 },
  benefitLogo: { width: "auto", objectFit: "contain", background: "#fff", borderRadius: 10, padding: "4px 6px", border: `1px solid ${colors.line}`, boxSizing: "border-box", flexShrink: 0 },
  benefitMono: { display: "grid", placeItems: "center", borderRadius: 10, background: "#E6F1FB", color: colors.navy, fontWeight: 800, fontSize: 15, flexShrink: 0 },
  benefitName: { margin: 0, fontFamily: "'Host Grotesk', sans-serif", fontSize: 16, fontWeight: 700, lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  benefitDeal: { fontSize: 15, color: colors.blue, fontWeight: 700, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  benefitChipRow: { minHeight: 24 },
  benefitChip: { display: "inline-block", fontSize: 12, fontWeight: 700, color: colors.navy, background: "#E6F1FB", borderRadius: 999, padding: "4px 10px", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  benefitActions: { marginTop: "auto", display: "grid", gap: 8 },
  benefitPrimary: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: colors.blue, color: "#fff", border: "none", borderRadius: 10, minHeight: 44, padding: "10px 12px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%" },
  benefitSecondary: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#fff", color: colors.blue, border: `1px solid ${colors.blue}`, borderRadius: 10, minHeight: 40, padding: "8px 12px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(5,31,53,.62)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modal: { background: "#fff", color: colors.ink, borderRadius: 18, width: "min(560px, 100%)", maxHeight: "86vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.35)" },
  sheet: { background: "#fff", color: colors.ink, borderRadius: "18px 18px 0 0", width: "100%", maxHeight: "90vh", position: "fixed", left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", boxShadow: "0 -10px 40px rgba(0,0,0,.3)", paddingBottom: "env(safe-area-inset-bottom)" },
  modalHead: { display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 12px", borderBottom: `1px solid ${colors.line}` },
  modalTitle: { margin: 0, fontFamily: "'Host Grotesk', sans-serif", fontSize: 19, fontWeight: 700 },
  modalClose: { border: "none", background: "#F1F5F8", color: colors.ink, borderRadius: 999, width: 44, height: 44, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 },
  modalBody: { overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", padding: "14px 18px 20px", display: "grid", gap: 14 },
  modalDeal: { fontSize: 20, fontWeight: 800, color: colors.blue, lineHeight: 1.3 },
  modalSection: { display: "grid", gap: 6 },
  modalH: { margin: 0, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.4, color: colors.muted },
  modalText: { margin: 0, fontSize: 15, lineHeight: 1.5, color: colors.ink },
  stepList: { margin: 0, paddingLeft: 22, display: "grid", gap: 6, fontSize: 15, lineHeight: 1.5 },
  codeRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  codeBox: { fontSize: 18, fontWeight: 800, letterSpacing: 1, padding: "8px 14px", border: `1.5px dashed ${colors.blue}`, borderRadius: 10, background: "#F3F9FE", color: colors.navy },
  goBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: colors.blue, color: "#fff", borderRadius: 10, minHeight: 46, fontSize: 15, fontWeight: 700, textDecoration: "none" },
  origLang: { fontSize: 11, fontWeight: 500, textTransform: "none", letterSpacing: 0, color: colors.muted },
  promoHoursRow: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: colors.muted, marginTop: 3 },
  reservationNotice: { background: "#FEF3E2", border: "1px solid #F0C674", borderRadius: 10, padding: "8px 10px", marginTop: 8, marginBottom: 6 },
  reservationLabel: { display: "block", fontSize: 11.5, fontWeight: 700, color: "#7A5A0A", marginBottom: 6 },
  reservationNoticeOptional: { background: "#E6F1FB", border: "1px solid #B5D4F4", borderRadius: 10, padding: "8px 10px", marginTop: 8, marginBottom: 6 },
  reservationLabelOptional: { display: "block", fontSize: 11.5, fontWeight: 700, color: "#0C447C", marginBottom: 6 },
  whatsappBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 12.5, padding: "8px 10px", borderRadius: 8, textDecoration: "none" },
  hoursGroup: { gridColumn: "1 / -1", marginTop: 4 },
  logoUploadRow: { display: "flex", alignItems: "center", gap: 10 },
  logoPreview: { width: 40, height: 40, borderRadius: 8, objectFit: "contain", background: "#fff", border: "1px solid rgba(255,255,255,0.2)" },
  logoUploadBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 8, padding: "9px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
  removeLogoBtn: { background: "none", border: "none", color: "#FF8A8A", fontSize: 12, fontWeight: 600, textDecoration: "underline", cursor: "pointer", padding: 0 },
  hoursInputsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 8, marginTop: 6 },
  branchRowWrap: { background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 10, marginBottom: 10 },
  restName: { fontFamily: "'Host Grotesk', sans-serif", fontSize: 15.5, fontWeight: 700 },
  restNameLocked: { fontSize: 13, color: "#CFE0EC", fontWeight: 600 },
  restAddress: { fontSize: 11, color: colors.muted, lineHeight: 1.3 },
  restDiscount: { fontSize: 13, color: colors.blue, fontWeight: 600 },
  qrBtn: { marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#fff", color: colors.blue, border: `1px solid ${colors.blue}`, borderRadius: 8, padding: "9px 10px", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  qrBox: { marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#F5F9FC", borderRadius: 10, padding: 10 },
  qrHint: { fontSize: 10.5, color: colors.muted, textAlign: "center" },
  checkinWrap: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" },
  checkinCard: { background: colors.card, color: colors.ink, borderRadius: 20, padding: "36px 28px", maxWidth: 360, width: "100%", textAlign: "center", boxShadow: "0 14px 34px rgba(0,0,0,0.35)" },
  checkinCheck: { width: 64, height: 64, borderRadius: "50%", background: colors.blue, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
  checkinName: { fontFamily: "'Host Grotesk', sans-serif", fontSize: 22, fontWeight: 800 },
  checkinTier: { fontSize: 13, color: colors.blue, fontWeight: 600, marginTop: 4 },
  checkinPoweredBy: { display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 11, color: colors.muted, marginBottom: 16 },
  checkinDiscountBig: { fontFamily: "'Host Grotesk', sans-serif", fontSize: 26, fontWeight: 800, color: colors.blue, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${colors.line}` },
  checkinRest: { fontSize: 14, color: colors.muted, marginTop: 4 },
  checkinHint: { fontSize: 12, color: colors.muted, marginTop: 8, lineHeight: 1.5 },
  emptyText: { fontSize: 13, color: "#9FC0D6" },
  validOk: { marginTop: 14, background: "rgba(0,130,203,0.1)", border: `1px solid ${colors.blue}`, color: colors.navy, borderRadius: 10, padding: "10px 12px", fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 },
  validBad: { marginTop: 14, background: "rgba(179,38,30,0.08)", border: "1px solid #B3261E", color: "#B3261E", borderRadius: 10, padding: "10px 12px", fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 },
  adminStatsRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 },
  adminStatCard: { background: colors.card, color: colors.ink, borderRadius: 12, padding: "12px 16px", display: "flex", flexDirection: "column", minWidth: 90 },
  adminStatNum: { fontFamily: "'Host Grotesk', sans-serif", fontSize: 22, fontWeight: 700 },
  adminStatLabel: { fontSize: 11.5, color: colors.muted },
  adminTableWrap: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 },
  adminRow: { background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 },
  adminEditRow: { background: "rgba(0,130,203,0.1)", border: "1px solid rgba(0,130,203,0.4)", borderRadius: 10, padding: "12px", display: "flex", flexDirection: "column", gap: 10 },
  adminTierSelect: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 8, padding: "6px 8px", fontSize: 12, fontWeight: 600 },
  adminRowName: { fontSize: 13.5, fontWeight: 600 },
  adminRowMeta: { fontSize: 11.5, color: "#9FC0D6" },
  adminRowTier: { fontSize: 11.5, background: colors.blue, color: "#fff", padding: "4px 9px", borderRadius: 999, fontWeight: 600, whiteSpace: "nowrap" },
  adminAddForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 8, marginBottom: 14, alignItems: "center" },
  removeBtn: { background: "none", border: "none", color: "#E8AFAF", cursor: "pointer" },
};
