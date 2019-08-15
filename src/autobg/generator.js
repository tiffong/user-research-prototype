/*
 * @Author: 王志伟
 * @Date: 2019-07-19 16:39:16
 * @Last Modified by: 王志伟
 * @Last Modified time: 2019-07-26 14:17:34
 * @Content: 生成海报。其中只更改了createPoster函数，添加了createCardPoster函数，其他与原代码相同。
 */
import * as SVG from 'svg.js'
import $ from 'jquery'


function csv2array(data, delimeter) {
    // Retrieve the delimeter
    if (delimeter === undefined)
        delimeter = ',';
    if (delimeter && delimeter.length > 1)
        delimeter = ',';

    // initialize variables
    var newline = '\n';
    var eof = '';
    var i = 0;
    var c = data.charAt(i);
    var row = 0;
    var col = 0;
    var array = [];

    while (c !== eof) {
        // skip whitespaces
        while (c === ' ' || c === '\t' || c === '\r') {
            c = data.charAt(++i); // read next char
        }

        // get value
        var value = "";
        if (c === '"') {
            // value enclosed by double-quotes
            c = data.charAt(++i);

            do {
                if (c !== '"') {
                    // read a regular character and go to the next character
                    value += c;
                    c = data.charAt(++i);
                }

                if (c === '"') {
                    // check for escaped double-quote
                    var cnext = data.charAt(i + 1);
                    if (cnext === '"') {
                        // this is an escaped double-quote.
                        // Add a double-quote to the value, and move two characters ahead.
                        value += '"';
                        i += 2;
                        c = data.charAt(i);
                    }
                }
            }
            while (c !== eof && c !== '"');

            if (c === eof) {
                throw "Unexpected end of data, double-quote expected";
            }

            c = data.charAt(++i);
        } else {
            // value without quotes
            while (c !== eof && c !== delimeter && c !== newline && c !== ' ' && c !== '\t' && c !== '\r') {
                value += c;
                c = data.charAt(++i);
            }
        }

        // add the value to the array
        if (array.length <= row)
            array.push([]);
        array[row].push(value);

        // skip whitespaces
        while (c === ' ' || c === '\t' || c === '\r') {
            c = data.charAt(++i);
        }

        // go to the next row or column
        if (c === delimeter) {
            // to the next column
            col = col + 1;
        } else if (c === newline) {
            // to the next row
            col = 0;
            row++;
        } else if (c !== eof) {
            // unexpected character
            throw "Delimiter expected after character " + i;
        }

        // go to the next character
        c = data.charAt(++i);
    }

    return array;
}

