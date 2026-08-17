import React, { useState, useEffect, useMemo, createContext, useContext } from "react";


const LOGO_DATA = "data:image/png;base64,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";
const SYMBOL_DATA = "data:image/png;base64,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";
const SYMBOL_WHITE_DATA = "data:image/png;base64,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";

const LangContext = createContext({ lang: "es", setLang: () => {} });

import { Lock, Check, Utensils, Star, ChevronRight, X, LogOut, ShieldCheck, Plus, QrCode, Sparkles } from "lucide-react";

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

// Cuando quieras activar el cobro con Stripe, cambia esto a true para volver a mostrar los planes.
const SHOW_PLANS = false;

const TIERS = [
  { id: "free", name: "Essential", price: 0, order: 0, tagline: { es: "Para empezar a ahorrar", en: "To start saving" } },
  { id: "t49", name: "Plus", price: 49, order: 1, tagline: { es: "El siguiente nivel de antojos", en: "The next level of cravings" } },
  { id: "t99", name: "Ultra", price: 99, order: 2, tagline: { es: "Acceso total a la ciudad", en: "Full access to the city" } },
];

const DEFAULT_RESTAURANTS = [
  { id: "r1", name: "Dogos Bravo", category: "Hot dogs", discount: "15% de descuento", code: "BRAVO15", tier: "free", address: "Av. General Ramón Corona 2419, San Juan de Ocotán, 45019 Zapopan, Jal." },
  { id: "r2", name: "Café Vaivén", category: "Cafetería", discount: "10% de descuento", code: "VAIVEN10", tier: "free", address: "P.º Solares 30, San Juan de Ocotán, 49015 Zapopan, Jal." },
  { id: "r3", name: "Pizza Rebelde", category: "Pizza", discount: "20% en pizzas medianas", code: "BARRIO20", tier: "free", address: "Av. Ejemplo 123, Guadalajara" },
  { id: "r4", name: "Exprime GDL", category: "Jugos", discount: "10% de descuento", code: "FRESCA10", tier: "free", address: "Av. Ejemplo 456, Guadalajara" },
  { id: "r5", name: "Sushi Salvaje", category: "Sushi", discount: "25% en rollos seleccionados", code: "ROLL25", tier: "t49", address: "Av. Ejemplo 789, Guadalajara" },
  { id: "r6", name: "Burger Bandido", category: "Hamburguesas", discount: "2x1 en combo clásico", code: "NACION2X1", tier: "t49", address: "Av. Ejemplo 321, Guadalajara" },
  { id: "r7", name: "Pasta Nonna", category: "Italiana", discount: "20% de descuento", code: "PIAZZA20", tier: "t49", address: "Av. Ejemplo 654, Guadalajara" },
  { id: "r8", name: "Poke Tribu", category: "Poke", discount: "15% de descuento", code: "POKE15", tier: "t49", address: "Av. Ejemplo 987, Guadalajara" },
  { id: "r9", name: "Fuego Norteño", category: "Carnes", discount: "30% en cortes seleccionados", code: "VALLE30", tier: "t99", address: "Av. Ejemplo 111, Guadalajara" },
  { id: "r10", name: "Ramen Kaiju", category: "Ramen", discount: "20% + bebida gratis", code: "KOJI20", tier: "t99", address: "Av. Ejemplo 222, Guadalajara" },
  { id: "r11", name: "La Marea Brava", category: "Mariscos", discount: "25% de descuento", code: "OLA25", tier: "t99", address: "Av. Ejemplo 333, Guadalajara" },
  { id: "r12", name: "Antojo Callejero", category: "Mexicana", discount: "2x1 entre semana", code: "NORTE2X1", tier: "t99", address: "Av. Ejemplo 444, Guadalajara" },
  { id: "r13", name: "El Asador Salvaje", category: "Carnes premium", discount: "35% en cortes", code: "ROBLE35", tier: "t99", address: "Av. Ejemplo 555, Guadalajara" },
  { id: "r14", name: "Omakase Luna", category: "Sushi premium", discount: "30% de descuento", code: "LUNA30", tier: "t99", address: "Av. Ejemplo 666, Guadalajara" },
  { id: "r15", name: "Rooftop Cielo", category: "Bar / Terraza", discount: "2x1 en bebidas", code: "CIELO2X1", tier: "t99", address: "Av. Ejemplo 777, Guadalajara" },
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

const ADMIN_CODE = "xtudy-admin";

function tierOrder(id) {
  return TIERS.find((t) => t.id === id)?.order ?? 0;
}

function genMemberId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 7; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return `XT-${id}`;
}

function QRCode({ value, size = 140 }) {
  const data = useMemo(() => {
    try {
      const qr = qrcode(0, "L");
      qr.addData(String(value || ""));
      qr.make();
      const count = qr.getModuleCount();
      const cells = [];
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (qr.isDark(r, c)) cells.push([r, c]);
        }
      }
      return { count, cells };
    } catch (e) {
      return null;
    }
  }, [value]);

  if (!data) return <div style={{ fontSize: 11, color: "#B3261E" }}>No se pudo generar el código QR.</div>;

  const quiet = 2;
  const total = data.count + quiet * 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges">
      <rect width={total} height={total} fill="#ffffff" />
      {data.cells.map(([r, c], i) => (
        <rect key={i} x={c + quiet} y={r + quiet} width="1" height="1" fill="#0B1F2B" />
      ))}
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

