$(function() {
  var $boardsDropDown = $("#boards-dropdown");
  var $content = $("#content");
  var currentBoardID;
  var boardsListData;
  
  var $grid = $('.corkboard').masonry({
    itemSelector: '.pin',
    columnWidth: 260
  });

  function getBoards() {
    $.get(
      '/boards',
      function(data) {
        boardsListData = data;
        boardsListData.forEach(function(board) {
          $boardsDropDown.append(
            $("<li>").append(
              $("<a class='board-link' href='#'>").text(board.name).data("data", {id: board.id})
            )
          )
        });
        currentBoardID = boardsListData[0].id;
        loadBoard(currentBoardID);
        populateNewPinForm();
      },
      "json"
    );
  }

  $boardsDropDown.on('click', '.board-link', function(e){
    e.preventDefault();
    var id = $(this).data("data").id;
    if (id == currentBoardID) {
      return false;
    }
    loadBoard(id);
  });

  function loadBoard(id) {
    currentBoardID = id;
    $.get(
      '/boards/'+id,
      function(data) {
        $(".corkboard").empty();
        var boardData = data;
        boardData.forEach(function(pin) {
          newPin(pin);
        });
        // var $addPin = $("<a class='pin add-pin' data-toggle='modal' data-target='#newPinModal'>");
        // $(".corkboard").prepend($addPin);
        $grid.masonry('reloadItems');
        $grid.masonry();
      },
      "json"
    );
  }


  function newPin(pin) {
    var $newPin = $("<div class='pin'>");
    $newPin.data("id", pin.id);
    $newPin.css("background-image", "url(" + pin.url + ")");
    $newPin.append($("<div class='title'>")
      .append($("<h3>")
        .text(pin.name)
        .attr('contenteditable', true)
      )
    );
    $newPin.append($("<div class='description'>")
      .append($("<p>")
        .text(pin.description)
        .attr('contenteditable', true)
      )
      .append($("<div class='controls'>")
        .append($("<a class='myButton save'>")
          .text("Save")
        )
        .append($("<a class='myButton cancel'>")
          .text("Cancel")
        )
      )
    );
    $grid.prepend($newPin).masonry( 'prepended', $newPin );
  }

  function populateNewPinForm() {
    boardsListData.forEach(function(board) {
      $("#newPinForm select").append($("<option>").attr("value", board.id).text(board.name));
    });
  }


  $("#newPinForm").submit(function(e) {
    e.preventDefault();
    var formData = $("#newPinForm").serialize();
    console.log(formData);
    $.post(
      '/pins',
      formData,
      function(data) {
        console.log(data);
        newPin(data);
      },
      "json"
    );
  })

  $content.on('click', '.pin', function(e) {
    $('.selected').toggleClass("selected").children(".description, .title").removeClass("viewable");
    $(this).toggleClass("selected").children(".description, .title").addClass("viewable");
    // $grid.masonry( 'unstamp', $('.pin') );
    // $grid.masonry( 'stamp', $(this) );
    $grid.masonry('layout');
  });

  $content.on('click', '.myButton.save', function(e) {
    e.preventDefault();
    var $pin = $(this).closest('.pin');
    var id = $pin.data("id");
    var title = $pin.find('h3').text();
    var description = $pin.find('p').html();
    console.log(title);
    console.log(description);
    console.log(id);

    $.ajax({
      type: "PUT",
      url: "/pins",
      data: { id: id, name: title, description: description }
    })
      .done(function( data ) {
      console.log(data);
      });
  })


  getBoards();
});