function createRGBfromHSV(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s;
        v = h.v;
        h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
        default:
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


function getNumberInNormalDistribution(std_dev) {
    var offset = randomNormalDistribution() * std_dev;
    return offset;
}

function randomNormalDistribution() {
    var u = 0.0,
        v = 0.0,
        w = 0.0,
        c = 0.0;
    do {
        u = Math.random() * 2 - 1.0;
        v = Math.random() * 2 - 1.0;
        w = u * u + v * v;
    } while (w === 0.0 || w >= 1.0)
    c = Math.sqrt((-2 * Math.log(w)) / w);
    return u * c;
}

function generateColor(colors, number, std_dev) {
    var numberOfColor = colors.length;

    var colorList = [];

    for (var n = 0; n < colors.length; n++) {

        var hList = [],
            sList = [],
            vList = [];

        var k = number
        for (k; k > 0; k--) {

            var offset = getNumberInNormalDistribution(std_dev)

            var new_h = colors[n][0] + offset;
            var new_s = colors[n][1] + offset;
            var new_v = colors[n][2] + offset;

            if (new_h < 0) {
                new_h = 360 + new_h
            } else if (new_h > 360) {
                new_h = new_h - 360
            }

            if (new_s < 0) {
                new_s = new_s * -1
            } else if (new_s > 100) {
                new_s = 200 - new_s
            }

            if (new_v < 0) {
                new_v = new_v * -1
            } else if (new_v > 100) {
                new_v = 200 - new_v
            }

            hList.push(new_h)
            sList.push(new_s)
            vList.push(new_v)
        }

        colorList.push([hList, sList, vList])

    }

    var rgbList = []
    let hIndex, sIndex, vIndex;
    for (hIndex in colorList[0][0]) {
        for (sIndex in colorList[0][1]) {
            for (vIndex in colorList[0][2]) {

                var RGBs = [];
                for (n = 0; n < numberOfColor; n++) {
                    RGBs.push(createRGBfromHSV(colorList[n][0][hIndex] / 360, colorList[n][1][sIndex] / 100, colorList[n][2][vIndex] / 100))
                }
                rgbList.push(RGBs)
            }
        }
    }

    return rgbList
}

var posterIndex = 0

var backgroundPalette = [],
    elementPalettePure = [],
    elementPaletteGrad = [];

//face_color/nose,ear_color/neck_color
var skinPalette = [
    [{
        r: 252,
        g: 234,
        b: 202
    }, {
        r: 240,
        g: 216,
        b: 182
    }, {
        r: 230,
        g: 203,
        b: 159
    }],
    [{
        r: 245,
        g: 219,
        b: 174
    }, {
        r: 232,
        g: 202,
        b: 160
    }, {
        r: 218,
        g: 189,
        b: 141
    }],
    [{
        r: 228,
        g: 196,
        b: 142
    }, {
        r: 214,
        g: 178,
        b: 133
    }, {
        r: 204,
        g: 166,
        b: 113
    }]
]

var colorRanNumber = 10,
    colorRanRange = 5;
backgroundPalette.push(generateColor([
    [0, 0, 100]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [0, 0, 92]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [0, 0, 21]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [164, 15, 72]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [248, 36, 58]
], colorRanNumber, colorRanRange))

backgroundPalette.push(generateColor([
    [39, 49, 98],
    [331, 60, 96]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [328, 33, 100],
    [213, 26, 100]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [187, 43, 100],
    [325, 21, 100]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [171, 49, 91],
    [223, 44, 89]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [336, 42, 100],
    [222, 93, 60]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [36, 32, 99],
    [188, 52, 95]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [135, 64, 91],
    [259, 67, 96]
], colorRanNumber, colorRanRange))
backgroundPalette.push(generateColor([
    [8, 25, 98],
    [188, 51, 85]
], colorRanNumber, colorRanRange))

colorRanRange = 8
elementPalettePure.push(generateColor([
    [0, 0, 100]
], colorRanNumber, colorRanRange))
elementPalettePure.push(generateColor([
    [0, 0, 84]
], colorRanNumber, colorRanRange))
elementPalettePure.push(generateColor([
    [77, 13, 21]
], colorRanNumber, colorRanRange))
elementPalettePure.push(generateColor([
    [252, 59, 100]
], colorRanNumber, colorRanRange))
elementPalettePure.push(generateColor([
    [154, 37, 94]
], colorRanNumber, colorRanRange))
elementPalettePure.push(generateColor([
    [339, 40, 100]
], colorRanNumber, colorRanRange))
elementPalettePure.push(generateColor([
    [47, 78, 98]
], colorRanNumber, colorRanRange))
elementPalettePure.push(generateColor([
    [296, 59, 99]
], colorRanNumber, colorRanRange))
elementPalettePure.push(generateColor([
    [187, 45, 91]
], colorRanNumber, colorRanRange))
elementPalettePure.push(generateColor([
    [347, 78, 100]
], colorRanNumber, colorRanRange))

elementPaletteGrad.push(generateColor([
    [0, 0, 93],
    [0, 0, 47]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [51, 19, 100],
    [334, 45, 100]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [58, 83, 100],
    [326, 80, 95]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [24, 49, 100],
    [274, 79, 91]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [135, 64, 91],
    [62, 81, 96]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [135, 64, 91],
    [259, 67, 96]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [352, 42, 99],
    [183, 75, 95]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [319, 86, 89],
    [190, 46, 93]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [181, 80, 93],
    [259, 67, 96]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [207, 86, 89],
    [273, 82, 57]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [30, 11, 93],
    [23, 44, 74]
], colorRanNumber, colorRanRange))
elementPaletteGrad.push(generateColor([
    [187, 43, 100],
    [325, 21, 100]
], colorRanNumber, colorRanRange))

//Rotation

var tRotation_1 = [0, 30, 60, 90, 120, 150, 180],
    tRotation_2 = [0, 36, 72, 108, 144, 180],
    tRotation_3 = [0, 30, 60, 90, 120, 150, 180],
    tRotation_4 = [0, 180],
    tRotation_5 = [0, 45, 90, 135, 180],
    tRotation_6 = [0, 60, 90, 150, 180],
    tRotation_7 = [0, 30, 60, 90, 120, 150, 180],

    sRotation_1 = [0, 30, 60, 90, 120, 150, 180],
    sRotation_2 = [0, 45, 90, 135, 180],

    cRotation = [0, 45, 90, 135, 180];


//Layout

var width = 1080 / 4,
    height = 1080 / 4;
var fontSizeSmall = 5,
    fontSizeMid = 8,
    fontSizeLarge = 10;

//resize
width /= 2;
height /= 2;
fontSizeSmall /= 2;
fontSizeMid /= 2;
fontSizeLarge /= 2;


var widthSegments = 15,
    heightSegments = 20;

//position for laying texts
var textIntersection = [];
textIntersection[0] = [(width / widthSegments) * 2, (height / heightSegments) * 2, 0]
textIntersection[1] = [(width / widthSegments) * 17, (height / heightSegments) * 2, 0]
textIntersection[2] = [(width / widthSegments) * 2, (height / heightSegments) * 32, 0]
textIntersection[3] = [(width / widthSegments) * 17, (height / heightSegments) * 32, 0]

var coreIntersections = [],
    normalIntersections = [];

//center
coreIntersections[0] = [width / 2, height / 2, 0];
//three-folds
coreIntersections[1] = [width / 3, height / 3, 0];
coreIntersections[2] = [width / 3, height * 2 / 3, 0];
coreIntersections[3] = [width * 2 / 3, height / 3, 0];
coreIntersections[4] = [width * 2 / 3, height * 2 / 3, 0];
//squre-intersection
coreIntersections[5] = calIntersection(height / width, 0, -width / height, width * width / height);
//coreIntersections[5].push(Math.atan(-width/height)*90)
coreIntersections[5].push(0)

coreIntersections[6] = calIntersection(height / width, 0, -width / height, height)
//coreIntersections[6].push(Math.atan(-width/height)*90)
coreIntersections[6].push(0)

coreIntersections[7] = calIntersection(-height / width, height, width / height, height - (width * width / height))
//coreIntersections[7].push(Math.atan(width/height)*90)
coreIntersections[7].push(0)

coreIntersections[8] = calIntersection(-height / width, height, width / height, 0)
//coreIntersections[8].push(Math.atan(width/height)*90)
coreIntersections[8].push(0)

function calIntersection(a1, b1, a2, b2) {
    var interPoint = []
    //x
    interPoint[0] = (b2 - b1) / (a1 - a2)
    //y
    interPoint[1] = a1 * interPoint[0] + b1
    return interPoint
}


// Draw white points
// var widthGap = width/widthSegments;
var heightGap = height / heightSegments;
// var lineStyle_2 = {width: 0.5 ,color: '#C1BAC6'}

for (var i = 1; i < widthSegments; i++) {

    var x = heightGap * i
    //draw.line(x,0,x,height).stroke(lineStyle_2)

    //calculate interaction with horizontal lines
    normalIntersections.push([x, x * height / width, Math.atan(height / width) * 90])
    normalIntersections.push([x, x * (-height / width) + height, Math.atan(-height / width) * 90])
    normalIntersections.push([x, x * (-width / height) + width * width / height, Math.atan(-width / height) * 90])
    normalIntersections.push([x, x * (-width / height) + height, Math.atan(-width / height) * 90])
    normalIntersections.push([x, x * width / height + height - (width * width / height), Math.atan(width / height) * 90])
    normalIntersections.push([x, x * width / height, Math.atan(width / height) * 90])
}
for (var j = 1; j < heightSegments; j++) {
    var y = heightGap * j
    //draw.line(0,y,width,y).stroke(lineStyle_2)

    normalIntersections.push([y / (height / width), y, Math.atan(height / width) * 90])
    normalIntersections.push([(y - height) / (-height / width), y, Math.atan(-height / width) * 90])


    if (y <= width * width / height) {
        normalIntersections.push([(y - width * width / height) / (-width / height), y, Math.atan(-width / height) * 90])
        normalIntersections.push([y / (width / height), y, Math.atan(width / height) * 90])
    }

    if (y >= height - width * width / height && y < height) {
        normalIntersections.push([(y - height) / (-width / height), y, Math.atan(-width / height) * 90])
        normalIntersections.push([(y - height + (width * width / height)) / (width / height), y, Math.atan(width / height) * 90])
    }
}

// ==================================================================

function loadxmlDoc(file) {
    let xmlDoc;
    try {
        //IE
        xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
    } catch (e) {
        ////Firefox, Mozilla, Opera, etc
        xmlDoc = document.implementation.createDocument("", "", null);
    }

    try {
        xmlDoc.async = false;
        xmlDoc.load(file);
    } catch (e) {
        // for Chrome
        var xmlhttp = new window.XMLHttpRequest();
        // console.log(xmlhttp);
        xmlhttp.open("GET", file, false);
        xmlhttp.send(null);
        xmlDoc = xmlhttp.responseXML.documentElement;
        // Sconsole.log(xmlDoc);
    }
    return xmlDoc;
}

var ob = loadxmlDoc("/all.xml");
var svg = ob.getElementsByTagName("svg");


//create all possible shapes in the canvas
function createShapes(cList, rList, tList, draw) {
    for (var i = 0; i < svg.length; i++) {
        var shape = draw.group()
        let data;
        if (svg[i].getElementById('triangle')) {
            data = svg[i].getElementById('triangle').childNodes[1]
            var transform = svg[i].getElementById('triangle').getAttribute("transform").match(/[^\(]+(?=\))/g)[0].split(',')
            var point = svg[i].getElementById('point')
            var index = (parseInt(data.id.split("/")[1]) + 4) + (parseInt(data.id.split("/")[2]) + 4) * 9

            // console.log(data.id)

            //check if the element has transform data
            if (svg[i].getElementById(data.id).getAttribute("transform")) {
                var elementTransform = svg[i].getElementById(data.id).getAttribute("transform").match(/[^\(]+(?=\))/g)[0].split(',')
                // console.log(elementTransform)
                transform[0] = parseFloat(transform[0]) + parseFloat(elementTransform[0])
                transform[1] = parseFloat(transform[1]) + parseFloat(elementTransform[1])

                if (svg[i].getElementById(data.id).getAttribute("transform").indexOf("scale") > 0) {
                    var scaleValue = svg[i].getElementById(data.id).getAttribute("transform").match(/scale.*?\)/g)[0].match(/[^\(]+(?=\))/g)[0].split(',')
                    shape.scale(parseInt(scaleValue[0]), parseInt(scaleValue[1]))
                }
            }

            // set attributes of shape
            if (point) {
                var cx = parseFloat(point.getAttribute("x"))
                var cy = parseFloat(point.getAttribute("y"))
                shape.attr({
                    "name": data.id,
                    "cx": cx,
                    "cy": cy,
                    "transform": "translate(" + (parseFloat(transform[0]) - cx) + "," + (parseFloat(transform[1]) - cy) + ")",
                    "width": parseFloat(svg[i].getAttribute("width").match(/\d+/g)[0]),
                    "height": parseFloat(svg[i].getAttribute("height").match(/\d+/g)[0])
                })
            } else {
                shape.attr({
                    "name": data.id,
                    "transform": "translate(" + (parseFloat(transform[0]) - parseFloat(svg[i].getAttribute("width").match(/\d+/g)[0]) / 2) + "," + (parseFloat(transform[1]) - parseFloat(svg[i].getAttribute("height").match(/\d+/g)[0]) / 2) + ")",
                    "width": parseFloat(svg[i].getAttribute("width").match(/\d+/g)[0]),
                    "height": parseFloat(svg[i].getAttribute("height").match(/\d+/g)[0])
                })
            }

            // set content of shape
            if (svg[i].getElementsByTagName('path')[0]) {
                shape.path(svg[i].getElementsByTagName('path')[0].getAttribute("d"))
            } else if (svg[i].getElementsByTagName('polygon')[0]) {
                shape.add(draw.polygon().attr("points", svg[i].getElementsByTagName('polygon')[0].getAttribute("points")))
            }

            draw.defs().add(shape)
            tList[index] = shape


        } else if (svg[i].getElementById('square')) {
            data = svg[i].getElementById('square').childNodes[1]
            var transform = svg[i].getElementById('square').getAttribute("transform").match(/[^\(]+(?=\))/g)[0].split(',')
            var point = svg[i].getElementById('point')
            var index = (parseInt(data.id.split("/")[1]) + 4) + (parseInt(data.id.split("/")[2]) + 4) * 9


            //check if the element has transform data
            if (svg[i].getElementById(data.id).getAttribute("transform")) {
                var elementTransform = svg[i].getElementById(data.id).getAttribute("transform").match(/[^\(]+(?=\))/g)[0].split(',')
                // console.log(elementTransform)
                transform[0] = parseFloat(transform[0]) + parseFloat(elementTransform[0])
                transform[1] = parseFloat(transform[1]) + parseFloat(elementTransform[1])

                if (svg[i].getElementById(data.id).getAttribute("transform").indexOf("scale") > 0) {
                    var scaleValue = svg[i].getElementById(data.id).getAttribute("transform").match(/scale.*?\)/g)[0].match(/[^\(]+(?=\))/g)[0].split(',')
                    shape.scale(parseInt(scaleValue[0]), parseInt(scaleValue[1]))
                }
            }

            // set attributes of shape
            if (point) {
                var cx = parseFloat(point.getAttribute("x"))
                var cy = parseFloat(point.getAttribute("y"))
                shape.attr({
                    "name": data.id,
                    "cx": cx,
                    "cy": cy,
                    "transform": "translate(" + (parseFloat(transform[0]) - cx) + "," + (parseFloat(transform[1]) - cy) + ")",
                    "width": parseFloat(svg[i].getAttribute("width").match(/\d+/g)[0]),
                    "height": parseFloat(svg[i].getAttribute("height").match(/\d+/g)[0])
                })
            } else {
                shape.attr({
                    "name": data.id,
                    "transform": "translate(" + (parseFloat(transform[0]) - parseFloat(svg[i].getAttribute("width").match(/\d+/g)[0]) / 2) + "," + (parseFloat(transform[1]) - parseFloat(svg[i].getAttribute("height").match(/\d+/g)[0]) / 2) + ")",
                    "width": parseFloat(svg[i].getAttribute("width").match(/\d+/g)[0]),
                    "height": parseFloat(svg[i].getAttribute("height").match(/\d+/g)[0])
                })
            }

            // set content of shape
            if (svg[i].getElementsByTagName('path')[0]) {
                shape.path(svg[i].getElementsByTagName('path')[0].getAttribute("d"))
            } else if (svg[i].getElementsByTagName('polygon')[0]) {
                shape.add(draw.polygon().attr("points", svg[i].getElementsByTagName('polygon')[0].getAttribute("points")))
            }

            draw.defs().add(shape)
            rList[index] = shape


        } else if (svg[i].getElementById('circular')) {
            data = svg[i].getElementById('circular').childNodes[1]
            var transform = svg[i].getElementById('circular').getAttribute("transform").match(/[^\(]+(?=\))/g)[0].split(',')
            var point = svg[i].getElementById('point')
            var index = (parseInt(data.id.split("/")[1]) + 4) + (parseInt(data.id.split("/")[2]) + 4) * 9

            //check if the element has transform data
            if (svg[i].getElementById(data.id).getAttribute("transform")) {
                var elementTransform = svg[i].getElementById(data.id).getAttribute("transform").match(/[^\(]+(?=\))/g)[0].split(',')
                // console.log(elementTransform)
                transform[0] = parseFloat(transform[0]) + parseFloat(elementTransform[0])
                transform[1] = parseFloat(transform[1]) + parseFloat(elementTransform[1])

                if (svg[i].getElementById(data.id).getAttribute("transform").indexOf("scale") > 0) {
                    var scaleValue = svg[i].getElementById(data.id).getAttribute("transform").match(/scale.*?\)/g)[0].match(/[^\(]+(?=\))/g)[0].split(',')
                    shape.scale(parseInt(scaleValue[0]), parseInt(scaleValue[1]))
                }
            }

            // set attributes of shape
            if (point) {
                var cx = parseFloat(point.getAttribute("x"))
                var cy = parseFloat(point.getAttribute("y"))
                shape.attr({
                    "name": data.id,
                    "cx": cx,
                    "cy": cy,
                    "transform": "translate(" + (parseFloat(transform[0]) - cx) + "," + (parseFloat(transform[1]) - cy) + ")",
                    "width": parseFloat(svg[i].getAttribute("width").match(/\d+/g)[0]),
                    "height": parseFloat(svg[i].getAttribute("height").match(/\d+/g)[0])
                })
            } else {
                shape.attr({
                    "name": data.id,
                    "transform": "translate(" + (parseFloat(transform[0]) - parseFloat(svg[i].getAttribute("width").match(/\d+/g)[0]) / 2) + "," + (parseFloat(transform[1]) - parseFloat(svg[i].getAttribute("height").match(/\d+/g)[0]) / 2) + ")",
                    "width": parseFloat(svg[i].getAttribute("width").match(/\d+/g)[0]),
                    "height": parseFloat(svg[i].getAttribute("height").match(/\d+/g)[0])
                })
            }

            // set content of shape
            if (svg[i].getElementsByTagName('path')[0]) {
                shape.path(svg[i].getElementsByTagName('path')[0].getAttribute("d"))
            } else if (svg[i].getElementsByTagName('ellipse')[0]) {
                shape.add(draw.ellipse().attr({
                    "cx": svg[i].getElementsByTagName('ellipse')[0].getAttribute("cx"),
                    "cy": svg[i].getElementsByTagName('ellipse')[0].getAttribute("cy"),
                    "rx": svg[i].getElementsByTagName('ellipse')[0].getAttribute("rx"),
                    "ry": svg[i].getElementsByTagName('ellipse')[0].getAttribute("ry")
                }))
            } else if (svg[i].getElementsByTagName('circle')[0]) {
                shape.add(draw.circle().attr({
                    "cx": svg[i].getElementsByTagName('circle')[0].getAttribute("cx"),
                    "cy": svg[i].getElementsByTagName('circle')[0].getAttribute("cy"),
                    "r": svg[i].getElementsByTagName('circle')[0].getAttribute("r")
                }))
            }

            draw.defs().add(shape)
            cList[index] = shape

        }
    }

}

