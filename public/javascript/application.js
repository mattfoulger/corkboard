$(function() {
  var $boardsDropDown = $("#boards-dropdown");
  var $content = $("#content");
  var currentBoardID;
  var boardsListData;
  var boardData;
  
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

  $.fn.editable.defaults.mode = 'inline';
  $.fn.editable.defaults.ajaxOptions = {type: "PUT"};

  function newPin(pin) {
    var $newPin = $("<div class='pin'>");
    $newPin.css("background-image", "url(" + pin.url + ")");
    $newPin.append($("<h3 class='title'>")
      .text(pin.name)
      .editable({
        type: 'text',
        pk: pin.id,
        url: '/pins',
        name: 'description',
        showbuttons: false,
        emptytext: 'Click here to add a description',
        success: function() { console.log(status);}
      })
    );
    $newPin.append($("<div class='description'>")
      .append($("<p>")
        .text(pin.description)
        .editable({
          type: 'textarea',
          pk: pin.id,
          url: '/pins',
          name: 'description',
          emptytext: 'Click here to add a description',
          success: function() { console.log(status);}
        })
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
    if($(this).hasClass('selected')) {

    } else {
    $('.selected').toggleClass("selected").children(".description, .title").slideToggle(250);
    $(this).toggleClass("selected").children(".description, .title").slideToggle(250);
    // $grid.masonry( 'unstamp', $('.pin') );
    // $grid.masonry( 'stamp', $(this) );
    $grid.masonry('layout');
    }
  })

  getBoards();
});
