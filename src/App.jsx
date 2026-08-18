import React, { useState, useEffect, useMemo, createContext, useContext } from "react";


const SYMBOL_DATA = "data:image/png;base64,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";
const SYMBOL_WHITE_DATA = "data:image/png;base64,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";
const WORDMARK_WHITE_DATA = "data:image/png;base64,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";
const WORDMARK_BLUE_DATA = "data:image/png;base64,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";

const LangContext = createContext({ lang: "es", setLang: () => {} });

import { Lock, Check, Utensils, Star, ChevronRight, X, LogOut, ShieldCheck, Plus, QrCode, Sparkles, Instagram, MapPin } from "lucide-react";
import { supabase } from "./lib/supabaseClient";

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

const DEFAULT_RESIDENT_CODE = "XTUDY2026";

const TIERS = [
  { id: "guest", name: { es: "Explorador", en: "Explorer" }, price: 0, order: 0, tagline: { es: "Para cualquier estudiante", en: "For any student" } },
  { id: "resident", name: { es: "Residente Xtudy", en: "Xtudy Resident" }, price: 49, order: 1, tagline: { es: "Acceso a todos los restaurantes", en: "Access to every restaurant" } },
];

// Nivel especial solo para restaurantes: no está ligado a ninguna membresía.
// Sirve para mostrar "Próximamente" con candado, sin importar el nivel del estudiante.
const SOON_TIER_ID = "soon";
const SOON_ORDER = 999;

// El panel de administrador siempre se muestra en español, así que aquí usamos
// nombres fijos (no bilingües) solo para esa parte de la app.
const TIER_NAME_ES = { guest: "Explorador", resident: "Residente Xtudy", soon: "Próximamente" };
const RESTAURANT_TIER_OPTIONS = [
  { id: "guest", name: "Explorador" },
  { id: "resident", name: "Residente Xtudy" },
  { id: "soon", name: "Próximamente" },
];

