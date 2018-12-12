'use strict';

/*
 * Variables
 */
var game = {
  turn: 0,
  nextTurn: function () {
    this.turn = this.turn + 1;
  }
};
var ko = [
  { x:0, y:0, alive:true },
  { x:1, y:0, alive:true },
  { x:2, y:0, alive:true },
  { x:3, y:0, alive:true },
  { x:4, y:0, alive:true },
  { x:0, y:1, alive:true },
  { x:4, y:1, alive:true },
  { x:0, y:2, alive:true },
  { x:4, y:2, alive:true },
  { x:0, y:3, alive:true },
  { x:4, y:3, alive:true },
  { x:0, y:4, alive:true },
  { x:1, y:4, alive:true },
  { x:2, y:4, alive:true },
  { x:3, y:4, alive:true },
  { x:4, y:4, alive:true }
];
var oya = { x:2, y:2  };

/*
 * Utility functions
 */
function convertToId (x, y) {
  return ('g' + x + '' + y);
}
function getCoor (id) {
  var coor = {
    x:parseInt(id.charAt(1)),
    y:parseInt(id.charAt(2))
  };
  return coor;
}
// check if coordinates are empty 
function isEmpty (x, y) {
  var elementId = '#' + convertToId(x, y);
  if ($( elementId ).hasClass( 'ko' ) || $( elementId ).hasClass( 'oya' )) {
    return false;
  }
  return true;
}
function killPiece (piece) {
  ko[piece].alive = false;
}

/*
 * 
 */
function icon (id) {
  // add selected
  $( '#' + id ).addClass('selected');
  $( '#' + id ).attr('onClick', 'clearBoard()');
  
  // turn id into coordinates
  var coor = getCoor(id);
  
  // if x + y is even, check 8 directions, else, only check +
  if (((coor.x + coor.y) % 2) == 0 ) {
    checkVicinity(1, coor.x, coor.y, $( '#' + id ).attr('data-piece'));
  } else {
    checkVicinity(2, coor.x, coor.y, $( '#' + id ).attr('data-piece'));
  }
}
function checkVicinity (mode, ogX, ogY, type) {
  var oyaCounter = 0;
  var vicinity = [
    { x: (ogX - 1), y: ogY },
    { x: (ogX - 1), y: (ogY - 1) },
    { x: ogX, y: (ogY - 1) },
    { x: (ogX + 1), y: (ogY - 1) },
    { x: (ogX + 1), y: ogY },
    { x: (ogX + 1), y: (ogY + 1) },
    { x: ogX, y: (ogY + 1) },
    { x: (ogX - 1), y: (ogY + 1) }
  ];
  if ((ogX == 0 && ogY == 4) ||
      (ogX == 1 && ogY == 4) ||
      (ogX == 3 && ogY == 4) ||
      (ogX == 4 && ogY == 4)) {
    vicinity = [
      { x: (ogX - 1), y: ogY },
      { x: (ogX - 1), y: (ogY - 1) },
      { x: ogX, y: (ogY - 1) },
      { x: (ogX + 1), y: (ogY - 1) },
      { x: (ogX + 1), y: ogY },
      { x: ogX, y: ogY },
      { x: ogX, y: ogY },
      { x: ogX, y: ogY }
    ];
  }
  
  for (var i = 0; i < vicinity.length; i = i + mode ) {
    var elementId = '#' + convertToId(vicinity[i].x, vicinity[i].y);

    if ($( elementId ).length && $( elementId ).attr('data-piece') == null) {
      if (type === 'oya') {
        oyaCounter++;
      }
      $( elementId ).addClass('ploppable');
      var currPieceId = convertToId(ogX, ogY);
      $( elementId ).attr('onClick', 'movePiece(this, ' + $( '#' + currPieceId ).attr('data-piece') + ', \'' + currPieceId + '\')');
    }
  }
  // when oya can't move, they lose
  if (type === 'oya' && oyaCounter === 0) {
    wonnered('ko');
  }
}
function movePiece(tile, piece, og) {
  // first, remove the og data-piece;
  $( '#' + og ).removeAttr('data-piece');
  // then move the piece to the clicked on tile
  var tileCoor = getCoor(tile.id);
  if ($( '#' + og ).attr('data-piece-type') == 'ko') {
    ko[piece].x = tileCoor.x;
    ko[piece].y = tileCoor.y;
  } else {
    oya.x = tileCoor.x;
    oya.y = tileCoor.y;
    
    if (((tileCoor.x + tileCoor.y) % 2) == 0 ) {
      findChild(1, tileCoor.x, tileCoor.y);
    } else {
      findChild(2, tileCoor.x, tileCoor.y);
    }
  }
  
  game.nextTurn();
  clearBoard();
}
function findChild (mode, ogX, ogY) {
  var vicinity = [
    { x: (ogX - 1), y: ogY },
    { x: (ogX - 1), y: (ogY - 1) },
    { x: ogX, y: (ogY - 1) },
    { x: (ogX + 1), y: (ogY - 1) },
    { x: (ogX + 1), y: ogY },
    { x: (ogX + 1), y: (ogY + 1) },
    { x: ogX, y: (ogY + 1) },
    { x: (ogX - 1), y: (ogY + 1) }
  ];
  
  //check +
  if ($( '#' + convertToId(vicinity[0].x, vicinity[0].y) ).attr('data-piece') != null && $( '#' + convertToId(vicinity[4].x, vicinity[4].y) ).attr('data-piece') != null) {
    killPiece($( '#' + convertToId(vicinity[0].x, vicinity[0].y) ).attr('data-piece'));
    killPiece($( '#' + convertToId(vicinity[4].x, vicinity[4].y) ).attr('data-piece'));
  }
  if ($( '#' + convertToId(vicinity[2].x, vicinity[2].y) ).attr('data-piece') != null && $( '#' + convertToId(vicinity[6].x, vicinity[6].y) ).attr('data-piece') != null) {
    killPiece($( '#' + convertToId(vicinity[2].x, vicinity[2].y) ).attr('data-piece'));
    killPiece($( '#' + convertToId(vicinity[6].x, vicinity[6].y) ).attr('data-piece'));
  }
  // check x
  if (mode === 1) {
    if ($( '#' + convertToId(vicinity[1].x, vicinity[1].y) ).attr('data-piece') != null && $( '#' + convertToId(vicinity[5].x, vicinity[5].y) ).attr('data-piece') != null) {
      killPiece($( '#' + convertToId(vicinity[1].x, vicinity[1].y) ).attr('data-piece'));
      killPiece($( '#' + convertToId(vicinity[5].x, vicinity[5].y) ).attr('data-piece'));
    }
    if ($( '#' + convertToId(vicinity[3].x, vicinity[3].y) ).attr('data-piece') != null && $( '#' + convertToId(vicinity[7].x, vicinity[7].y) ).attr('data-piece') != null) {
      killPiece($( '#' + convertToId(vicinity[3].x, vicinity[3].y) ).attr('data-piece'));
      killPiece($( '#' + convertToId(vicinity[7].x, vicinity[7].y) ).attr('data-piece'));
    }
  }
  
  // count number of ko left
  var alive = 0;
  for (var i = 0; i < ko.length; i++) {
    if (ko[i].alive == true) {
      alive++;
    }
  }
  if (alive < 5) {
    wonnered('musashi');
  }
}

