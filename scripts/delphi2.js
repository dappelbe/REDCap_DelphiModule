/**
 * @author Duncan Appelbe
 * @version 1.0 23Jan2025
 */

$(document).ready(function(){
    let elmts = REDCapDelphi.elements;
    $.each(elmts, function(key, value){
        switch(value.type){
            case 'bar':
                delphi_highlight_td(key,value.groups.prevscore);
                delphi_display_results_bar(key,value.groups.group);
                break;
            case 'single-matrix':
                delphi_highlight_td(key,value.groups.prevscore);
                delphi_display_results_matrix(key,value.groups.group);
                break;
            case 'single':
            default:
                delphi_highlight_td(key,value.groups.prevscore);
                delphi_display_results(key,value.groups.group);
                break;
        }
    });
})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function clearGreenHighlight() {
    await delay(500);
    $('form#form #questiontable tr td.greenhighlight').removeClass('greenhighlight');
}
function delphi_highlight_td(elmt,score) {
    $('input[name="' + elmt + '___radio"][value="' + score + '"]').prop("checked", true);
    $('input[name="' + elmt + '___radio"][value="' + score + '"]').parent().css('background-color','#FFC20A');
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
            if ( values[i] == value.score ) {
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

    clearGreenHighlight();

}

function delphi_display_results_matrix(elmt,groups) {
    $('<tr class="labelmatrix col-12" style="display: table-row; border-bottom: none;"><td colspan="2">' + $('[data-mlm-field="' + elmt + '"][data-mlm-type="label"]').html() + '</td></tr>').insertBefore('#' + elmt + '-tr');

    let tdCtr = $('[name='+elmt+'___radio]').length;
    let values = [];

    $('[name='+elmt+'___radio]').each( function() { values.push($(this).prop('value'))});

    rowText = '';
    $.each(groups, function(key, value){
        rowText = '<tr><td style="padding:2px 0;">'
            + value.name
            + '</td>';
        for (let i = 0; i < tdCtr; i++ ) {
            if ( values[i] == value.score ) {
                rowText += '<td  class="" style="border: 1px solid black; background-color: ' + value.colour + '">&#160;</td>';
            } else {
                rowText += '<td  class="" style="border: 1px dotted black;">&#160;</td>';
            }
        }
        rowText += '</tr>';
        $(rowText).insertBefore($('[name="' + elmt + '___radio"]').first().parent().parent());
    });

    $('[data-mlm-field="' + elmt + '"][data-mlm-type="label"]').html('Your rating')
    rowText = '<tr><td colspan="13" style="font-weight:normal;"><p>Please now consider your previous rating; if you wish to change this, please select your new rating. Please then click \'next page\' to move to the next topic</p></td></tr>';
    $('#' + elmt + '-tr').find('table').first().append(rowText)
    clearGreenHighlight();
}

function delphi_display_results_bar(elmt,groups) {
    let tdCtr = $('[name='+elmt+'___radio]').length;
    let values = [];

    $('[name='+elmt+'___radio]').each( function() { values.push($(this).prop('value'))});

    $('[name='+elmt+']').nextAll('.choicehoriz')
        $.each(function() {
            $(this).wrap('<td style="border: 1px dotted #999;"></td>')
        });
    $('<td>Your rating</td>').insertBefore($('[name='+elmt+']').next('td'));
    
    //$('[data-mlm-field="' + elmt + '"][data-mlm-type="label"]').html('Your rating')
    //rowText = '<tr><td colspan="13" style="font-weight:normal;"><p>Please now consider your previous rating; if you wish to change this, please select your new rating. Please then click \'next page\' to move to the next topic</p></td></tr>';
    $.each(groups, function(key, value) {
        $('#' + elmt + '-tr').find('table').first().append('<div id="' + elmt + '-graph" class="' + elmt + '-graph" style="height:300px;"></div>')
        let data = value.score.split(',');
        let myChart = echarts.init($('.' + elmt + '-graph')[0]);
        let option = {
            title: [
                {
                    left: 'center',
                    text: value.name,
                },
                ],
            tooltip: {},
            xAxis: {
                data: values,
            },
            yAxis: {},
            series: [
                {
                    name: value.name,
                    type: 'bar',
                    data: data,
                }
            ]
        };
        // Display the chart using the configuration items and data just specified.
        myChart.setOption(option);
    });

    $('<span><b>Your rating</b>&#160;&#160;&#160;&#160;</span>').insertAfter('[name="aa"]');
    rowText = '<tr><td colspan="13" style="font-weight:normal;"><p>Please now consider your previous rating; if you wish to change this, please select your new rating. Please then click \'next page\' to move to the next topic</p></td></tr>';
    $(rowText).insertBefore('#' + elmt + '_MDLabel')

    clearGreenHighlight();
}