var drawList = []

//Define the number of deatures for each shape
// const NUM_SHAPE_FEATURES=15,
// 	  MAX_ELEMENTS = 18,
// 	  NUM_PEOPLE_FEATURES = 17,
// 	  NUM_TEXT_FEATURES =1,
// 	  NUM_BG_FEATURES = 6;
const NUM_ELEMENT_TYPE = 3,
    NUM_ELEMENT_X = 9,
    NUM_ELEMENT_Y = 9;


function rotate(shape, index) {
    var randomRotation = index
    var shapeName = shape.node.attributes.name.nodeValue.split("/")
    var rotationAngel

    if (shapeName[0] === "t") {
        if (parseInt(shapeName[1]) === -4) {
            rotationAngel = tRotation_1[parseInt(tRotation_1.length * randomRotation)]
        } else if (parseInt(shapeName[1]) === -3) {
            rotationAngel = tRotation_2[parseInt(tRotation_2.length * randomRotation)]
        } else if (parseInt(shapeName[1]) === -2 || parseInt(shapeName[1]) === -1 || parseInt(shapeName[1]) === 0) {
            rotationAngel = tRotation_3[parseInt(tRotation_3.length * randomRotation)]
        } else if (parseInt(shapeName[1]) === 1) {
            rotationAngel = tRotation_4[parseInt(tRotation_4.length * randomRotation)]
        } else if (parseInt(shapeName[1]) === 2) {
            rotationAngel = tRotation_5[parseInt(tRotation_5.length * randomRotation)]
        } else if (parseInt(shapeName[1]) === 3) {
            rotationAngel = tRotation_6[parseInt(tRotation_6.length * randomRotation)]
        } else if (parseInt(shapeName[1]) === 4) {
            rotationAngel = tRotation_7[parseInt(tRotation_7.length * randomRotation)]
        }

    }
    //
    else if (shapeName[0] === "s") {
        if (parseInt(shapeName[1]) >= -4 && parseInt(shapeName[1]) <= -1) {
            rotationAngel = sRotation_1[parseInt(sRotation_1.length * randomRotation)]
        } else if (parseInt(shapeName[1]) >= 0 && parseInt(shapeName[1]) <= 4) {
            rotationAngel = sRotation_2[parseInt(sRotation_2.length * randomRotation)]
        }
    } else if (shapeName[0] === "c") {
        rotationAngel = cRotation[parseInt(cRotation.length * randomRotation)]
    }

    if (shape.attr("cx") && shape.attr("cy")) {
        shape
            .rotate(rotationAngel, shape.attr("cx"), shape.attr("cy"))
    } else {
        shape
            .rotate(rotationAngel)
    }

    return randomRotation;
}

