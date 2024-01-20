$(document).ready(function() {
  $(document).ajaxStart(function() {
    $('#loading').show();
  }).ajaxStop(function() {
    $('#loading').hide();
  });

  // Attach event listener to the Search button
  $('#search-btn').on('click', function() {

    // get the search term, trim every spaces and hyphens
    var isbn = $('#search-isbn').val().trim().replace(/[\s-]/g, '');
    $.ajax({
      url: 'https://book-webapp.azurewebsites.net/isbn/' + isbn,
      type: 'GET',
      success: function(data) {
        // clear the previous results
        $('#results').empty();

        var keyMap = {
          _id: 'ISBN',
          title: 'Tiêu đề',
          author: 'Tác giả',
          publisher: 'Nhà xuất bản',
          partner: 'Đối tác xuất bản (nhà sách)',
          submitDate: 'Ngày nộp lưu chiểu',
        };

        if (!data.document) {
          $('#results').append('<div class="text-center">Không tìm thấy kết quả</div>');
          return;
        }

        // loop through properties of the response object and append results
        $.each(data.document, function(key, value) {

          // continue if key not in keyMap
          if (!keyMap[key]) {
            return true;
          }

          // append the result in a tabular format, render \n in value as <br>, escape \n
          $('#results').append(`<tr>
            <td width="150px"><strong>${keyMap[key]}</strong></td>
            <td>${value.replace('\\n', '<br>')}</td>
            <td><button class="btn btn-info copy-btn btn-sm m-1" data-clipboard-text="${value}"><i class="far fa-copy"></i></button></td></tr>`);
        });

        new ClipboardJS('.copy-btn');
      },
      error: function() {
        alert('Error retrieving search results');
      }
    });
  });
});
