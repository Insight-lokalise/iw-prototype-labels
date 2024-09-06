
export var getObject = (obj, path, defval) => {
    var _path = path.split('.');

    var _getObject = (obj, _gopath) => {
        if (obj === undefined || obj === null) return undefined;
        var key = _gopath.shift();
        if (_gopath.length) {
            return _getObject(obj[key], _gopath);
        } else {
            return obj[key];
        }
    };

    return _getObject(obj, _path) || defval;
};

// var abc = {a: {b: {c: 5}}};
// console.log('getObject(abc,"a.b.c")',getObject(abc,"a.b.c"));               // 5
// console.log('getObject(abc,"a.b.c.d")',getObject(abc,"a.b.c.d"));           // undefined
// console.log('getObject(abc,"a.b")',getObject(abc,"a.b"));                   // {c: 5}
// console.log('getObject(abc,"abc")',getObject(abc,"abc"));                   // undefined
// console.log('getObject(abc,"a.b.c")',getObject(abc,"a.b.c","Hello 1"));     // 5
// console.log('getObject(abc,"a.b.c.d")',getObject(abc,"a.b.c.d","Hello 2")); // Hello 2
// console.log('getObject(abc,"a.b")',getObject(abc,"a.b","Hello 3"));         // {c: 5}
// console.log('getObject(abc,"abc")',getObject(abc,"abc","Hello 4"));         // Hello 4