var div = document.createElement("div");
div.setAttribute("id", "container");

// 被选中的海报
var choosed = null;

var _draw = SVG('test').size(width, height)
var _circleList = [], _rectList = [], _triList = [];
createShapes(_circleList,_rectList,_triList,_draw)

// 生成海报，并为每一张海报添加click函数
function createPoster(csvdata, num, isExtended) {

    // var subdiv = document.createElement("div");
    // subdiv.setAttribute("id", "poster"+num);
    // subdiv.setAttribute("class", "poster");
    // div.appendChild(subdiv)
    // document.body.appendChild(div);
    // console.log(pnt.state);
    if(isExtended)
        var draw = SVG('square'+num).size(width, height)
    else
        var draw = SVG('poster'+num).size(width, height)

    var circleList = _circleList.concat(),
        rectList = _rectList.concat(),
        triList = _triList.concat();

    var shapeList = triList.concat(rectList, circleList);

    var bgGradient = draw.gradient('linear', function (stop) {
        var bgHSV = csvdata[csvdata.length - 1]
        stop.at(0, createRGBfromHSV(bgHSV.data[0], bgHSV.data[1], bgHSV.data[2]))
        stop.at(1, createRGBfromHSV(bgHSV.data[3], bgHSV.data[4], bgHSV.data[5]))
    })
    bgGradient.from("0%", "0%").to("0%", "100%")
    draw.rect(width, height).fill(bgGradient)
    // let start = new Date().getTime();
    for (var i = 0; i < csvdata.length; i++) {
        if (csvdata[i].name === "element") {
            var shapeNormalX = Math.round((NUM_ELEMENT_TYPE - 1) * csvdata[i].data[0]),
                shapeNormalY = Math.round((NUM_ELEMENT_X - 1) * csvdata[i].data[1]),
                shapeNormalZ = Math.round((NUM_ELEMENT_Y - 1) * csvdata[i].data[2]);

            var elementColor = draw.gradient('linear', function (stop) {
                stop.at(0, createRGBfromHSV(csvdata[i].data[7], csvdata[i].data[8], csvdata[i].data[9]))
                stop.at(1, createRGBfromHSV(csvdata[i].data[10], csvdata[i].data[11], csvdata[i].data[12]))
            })
            elementColor.from("0%", "0%").to("0%", "100%")

            // console.log(shapeList)
            // console.log(shapeNormalX,shapeNormalY,shapeNormalZ,shapeNormalX*NUM_ELEMENT_X*NUM_ELEMENT_Y+NUM_ELEMENT_X*shapeNormalY+shapeNormalZ)

            var shapeNormal = shapeList[shapeNormalX * NUM_ELEMENT_X * NUM_ELEMENT_Y + NUM_ELEMENT_X * shapeNormalY + shapeNormalZ].clone()

            var shapeScale = Math.sqrt((width * height) * csvdata[i].data[3] / (shapeNormal.width() * shapeNormal.height()))

            draw.use(shapeNormal)

            // console.log(width*csvdata[i].data[4],height*csvdata[i].data[5],shapeScale,parseFloat(csvdata[i].data[13]))

            shapeNormal
                .dx(width * csvdata[i].data[4])
                .dy(height * csvdata[i].data[5])

            rotate(shapeNormal, csvdata[i].data[6])

            shapeNormal
                .scale(shapeScale, shapeScale)
                .fill(elementColor)
                .opacity(parseFloat(csvdata[i].data[13]))
        }
    }
    // console.log('for:')
    // console.log(new Date().getTime()-start);
    drawList.push(draw);
    draw.attr('num', num);
    // draw.click(function () {
    //     document.getElementById("audio-click").play();
    //
    //     // 点击海报则放大显示
    //     document.getElementById('chooseposter').style.display = 'block';
    //     document.getElementById('overlay0').style.display = 'block';
    //     if (choosed === null)
    //         choosed = SVG("choosed").fill('#0f4');
    //     choosed.svg(draw.svg());
    //     choosed.attr({
    //         'num': num
    //     });
    //     choosed.scale(4.92);
    //     choosed.translate(1294, 1559);
    //     // pnt.setState({
    //     //     num: draw.attr('num')
    //     // });
    //
    //     // 添加放大动画
    //     $("#chooseposter").addClass("choose-poster-ani");
    // })
}


