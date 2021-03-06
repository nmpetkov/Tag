/**
 * Tag - a content-tagging module for the Zikukla Application Framework
 * 
 * @license MIT
 *
 * Please see the NOTICE file distributed with this source code for further
 * information regarding copyright and licensing.
 */
function initTagUI()
{
    if ($('tagsAvailableToAdd')) {
        $$('.tag_available').invoke('observe', 'click', tag_add_available);
    }
    if ($('selectedTags')) {
        $$('.tagRemover').invoke('observe', 'click', tag_remove);
    }
    if ($('addNewTag')) {
        $('addNewTag').observe('click', tag_add_new);
    }
    // observe form for submit before tags added
    if ($('tag_adder')) {
        $('tag_adder').up('form').observe('submit', tag_add_new);
    }
    // add tooltips to tag removal links (special case)
    $$('li.activeTag a').each(function(link) {
        link.tooltip = new Zikula.UI.Tooltip(link);
    });
    // disable form submission for tag_adder field
    $('tag_adder').observe('keypress', function(event){
       if (event.keyCode == Event.KEY_RETURN) {
           event.stop();
           tag_add_new();
       }
    });
    // autocompleter options
    var options = Zikula.Ajax.Request.defaultOptions({
        paramName: 'fragment',
        tokens: ',',
        minChars: 3
    });
    new Ajax.Autocompleter('tag_adder', 'tag_choices', Zikula.Config.baseURL + 'ajax.php?module=tag&type=ajax&func=gettags', options);
}

function tag_add_available(event)
{
    var id = event.element().identify();
    var tagnameparts = id.split("_");
    var slug = tagnameparts.pop();
    // get tagname from element content
    var tagname = event.element().innerHTML;
    _tag_add(tagname, slug);
}

function _tag_add(tagname, slug)
{
    if ($('li_' + slug) == undefined) {
        // add visible tag
        $('selectedTags').insert("<li class='activeTag' id='li_" + slug + "'><span class='taghole'>&bull;</span>" + tagname + " <a href='javascript:void(0);' title='" + Zikula.__('remove tag') + "' id='tagRemove_" + slug + "' class='tagRemover'>x</a></li>\n");
        // engage tooltip observer
        $('tagRemove_' + slug).tooltip = new Zikula.UI.Tooltip($('tagRemove_' + slug));
        // engage removal observer
        $('tagRemove_' + slug).observe('click', tag_remove);
        // add hidden form element
        $('activeTagContainer').insert("<input type='hidden' name='tag[tags][]' id='tagActive_" + slug + "' value='" + tagname + "' />\n");
        // form.insert(new Element('input', {name: 'q', value: 'a', type: 'hidden'}));

    } else {
        new Effect.Highlight('li_' + slug, { startcolor: '#99ff66', endcolor: '#C5E8F1' });
    }
}

function tag_remove(event)
{
    var id = event.element().identify();
    var tagnameparts = id.split("_");
    var tagname = tagnameparts.pop();
    _tag_remove(tagname);
}

function _tag_remove(tagname)
{    
    // remove visible tooltip
    $('tagRemove_' + tagname).tooltip.close();
    $('tagRemove_' + tagname).tooltip.destroy();
    // remove visible tag
    $('li_' + tagname).remove();
    // remove hidden form element
    $('tagActive_' + tagname).remove();
}

function tag_add_new(event)
{
    var taglist = $('tag_adder').value;
    if (taglist) {
        var tagArray = tagListToCleanArray(taglist);
        tagArray.each(function(word) {
            // create temporary slug
            var slug = word.replace(/\W+/g, '-');
            _tag_add(word, slug);
        });
        $('tag_adder').value = '';
    }
}

function tagListToCleanArray(list)
{
    var tagArray = list.split(",");
    var resultArray = [];
    tagArray.each(function(word) {
        // remove tags, scripts and trailing/leading spaces
        word = word.stripTags().stripScripts().strip();
        if (!word.empty()) {
            resultArray.push(word);
        }
    });
    return resultArray;
}