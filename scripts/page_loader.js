$(function() {
  // Set listener for loading clicks
  $('#load').click(function() {
    var url = $('#url').val();
    $.get(url, function(source) {
      // remove old info
      $('.info').remove();
      
      // generate new info
      generateTagListHtml(source);
      generateSourceHtml(source);
    });
  });

  // modifies source for highlighting
  function generateSourceHtml(source) {
    var $sourceHeader = $('<h3>');
    $sourceHeader.text('Source');

    var $source = $('<div>')
    $source.addClass('info')
    $source.append($sourceHeader);

    // matches any tag, and any whitespace before it
    var tagsReg = / *<\W*(\w+) *?.*?>/
    while (match = source.match(tagsReg)){
      // Grab non-tag text and append it to source as text
      $source.append(source.slice(0, source.indexOf(match[0])))
      
      // discard already processed sections
      source = source.slice(source.indexOf(match[0]) + match[0].length)

      // get tag name
      var tag = match[1]
      
      // build tag element
      var $tag = $('<pre>')
      $tag.addClass('tag')
      $tag.addClass(tag)
      $tag.text(match[0])
      $source.append($tag)
    }

    $('body').append($source)
  }

  // generate html to be added to page
  function generateTagListHtml(source) {
    var tagList = generateTagList(source);

    var $tagListHeader = $('<h3>');
    $tagListHeader.text('Tag List');

    var $tagList = $('<div>');
    $tagList.addClass('info');
    $tagList.append($tagListHeader);

    Object.keys(tagList).forEach(function(tag) {
      var $tag = $('<div>')
      $tag.data('type', tag)
      $tag.addClass('tag-button');
      $tag.click(highlightTag);
      $tag.text(tag + ": " + tagList[tag])
      $tagList.append($tag)
    });
     $('body').append($tagList);
  }

  // highlights tag when item in tag list is clicked
  function highlightTag() {
    var type = $(this).data('type')
    $('.tag').css('background-color', '#FFF')
    $('.' + type).css('background-color', "#F00") 
  }

  // get count of tags from source
  function generateTagList(source) {
    // matches all opening tags
    var tagsReg = /<(\w+).*?>/g
    var tagList = {}
    while (match = tagsReg.exec(source)) {
      if (tagList[match[1]]){
        tagList[match[1]]++;
      } else {
        tagList[match[1]] = 1;
      }
    }
    return tagList
  }
});
