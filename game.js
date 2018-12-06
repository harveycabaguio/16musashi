'use strict';

/*
 * Variables
 */
var game = {
  turn: 0,
  nextTurn: function () {
    this.turn = this.turn + 1;
    console.log('Starting turn ' + this.turn);
  }
};
var ko = [
  { x:0 , y:0 },
  { x:1 , y:0 },
  { x:2 , y:0 },
  { x:3 , y:0 },
  { x:4 , y:0 },
  { x:0 , y:1 },
  { x:4 , y:1 },
  { x:0 , y:2 },
  { x:4 , y:2 },
  { x:0 , y:3 },
  { x:4 , y:3 },
  { x:0 , y:4 },
  { x:1 , y:4 },
  { x:2 , y:4 },
  { x:3 , y:4 },
  { x:4 , y:4 }
];
var oya = { x:2 , y:2  };

/*
 * Utility functions
 */
function convertToId (x, y) {
  return ('g' + x + '' + y);
}
function getCoor (id) {
  var coor = {
    x:parseInt(id.charAt(1)),
    set setX (i) {
      this.x = i;
    },
    y:parseInt(id.charAt(2)),
    set setY (i) {
      this.y = i;
    }
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
    checkVicinity(1, coor.x, coor.y);
  } else {
    checkVicinity(2, coor.x, coor.y);
  }
}
function checkVicinity (mode, ogX, ogY) {
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
    console.log('ID ' + elementId + ' has data: ' + $( elementId ).attr('data-iece'));
    console.log($( elementId ));
    if ($( elementId ).attr('data-piece') == null) {
      $( elementId ).addClass('ploppable');
      var currPieceId = '#' + convertToId(ogX, ogY);
      $( elementId ).attr('onClick', 'movePiece(this, ' + $( currPieceId ).attr('data-piece') + ', \'' + currPieceId + '\')');
    }
  }
}
function movePiece(tile, piece, og) {
  console.log('tile: ' + tile + ' piece: ' + piece + ' og: ' + og);
  // first, remove the og data-piece;
  $( og ).removeAttr('data-piece');
  // then move the piece to the clicked on tile
  var tileCoor = getCoor(tile.id);
  if ($( og ).attr('data-piece-type') == 'ko') {
    ko[piece].x = tileCoor.x;
    ko[piece].y = tileCoor.y;
  } else {
    oya.x = tileCoor.x;
    oya.y = tileCoor.y;
  }
  
  game.nextTurn();
  clearBoard();
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
  elementId = '#' + convertToId(oya.x, oya.y);
  $( elementId ).addClass('oya');
  $( elementId ).attr('data-piece', 'oya');
  if ((game.turn % 2) === 0) {
    $( elementId ).attr('onClick', 'icon(this.id)');
    $( '#oya-turn' ).fadeTo(120, 1.0);
    $( '#ko-turn' ).fadeTo(120, 0.0);
  }
}

// run the game
$( function() {
  // populate board
  clearBoard();
});