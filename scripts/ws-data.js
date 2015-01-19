function WSData(options, _settings){

    console.log(options);
    console.log(_settings);
    var self = this,
        default_settings = {
            id : '',
            title : '',
            text : '',
            'actual-class' : '',
            'inferred-class' : '',
            measures : [],
            metrics : {},
            keywords : []
        },
        s = $.extend({
            fileName: 'myArff',
            attributes: {},
            rawData: [],
            data : [],
            settings: $.extend({}, default_settings, _settings)
        }, options);

    this.fileName = s.fileName;
    this.attributes = s.attributes;
    this.rawData = s.rawData;
    this.data = s.data;
    this.settings = s.settings;


    WSData.prototype.getAttributesByType = function(_types){
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
    
    
    
    WSData.prototype.createStructuredData = function() {
    
        this.rawData.forEach(function(d){
        
            var datum = {
                id: d[self.settings.id],
                title: d[self.settings.title],
                text: d[self.settings.text],
                'actual-class': d[self.settings["actual-class"]],
                'inferred-class': d[self.settings["inferred-class"]],
                measures: {},
                metrics: {},
                keywords: []
            };
            
            //metric names in settings
            self.data.push(datum);
        });
    };
    
    

    WSData.prototype.computeMetrics = function() {

        
        
        //getDummyMetrics();
    };
    


    function getDummyMetrics() {

        for(var j=0; j<8; j++){
            this.settings.metrics['M' + j] = {
                name: 'M' + j,
                "information-gain": 0
            };
        }

        this.rawData.forEach(function(d){
            d['metrics'] = {};
            Object.keys(this.settings.metrics).forEach(function(m){
                d.metrics[m] = Math.random();
            });
        });

        /// Calculate information gain
    }

    
    
    WSData.prototype.extendDataWithKeywords = function() {
        
    };
    
 
    

};

