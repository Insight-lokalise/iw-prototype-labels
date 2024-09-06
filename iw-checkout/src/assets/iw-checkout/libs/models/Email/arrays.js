export const initSet = (keys) => {
    if (keys) {
        if (keys.constructor === Array) return keys;
        if (keys.constructor === String) return keys.split(',');
    }
    return new Array();
};
export const classListToArray = (cl) => cl?Array.prototype.slice.call(cl, 0):[] || [];
export const reduce = (a) => a.filter(x => x);
export const narrow = (a) => a.filter(x => x !== '');
export const union = (s1, s2) => { return [].concat(s1).concat(s2.filter((o) => !s1.includes(o))); };
// export const union = (s1, s2) => [...s1, ...s2];
export const intersection = (s1, s2) => s1.filter((o) => s2.includes(o));
// export const intersection = (s1, s2) => [...s1].filter(k => s2.includes(k));
