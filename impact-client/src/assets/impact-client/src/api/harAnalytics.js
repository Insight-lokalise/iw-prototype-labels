import JSONPath from 'jsonpath-plus';

export default class harAnalytics {
    avg(arr, path) {
        if (typeof path == "string") {
            arr = JSONPath({path: path, json: arr})
        }
        let total = arr.reduce((total, num) => total + num);
        let average = total / arr.length;
        return average;
    }
    formatNumber(val, places) {
        places = places || 0;
        let num = Number(val).toLocaleString(undefined,{minimumFractionDigits:places,maximumFractionDigits:places})
        return num;
    }
    formatTime(val) {
        let time = new Date(val).toLocaleTimeString(undefined,{})
        return time;
    }
    reformClassName(className) {
        if (typeof className === "string") {
            className = className.trim();
            if (className === "") {
                className={};
            } else {
                let cna = className.split(',');
                className={};
                cna.forEach(key => {className[key.trim()]=true})
            }
        }
        return className;
    }
    sum(obj, path) {
    	if (typeof path === "string") {
            obj = JSONPath({path: path, json: obj})
    	}
    	if (typeof obj === "undefined" || obj.length===0) return 0;
        let asum = obj.reduce((total, num) => total + num);
        return asum;
    }
    unique(arr, filter) {
        if (typeof filter === "function") arr = arr.map(filter);
        const uniqueValues = [...new Set(arr)];
        return uniqueValues;
    }
    groupBy(arr, property) {
        return arr.reduce(function (acc, obj) {
            let key = typeof property === "function" ?
                property(obj) :
                JSONPath({path: property, json: obj})
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    }
}
export const avg = harAnalytics.prototype.avg;
export const formatNumber = harAnalytics.prototype.formatNumber;
export const formatTime = harAnalytics.prototype.formatTime;
export const groupBy = harAnalytics.prototype.groupBy;
export const reformClassName = harAnalytics.prototype.reformClassName;
export const sum = harAnalytics.prototype.sum;
export const unique = harAnalytics.prototype.unique;
