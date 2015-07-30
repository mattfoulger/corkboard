$(function() {
  var $boardsDropDown = $("#boards-dropdown");
  var $content = $("#content");
  var currentBoardID;
  var boardsListData;
  var boardData;
  
  var $grid = $('.corkboard').masonry({
    itemSelector: '.pin',
    columnWidth: 270
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
        loadBoard(boardsListData[0].id);
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
        boardData = data;
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
    var $newPin = $("<div class='pin pin-default'>");
    $newPin.css("background-image", "url(" + pin.url + ")");
    $newPin.append($("<h3 class='title'>").text(pin.name));
    $newPin.append($("<p class='description'>").text(pin.description));
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

  $content.on('click', '.pin.pin-default', function(e) {
    if($(this).hasClass('selected')) {

    } else {
    $('.selected').toggleClass("selected");
    $(this).toggleClass("selected");
    $grid.masonry();
    console.log("it completed");
    }
  })

  getBoards();
});
