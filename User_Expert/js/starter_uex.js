
(function(){
    var arffDataArray = [],
        scriptURLroot = "http://localhost:8888/SurfWikipedia/file_manager_server/",
        uploadedFiles = 0,
        selectedAttributes = [],
        arffManager, 
        arffObj = new arffStructure(),
        currentFile = 0;


    /*********************************************************************************************************************************/

    // Upload plugin
    var uploadOnSuccess = function(files,data,xhr) {
        ++uploadedFiles;
        arffManager.processArffFile(files[0]);
    };


    var uploadAfterUploadAll = function() {
        $("#button_group_upload").show();
    };
    

    var deleteFilesCallback = function(filesToDelete, pd){

        // if filesToDelete is not array, delete all
        if(!Array.isArray(filesToDelete)){
            filesToDelete = [];
            arffDataArray.forEach(function(arff){
                filesToDelete.push(arff.file);
            });

            $('.ajax-file-upload-statusbar').remove();
        }
        filesToDelete.forEach(function(fileName){
            arffDataArray.splice(arffDataArray.getIndexOf(fileName, 'file'), 1);
            --uploadedFiles;
        });

        if(arffDataArray.length == 0)
            $('#button_group').hide();

        $.post(scriptURLroot + 'delete.php', {op: "delete", files: filesToDelete.join('|')}, function(response){
            console.log(response);
        });
    };


    
    // Arff Manager
    var arffLoadOnSuccess = function(processedArff){
        arffDataArray.push(processedArff);
    };
    
    
    var arffLoadOnError = function(message){
        $('#status').html(message);
    };
    
    
    
    // Dropdown-custom plugin
    var mergeDropdownChanged = function(selectedValue) {
        var areAllDropdownSet = true;
        
        $('#dropdown_container_join_by .dropdown').each(function(i, dd){
            var attrJoinBy = $(dd).prop('value');
            arffDataArray[i]['join-by'] = attrJoinBy;
            if(typeof attrJoinBy == 'undefined' || attrJoinBy == 'undefined')
                areAllDropdownSet = false;
        });
        if(areAllDropdownSet)
            $('#button_group_merge').slideDown();
    };
    
    
    var settingDropdownChanged = function(selectedValue) {
        
        var areAllDropdownSet = true;
        $('#file_settings_container .dropdown').each(function(i, dd){
            var value = $(dd).prop('value');
            if(typeof value == 'undefined' || value == 'undefined')
                areAllDropdownSet =false;
        });
        if(areAllDropdownSet)
            $('#btn_continue_settings').slideDown();
    };
    

    // Buttons 
    var btnContinueUploadClicked = function(){
        $('#file_uploader_container').slideUp();
        $('#button_group_upload').hide();
        
        // if uploaded files > 1 => merge files; otherwise skip merging step
        if(uploadedFiles > 1){
            buildMergeDropdowns();
            $('#file_merger_container').slideDown();
        }
        else{
            arffObj.clone(arffDataArray[0]);
            $('#file_settings_container').slideDown();
            fillFileAttrSelectors();
            buildMetricsTable();
        }   
    };
    
    
    var btnContinueMergeClicked = function(){
        $('#file_merger_container').slideUp();
        $('#file_settings_container').slideDown();
        
        arffDataArray.forEach(function(arff){
            selectedAttributes.push(arff["join-by"]);
        });
        
        arffObj.clone(arffDataArray[0]);
        for(var i=1; i< arffDataArray.length; i++)
            arffObj = arffManager.merge(arffObj, selectedAttributes[i-1], arffDataArray[i], selectedAttributes[i]);
        
        fillFileAttrSelectors();
        buildMetricsTable();
    };
    
    
    var btnContinueSettings = function() {
        setAttributesToVisualize();
    };
    
    
    // Select / Deselect all links
    
    var selectAllClicked = function(){
        $('.metric-checkbox').prop('checked', true);
    };
    
    var deselectAllClicked = function(){
        $('.metric-checkbox').prop('checked', false);
    };


    /*********************************************************************************************************************************/
    //  pluggins' Settings & Options



    var arffSettings = {
        pathToUploads: '../uploads/',
        onSuccess: arffLoadOnSuccess,
        onError: arffLoadOnError
    };
    
    var uploadSettings = {
        url: scriptURLroot + "upload.php",
        dragDrop: true,
        fileName: "myfile",
        allowedTypes: "arff",	
        returnType: "json",
        showDone: false,
        showDelete: true,
        showFileCounter: false,
        onSuccess: uploadOnSuccess,
        deleteCallback: deleteFilesCallback,    //pd.statusbar.hide(); //You chose whether to hide or not.
        afterUploadAll: uploadAfterUploadAll
    };
    
    var dropdownOptions = {
        label: 'Select attribute',
        listItems: [],
        onChange: mergeDropdownChanged
    };



    /*********************************************************************************************************************************/
    // Functionalities
    
    
    function buildMergeDropdowns(){        
        
        arffDataArray.forEach(function(arff, i){
            
            dropdownOptions.listItems = arff.getAttributesByType(['string', 'nominal']);
            var row = $("<div class='row show-grid'></div>").appendTo($('#dropdown_container_join_by'));
            var spanCol = $("<div class='col-md-3 col-md-offset-3 text-right label-col'></div>").appendTo(row);
            $("<span>" + arff.file + "</span>").appendTo(spanCol);

            var ddCol = $("<div class='col-md-2'>").appendTo(row);
            $("<div id='dd_join_by_" + arff.file + "'></div>").appendTo(ddCol).dropdown_custom(dropdownOptions);
        });
    }
    
    
    function fillFileAttrSelectors(){
        
        $('#dropdown_actual_class').empty();
        $('#dropdown_inferred_class').empty();
        $('#dropdown_text').empty();
        
        var nominalAttr = arffObj.getAttributesByType('nominal');
        var stringAttr = arffObj.getAttributesByType('string');
        selectedAttributes.forEach(function(attr){
            if(nominalAttr.indexOf(attr) > -1)
                nominalAttr.splice(nominalAttr.indexOf(attr), 1);
            if(stringAttr.indexOf(attr) > -1)
                stringAttr.splice(stringAttr.indexOf(attr), 1);
        });
        
        
        dropdownOptions.onChange = settingDropdownChanged;
        dropdownOptions.listItems = nominalAttr;
        $('#dropdown_actual_class').dropdown_custom(dropdownOptions);
        $('#dropdown_inferred_class').dropdown_custom(dropdownOptions);
        dropdownOptions.listItems = stringAttr;
        $('#dropdown_text').dropdown_custom(dropdownOptions);
    }
    
    
    function buildMetricsTable() {
        
        var $tbody = $('#metrics_table tbody');
        var numericAttr = arffObj.getAttributesByType('numeric');
        
        numericAttr.forEach(function(numAttr){
            var $row = $("<tr value='" + numAttr + "'></tr>").appendTo($tbody);
            $("<td>" + numAttr + "</td>").appendTo($row);
            $("<td><input type='checkbox' id='cb_" + numAttr + "' class='metric-checkbox' "+
              "value='" + numAttr + "' checked=''></div></td>").appendTo($row);
        });
    }
    
    
    function setAttributesToVisualize() {
    
        arffObj['settings'] = { metrics: [] };
        $('#file_settings_container .dropdown').each(function(i, dd){
            var label = $(dd).attr('label');
            var attr = $(dd).prop('value');
            
            arffObj.settings[label] = attr;
        });
        
        $('.metric-checkbox').each(function(i, cb){
            if($(cb).prop('checked'))
                arffObj.settings.metrics.push($(cb).attr('value'));
        });
        
        console.log('arff ready to be visualized');
        console.log(arffObj);
    }
    
    
    /*********************************************************************************************************************************/
    // Ready function

    (function() {
        arffManager = new arffProcessor(arffSettings);
        $("#mulitplefileuploader").uploadFile(uploadSettings);
        $('#btn_delete_all').click(deleteFilesCallback);
        $('#btn_continue_upload').click(btnContinueUploadClicked);
        $('#btn_continue_merge').click(btnContinueMergeClicked);
        $('#a_select_all').click(selectAllClicked);
        $('#a_deselect_all').click(deselectAllClicked);
        $('#btn_continue_settings').click(btnContinueSettings);
    })();


})();   