const DEFAULT_RESTAURANTS = [
  { id: "r1", name: "Dogos Bravo", category: "Hot dogs", discount: "15% de descuento", code: "BRAVO15", tier: "guest", address: "Av. General Ramón Corona 2419, San Juan de Ocotán, 45019 Zapopan, Jal." },
  { id: "r2", name: "Café Vaivén", category: "Cafetería", discount: "10% de descuento", code: "VAIVEN10", tier: "guest", address: "P.º Solares 30, San Juan de Ocotán, 49015 Zapopan, Jal." },
  { id: "r3", name: "Pizza Rebelde", category: "Pizza", discount: "20% en pizzas medianas", code: "BARRIO20", tier: "guest", address: "Av. Ejemplo 123, Guadalajara" },
  { id: "r4", name: "Exprime GDL", category: "Jugos", discount: "10% de descuento", code: "FRESCA10", tier: "guest", address: "Av. Ejemplo 456, Guadalajara" },
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

  const [form, setForm] = useState({ name: "", email: "", phone: "", studentId: "", university: DEFAULT_UNIVERSITIES[0].name, isXtudy: "no", residentCode: "" });
  const [formError, setFormError] = useState("");
  const [residentAccessCode, setResidentAccessCode] = useState(DEFAULT_RESIDENT_CODE);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [newRest, setNewRest] = useState({ name: "", category: "", discount: "", code: "", tier: "guest", address: "" });
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

        const savedCode = await storageGet("resident-access-code", true);
        if (savedCode) setResidentAccessCode(savedCode);
        else persist(() => window.storage.set("resident-access-code", DEFAULT_RESIDENT_CODE, true));

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) setAdminUnlocked(true);
        } catch {}

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
              setVerifyResult({ status: "tier", name: acc.name, requiredTier: TIER_NAME_ES[restaurant.tier] || restaurant.tier });
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

  const updateResidentCode = (code) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setResidentAccessCode(trimmed);
    persist(() => window.storage.set("resident-access-code", trimmed, true));
  };

  const handleRegister = () => {
    setFormError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.studentId.trim()) {
      setFormError("Completa todos los campos para continuar.");
      return;
    }
    if (form.isXtudy === "si" && form.residentCode.trim().toUpperCase() !== residentAccessCode.trim().toUpperCase()) {
      setFormError("El código de residente Xtudy no es correcto. Verifícalo con administración.");
      return;
    }
    const newAccount = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      studentId: form.studentId.trim(),
      university: form.university,
      isXtudy: form.isXtudy,
      tier: form.isXtudy === "si" ? "resident" : "guest",
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

  const handleLogin = () => {
    setLoginError("");
    const email = loginEmail.trim().toLowerCase();
    if (!email) {
      setLoginError("Escribe el correo con el que te registraste.");
      return;
    }
    (async () => {
      const val = await storageGet(`account:${email}`, true);
      if (!val) {
        setLoginError("No encontramos una cuenta con ese correo. ¿Ya te registraste?");
        return;
      }
      try {
        const parsedAcc = JSON.parse(val);
        setAccount(parsedAcc);
        setView("dashboard");
        persist(() => window.storage.set("my-email", parsedAcc.email, false));
      } catch {
        setLoginError("Ocurrió un problema al leer tu cuenta. Intenta de nuevo.");
      }
    })();
  };

  const submitAdminLogin = async () => {
    setFormError("");
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword,
      });
      if (authError) {
        setFormError("Correo o contraseña incorrectos.");
        return;
      }
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
            if (val) { try { reds.push({ ...JSON.parse(val), _key: k }); } catch {} }
          }
          reds.sort((a, b) => new Date(b.at) - new Date(a.at));
          setRedemptions(reds);
        } catch { setRedemptions([]); }
      });
    } catch {
      setFormError("Ocurrió un problema al iniciar sesión. Intenta de nuevo.");
    }
  };

  const removeAccount = (acc) => {
    if (!window.confirm(`¿Seguro que quieres borrar el registro de ${acc.name} (${acc.email})? Esto no se puede deshacer.`)) return;
    setAllAccounts((prev) => prev.filter((a) => a.email !== acc.email));
    persist(async () => {
      await window.storage.delete(`account:${acc.email}`, true);
      if (acc.memberId) await window.storage.delete(`member:${acc.memberId}`, true);
    });
  };

  const removeRedemption = (item) => {
    if (!window.confirm(`¿Borrar este canje de ${item.name || item.email} en ${item.restaurant}?`)) return;
    setRedemptions((prev) => prev.filter((r) => r._key !== item._key));
    persist(() => window.storage.delete(item._key, true));
  };

  const addRestaurant = () => {
    if (!newRest.name.trim() || !newRest.code.trim()) return;
    saveRestaurants([...restaurants, { id: `r${Date.now()}`, ...newRest }]);
    setNewRest({ name: "", category: "", discount: "", code: "", tier: "guest", address: "" });
  };
  const removeRestaurant = (id) => saveRestaurants(restaurants.filter((r) => r.id !== id));
  const updateRestaurantTier = (id, tier) => saveRestaurants(restaurants.map((r) => (r.id === id ? { ...r, tier } : r)));

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
                <div style={styles.checkinTier}>Miembro del Club Xtudy · {TIER_NAME_ES[verifyResult.tier] || verifyResult.tier}</div>
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
        <Landing onStart={() => setView("register")} onAdmin={() => setView("admin-login")} onLogin={() => { setLoginError(""); setLoginEmail(""); setView("login"); }} />
      )}

      {view === "register" && (
        <Register form={form} setForm={setForm} onSubmit={handleRegister} error={formError} onBack={() => setView("landing")} universities={universities} />
      )}

      {view === "login" && (
        <Login email={loginEmail} setEmail={setLoginEmail} onSubmit={handleLogin} error={loginError} onBack={() => setView("landing")} />
      )}

      {view === "dashboard" && account && (
        <Dashboard account={account} restaurants={restaurants} onChangeTier={changeTier} onLogout={logout} />
      )}

      {view === "admin-login" && (
        <AdminLogin email={adminEmail} setEmail={setAdminEmail} password={adminPassword} setPassword={setAdminPassword} onSubmit={submitAdminLogin} error={formError} onBack={() => { setFormError(""); setView("landing"); }} />
      )}

      {view === "admin" && adminUnlocked && (
        <AdminPanel
          accounts={allAccounts} restaurants={restaurants} universities={universities} redemptions={redemptions}
          newRest={newRest} setNewRest={setNewRest} onAddRest={addRestaurant} onRemoveRest={removeRestaurant} onUpdateRestTier={updateRestaurantTier}
          newUni={newUni} setNewUni={setNewUni} onAddUni={addUniversity} onRemoveUni={removeUniversity}
          onRemoveAccount={removeAccount} onRemoveRedemption={removeRedemption}
          residentAccessCode={residentAccessCode} onUpdateResidentCode={updateResidentCode}
          onBack={() => setView("landing")}
        />
      )}
    </div>
    </LangContext.Provider>
  );
}

