
(function($) {

    $.fn.dropdown_custom = function(options){

        var self = this;
        s = $.extend({
            toggleType: "button",
            toggleStyleClass: 'btn-default',
            toggleSizeClass: '',
            label: 'Select...',
            listItems: [],
            onChange: function(selectedValue){}
        }, options);   

        this.val = '';

         
        return this.each(function(){
        
            var dd = $(this),
                ddId = dd.attr('id'),
                toggleElem;
            
            
            /*
            <div class="dropdown" id="dropdown_join_by">
                <button class="btn btn-default dropdown-toggle" type="button" id="dd_join_by" data-toggle="dropdown" aria-expanded="false">
                                Select attribute
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dd_join_by">
                    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
                </ul>
            </div>
            */

            dd.empty().addClass('dropdown');

            switch(s.toggleType){
                case 'button':
                    toggleElem = $('<button></button>').appendTo(dd)
                    .attr('id', ddId + '_btn')
                    .attr('class', 'dropdown-toggle btn ' + s.toggleSizeClass + ' ' + s.toggleStyleClass)
                    .attr('type', 'button')
                    .attr('data-toggle', 'dropdown')
                    .text(s.label);
                    break;
            }

            var caret = "<span class='caret'></span>";
            $(caret).appendTo(toggleElem);
            var ddMenu = $('<ul></ul>').appendTo(dd)
            .attr('class', 'dropdown-menu')
            .attr('role', 'menu')
            .attr('aria-labelledby', ddId + '_btn');

            s.listItems.forEach(function(liItem, i){
                var li = $("<li role='presentation'></li>").appendTo(ddMenu);
                var item = $("<a href='#' role='menuitem' tabindex='" + (i+1) + "'>" + liItem + "</a>").appendTo(li);
                item.on('click', function(){ 
                    var dd = $(this).parent().parent().parent(),
                        selectedValue = $(this).text();
                    dd.prop('value',selectedValue);
                    dd.children('.dropdown-toggle').html(selectedValue + '' + caret);
                    s.onChange.call(this, selectedValue);
                });
            });
        
        });
        
        
        
        


    };

}(jQuery));