function setChoosedNull() {
    choosed = null;
}

// // 生成“输入名字”页面的卡片上的海报
// function createCardPoster(csvdata) {
//     width *= 4.92;
//     height *= 4.92;
//     fontSizeSmall *= 4.92;
//     fontSizeMid *= 4.92;
//     fontSizeLarge *= 4.92;
//     var draw = SVG('cardPoster').size(width, height);
//
//     // var circleList = _circleList.concat(), rectList = _rectList.concat(), triList = _triList.concat(), peopleList = _peopleList.concat()
//     var circleList = [],
//         rectList = [],
//         triList = [];
//
//     createShapes(circleList, rectList, triList, draw)
//
//     var shapeList = triList.concat(rectList, circleList)
//
//     var bgGradient = draw.gradient('linear', function (stop) {
//         var bgHSV = csvdata[csvdata.length - 1]
//         stop.at(0, createRGBfromHSV(bgHSV.data[0], bgHSV.data[1], bgHSV.data[2]))
//         stop.at(1, createRGBfromHSV(bgHSV.data[3], bgHSV.data[4], bgHSV.data[5]))
//     })
//     bgGradient.from("0%", "0%").to("0%", "100%")
//     draw.rect(width, height).fill(bgGradient)
//     // let start = new Date().getTime();
//     for (var i = 0; i < csvdata.length; i++) {
//         if (csvdata[i].name === "element") {
//             var shapeNormalX = Math.round((NUM_ELEMENT_TYPE - 1) * csvdata[i].data[0]),
//                 shapeNormalY = Math.round((NUM_ELEMENT_X - 1) * csvdata[i].data[1]),
//                 shapeNormalZ = Math.round((NUM_ELEMENT_Y - 1) * csvdata[i].data[2]);
//
//             var elementColor = draw.gradient('linear', function (stop) {
//                 stop.at(0, createRGBfromHSV(csvdata[i].data[7], csvdata[i].data[8], csvdata[i].data[9]))
//                 stop.at(1, createRGBfromHSV(csvdata[i].data[10], csvdata[i].data[11], csvdata[i].data[12]))
//             })
//             elementColor.from("0%", "0%").to("0%", "100%")
//
//             // console.log(shapeList)
//             //console.log(shapeNormalX,shapeNormalY,shapeNormalZ,shapeNormalX*NUM_ELEMENT_X*NUM_ELEMENT_Y+NUM_ELEMENT_X*shapeNormalY+shapeNormalZ)
//
//             var shapeNormal = shapeList[shapeNormalX * NUM_ELEMENT_X * NUM_ELEMENT_Y + NUM_ELEMENT_X * shapeNormalY + shapeNormalZ].clone()
//
//             var shapeScale = Math.sqrt((width * height) * csvdata[i].data[3] / (shapeNormal.width() * shapeNormal.height()))
//
//             draw.use(shapeNormal)
//
//             // console.log(width*csvdata[i].data[4],height*csvdata[i].data[5],shapeScale,parseFloat(csvdata[i].data[13]))
//
//             shapeNormal
//                 .dx(width * csvdata[i].data[4])
//                 .dy(height * csvdata[i].data[5])
//
//             rotate(shapeNormal, csvdata[i].data[6])
//
//             shapeNormal
//                 .scale(shapeScale, shapeScale)
//                 .fill(elementColor)
//                 .opacity(parseFloat(csvdata[i].data[13]))
//         }
//     }
//
// }

