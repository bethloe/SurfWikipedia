function arffStructure(options){
    
    s = $.extend({
        fileName: 'myArff',
        attributes: {},
        data: []
    }, options);
    
    this.file = s.file;
    this.attributes = s.attributes;
    this.data = s.data;
    
    
    arffStructure.prototype.clone = function(refArff){
        this.file = refArff.file;
        this.attributes = refArff.attributes;
        this.data = refArff.data;
    };
    
    
    arffStructure.prototype.getAttributesByType = function(_types){
        var types = (Array.isArray(_types)) ? _types : [_types],
            attributes = this.attributes,
            attrKeys = Object.keys(attributes),
            attrByType = [];
        
        attrKeys.forEach(function(attrKey, i){
            if(types.indexOf(attributes[attrKey].type) > -1)
                attrByType.push(attrKey);
        });
        return attrByType;
    };
    
};



function arffProcessor(settings){
    
    var self = this,
        STR_ERROR_READING_ATTRIBUTES = "Error reading attributes",
        STR_ERROR_READING_DATA = "Error reading data",
        s = $.extend({
            pathToUploads: "../uploads/",
            onSuccess: function(attributes, data){},
            onError: function(message){}
        }, settings);
    
    
    arffProcessor.prototype.processArffFile = function(fileName){

        var arffFile = s.pathToUploads + fileName;

        $.get(arffFile, {})
            .done(function(arff){
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
            
                var data = getData(dataLines, attributes);
                if(data === null)
                    s.onError.call(this, STR_ERROR_READING_DATA);
                else{
                    s.onSuccess.call(this, new arffStructure({file: fileName, attributes: attributes, data: data}));
                }
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
                type: attrType
            }
        });
        return attributes;
    }
    
    
    function getData(lines, attributes){
        var data = [],
            attrKeys = Object.keys(attributes);
        
        lines.forEach(function(line){
            
            var row = CSVtoArray(line),
                rowObj = {};    
            if(row === null)
                return null;
            row.forEach(function(cell, i){
                rowObj[attributes[attrKeys[i]]] = cell;
            });
            data.push(rowObj);
        });    
        return data;
    }
    
    
    arffProcessor.prototype.merge = function(arff1, join_by1, arff2, join_by2, idAttrName){
        
        var newArff = {
            file: arff1.file + ' + ' + arff2.file,
            attributes: $.extend({}, arff1.attributes, arff2.attributes),
            data: []
        };
        
        arff1.data.forEach(function(arff1Row, i){
            if(arff1Row[join_by1] == arff2.data[i][join_by2]){
                newArff.data.push($.extend({}, arff1Row, arff2.data[i]));
            }
            else{
                var indexInArff2 = arff2.data.getIndexOf(arff1Row[join_by1], join_by2);
                
                if(indexInArff2 > -1)
                    newArff.data.push($.extend({}, arff1Row, arff2.data[indexInArff2]));
                else
                    console.log('No match for :' + join_by1 + ' = ' + arff1Row[join_by1]);
            }
        });    
        return new arffStructure(newArff);
    };
    
    
    
    
    
        
}