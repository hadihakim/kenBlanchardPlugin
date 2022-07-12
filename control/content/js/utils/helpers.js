const Utils = {
    /**
     * RFC4122 version 4 compliant UUID solution 
     * It solves the Math.random() poor implementaion issue (possible collision)
     * by offsetting the first 13 hex numbers by a hex portion of the timestamp, 
     * and once depleted offsets by a hex portion of the microseconds since pageload
     * @returns {string} UUID4 string
     */
    generateUUID: () => {
        let d = new Date().getTime(),
            d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
    },

    traverseObject: (obj, keys) => {
        return keys.split('.').reduce((cur, key) => {
            return cur[key];
        }, obj);
    },

    /**
     * Create an HTML element with classes and innerHTML
     * @param {Object} elementOptions {elementType, innerHTML, attrObj, classArray, parent }
     * elementType : (span, div...)
     * attrObj : to add an id or any other attribute (data, ...)
     * classArray : array of CSS classes to be added
     * parent: parent HTML element where it should be added
     */
    createUIElement(elementOptions) {
        let e = document.createElement(elementOptions.elementType);
        e.innerHTML = elementOptions.innerHTML || '';
        if (elementOptions.classArray) elementOptions.classArray.forEach(c => e.classList.add(c));
        elementOptions.parent.appendChild(e);
        // adding attributes to the element
        if (elementOptions.attrObj) Object.keys(elementOptions.attrObj).forEach(attr => { e.setAttribute(attr, elementOptions.attrObj[attr]) })
        return e;
    },

    numToHHMMSS: (duration) => {
        var sec_num = parseInt(duration, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return hours + ':' + minutes + ':' + seconds;
    },

    hhmmssToNum: (durationString) => {
        var parts = durationString.split(':');
        return parseInt(parts[0] || 0, 10) * 3600 + parseInt(parts[1] || 0, 10) * 60 + parseInt(parts[2] || 0, 10);
    },

    // sort an array of objects by a given key and order
    // key could be a string or date or number or whatever
    // order could be 'asc' or 'desc'
    sortObjectArray: (array, key, order) => {
        const sortDirection = order === 'asc' ? 1 : -1;
        return array.sort((a, b) => {
            if (a[key] < b[key]) return -1 * sortDirection;
            if (a[key] > b[key]) return 1 * sortDirection;
            return 0;
        });
    }
}