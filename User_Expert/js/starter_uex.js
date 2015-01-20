
(function(){
    var arffDataArray = [],
        port = location.port || 80,
        scriptURLroot = "http://localhost:" + port + "/SurfWikipedia/file_manager_server/",
        //scriptURLroot = "http://localhost/SurfWikipedia/file_manager_server/",
        uploadedFiles = 0,
        selectedAttributes = [],
        arffManager, 
        wsData = new WSData(),
        currentFile = 0,
        newIdName;

/*
    console.log('port');
    console.log(port);
    console.log(typeof port);
    console.log(scriptURLroot);
  */
    /*********************************************************************************************************************************/
    //  CALLBACKS
    
    // Upload plugin
    var uploadOnSuccess = function(files,data,xhr) {
        console.log("---- success uploading");
        ++uploadedFiles;
        setTimeout(function(){
            arffManager.processArffFile(files[0]);
        }, 100);

    };


    var uploadAfterUploadAll = function() {
        $("#button_group_upload").show();
    };
    
    var uploadOnError = function(files, status, message) {
        console.log("---- error uploading");
        console.log(status);
        console.log(message);
    };


    var deleteFilesCallback = function(filesToDelete, pd){

        // if filesToDelete is not array, delete all
        if(!Array.isArray(filesToDelete)){
            filesToDelete = [];
            arffDataArray.forEach(function(arff){
                filesToDelete.push(arff.fileName);
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
        if(areAllDropdownSet){
            $('#button_group_merge').slideDown();
            var commonAttrName = arffDataArray[0]['join-by'],
                i=1;
            while(i<arffDataArray.length && arffDataArray[i]['join-by'] == commonAttrName)
                ++i;
            
            if(i < arffDataArray.length)
                $('#new_name_section').slideDown();
            else
                $('#new_name_section').slideUp();
        }
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
        
        console.log(arffDataArray);
        $('#file_uploader_container').slideUp();
        $('#button_group_upload').hide();
        
        // if uploaded files > 1 => merge files; otherwise skip merging step
        if(uploadedFiles > 1){
            buildMergeDropdowns();
            $('#file_merger_container').slideDown();
        }
        else{
            wsData = arffDataArray[0];
            $('#file_settings_container').slideDown();
            fillFileAttrSelectors();
            buildMeasuresTable();
        }   
    };
    
    
    var goClicked = function(){
            
        
    };
    
    
    var btnContinueMergeClicked = function(){
        $('#file_merger_container').slideUp();
        $('#file_settings_container').slideDown();
        
        arffDataArray.forEach(function(arff){
            selectedAttributes.push(arff["join-by"]);
        });
        
        newIdName = $('#input_new_name').val();
        wsData = arffDataArray[0];
        for(var i=1; i< arffDataArray.length; i++)
            wsData = arffManager.merge(wsData, selectedAttributes[i-1], arffDataArray[i], selectedAttributes[i], newIdName);
        
        fillFileAttrSelectors();
        buildMeasuresTable();
    };
    
    
    var btnContinueSettings = function() {
        prepareDataToVisualize();
    };
    
    
    // Select / Deselect all links
    
    var selectAllClicked = function(){
        $('.measure-checkbox').prop('checked', true);
    };
    
    var deselectAllClicked = function(){
        $('.measure-checkbox').prop('checked', false);
    };

    
    var submitData = function() {
        // submit to vis_uex.php
        $("input[name='post']").val(JSON.stringify(wsData));
        $("#post_form").submit();
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
        onError: uploadOnError,
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
            var row = $("<div class='row margin-top-bottom show-grid'></div>").appendTo($('#dropdown_container_join_by'));
            var spanCol = $("<div class='col-md-3 col-md-offset-3 text-right label-col'></div>").appendTo(row);
            $("<span>" + arff.fileName + "</span>").appendTo(spanCol);

            var ddCol = $("<div class='col-md-2'>").appendTo(row);
            $("<div id='dd_join_by_" + arff.fileName + "'></div>").appendTo(ddCol).dropdown_custom(dropdownOptions);
        });
    }
    
    
    function fillFileAttrSelectors(){
        
        $('#dropdown_title').empty();
        $('#dropdown_snippet').empty();
        $('#dropdown_actual_class').empty();
        $('#dropdown_inferred_class').empty();
        
        var nominalAttr = wsData.getAttributesByType('nominal');
        var stringAttr = wsData.getAttributesByType('string');
        
        dropdownOptions.onChange = settingDropdownChanged;
        dropdownOptions.listItems = $.merge($.merge([], stringAttr), nominalAttr);
        $('#dropdown_title').dropdown_custom(dropdownOptions);
        stringAttr.splice(stringAttr.indexOf(wsData.settings.id), 1);
        dropdownOptions.listItems = stringAttr;
        $('#dropdown_snippet').dropdown_custom(dropdownOptions);
        dropdownOptions.listItems = nominalAttr;
        $('#dropdown_actual_class').dropdown_custom(dropdownOptions);
        $('#dropdown_inferred_class').dropdown_custom(dropdownOptions);

    }
    
    
    function buildMeasuresTable() {
        
        var $tbody = $('#measures_table tbody');
        var numericAttr = wsData.getAttributesByType('numeric');
        
        numericAttr.forEach(function(numAttr){
            var $row = $("<tr value='" + numAttr + "'></tr>").appendTo($tbody);
            $("<td>" + numAttr + "</td>").appendTo($row);
            $("<td><input type='checkbox' id='cb_" + numAttr + "' class='measure-checkbox' "+
              "value='" + numAttr + "' checked=''/></td>").appendTo($row);
        });
    }
    
    
    
    function prepareDataToVisualize() {
        setAttributesSemantics();
        wsData.computeMetrics();
        wsData.createStructuredData();
        
        console.log('arff ready to visualize');
        console.log(wsData);

        // submit to vis_uex.php
        $("input[name='post']").val(JSON.stringify(wsData));
        //$("#post_form").submit();
    }
    
    
    function setAttributesSemantics() {
    
        $('#file_settings_container .dropdown').each(function(i, dd){
            var label = $(dd).attr('label');
            var attr = $(dd).prop('value');
            
            wsData.settings[label] = attr;
        });
    
        $('.measure-checkbox').each(function(i, cb){
            if($(cb).prop('checked'))
                wsData.settings.measures.push($(cb).attr('value'));
        });        
    }
    
    
    
    /*********************************************************************************************************************************/
    // Ready function

    (function() {
        arffManager = new fileProcessor(arffSettings);
        $("#mulitplefileuploader").uploadFile(uploadSettings);
        $('#btn_delete_all').click(deleteFilesCallback);
        $('#btn_continue_upload').click(btnContinueUploadClicked);
        $('#btn_continue_merge').click(btnContinueMergeClicked);
        $('#a_select_all').click(selectAllClicked);
        $('#a_deselect_all').click(deselectAllClicked);
        $('#btn_continue_settings').click(btnContinueSettings);
    })();


})();
