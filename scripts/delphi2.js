/**
 * @author Duncan Appelbe
 * @version 1.0 23Jan2025
 */

$(document).ready(function(){
    switch(REDCapDelphi.type){
        case 'single':
        default:
            let elmts = REDCapDelphi.elements;
            $.each(elmts, function(key, value){
                delphi_highlight_td(key,value.prevscore);
                delphi_display_results(key,value.group);
            });
            break;
    }
})

function delphi_highlight_td(elmt,score) {
    $('#label-' + elmt + '-' + score).prev().prop("checked", true);
    $('#label-' + elmt + '-' + score).parent().css('background-color','#FFC20A');
    $('[name="' + elmt + '"]').val(score);
}

function delphi_display_results(elmt, groups) {
    let tdCtr = 0;
    let values = [];
    //-- put the TD's in place
    $('[name='+elmt+']').nextAll('.choicehoriz')
        .each(function() {
            $(this).wrap('<td style="border: 1px dotted #999;"></td>')
            tdCtr++;
            val = $(this).find('.mc').first().text();
            values.push(val);
        })
    //-- now add the "You" element
    $('<td>Your rating</td>').insertBefore($('[name='+elmt+']').next('td'));
    //--Now wrap in a tr
    $('[name='+elmt+']').nextAll('td').wrapAll('<tr></tr>')

    let rowText = '';
    rowText = '<tr><td colspan="13" style="font-weight:normal;"><p>You previously rated this topic as follows:</p></td></tr>';
    $(rowText).insertBefore($('[name='+elmt+']').next('tr'));

    $.each(groups, function(key, value){
        rowText = '<tr><td>' + value.name + '<br/><br/></td>';
        for (let i = 0; i < tdCtr; i++ ) {
            if ( i == value.score ) {
                rowText += '<td style="border: 1px dotted #999; background-color: ' + value.colour + '"></td>';
            } else {
                rowText += '<td style="border: 1px dotted #999;"></td>';
            }
        }
        rowText += '</tr>';
        $(rowText).insertBefore($('[name='+elmt+']').next('tr'));
    });

    let rowText2 = '<tr><td></td>';
    for (let i = 0; i < tdCtr; i++ ) {
        rowText2 += '<td style="font-weight:normal; text-align: center;">' + values[i] + '</td>';
    }
    rowText2 += '</tr>';

    $(rowText2).insertBefore($('[name='+elmt+']').next('tr'));
    //-- Now wrap in a table
    $('[name='+elmt+']').nextAll('tr').wrapAll('<table class="nogreen"></table>');

    rowText = '<tr><td colspan="13" style="font-weight:normal;"><p>Please now consider your previous rating; if you wish to change this, please select your new rating. Please then click \'next page\' to move to the next topic</p></td></tr>';
    $(rowText).insertAfter($('[name='+elmt+']').next('table').find('tr:last'));


    //-- now disable the greenhighlight
    $('.nogreen, .smalllink').on('click', function(){
        $('form#form #questiontable tr td.greenhighlight').removeClass('greenhighlight');
    });
}
