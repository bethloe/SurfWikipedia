
<!DOCTYPE html>
<html>
    <head>
        <title>uRank</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        
        <script type="text/javascript" src="libs/jquery-1.10.2.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/fileGenerator.js" charset="utf-8"></script>
        
        <script type="text/javascript" src="scripts/utils.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/previousResults.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/taskStorage.js" charset="utf-8"></script>

        <link rel="stylesheet" type="text/css" href="css/general-style.css" />
    </head>
    <body>
        <div style="text-align: center; margin-top: 10em; color: darkblue;">
            <h2>Evaluation results</h2>
            <a id="clear_results" href="#">Clear</a>
            <br/><br/>
            <a id="fix_results" href="#">Fix</a>
            <br/><br/>
            <a id="restore_results" href="#">Restore</a>
            <br/><br/>
            <form action="./" method="post">
                <a id="download_results" href="#">Download</a>
            </form>
        </div>
        
        <script type="text/javascript" src="scripts/controls.js" charset="utf-8"></script>
    </body>
</html>