export default function ClubDescuentos() {
  const [view, setView] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [restaurants, setRestaurants] = useState(DEFAULT_RESTAURANTS);
  const [universities, setUniversities] = useState(DEFAULT_UNIVERSITIES);

  const [form, setForm] = useState({ name: "", email: "", phone: "", university: DEFAULT_UNIVERSITIES[0].name, isXtudy: "no" });
  const [formError, setFormError] = useState("");
  const [adminInput, setAdminInput] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [newRest, setNewRest] = useState({ name: "", category: "", discount: "", code: "", tier: "free", address: "" });
  const [newUni, setNewUni] = useState({ name: "", tipo: "Pública" });

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
      return m && r ? { m, r } : null;
    } catch {
      return null;
    }
  });
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const myEmail = await storageGet("my-email", false);
        const savedLang = await storageGet("my-lang", false);
        if (savedLang === "en" || savedLang === "es") setLangState(savedLang);
        const list = await storageGet("restaurants-list", true);
        let restList = DEFAULT_RESTAURANTS;
        if (list) { try { restList = JSON.parse(list); setRestaurants(restList); } catch {} }
        else persist(() => window.storage.set("restaurants-list", JSON.stringify(DEFAULT_RESTAURANTS), true));

        const unis = await storageGet("universities-list", true);
        if (unis) { try { setUniversities(JSON.parse(unis)); } catch {} }
        else persist(() => window.storage.set("universities-list", JSON.stringify(DEFAULT_UNIVERSITIES), true));

        if (verifyParams) {
          const restaurant = restList.find((r) => r.id === verifyParams.r);
          const val = await storageGet(`member:${verifyParams.m}`, true);
          if (!restaurant) {
            setVerifyResult({ status: "notfound" });
          } else if (!val) {
            setVerifyResult({ status: "notfound" });
          } else {
            let acc;
            try { acc = JSON.parse(val); } catch { acc = null; }
            if (!acc) {
              setVerifyResult({ status: "notfound" });
            } else if (tierOrder(acc.tier) >= tierOrder(restaurant.tier)) {
              setVerifyResult({ status: "ok", name: acc.name, tier: acc.tier, restaurant });
              persist(() => window.storage.set(
                `redemption:${restaurant.id}:${Date.now()}`,
                JSON.stringify({ restaurant: restaurant.name, email: acc.email, name: acc.name, tier: acc.tier, at: new Date().toISOString() }),
                true
              ));
            } else {
              setVerifyResult({ status: "tier", name: acc.name, requiredTier: TIERS.find((t) => t.id === restaurant.tier)?.name });
            }
          }
          setLoading(false);
          return;
        }

        if (myEmail) {
          const acc = await storageGet(`account:${myEmail}`, true);
          if (acc) {
            try {
              let parsedAcc = JSON.parse(acc);
              if (!parsedAcc.memberId) {
                parsedAcc = { ...parsedAcc, memberId: genMemberId() };
                persist(async () => {
                  await window.storage.set(`account:${parsedAcc.email}`, JSON.stringify(parsedAcc), true);
                  await window.storage.set(`member:${parsedAcc.memberId}`, JSON.stringify({ memberId: parsedAcc.memberId, name: parsedAcc.name, email: parsedAcc.email, tier: parsedAcc.tier }), true);
                });
              }
              setAccount(parsedAcc);
              setView("dashboard");
            } catch {}
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveRestaurants = (list) => {
    setRestaurants(list);
    persist(() => window.storage.set("restaurants-list", JSON.stringify(list), true));
  };

  const saveUniversities = (list) => {
    setUniversities(list);
    persist(() => window.storage.set("universities-list", JSON.stringify(list), true));
  };

  const handleRegister = () => {
    setFormError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setFormError("Completa todos los campos para continuar.");
      return;
    }
    const newAccount = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      university: form.university,
      isXtudy: form.isXtudy,
      tier: "free",
      createdAt: new Date().toISOString(),
      memberId: genMemberId(),
    };
    // Avanza de inmediato: nunca deja al usuario atorado esperando la red.
    setAccount(newAccount);
    setView("dashboard");
    persist(async () => {
      await window.storage.set(`account:${newAccount.email}`, JSON.stringify(newAccount), true);
      await window.storage.set(`member:${newAccount.memberId}`, JSON.stringify({ memberId: newAccount.memberId, name: newAccount.name, email: newAccount.email, tier: newAccount.tier }), true);
      await window.storage.set("my-email", newAccount.email, false);
    });
  };

  const changeTier = (tierId) => {
    if (!account) return;
    const updated = { ...account, tier: tierId };
    setAccount(updated);
    persist(async () => {
      await window.storage.set(`account:${account.email}`, JSON.stringify(updated), true);
      if (updated.memberId) await window.storage.set(`member:${updated.memberId}`, JSON.stringify({ memberId: updated.memberId, name: updated.name, email: updated.email, tier: updated.tier }), true);
    });
  };

  const logout = () => {
    persist(() => window.storage.delete("my-email", false));
    setAccount(null);
    setView("landing");
  };

  const submitAdminCode = () => {
    if (adminInput === ADMIN_CODE) {
      setAdminUnlocked(true);
      setView("admin");
      persist(async () => {
        try {
          const idx = await window.storage.list("account:", true);
          const keys = idx?.keys || [];
          const accs = [];
          for (const k of keys) {
            const val = await storageGet(k, true);
            if (val) { try { accs.push(JSON.parse(val)); } catch {} }
          }
          setAllAccounts(accs);
        } catch { setAllAccounts([]); }
        try {
          const ridx = await window.storage.list("redemption:", true);
          const rkeys = ridx?.keys || [];
          const reds = [];
          for (const k of rkeys) {
            const val = await storageGet(k, true);
            if (val) { try { reds.push(JSON.parse(val)); } catch {} }
          }
          reds.sort((a, b) => new Date(b.at) - new Date(a.at));
          setRedemptions(reds);
        } catch { setRedemptions([]); }
      });
    } else {
      setFormError("Código incorrecto.");
    }
  };

  const addRestaurant = () => {
    if (!newRest.name.trim() || !newRest.code.trim()) return;
    saveRestaurants([...restaurants, { id: `r${Date.now()}`, ...newRest }]);
    setNewRest({ name: "", category: "", discount: "", code: "", tier: "free", address: "" });
  };
  const removeRestaurant = (id) => saveRestaurants(restaurants.filter((r) => r.id !== id));

  const addUniversity = () => {
    if (!newUni.name.trim()) return;
    saveUniversities([...universities.slice(0, -1), { ...newUni }, universities[universities.length - 1]]);
    setNewUni({ name: "", tipo: "Pública" });
  };
  const removeUniversity = (name) => saveUniversities(universities.filter((u) => u.name !== name));

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
            <img src={SYMBOL_DATA} alt="Xtudy" style={{ height: 28, marginBottom: 14 }} />
            {!verifyResult && <p style={styles.formSub}>Verificando…</p>}
            {verifyResult && verifyResult.status === "ok" && (
              <>
                <div style={styles.checkinCheck}><Check size={40} color="#fff" strokeWidth={3} /></div>
                <div style={styles.checkinName}>{verifyResult.name}</div>
                <div style={styles.checkinTier}>Miembro del Club Xtudy · {TIERS.find((t) => t.id === verifyResult.tier)?.name}</div>
                <div style={styles.checkinDiscountBig}>{verifyResult.restaurant.discount}</div>
                <div style={styles.checkinRest}>{verifyResult.restaurant.name}</div>
                <p style={styles.checkinHint}>Este estudiante tiene acceso confirmado a este descuento.</p>
              </>
            )}
            {verifyResult && verifyResult.status === "tier" && (
              <>
                <div style={{ ...styles.checkinCheck, background: "#B3261E" }}><X size={40} color="#fff" strokeWidth={3} /></div>
                <div style={styles.checkinName}>{verifyResult.name}</div>
                <p style={styles.checkinHint}>Este estudiante no tiene acceso a este restaurante — requiere nivel {verifyResult.requiredTier}.</p>
              </>
            )}
            {verifyResult && verifyResult.status === "notfound" && (
              <>
                <div style={{ ...styles.checkinCheck, background: "#B3261E" }}><X size={40} color="#fff" strokeWidth={3} /></div>
                <p style={styles.checkinHint}>Este código no es válido o ya expiró.</p>
              </>
            )}
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
        <Landing onStart={() => setView("register")} onAdmin={() => setView("admin-login")} />
      )}

      {view === "register" && (
        <Register form={form} setForm={setForm} onSubmit={handleRegister} error={formError} onBack={() => setView("landing")} universities={universities} />
      )}

      {view === "dashboard" && account && (
        <Dashboard account={account} restaurants={restaurants} onChangeTier={changeTier} onLogout={logout} />
      )}

      {view === "admin-login" && (
        <AdminLogin value={adminInput} setValue={setAdminInput} onSubmit={submitAdminCode} error={formError} onBack={() => { setFormError(""); setView("landing"); }} />
      )}

      {view === "admin" && adminUnlocked && (
        <AdminPanel
          accounts={allAccounts} restaurants={restaurants} universities={universities} redemptions={redemptions}
          newRest={newRest} setNewRest={setNewRest} onAddRest={addRestaurant} onRemoveRest={removeRestaurant}
          newUni={newUni} setNewUni={setNewUni} onAddUni={addUniversity} onRemoveUni={removeUniversity}
          onBack={() => setView("landing")}
        />
      )}
    </div>
    </LangContext.Provider>
  );
}

