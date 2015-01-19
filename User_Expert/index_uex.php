<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">

    <script src="../libs/jquery-1.10.2.js" type="application/javascript" charset="utf-8"></script>
    <script src="../libs/bootstrap-3.3.1/dist/js/bootstrap.min.js" type="application/javascript" charset="utf-8"></script>
    
    <script src="../libs/jquery.uploadfile.js" type="application/javascript" charset="utf-8"></script>
    <script src="../scripts/ws-data.js" type="application/javascript" charset="utf-8"></script>
    <script src="../scripts/file-processor.js" type="application/javascript" charset="utf-8"></script>
    <script src="../scripts/dropdown-custom.js" type="application/javascript" charset="utf-8"></script>
    <script src="../scripts/utils.js" type="application/javascript" charset="utf-8"></script>
    
    <link rel="stylesheet/less" type="text/css" href="../less/styles.less" />
    <!-- <link rel="stylesheet/less" type="text/css" href="../less/styles.css" /> -->
    
    <script src="../libs/less.min.js"></script>

</head>
<body>

    <div class="container-fluid">
        
        <div id="file_uploader_container" class="text-center">
            <div class="page-header text-center">
                <h3>Upload files</h3>
            </div>
            <div id="mulitplefileuploader">Select</div>
            <div id="status"></div>
            <div id="button_group_upload" class="btn-group" role="group" style="display:none;">
                <button type="button" id="btn_delete_all" class="btn btn-default">Delete All</button>
                <button type="button" id="btn_continue_upload" class="btn btn-default">Continue</button>
            </div>
            <a href="#" id="go_no_upload" >Go</a>
        </div>

        <div id="file_merger_container" class="text-center" style="display:none;">
            <div class="page-header text-center">
                <h3>Select attributes to join files by</h3>
            </div>
            <div id="dropdown_container_join_by" class="container-fluid text-center"></div>

            <div id="new_name_section" class="container-fluid text-center" style="display:none;">
                <div class="row margin-top-bottom">
                    <div class="col-md-3 col-md-offset-3 text-right label-col">
                        <span>Enter a name for ID attribute</span>
                    </div>
                    <div class="col-md-2"> 
                        <input type="text" class="text-input" id="input_new_name">
                    </div>
                </div>
            </div>
            
            <div id="button_group_merge" class="btn-group" role="group" style="display:none">
                <button type="button" class="clear_all btn btn-default">Clear all</button>
                <button type="button" id="btn_continue_merge" class="btn btn-default">Continue</button>
            </div>
        </div>  
        
            
        <div id="file_settings_container" class="container-fluid" style="display:none">
            <div class="page-header text-center">
                <h3>Select attributes semantic</h3>
            </div>
            <div class="row margin-top-bottom show-grid">
                <div class="col-md-4 col-md-offset-1">  
                    
                    <div class="row margin-top-bottom show-grid">
                        <div class="col-md-6 text-right label-col">
                            <span>Title</span>
                        </div>
                        <div class="col-md-6">
                            <div id="dropdown_container_title" class="dropdown-container">
                                <div class="dropdown" id="dropdown_title" label="title"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row margin-top-bottom show-grid">
                        <div class="col-md-6 text-right label-col">
                            <span>Snippet</span>
                        </div>
                        <div class="col-md-6">
                            <div id="dropdown_container_snippet" class="dropdown-container">
                                <div class="dropdown" id="dropdown_snippet" label="text"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row margin-top-bottom show-grid">
                        <div class="col-md-6 text-right label-col">
                            <span>Actual Class</span>
                        </div>
                        <div class="col-md-6">
                            <div id="dropdown_container_actual_class" class="dropdown-container">
                                <div class="dropdown" id="dropdown_actual_class" label="actual-class"></div>
                            </div>
                        </div>
                    </div>

                    <div class="row margin-top-bottom show-grid">
                        <div class="col-md-6 text-right label-col">
                            <span>Inferred Class</span>
                        </div>
                        <div class="col-md-6">
                            <div id="dropdown_container_inferred_class" class="dropdown-container">
                                <div class="dropdown" id="dropdown_inferred_class"  label="inferred-class"></div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                <div class="col-md-4">
                    <table id="measures_table" class="table">
                        <thead>
                            <th>Measures</th>
                            <th>Select</th>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                
                <div class="col-md-1">
                    <a id="a_select_all" href="#">Select all</a><br/>
                    <a id="a_deselect_all" href="#">Delect all</a><br/><br/><br/>
                    <button type="button" id="btn_continue_settings" class="btn btn-default" style="display:none;">Continue</button>    
                </div>
                
            </div>  
        </div>
    </div>
    <div style="display: none;">
        <form id="post_form" action="vis_uex.php" method="post">
            <input type="text" name="data" />
        </form>
    </div>
    
    <script src="js/starter_uex.js" type="text/javascript" charset="utf-8"></script>
</body>