var posterList = [];
var div;
// 获取到服务器返回的csv文件后的回调函数

var features
var noises=[]
function getDataCallback(data, containedNoise, isExtended) {
    // $.get("/test.csv",function(data){
    // console.log(data);
    $(".postersamples").empty()
    $(".square2").empty()
    features = csv2array(data);

    if(containedNoise){
        for(var f in features){//
            for(var g in features[f]){
                features[f][g] = parseFloat(features[f][g])
            }
            noises[f] = features[f].slice(0,39)
            features[f] =  features[f].slice(39)
        }
    }


    console.log(features)
    // console.log(noises)

    for (var i = 0; i < features.length; i++) {
        var element = {
                "data": features[i].slice(0, 15),
                "index": features[i][14],
                "name": "element"
            },
            element2 = {
                "data": features[i].slice(15, 30),
                "index": features[i][29],
                "name": "element"
            },
            element3 = {
                "data": features[i].slice(30, 45),
                "index": features[i][44],
                "name": "element"
            },
            element4 = {
                "data": features[i].slice(45, 60),
                "index": features[i][59],
                "name": "element"
            },
            element5 = {
                "data": features[i].slice(60, 75),
                "index": features[i][74],
                "name": "element"
            },
            element6 = {
                "data": features[i].slice(75, 90),
                "index": features[i][89],
                "name": "element"
            },
            element7 = {
                "data": features[i].slice(90, 105),
                "index": features[i][104],
                "name": "element"
            },
            element8 = {
                "data": features[i].slice(105, 120),
                "index": features[i][119],
                "name": "element"
            },
            element9 = {
                "data": features[i].slice(120, 135),
                "index": features[i][134],
                "name": "element"
            },
            element10 = {
                "data": features[i].slice(135, 150),
                "index": features[i][149],
                "name": "element"
            },
            element11 = {
                "data": features[i].slice(150, 165),
                "index": features[i][164],
                "name": "element"
            },
            element12 = {
                "data": features[i].slice(165, 180),
                "index": features[i][179],
                "name": "element"
            },
            element13 = {
                "data": features[i].slice(180, 195),
                "index": features[i][194],
                "name": "element"
            },
            element14 = {
                "data": features[i].slice(195, 210),
                "index": features[i][209],
                "name": "element"
            },
            element15 = {
                "data": features[i].slice(210, 225),
                "index": features[i][224],
                "name": "element"
            },
            element16 = {
                "data": features[i].slice(225, 240),
                "index": features[i][239],
                "name": "element"
            },
            element17 = {
                "data": features[i].slice(240, 255),
                "index": features[i][254],
                "name": "element"
            },
            element18 = {
                "data": features[i].slice(255, 270),
                "index": features[i][269],
                "name": "element"
            },
            bg = {
                "data": features[i].slice(270, 275),
                "name": "bg"
            };

        var poster = [element, element2, element3, element4, element5, element6, element7, element8, element9, element10, element11,
            element12, element13, element14, element15, element16, element17, element18, bg]

        createPoster(poster, i, isExtended)

        posterList.push(poster);
    }
}

export {
    _circleList,
    _rectList,
    _triList,
    height,
    width,
    features,
    noises
};

export {
    choosed,
    posterList,
    setChoosedNull
};

export {
    createPoster,
    createShapes,
    getDataCallback
};