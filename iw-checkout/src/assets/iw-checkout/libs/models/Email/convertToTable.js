import { initSet, classListToArray, union, intersection } from './arrays'
import {getObject} from "./getObject";

export function convertToTable(node, options) {
    options = options || {};
    if (typeof node === 'string') {
        node = document.querySelector(node);
    }
    if (!node) return "";

    let id = options.id || '';
    let minVisibleHeight = options.minVisibleHeight || 0;
    let minVisibleWidth = options.minVisibleWidth || 0;
    let rowVariance = options.rowVariance || 1;
    let colVariance = options.colVariance || 1;
    let beforeClassSet = initSet(options.beforeClassList);
    let afterClassSet = initSet(options.afterClassList);
    let rowClassSet = initSet(options.rowClassList);
    let cellClassSet = initSet(options.cellClassList);
    let hideClassSet = initSet(options.hideClassList);
    let columns = [];
    let tableData = [];
    let tableCells = [];
    let idx = 0;

    function getText(textNode) {
        let text = textNode.textContent;
        text = text.replace(/\s+/g," ");
        return text;
    }
    function getTranslateText(translateClasses,classList) {
        let text = "";
        translateClasses.forEach((translateClass) => {
            let matches = intersection([translateClass.name], classList);
            if (matches.length > 0) {
                text += translateClass.translation;
            };
        });
        return text;
    }
    function addRowToTable(cols) {
        function addTd(text, cs, cn) {
            var colspan = '';
            if (cs > 1) {
                colspan = " colspan='" + cs + "'";
            }
            var cname = '';
            var cnames = intersection(cn, cellClassSet);
            if (cnames.length) {
                cname = " class='" + [...cnames].join(' ') + "'";
            }
            return '<td' + colspan + cname + '>' + text + '</td>';
        }
        var currentRowSet = new Array();
        var col = null;
        for (var i = 0; i < cols.length; i++) {
            col = cols[i];
            currentRowSet = union(currentRowSet, col.cellclasses);
        }
        var rcname = '';
        currentRowSet = intersection(currentRowSet, rowClassSet);
        if (currentRowSet.length) {
            rcname = " class='" + [...currentRowSet].join(' ') + "'";
        }

        var row = '<tr' + rcname + '>';
        var colspan = '';
        var cs = 0;
        var lastCol = 0;
        for (var i = 0; i < cols.length; i++) {
            col = cols[i];
            if (col.adjCol > lastCol) {
                cs = col.adjCol - lastCol;
                row += addTd('', cs, new Array());
            }
            cs = col.adjCend - col.adjCol;
            row += addTd(col.text, cs, col.cellclasses);
            lastCol = col.adjCol + cs;
        }
        cs = 0;
        if (columns.length > lastCol) {
            cs = columns.length - lastCol;
            row += addTd('', cs, new Array());
        }
        row += '</tr>\n';
        table += row;
    }

    var getStyle = (element) => {
        return element.currentStyle ? element.currentStyle : getComputedStyle(element, null);
    }

    function getCell(node, container, foreclasses, depth) {

        let getBounds = (node) => {
            let pos = node.getBoundingClientRect();
            let style = getComputedStyle(node);
            let adjpos = {
                top: pos.top + parseFloat(style.marginTop) + parseFloat(style.paddingTop),
                left: pos.left + parseFloat(style.marginLeft) + parseFloat(style.paddingLeft),
                bottom: pos.bottom - parseFloat(style.marginBottom) - parseFloat(style.paddingBottom),
                right: pos.right - parseFloat(style.marginRight) - parseFloat(style.paddingRight),
            };
            adjpos.height = pos.bottom - pos.top;
            adjpos.width = pos.right - pos.left;

            return adjpos;
        };
        var childNodes = Array.prototype.slice.call(node.childNodes);

        childNodes.forEach(function(item) {
            switch (item.nodeName) {
                case '#text':
                    var text = getText(item);
                    if (text) {
                        if (node.offsetParent && text) {
                            var pos = getBounds(container);
                            if (pos.height > minVisibleHeight && pos.width > minVisibleWidth) {
                                let ancestry_classes = union(foreclasses, classListToArray(node.classList));
                                let beforeText = getTranslateText(beforeClassSet,ancestry_classes);
                                let afterText = getTranslateText(afterClassSet,ancestry_classes);
                                text = beforeText + text + afterText;
                                tableData.push({ type: '#text', idx: ++idx, pos: pos, text: text, cellclasses: ancestry_classes, node: node, container: container });
                            }
                        }
                    }
                    break;
                case 'A':
                    if (node.offsetParent) {
                        if (!item.classList || !(intersection(classListToArray(item.classList),hideClassSet).length>0)) {
                            let text = getText(item);
                            let pos = getBounds(item);
                            if (pos.height > minVisibleHeight && pos.width > minVisibleWidth) {
                                let anchor = item.cloneNode(true);
                                anchor.href = "" + anchor.href;
                                let isLink = /^https?:/.test(anchor);

                                tableData.push({
                                    type: 'A',
                                    idx: ++idx,
                                    pos: pos,
                                    text: isLink ? anchor.outerHTML : anchor.innerHTML,
                                    cellclasses: union(foreclasses, classListToArray(node.classList)),
                                    node: node,
                                    container: item
                                });
                            }
                        }
                    }
                    break;
                case 'INPUT':
                    if (node.offsetParent) {
                        var pos = getBounds(item);
                        if (pos.height > minVisibleHeight && pos.width > minVisibleWidth) {
                            tableData.push({
                                type: 'INPUT',
                                idx: ++idx,
                                pos: pos,
                                text: item.value,
                                cellclasses: union(foreclasses, classListToArray(node.classList)),
                                node: node,
                                container: item
                            });
                        }
                    }
                    break;
                case 'IMG':
                    if (node.offsetParent) {
                        var pos = getBounds(item);
                        if (pos.height > minVisibleHeight && pos.width > minVisibleWidth) {
                            tableData.push({
                                type: 'IMG',
                                idx: ++idx,
                                pos: pos,
                                text: "<img src='" + item.src + "'/>",
                                cellclasses: union(foreclasses, classListToArray(node.classList)),
                                node: node,
                                container: item
                            });
                        }
                    }
                    break;
                case '#comment':
                    break;
                default:
                    let boundingContainer = container;
                    if (!item.classList || !(intersection(classListToArray(item.classList),hideClassSet).length>0)) {
                        let style = getStyle(item);
                        if (!["inline","inline-block"].includes(style.display)) {
                            boundingContainer = item;
                        }
                        getCell(item, boundingContainer, union(foreclasses, classListToArray(item.classList)), depth + 1);
                    }
            }
        });
    }
    function lpad(str, pad) {
        let length = pad - ('' + str).length;
        if (length < 0) length = 0;
        return ' '.repeat(length) + str;
    }
    function rpad(str, pad) {
        let length = pad - ('' + str).length;
        if (length < 0) return str.substr(0,pad);
        return str + ' '.repeat(length);
    }
    function npad( num, pad, dec) {
        let nstr = ""+num.toFixed(dec);
        return lpad( nstr, pad + dec +1 );
    }
    function layoutCells() {
        if (tableData.length===0) return;
        let byTopLeft = (o1,o2) => {
            let rd = o1.pos.top - o2.pos.top;
            let cd = o1.pos.left - o2.pos.left;
            let id = o1.idx - o2.idx;
            return (rd!==0?rd:cd!==0?cd:id);
        };
        let byLeftAdjTop = (o1,o2) => {
            let cd = o1.pos.left - o2.pos.left;
            let rd = o1.adjTop - o2.adjTop;
            let id = o1.idx - o2.idx;
            return (cd!==0?cd:rd!==0?rd:id);
        };
        let byAdjTopAdjLeft = (o1,o2) => {
            let rd = o1.adjTop - o2.adjTop;
            let cd = o1.adjLeft - o2.adjLeft;
            let id = o1.idx - o2.idx;
            return (rd!==0?rd:cd!==0?cd:id);
        };

//      Assure this is sorted top to bottom, left to right, then ascending index.
        tableData = tableData.sort(byTopLeft);

//      Adjust top values to consider variance
        var horizontalBar = getObject(tableData,"0.pos.top",0);
        for (var i = 0; i < tableData.length; i++) {
            var td = tableData[i];
            var curRow =td.pos.top ;
            if (curRow > horizontalBar + rowVariance){
                horizontalBar = curRow;
            }
            td.adjTop = horizontalBar;
//            console.log(npad(i,2,0),"Adjusted top:",npad (td.adjTop,4,1)," orig top:",npad(curRow,4,1),"idx:", td.idx,">", td.text.substr(0,15));
        }
//      Assure this is sorted left to right, top to bottom, then ascending index.
        tableData = tableData.sort(byLeftAdjTop) ;
//      Adjust left values to consider variance
        var verticalBar = getObject(tableData,"0.pos.left",0);
        let lastLeft = -9999999;
        let colcount = -1;
        for(let i=0;i<tableData.length;i++) {
            let td = tableData[i];
            let curCol = td.pos.left;
            if (curCol > verticalBar + colVariance) {
                verticalBar = curCol;
            }
            if (verticalBar!==lastLeft) {
                colcount++;
                columns.push(verticalBar);
                lastLeft = verticalBar;
            }
            td.adjLeft = verticalBar;
            td.adjCol = colcount;
        }
        if (tableData.length>0) columns.push(tableData[tableData.length-1].pos.right);
            var getClosestCend = ( posvert ) => {
            for(var i=0;i<columns.length;i++) {
                if (posvert<=(columns[i]+colVariance)) break;
            };
            return i;

        }
        for(var i=0;i<tableData.length;i++) {
            var td = tableData[i];
            td.adjCend = getClosestCend(td.pos.right);
        }

        tableData = tableData.sort(byAdjTopAdjLeft);

//      Uncomment the next line to see *lots* of debugging detail in the console on how the geometry is setup.
//        debugTableDataDetails( tableData );
    }

    function debugTableDataDetails( tableData ) {
        console.log("Columns: ",columns.join(", "));

//      Adjust top values to consider variance
        console.log("idx              Act top,left                    Adj top,left        td col,cend     cntnr/node     Bottom x Right   Text");
        for(var i=0;i<tableData.length;i++) {
            var td = tableData[i];
            console.log(npad(i,2,0),
                "(",npad(td.pos.top,4,1)+"/"+rpad(getStyle(td.node).marginTop,4)+"/"+rpad(getStyle(td.node).paddingTop,4)+" x "+npad(td.pos.left,4,1)+"/"+rpad(getStyle(td.node).marginLeft,4)+"/"+rpad(getStyle(td.node).paddingLeft,4),")  "+
                "(",npad(td.adjTop,4,1),"x",npad(td.adjLeft,4,1),")  "+
                "(",npad(td.adjCol,2,1),"-",npad(td.adjCend,2,1),")  "+
                "",rpad(td.container.tagName,4),"/"+rpad(td.node.tagName,4),"  "+
                "(",npad(td.pos.bottom,4,1),"x",npad(td.pos.right,4,1),")  "+
                "char: "+td.text.charCodeAt(0)+"  "+
                (td.text.substr(0,15)),"\n",
                (td.cellclasses.join()),
            );
        }
    }

    function combineCells() {
        if (tableData.length===0) return;
        var ptd = tableData[0];
        tableCells.push(ptd);
        for (var i = 1; i < tableData.length; i++) {
            var td = tableData[i];
            if (ptd.adjTop==td.adjTop && ptd.adjLeft==td.adjLeft) {
                ptd.text += td.text;
            } else {
                tableCells.push(td);
                ptd = td;
            }
        }
    }
    function cellsToTable() {
        if (tableCells.length===0) return;
        var ptd = tableCells[0];
        td = ptd;
        var cols = [];
        cols.push(td);
        for (var i = 1; i < tableCells.length; i++) {
            var td = tableCells[i];
            if (td.adjTop!=ptd.adjTop) {
                addRowToTable(cols);
                cols = [];
            }
            cols.push(td);
            ptd = td;
        }
        addRowToTable(cols);
    }

    var table = '<table width=\"100%\">\n';
    if (id) {
        table = "<table width=\"100%\" id='" + id + "'>\n";
    }
// First Get the Cells from the screen.
    idx = 0;
    getCell(node,node,classListToArray(node.classList), 0);

    layoutCells();
    combineCells();
    cellsToTable();

    table += '</table>';
    return table;
}
