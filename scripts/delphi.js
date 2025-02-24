function delphi_highlight_td(elmt,score) {
    $('#label-' + elmt + '-' + score).prev().prop("checked", true);
    $('#label-' + elmt + '-' + score).parent().parent().css('background-color','#FFC20A');
    $('[name="' + elmt + '"]').val(score);
}

function delphi_display_results(elmt, groups) {
    //-- put the TD's in place
    $('[name='+elmt+']').nextAll('.choicehoriz')
        .each(function() {
            $(this).wrap('<td style="border: 1px dotted #999;"></td>')
        })
    //-- now add the "You" element
    $('<td>Your rating</td>').insertBefore($('[name='+elmt+']').next('td'));
    //--Now wrap in a tr
    $('[name='+elmt+']').nextAll('td').wrapAll('<tr></tr>')
    let gLen = groups.length - 1;
    let rowText = '';
    rowText = '<tr><td colspan="13" style="font-weight:normal;"><p>You previously rated this topic as follows:</p></td></tr>';
    $(rowText).insertBefore($('[name='+elmt+']').next('tr'));

    for ( let j = gLen; j >= 0 ; j-- ) {
        rowText = '<tr><td>' + groups[j][0] + '<br/><br/></td>';
        for (let i = 0; i < 12; i++ ) {
            if ( i === groups[j][1] ) {
                rowText += '<td style="border: 1px dotted #999; background-color: ' + groups[j][2] + '"></td>';
            } else {
                rowText += '<td style="border: 1px dotted #999;"></td>';
            }
        }
        rowText += '</tr>';
        $(rowText).insertBefore($('[name='+elmt+']').next('tr'));
    }
    rowText = '<tr><td></td><td style="font-weight:normal; text-align: center;">0</td><td style="font-weight:normal; text-align: center;">1</td><td style="font-weight:normal; text-align: center;">2</td><td style="font-weight:normal; text-align: center;">3</td><td style="font-weight:normal; text-align: center;">4</td><td style="font-weight:normal; text-align: center;">5</td><td style="font-weight:normal; text-align: center;">6</td><td style="font-weight:normal; text-align: center;">7</td>';
    rowText += '<td style="font-weight:normal; text-align: center;">8</td><td style="font-weight:normal; text-align: center;">9</td><td style="font-weight:normal; text-align: center;">10</td><td style="font-weight:normal; text-align: center;">Unsure</td></tr>';
    $(rowText).insertBefore($('[name='+elmt+']').next('tr'));
    rowText = '<tr><td colspan="13" style="font-weight:normal;">Where: 0 = Not important at all and 10= Very important</td></tr>';
    $(rowText).insertBefore($('[name='+elmt+']').next('tr'));
    //-- Now wrap in a table
    $('[name='+elmt+']').nextAll('tr').wrapAll('<table class="nogreen"></table>');

    rowText = '<tr><td colspan="13" style="font-weight:normal;"><p>Please now consider your previous rating; if you wish to change this, please select your new rating. Please then click \'next page\' to move to the next topic</p></td></tr>';
    $(rowText).insertAfter($('[name='+elmt+']').next('table').find('tr:last'));


    //-- now disable the greenhighlight
    $('.nogreen, .smalllink').on('click', function(){
        $('form#form #questiontable tr td.greenhighlight').removeClass('greenhighlight');
    });
}