function AppHeader() {
  return (
    <div className="page-container" style={styles.appHeader}>
      <div />
      <div />
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

function Landing({ onStart, onAdmin, onLogin }) {
  const { lang } = useContext(LangContext);
  return (
    <div className="page-container" style={styles.landingWrap}>
      <div style={styles.bigLogoWrap}>
        <img src={WORDMARK_WHITE_DATA} alt="Xtudy" style={styles.bigLogoImg} />
      </div>
      <div style={styles.poweredByRow}>
        <div style={styles.poweredByBadge}>
          <Star size={12} color={colors.blue} fill={colors.blue} />
          Powered by Xtudy
        </div>
      </div>
      <FomoBanner />
      <div style={styles.trianglePatch} />
      <div className="landing-grid" style={styles.landingContent}>
        <div style={styles.landingHero}>
          <div style={styles.eyebrow}>{lang === "es" ? "CLUB DE ESTUDIANTES" : "STUDENT CLUB"}</div>
          <h1 style={styles.h1}>
            {lang === "es"
              ? (<>Descuentos que <span style={styles.accentText}>sí</span> vas a usar.</>)
              : (<>Discounts you'll <span style={styles.accentText}>actually</span> use.</>)}
          </h1>
          <p style={styles.heroSub}>
            {lang === "es"
              ? "Regístrate gratis y desbloquea descuentos reales en restaurantes de Guadalajara. Sé parte de la mejor comunidad estudiantil de México, hecha por Xtudy."
              : "Sign up for free and unlock real discounts at restaurants in Guadalajara. Be part of the best student community in Mexico, made by Xtudy."}
          </p>
          <div style={styles.unlimitedPill}>
            <Sparkles size={13} color={colors.blue} />
            {lang === "es" ? "Úsalos las veces que quieras, sin límite" : "Use them as many times as you want, no limit"}
          </div>
          <div style={styles.heroBtnRow}>
            <button style={styles.ctaBtn} onClick={onStart}>
              {lang === "es" ? "Registrarme gratis" : "Sign up for free"} <ChevronRight size={18} strokeWidth={2.5} />
            </button>
            <button style={styles.loginLink} onClick={onLogin}>
              {lang === "es" ? "Ya tengo cuenta — iniciar sesión" : "I already have an account — log in"}
            </button>
          </div>
        </div>

        <div style={styles.cardMock}>
          <div style={styles.membershipCard}>
            <div style={styles.cardTop}>
              <img src={WORDMARK_BLUE_DATA} alt="Xtudy" style={styles.cardBrandImg} />
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

function Login({ email, setEmail, onSubmit, error, onBack }) {
  const { lang } = useContext(LangContext);
  return (
    <div style={styles.centerWrap}>
      <div style={styles.panel}>
        <button style={styles.backLink} onClick={onBack}><X size={16} /></button>
        <img src={SYMBOL_DATA} alt="Xtudy" style={styles.panelSymbol} />
        <div style={styles.eyebrow}>{lang === "es" ? "BIENVENIDO DE VUELTA" : "WELCOME BACK"}</div>
        <h2 style={styles.h2}>{lang === "es" ? "Iniciar sesión" : "Log in"}</h2>
        <p style={styles.formSub}>
          {lang === "es"
            ? "Escribe el correo con el que te registraste — no necesitas contraseña."
            : "Type the email you registered with — no password needed."}
        </p>
        <div style={styles.form}>
          <label style={styles.label}>{lang === "es" ? "Correo electrónico" : "Email"}
            <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={lang === "es" ? "tucorreo@ejemplo.com" : "youremail@example.com"} />
          </label>
          {error && <div style={styles.errorText}>{error}</div>}
          <button type="button" style={styles.ctaBtn} onClick={onSubmit}>{lang === "es" ? "Entrar" : "Log in"}</button>
        </div>
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
        <p style={styles.formSub}>{lang === "es" ? "Toma menos de un minuto. Empiezas como Explorador al instante — y si vives con Xtudy, activas tu nivel Residente ahora mismo." : "Takes less than a minute. You start as an Explorer right away — and if you live with Xtudy, you activate your Resident tier now."}</p>
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
          <label style={styles.label}>{lang === "es" ? "Matrícula / ID de estudiante" : "Student ID"}
            <input style={styles.input} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder={lang === "es" ? "Ej. A01234567" : "E.g. A01234567"} />
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
          {form.isXtudy === "si" && (
            <label style={styles.label}>{lang === "es" ? "Código de residente Xtudy" : "Xtudy resident code"}
              <input style={styles.input} value={form.residentCode} onChange={(e) => setForm({ ...form, residentCode: e.target.value })} placeholder={lang === "es" ? "Pídelo a tu administración Xtudy" : "Ask your Xtudy administration"} />
            </label>
          )}
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
  const lockedResidentOnly = restaurants.filter((r) => r.tier === "resident" && tierOrder(r.tier) > myOrder);
  const lockedComingSoon = restaurants.filter((r) => r.tier === "soon");
  const [openQrFor, setOpenQrFor] = useState(null);

  const verifyUrl = (restaurantId) => {
    try {
      return `${window.location.origin}${window.location.pathname}?m=${encodeURIComponent(account.memberId)}&r=${encodeURIComponent(restaurantId)}`;
    } catch {
      return `?m=${account.memberId}&r=${restaurantId}`;
    }
  };

  return (
    <div className="page-container" style={styles.dashWrap}>
      <div style={styles.dashHeader}>
        <div>
          <div style={styles.memberBadge}><Check size={12} /> {lang === "es" ? "Eres parte del Club Xtudy" : "You're part of the Xtudy Club"}</div>
          <h2 style={styles.h2}>{lang === "es" ? "Hola" : "Hi"}, {account.name.split(" ")[0]}</h2>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}><LogOut size={15} /> {lang === "es" ? "Salir" : "Log out"}</button>
      </div>

      <div style={styles.membershipCardBig}>
        <div style={styles.cardTop}>
          <img src={WORDMARK_BLUE_DATA} alt="Xtudy" style={styles.cardBrandImg} />
          <Star size={18} color={colors.blue} fill={colors.blue} />
        </div>
        <div style={styles.cardName}>{account.name}</div>
        <div style={styles.cardUni}>{account.university}</div>
        <div style={styles.cardTierRow}>
          <span style={styles.cardTierLabel}>{lang === "es" ? "Nivel actual" : "Current tier"}</span>
          <span style={styles.cardTierValue}>{TIERS.find((t) => t.id === account.tier)?.name[lang]}</span>
        </div>
        <div style={styles.stampsRow}>
          {TIERS.map((t) => (
            <div key={t.id} style={{ ...styles.stampDot, ...(t.order <= myOrder ? styles.stampDotFilled : {}) }} />
          ))}
        </div>
      </div>

      {SHOW_PLANS && account.tier === "guest" && (
        <>
          <div style={styles.tierUpgradeRow}>
            {TIERS.map((t) => (
              <button key={t.id} onClick={() => t.id !== "resident" || window.confirm(lang === "es" ? "¿Confirmar upgrade a Residente Xtudy por $49/mes? (modo de prueba, sin cobro real)" : "Confirm upgrade to Xtudy Resident for $49/mo? (test mode, no real charge)") ? onChangeTier(t.id) : null} style={{ ...styles.tierCard, ...(account.tier === t.id ? styles.tierCardActive : {}) }}>
                <span style={styles.tierCardPrice}>{t.price === 0 ? (lang === "es" ? "Gratis" : "Free") : (lang === "es" ? `$${t.price}/mes` : `$${t.price}/mo`)}</span>
                <span style={styles.tierCardName}>{t.name[lang]}</span>
                <span style={styles.tierCardTag}>{t.tagline[lang]}</span>
                {account.tier === t.id && <span style={styles.currentBadge}>{lang === "es" ? "Plan actual" : "Current plan"}</span>}
              </button>
            ))}
          </div>
          <p style={styles.demoNote}>
            {lang === "es"
              ? "Nota: en esta versión de prueba, el upgrade es instantáneo y sin cobro real — sirve para validar el interés. El cobro con tarjeta se integra después con Stripe."
              : "Note: in this test version, the upgrade is instant with no real charge — it's here to validate interest. Card payments will be added later with Stripe."}
          </p>
        </>
      )}

      <h3 style={styles.sectionTitle}><Utensils size={16} /> {lang === "es" ? "Tus descuentos desbloqueados" : "Your unlocked discounts"}</h3>

      <div style={styles.restGrid}>
        {unlocked.map((r) => (
          <div key={r.id} style={styles.restCard}>
            <div style={styles.restCategory}>{r.category}</div>
            <div style={styles.restName}>{r.name}</div>
            {r.address && (
              <>
                <div style={styles.restAddress}>📍 {r.address}</div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ", " + r.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.locationLink}
                >
                  <MapPin size={12} /> {lang === "es" ? "Ver ubicación" : "View location"}
                </a>
              </>
            )}
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

      {lockedResidentOnly.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}><Lock size={15} /> {lang === "es" ? "Solo para Residentes Xtudy" : "Xtudy Residents only"}</h3>
          <div style={styles.restGrid}>
            {lockedResidentOnly.map((r) => (
              <div key={r.id} style={styles.restCardLocked}>
                <Lock size={22} color="#8FA5B8" />
                <div style={styles.restCategory}>{r.category}</div>
                <div style={styles.restNameLocked}>{r.name}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {lockedComingSoon.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}><Lock size={15} /> {lang === "es" ? "Próximamente" : "Coming soon"}</h3>
          <div style={styles.restGrid}>
            {lockedComingSoon.map((r) => (
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

function AdminLogin({ email, setEmail, password, setPassword, onSubmit, error, onBack }) {
  return (
    <div style={styles.centerWrap}>
      <div style={styles.panel}>
        <button style={styles.backLink} onClick={onBack}><X size={16} /></button>
        <div style={styles.eyebrow}>ACCESO RESTRINGIDO</div>
        <h2 style={styles.h2}>Panel de administrador</h2>
        <p style={styles.formSub}>Solo para uso interno del equipo Xtudy.</p>
        <div style={styles.form}>
          <label style={styles.label}>Correo
            <input style={styles.input} type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label style={styles.label}>Contraseña
            <input style={styles.input} type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <div style={styles.errorText}>{error}</div>}
          <button style={styles.ctaBtn} onClick={onSubmit}>Entrar</button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ accounts, restaurants, universities, redemptions, newRest, setNewRest, onAddRest, onRemoveRest, onUpdateRestTier, newUni, setNewUni, onAddUni, onRemoveUni, onRemoveAccount, onRemoveRedemption, residentAccessCode, onUpdateResidentCode, onBack }) {
  const [codeInput, setCodeInput] = useState(residentAccessCode);
  const counts = TIERS.map((t) => ({ ...t, count: accounts.filter((a) => a.tier === t.id).length, adminName: TIER_NAME_ES[t.id] }));

  const byRestaurant = {};
  const byUser = {};
  (redemptions || []).forEach((r) => {
    byRestaurant[r.restaurant] = (byRestaurant[r.restaurant] || 0) + 1;
    const key = r.email || "sin identificar";
    byUser[key] = (byUser[key] || 0) + 1;
  });

  const downloadCsv = (filename, rows) => {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
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
    const rows = [["Nombre", "Correo", "Teléfono", "Matrícula/ID", "Universidad", "Cliente Xtudy", "Nivel", "Fecha de registro"]];
    accounts.forEach((a) => rows.push([a.name, a.email, a.phone, a.studentId || "", a.university, a.isXtudy === "si" ? "Sí" : "No", TIER_NAME_ES[a.tier] || a.tier, a.createdAt]));
    downloadCsv("registros_xtudy_club.csv", rows);
  };

  const exportRedemptions = () => {
    const rows = [["Estudiante", "Correo", "Restaurante", "Nivel", "Fecha y hora"]];
    (redemptions || []).forEach((r) => rows.push([r.name, r.email, r.restaurant, TIER_NAME_ES[r.tier] || r.tier, r.at]));
    downloadCsv("canjes_xtudy_club.csv", rows);
  };

  return (
    <div className="page-container" style={styles.dashWrap}>
      <div style={styles.dashHeader}>
        <div><div style={styles.eyebrow}>PANEL INTERNO</div><h2 style={styles.h2}>Administración</h2></div>
        <button style={styles.logoutBtn} onClick={onBack}><X size={15} /> Cerrar</button>
      </div>

      <div style={styles.exportRow}>
        <button style={styles.exportBtn} onClick={exportAccounts}>⬇ Exportar registros (CSV)</button>
        <button style={styles.exportBtn} onClick={exportRedemptions}>⬇ Exportar canjes (CSV)</button>
      </div>

      <h3 style={styles.sectionTitle}>Código de acceso para residentes Xtudy</h3>
      <p style={styles.formSub}>Los estudiantes que viven en Xtudy usan este código al registrarse para obtener el nivel Residente gratis, sin pagar. Cámbialo cuando quieras.</p>
      <div style={styles.adminAddForm}>
        <input style={styles.input} value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder="Código actual" />
        <button style={styles.exportBtn} onClick={() => onUpdateResidentCode(codeInput)}>Guardar código</button>
      </div>

      <h3 style={styles.sectionTitle}>Suscriptores por nivel</h3>
      <div style={styles.adminStatsRow}>
        {counts.map((c) => (
          <div key={c.id} style={styles.adminStatCard}>
            <span style={styles.adminStatNum}>{c.count}</span>
            <span style={styles.adminStatLabel}>{c.adminName}</span>
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
              <div style={styles.adminRowMeta}>{a.email} · {a.phone} · {a.studentId ? `ID: ${a.studentId} · ` : ""}{a.university} · Xtudy: {a.isXtudy === "si" ? "Sí" : "No"}</div>
            </div>
            <span style={styles.adminRowTier}>{TIER_NAME_ES[a.tier] || a.tier}</span>
            <button style={styles.removeBtn} onClick={() => onRemoveAccount(a)} title="Borrar este registro"><X size={14} /></button>
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
          {RESTAURANT_TIER_OPTIONS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button style={styles.ctaBtnSmall} onClick={onAddRest}><Plus size={15} /> Agregar restaurante</button>
      </div>
      <div style={styles.adminTableWrap}>
        {restaurants.map((r) => (
          <div key={r.id} style={styles.adminRow}>
            <div>
              <div style={styles.adminRowName}>{r.name} <span style={styles.adminRowMeta}>({r.category})</span></div>
              <div style={styles.adminRowMeta}>{r.discount} · código: {r.code}</div>
            </div>
            <select style={styles.adminTierSelect} value={r.tier} onChange={(e) => onUpdateRestTier(r.id, e.target.value)}>
              {RESTAURANT_TIER_OPTIONS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
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
          <div key={r._key || i} style={styles.adminRow}>
            <div>
              <div style={styles.adminRowName}>{r.name || r.email} — {r.restaurant}</div>
              <div style={styles.adminRowMeta}>{new Date(r.at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })} · nivel: {TIER_NAME_ES[r.tier] || r.tier}</div>
            </div>
            <button style={styles.removeBtn} onClick={() => onRemoveRedemption(r)} title="Borrar este canje"><X size={14} /></button>
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
  membershipCardBig: { background: colors.card, borderRadius: 18, padding: 22, color: colors.ink, boxShadow: "0 12px 30px rgba(0,0,0,0.3)", maxWidth: 420, margin: "0 auto 22px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cardBrand: { fontFamily: "'Host Grotesk', sans-serif", fontWeight: 800, letterSpacing: 1, fontSize: 13, color: colors.navy },
  cardBrandImg: { height: 20, width: "auto" },
  panelSymbol: { height: 26, width: "auto", marginBottom: 10 },
  appHeader: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", marginBottom: 18 },
  headerSymbol: { height: 22, width: "auto" },
  headerWordmark: { height: 22, width: "auto", justifySelf: "center" },
  headerRight: { display: "flex", alignItems: "center", gap: 12, justifySelf: "end" },
  igLink: { display: "flex", alignItems: "center", justifyContent: "center", color: "#CFE0EC", opacity: 0.9 },
  bigLogoWrap: { display: "flex", justifyContent: "center", padding: "6px 0 4px" },
  bigLogoImg: { height: "clamp(48px, 7vw, 72px)", width: "auto", maxWidth: "90%" },
  poweredByRow: { display: "flex", justifyContent: "center", marginBottom: 14 },
  poweredByBadge: { display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: "#CFE0EC", fontSize: 11.5, fontWeight: 600, borderRadius: 999, padding: "6px 14px", textAlign: "center" },
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
  adminTierSelect: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 8, padding: "6px 8px", fontSize: 12, fontWeight: 600 },
  adminRowName: { fontSize: 13.5, fontWeight: 600 },
  adminRowMeta: { fontSize: 11.5, color: "#9FC0D6" },
  adminRowTier: { fontSize: 11.5, background: colors.blue, color: "#fff", padding: "4px 9px", borderRadius: 999, fontWeight: 600, whiteSpace: "nowrap" },
  adminAddForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 8, marginBottom: 14, alignItems: "center" },
  removeBtn: { background: "none", border: "none", color: "#E8AFAF", cursor: "pointer" },
};