function AppHeader() {
  return (
    <div style={styles.appHeader}>
      <img src={SYMBOL_WHITE_DATA} alt="Xtudy" style={styles.headerSymbol} />
      <LangToggle />
    </div>
  );
}

function LangToggle() {
  const { lang, setLang } = useContext(LangContext);
  return (
    <div style={styles.langToggle}>
      <button style={{ ...styles.langBtn, ...(lang === "es" ? styles.langBtnActive : {}) }} onClick={() => setLang("es")}>ES</button>
      <button style={{ ...styles.langBtn, ...(lang === "en" ? styles.langBtnActive : {}) }} onClick={() => setLang("en")}>EN</button>
    </div>
  );
}

function FomoBanner() {
  const { lang } = useContext(LangContext);
  return (
    <div style={styles.fomoBanner}>
      <Sparkles size={14} color={colors.blue} />
      <span>
        {lang === "es"
          ? (<>Ya hay estudiantes de GDL ahorrando cada semana en restaurantes. <b>No te quedes fuera.</b></>)
          : (<>Students in GDL are already saving every week at local restaurants. <b>Don't miss out.</b></>)}
      </span>
    </div>
  );
}

function Landing({ onStart, onAdmin }) {
  const { lang } = useContext(LangContext);
  return (
    <div style={styles.landingWrap}>
      <FomoBanner />
      <div style={styles.trianglePatch} />
      <div style={styles.landingContent}>
        <div style={styles.landingHero}>
          <div style={styles.eyebrow}>{lang === "es" ? "CLUB DE ESTUDIANTES" : "STUDENT CLUB"}</div>
          <h1 style={styles.h1}>
            {lang === "es"
              ? (<>Descuentos que <span style={styles.accentText}>sí</span> vas a usar.</>)
              : (<>Discounts you'll <span style={styles.accentText}>actually</span> use.</>)}
          </h1>
          <p style={styles.heroSub}>
            {lang === "es"
              ? "Regístrate gratis y desbloquea descuentos reales en restaurantes de Guadalajara. Sin credencial que verificar: solo tu correo y listo."
              : "Sign up for free and unlock real discounts at restaurants in Guadalajara. No ID to verify: just your email and you're in."}
          </p>
          <div style={styles.unlimitedPill}>
            <Sparkles size={13} color={colors.blue} />
            {lang === "es" ? "Úsalos las veces que quieras, sin límite" : "Use them as many times as you want, no limit"}
          </div>
          <button style={styles.ctaBtn} onClick={onStart}>
            {lang === "es" ? "Registrarme gratis" : "Sign up for free"} <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div style={styles.cardMock}>
          <div style={styles.membershipCard}>
            <div style={styles.cardTop}>
              <img src={SYMBOL_DATA} alt="Xtudy" style={styles.cardBrandImg} />
              <Star size={18} color={colors.blue} fill={colors.blue} />
            </div>
            <div style={styles.cardName}>{lang === "es" ? "Tu nombre aquí" : "Your name here"}</div>
            <div style={styles.cardUni}>{lang === "es" ? "Tu universidad" : "Your university"}</div>
            <div style={styles.stampsRow}>
              {TIERS.map((t, i) => (
                <div key={t.id} style={{ ...styles.stampDot, ...(i === 0 ? styles.stampDotFilled : {}) }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.landingLinks}>
        <button style={styles.adminLink} onClick={onAdmin}><ShieldCheck size={13} /> {lang === "es" ? "Acceso administrador" : "Admin access"}</button>
      </div>
    </div>
  );
}

function Register({ form, setForm, onSubmit, error, onBack, universities }) {
  const { lang } = useContext(LangContext);
  const publicas = universities.filter((u) => u.tipo === "Pública");
  const privadas = universities.filter((u) => u.tipo === "Privada");
  const otras = universities.filter((u) => u.tipo === "Otra");
  return (
    <div style={styles.centerWrap}>
      <div style={styles.panel}>
        <button style={styles.backLink} onClick={onBack}><X size={16} /></button>
        <img src={SYMBOL_DATA} alt="Xtudy" style={styles.panelSymbol} />
        <div style={styles.eyebrow}>{lang === "es" ? "PASO 1 DE 1" : "STEP 1 OF 1"}</div>
        <h2 style={styles.h2}>{lang === "es" ? "Crea tu cuenta" : "Create your account"}</h2>
        <p style={styles.formSub}>{lang === "es" ? "Toma menos de un minuto. Empiezas en el nivel gratis al instante." : "Takes less than a minute. You start on the free tier right away."}</p>
        <div style={styles.form}>
          <label style={styles.label}>{lang === "es" ? "Nombre completo" : "Full name"}
            <input style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={lang === "es" ? "Ej. Ana Torres" : "E.g. Ana Torres"} />
          </label>
          <label style={styles.label}>{lang === "es" ? "Correo electrónico" : "Email"}
            <input style={styles.input} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={lang === "es" ? "tucorreo@ejemplo.com" : "youremail@example.com"} />
          </label>
          <label style={styles.label}>{lang === "es" ? "Teléfono" : "Phone"}
            <input style={styles.input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={lang === "es" ? "10 dígitos" : "10 digits"} />
          </label>
          <label style={styles.label}>{lang === "es" ? "Universidad" : "University"}
            <select style={styles.input} value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })}>
              <optgroup label={lang === "es" ? "Públicas" : "Public"}>{publicas.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}</optgroup>
              <optgroup label={lang === "es" ? "Privadas" : "Private"}>{privadas.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}</optgroup>
              <optgroup label={lang === "es" ? "Otra" : "Other"}>{otras.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}</optgroup>
            </select>
          </label>
          <label style={styles.label}>{lang === "es" ? "¿Eres cliente de Xtudy?" : "Are you an Xtudy tenant?"}
            <div style={styles.radioRow}>
              <button type="button" style={{ ...styles.radioBtn, ...(form.isXtudy === "si" ? styles.radioBtnActive : {}) }} onClick={() => setForm({ ...form, isXtudy: "si" })}>{lang === "es" ? "Sí" : "Yes"}</button>
              <button type="button" style={{ ...styles.radioBtn, ...(form.isXtudy === "no" ? styles.radioBtnActive : {}) }} onClick={() => setForm({ ...form, isXtudy: "no" })}>No</button>
            </div>
          </label>
          {error && <div style={styles.errorText}>{error}</div>}
          <button type="button" style={styles.ctaBtn} onClick={onSubmit}>{lang === "es" ? "Crear mi cuenta" : "Create my account"}</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ account, restaurants, onChangeTier, onLogout }) {
  const { lang } = useContext(LangContext);
  const myOrder = tierOrder(account.tier);
  const unlocked = restaurants.filter((r) => tierOrder(r.tier) <= myOrder);
  const locked = restaurants.filter((r) => tierOrder(r.tier) > myOrder);
  const [openQrFor, setOpenQrFor] = useState(null);

  const verifyUrl = (restaurantId) => {
    try {
      return `${window.location.origin}${window.location.pathname}?m=${encodeURIComponent(account.memberId)}&r=${encodeURIComponent(restaurantId)}`;
    } catch {
      return `?m=${account.memberId}&r=${restaurantId}`;
    }
  };

  return (
    <div style={styles.dashWrap}>
      <div style={styles.dashHeader}>
        <div>
          <div style={styles.memberBadge}><Check size={12} /> {lang === "es" ? "Eres parte del Club Xtudy" : "You're part of the Xtudy Club"}</div>
          <h2 style={styles.h2}>{lang === "es" ? "Hola" : "Hi"}, {account.name.split(" ")[0]}</h2>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}><LogOut size={15} /> {lang === "es" ? "Salir" : "Log out"}</button>
      </div>

      <div style={styles.membershipCardBig}>
        <div style={styles.cardTop}>
          <img src={SYMBOL_DATA} alt="Xtudy" style={styles.cardBrandImg} />
          <Star size={18} color={colors.blue} fill={colors.blue} />
        </div>
        <div style={styles.cardName}>{account.name}</div>
        <div style={styles.cardUni}>{account.university}</div>
        <div style={styles.cardTierRow}>
          <span style={styles.cardTierLabel}>{lang === "es" ? "Nivel actual" : "Current tier"}</span>
          <span style={styles.cardTierValue}>{TIERS.find((t) => t.id === account.tier)?.name}</span>
        </div>
        <div style={styles.stampsRow}>
          {TIERS.map((t) => (
            <div key={t.id} style={{ ...styles.stampDot, ...(t.order <= myOrder ? styles.stampDotFilled : {}) }} />
          ))}
        </div>
      </div>

      {SHOW_PLANS && account.isXtudy === "si" && (
        <div style={styles.couponBanner}>
          <Sparkles size={16} color={colors.blue} />
          <div>
            <div style={styles.couponTitle}>
              {lang === "es" ? "¡Tienes un descuento especial por ser cliente Xtudy!" : "You have a special discount as an Xtudy tenant!"}
            </div>
            <div style={styles.couponCodeRow}>
              <span style={styles.couponCode}>WELCOME_TO_XTUDY</span>
              <span style={styles.couponPct}>{lang === "es" ? "50% OFF" : "50% OFF"}</span>
            </div>
            <div style={styles.couponHint}>
              {lang === "es" ? "Úsalo al pagar cualquier plan mensual." : "Use it when paying for any monthly plan."}
            </div>
          </div>
        </div>
      )}

      {SHOW_PLANS && (
        <>
          <div style={styles.tierUpgradeRow}>
            {TIERS.map((t) => (
              <button key={t.id} onClick={() => onChangeTier(t.id)} style={{ ...styles.tierCard, ...(account.tier === t.id ? styles.tierCardActive : {}) }}>
                <span style={styles.tierCardPrice}>{t.price === 0 ? (lang === "es" ? "Gratis" : "Free") : (lang === "es" ? `$${t.price}/mes` : `$${t.price}/mo`)}</span>
                <span style={styles.tierCardName}>{t.name}</span>
                <span style={styles.tierCardTag}>{t.tagline[lang]}</span>
                {account.tier === t.id && <span style={styles.currentBadge}>{lang === "es" ? "Plan actual" : "Current plan"}</span>}
              </button>
            ))}
          </div>
          <p style={styles.demoNote}>
            {lang === "es"
              ? "Nota: en esta versión de prueba, cambiar de plan es instantáneo y sin cobro real — sirve para validar el interés. El cobro con tarjeta se integra en la versión final."
              : "Note: in this test version, switching plans is instant with no real charge — it's here to validate interest. Card payments will be added in the final version."}
          </p>
        </>
      )}

      <h3 style={styles.sectionTitle}><Utensils size={16} /> {lang === "es" ? "Tus descuentos desbloqueados" : "Your unlocked discounts"}</h3>
      <div style={styles.restGrid}>
        {unlocked.map((r) => (
          <div key={r.id} style={styles.restCard}>
            <div style={styles.restCategory}>{r.category}</div>
            <div style={styles.restName}>{r.name}</div>
            {r.address && <div style={styles.restAddress}>📍 {r.address}</div>}
            <div style={styles.restDiscount}>{r.discount}</div>
            <button style={styles.qrBtn} onClick={() => setOpenQrFor(openQrFor === r.id ? null : r.id)}>
              <QrCode size={14} /> {openQrFor === r.id ? (lang === "es" ? "Ocultar QR" : "Hide QR") : (lang === "es" ? "Mostrar QR" : "Show QR")}
            </button>
            {openQrFor === r.id && (
              <div style={styles.qrBox}>
                <QRCode value={verifyUrl(r.id)} size={160} />
                <span style={styles.qrHint}>
                  {lang === "es" ? "El mesero lo escanea con la cámara de su celular y confirma tu membresía al instante." : "The waiter scans it with their phone camera and confirms your membership instantly."}
                </span>
              </div>
            )}
          </div>
        ))}
        {unlocked.length === 0 && <p style={styles.emptyText}>{lang === "es" ? "Aún no tienes descuentos activos." : "You don't have any active discounts yet."}</p>}
      </div>

      {locked.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}><Lock size={15} /> {lang === "es" ? "Próximamente" : "Coming soon"}</h3>
          <div style={styles.restGrid}>
            {locked.map((r) => (
              <div key={r.id} style={styles.restCardLocked}>
                <Lock size={22} color="#8FA5B8" />
                <div style={styles.restCategory}>{r.category}</div>
                <div style={styles.restNameLocked}>{r.name}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AdminLogin({ value, setValue, onSubmit, error, onBack }) {
  return (
    <div style={styles.centerWrap}>
      <div style={styles.panel}>
        <button style={styles.backLink} onClick={onBack}><X size={16} /></button>
        <div style={styles.eyebrow}>ACCESO RESTRINGIDO</div>
        <h2 style={styles.h2}>Panel de administrador</h2>
        <p style={styles.formSub}>Solo para uso interno mientras validas el proyecto.</p>
        <input style={styles.input} type="password" placeholder="Código de acceso" value={value} onChange={(e) => setValue(e.target.value)} />
        {error && <div style={styles.errorText}>{error}</div>}
        <button style={{ ...styles.ctaBtn, marginTop: 14 }} onClick={onSubmit}>Entrar</button>
      </div>
    </div>
  );
}

function AdminPanel({ accounts, restaurants, universities, redemptions, newRest, setNewRest, onAddRest, onRemoveRest, newUni, setNewUni, onAddUni, onRemoveUni, onBack }) {
  const counts = TIERS.map((t) => ({ ...t, count: accounts.filter((a) => a.tier === t.id).length }));

  const byRestaurant = {};
  const byUser = {};
  (redemptions || []).forEach((r) => {
    byRestaurant[r.restaurant] = (byRestaurant[r.restaurant] || 0) + 1;
    const key = r.email || "sin identificar";
    byUser[key] = (byUser[key] || 0) + 1;
  });

  const downloadCsv = (filename, rows) => {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAccounts = () => {
    const rows = [["Nombre", "Correo", "Teléfono", "Universidad", "Cliente Xtudy", "Nivel", "Fecha de registro"]];
    accounts.forEach((a) => rows.push([a.name, a.email, a.phone, a.university, a.isXtudy === "si" ? "Sí" : "No", TIERS.find((t) => t.id === a.tier)?.name || a.tier, a.createdAt]));
    downloadCsv("registros_xtudy_club.csv", rows);
  };

  const exportRedemptions = () => {
    const rows = [["Estudiante", "Correo", "Restaurante", "Nivel", "Fecha y hora"]];
    (redemptions || []).forEach((r) => rows.push([r.name, r.email, r.restaurant, TIERS.find((t) => t.id === r.tier)?.name || r.tier, r.at]));
    downloadCsv("canjes_xtudy_club.csv", rows);
  };

  return (
    <div style={styles.dashWrap}>
      <div style={styles.dashHeader}>
        <div><div style={styles.eyebrow}>PANEL INTERNO</div><h2 style={styles.h2}>Administración</h2></div>
        <button style={styles.logoutBtn} onClick={onBack}><X size={15} /> Cerrar</button>
      </div>

      <div style={styles.exportRow}>
        <button style={styles.exportBtn} onClick={exportAccounts}>⬇ Exportar registros (CSV)</button>
        <button style={styles.exportBtn} onClick={exportRedemptions}>⬇ Exportar canjes (CSV)</button>
      </div>

      <h3 style={styles.sectionTitle}>Suscriptores por nivel</h3>
      <div style={styles.adminStatsRow}>
        {counts.map((c) => (
          <div key={c.id} style={styles.adminStatCard}>
            <span style={styles.adminStatNum}>{c.count}</span>
            <span style={styles.adminStatLabel}>{c.name}</span>
          </div>
        ))}
      </div>

      <h3 style={styles.sectionTitle}>Registros ({accounts.length})</h3>
      <div style={styles.adminTableWrap}>
        {accounts.length === 0 && <p style={styles.emptyText}>Todavía no hay registros.</p>}
        {accounts.map((a) => (
          <div key={a.email} style={styles.adminRow}>
            <div>
              <div style={styles.adminRowName}>{a.name}</div>
              <div style={styles.adminRowMeta}>{a.email} · {a.phone} · {a.university} · Xtudy: {a.isXtudy === "si" ? "Sí" : "No"}</div>
            </div>
            <span style={styles.adminRowTier}>{TIERS.find((t) => t.id === a.tier)?.name}</span>
          </div>
        ))}
      </div>

      <h3 style={styles.sectionTitle}>Restaurantes ({restaurants.length})</h3>
      <div style={styles.adminAddForm}>
        <input style={styles.input} placeholder="Nombre" value={newRest.name} onChange={(e) => setNewRest({ ...newRest, name: e.target.value })} />
        <input style={styles.input} placeholder="Categoría" value={newRest.category} onChange={(e) => setNewRest({ ...newRest, category: e.target.value })} />
        <input style={styles.input} placeholder="Descuento (ej. 15% de descuento)" value={newRest.discount} onChange={(e) => setNewRest({ ...newRest, discount: e.target.value })} />
        <input style={styles.input} placeholder="Código" value={newRest.code} onChange={(e) => setNewRest({ ...newRest, code: e.target.value })} />
        <input style={styles.input} placeholder="Dirección de la sucursal" value={newRest.address} onChange={(e) => setNewRest({ ...newRest, address: e.target.value })} />
        <select style={styles.input} value={newRest.tier} onChange={(e) => setNewRest({ ...newRest, tier: e.target.value })}>
          {TIERS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button style={styles.ctaBtnSmall} onClick={onAddRest}><Plus size={15} /> Agregar restaurante</button>
      </div>
      <div style={styles.adminTableWrap}>
        {restaurants.map((r) => (
          <div key={r.id} style={styles.adminRow}>
            <div>
              <div style={styles.adminRowName}>{r.name} <span style={styles.adminRowMeta}>({r.category})</span></div>
              <div style={styles.adminRowMeta}>{r.discount} · código: {r.code} · nivel: {TIERS.find((t) => t.id === r.tier)?.name}</div>
            </div>
            <button style={styles.removeBtn} onClick={() => onRemoveRest(r.id)}><X size={14} /></button>
          </div>
        ))}
      </div>

      <h3 style={styles.sectionTitle}><QrCode size={15} /> Canjes registrados ({(redemptions || []).length})</h3>
      <div style={styles.adminStatsRow}>
        <div style={styles.adminStatCard}>
          <span style={styles.adminStatNum}>{(redemptions || []).length}</span>
          <span style={styles.adminStatLabel}>Total de canjes</span>
        </div>
      </div>
      <p style={styles.demoNote}>Por restaurante:</p>
      <div style={styles.adminTableWrap}>
        {Object.keys(byRestaurant).length === 0 && <p style={styles.emptyText}>Aún no hay canjes registrados.</p>}
        {Object.entries(byRestaurant).map(([name, count]) => (
          <div key={name} style={styles.adminRow}>
            <div style={styles.adminRowName}>{name}</div>
            <span style={styles.adminRowTier}>{count} canje{count === 1 ? "" : "s"}</span>
          </div>
        ))}
      </div>
      <p style={styles.demoNote}>Por estudiante:</p>
      <div style={styles.adminTableWrap}>
        {Object.entries(byUser).map(([email, count]) => (
          <div key={email} style={styles.adminRow}>
            <div style={styles.adminRowName}>{email}</div>
            <span style={styles.adminRowTier}>{count} canje{count === 1 ? "" : "s"}</span>
          </div>
        ))}
      </div>

      <p style={styles.demoNote}>Bitácora (más reciente primero):</p>
      <div style={styles.adminTableWrap}>
        {(redemptions || []).length === 0 && <p style={styles.emptyText}>Aún no hay canjes registrados.</p>}
        {(redemptions || []).map((r, i) => (
          <div key={i} style={styles.adminRow}>
            <div>
              <div style={styles.adminRowName}>{r.name || r.email} — {r.restaurant}</div>
              <div style={styles.adminRowMeta}>{new Date(r.at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })} · nivel: {TIERS.find((t) => t.id === r.tier)?.name || r.tier}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={styles.sectionTitle}>Universidades ({universities.length})</h3>
      <div style={styles.adminAddForm}>
        <input style={styles.input} placeholder="Nombre de la universidad" value={newUni.name} onChange={(e) => setNewUni({ ...newUni, name: e.target.value })} />
        <select style={styles.input} value={newUni.tipo} onChange={(e) => setNewUni({ ...newUni, tipo: e.target.value })}>
          <option value="Pública">Pública</option>
          <option value="Privada">Privada</option>
        </select>
        <button style={styles.ctaBtnSmall} onClick={onAddUni}><Plus size={15} /> Agregar universidad</button>
      </div>
      <div style={styles.adminTableWrap}>
        {universities.map((u) => (
          <div key={u.name} style={styles.adminRow}>
            <div style={styles.adminRowName}>{u.name} <span style={styles.adminRowMeta}>({u.tipo})</span></div>
            {u.tipo !== "Otra" && <button style={styles.removeBtn} onClick={() => onRemoveUni(u.name)}><X size={14} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;600;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
*, *::before, *::after { box-sizing: border-box; }
input, select, button { max-width: 100%; }
img { max-width: 100%; height: auto; }
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
  app: { minHeight: "100vh", background: colors.navy, fontFamily: "'Inter', sans-serif", color: colors.card, padding: "24px 16px 60px", position: "relative" },
  loadingWrap: { minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: colors.navy },
  stamp: { width: 40, height: 40, borderRadius: "50%", border: `3px dashed ${colors.blue}`, animation: "spin 1.2s linear infinite" },
  landingWrap: { maxWidth: 1100, margin: "0 auto", position: "relative", width: "100%" },
  landingContent: { display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "center" },
  trianglePatch: { position: "absolute", top: -24, right: -40, width: 160, height: 160, background: colors.blue, opacity: 0.18, clipPath: "polygon(100% 0, 0 0, 100% 100%)", pointerEvents: "none" },
  fomoBanner: { display: "flex", alignItems: "center", gap: 8, background: "rgba(0,130,203,0.12)", border: `1px solid ${colors.blue}`, borderRadius: 10, padding: "9px 12px", fontSize: 12, color: "#CFE6F5", marginBottom: 18 },
  landingHero: { textAlign: "left", padding: "12px 4px 28px", position: "relative", zIndex: 1, flex: "1 1 380px", minWidth: 300, maxWidth: 480 },
  eyebrow: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 2, color: colors.blueLight, marginBottom: 10, fontWeight: 500 },
  h1: { fontFamily: "'Host Grotesk', sans-serif", fontSize: "clamp(28px, 4.5vw, 40px)", lineHeight: 1.1, margin: "0 0 14px", color: colors.card, fontWeight: 800 },
  accentText: { color: colors.blueLight },
  heroSub: { fontSize: 15, lineHeight: 1.55, color: "#CFE0EC", margin: "0 0 22px", maxWidth: 420 },
  ctaBtn: { display: "inline-flex", alignItems: "center", gap: 8, background: colors.blue, color: "#fff", border: "none", borderRadius: 999, padding: "13px 22px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  ctaBtnSmall: { display: "inline-flex", alignItems: "center", gap: 6, background: colors.blue, color: "#fff", border: "none", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  unlimitedPill: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,130,203,0.14)", border: `1px solid ${colors.blue}`, color: "#CFE0EC", fontSize: 12.5, fontWeight: 600, borderRadius: 999, padding: "6px 12px", marginBottom: 18 },
  cardMock: { display: "flex", justifyContent: "center", margin: "8px 0 24px", position: "relative", zIndex: 1, flex: "0 1 300px", minWidth: 260, width: "100%" },
  membershipCard: { background: colors.card, borderRadius: 18, padding: 20, width: "100%", maxWidth: 300, color: colors.ink, boxShadow: "0 12px 30px rgba(0,0,0,0.3)" },
  membershipCardBig: { background: colors.card, borderRadius: 18, padding: 22, color: colors.ink, boxShadow: "0 12px 30px rgba(0,0,0,0.3)", maxWidth: 420, margin: "0 auto 22px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cardBrand: { fontFamily: "'Host Grotesk', sans-serif", fontWeight: 800, letterSpacing: 1, fontSize: 13, color: colors.navy },
  cardBrandImg: { height: 20, width: "auto" },
  panelSymbol: { height: 26, width: "auto", marginBottom: 10 },
  appHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto 18px" },
  headerSymbol: { height: 22, width: "auto" },
  langToggle: { display: "flex", gap: 4, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: 3 },
  langBtn: { border: "none", background: "none", color: "#9FC0D6", fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 999, cursor: "pointer" },
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
  radioRow: { display: "flex", gap: 8 },
  radioBtn: { flex: 1, padding: "9px 0", borderRadius: 10, border: `1px solid ${colors.line}`, background: "#fff", cursor: "pointer", fontSize: 13.5, color: colors.ink },
  radioBtnActive: { background: colors.blue, color: "#fff", borderColor: colors.blue },
  errorText: { fontSize: 12.5, color: "#B3261E" },
  dashWrap: { maxWidth: 1100, margin: "0 auto" },
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
  restGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, alignItems: "start" },
  restCard: { background: colors.card, color: colors.ink, borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 4 },
  restCardLocked: { background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.25)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" },
  restCategory: { fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5 },
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
  adminRowName: { fontSize: 13.5, fontWeight: 600 },
  adminRowMeta: { fontSize: 11.5, color: "#9FC0D6" },
  adminRowTier: { fontSize: 11.5, background: colors.blue, color: "#fff", padding: "4px 9px", borderRadius: 999, fontWeight: 600, whiteSpace: "nowrap" },
  adminAddForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 8, marginBottom: 14, alignItems: "center" },
  removeBtn: { background: "none", border: "none", color: "#E8AFAF", cursor: "pointer" },
};