// dom stuff here (visual)
function clearBoard () {
  var elementId;
  for (var y=0; y<7; y++) {
    for (var x=0; x<5; x++) {
      elementId = '#' + convertToId(x, y);
      $( elementId ).removeAttr('class');
      $( elementId ).removeAttr('data-piece');
      $( elementId ).removeAttr('data-piece-type');
      $( elementId ).removeAttr('onclick');
    }
  }
  populateBoard();
}
function populateBoard () {
  var elementId;
  for ( var i=0; i<ko.length; i++ ) {
    if (ko[i].alive == true) {
      elementId = '#' + convertToId(ko[i].x, ko[i].y);
      $( elementId ).addClass('ko');
      $( elementId ).attr('data-piece', i);
      $( elementId ).attr('data-piece-type', 'ko');
      if ((game.turn % 2) != 0) {
        $( elementId ).attr('onClick', 'icon(this.id)');
        $( '#oya-turn' ).fadeTo(120, 0.0);
        $( '#ko-turn' ).fadeTo(120, 1.0);
      }
    }
  }
  elementId = '#' + convertToId(oya.x, oya.y);
  $( elementId ).addClass('oya');
  $( elementId ).attr('data-piece', 'oya');
  if ((game.turn % 2) === 0) {
    $( elementId ).attr('onClick', 'icon(this.id)');
    $( '#oya-turn' ).fadeTo(120, 1.0);
    $( '#ko-turn' ).fadeTo(120, 0.0);
  }
}
function wonnered (who) {
  if (who === 'ko') {
    $( '#wonnered' ).addClass('ten');
  } else {
    $( '#wonnered' ).addClass('musashi');
  }
  $( '#wonnered-bg' ).fadeIn(120);
}

// run the game
$( function() {
  // populate board
  clearBoard();
});