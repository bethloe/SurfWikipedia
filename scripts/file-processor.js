
function fileProcessor(settings){
    
    var self = this,
        STR_ERROR_READING_ATTRIBUTES = "Error reading attributes",
        STR_ERROR_READING_DATA = "Error reading data",
        s = $.extend({
            pathToUploads: "../uploads/",
            onSuccess: function(attributes, data){},
            onError: function(message){}
        }, settings);
    
    fileProcessor.prototype.processArffFile = function(fileName){

        var arffFile = s.pathToUploads + fileName;

        $.get(arffFile, {})
            .success(function(arff){
                var lines = arff.split('\n'),
                    attrLines = [],
                    dataLines = [],
                    i = 0;
            
                while(i<lines.length && !lines[i].toLowerCase().contains('@data')){
                    if(lines[i].toLowerCase().contains('@attribute'))
                        attrLines.push(lines[i]);
                    i++;
                }
                dataLines = lines.slice(i+1);
                
                var attributes = getAttributes(attrLines);
                if(attributes === null)
                    return s.onError.call(this, STR_ERROR_READING_ATTRIBUTES);
            
                var rawData = getRawData(dataLines, attributes);
                if(rawData === null)
                    s.onError.call(this, STR_ERROR_READING_DATA);
                else{
                    s.onSuccess.call(this, new WSData({fileName: fileName, attributes: attributes, rawData: rawData}));
                }
            })
            .error(function(jqXHR, textStatus, errorThrown){
                console.log("***** ERROR *****");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            });
    };
    
    
    function getAttributes(lines){
    
        var attributes = {};
        lines.forEach(function(line){
            var posBegin = '@attribute'.length + 1,  // +1 = blanck space
                posEnd = posBegin;
            while(posEnd<line.length && line.charAt(posEnd) != ' ')
                posEnd++;
            
            var attrName = line.substring(posBegin, posEnd),
                attrType = line.substring(posEnd + 1, line.length).toLowerCase();
            
            if(attrType.contains('{') && attrType.contains('}'))
                attrType = 'nominal';
            else if(attrType.contains('date'))
                attrType = 'date';
            
            attributes[attrName] = {
                name: attrName,
                type: attrType
            }
        });
        return attributes;
    }
    
    
    function getRawData(lines, attributes){
        var rawData = [],
            attrKeys = Object.keys(attributes);
        
        lines.forEach(function(line){
            
            var row = CSVtoArray(line),
                rowObj = {};    
            if(row === null)
                return null;
            row.forEach(function(cell, i){
                rowObj[attributes[attrKeys[i]].name] = cell;
            });
            
            rawData.push(rowObj);
        });    
        return rawData;
    }
    
    
    
    /**
     * Return array of string values, or NULL if CSV string not well formed.
     *
     * */

    function CSVtoArray(text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a = [];                     // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
                     function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    }

    
    
    
    fileProcessor.prototype.merge = function(arff1, join_by1, arff2, join_by2, idAttrName){
        
        console.log(arff1);
        var attrId = idAttrName || join_by1,
            newArff = {
            file: 'Merged -- ' + arff1.fileName + ' + ' + arff2.fileName,
            attributes: {},
            rawData: [],
        };
    
        // Merge data
        arff1.rawData.forEach(function(arff1Row, i){
            var index = (arff1Row[join_by1] == arff2.rawData[i][join_by2]) ? i : arff2.rawData.getIndexOf(arff1Row[join_by1], join_by2);
            if(index > -1) {
                var auxObj = {};
                auxObj[attrId] = arff1Row[join_by1]; 
                var newRow = $.extend(auxObj, arff1Row, arff2.rawData[index]);
                delete newRow[join_by1];
                delete newRow[join_by2];
                newArff.rawData.push(newRow);    
            }
            else
                console.log('No match for :' + join_by1 + ' = ' + arff1Row[join_by1]);      
        });
        
        // Delete join attributes and add new ID attribute
        var auxObj = {};
        auxObj[attrId] = {name: attrId, type: 'string'};
        newArff.attributes = $.extend(auxObj, arff1.attributes, arff2.attributes);
        delete newArff.attributes[join_by1];
        delete newArff.attributes[join_by2];
        
        return new WSData(newArff, {id: attrId});
    };
    
    
        
}
