const placeholder = document.querySelector('div#placeholder');
let gap = parseInt( getComputedStyle(document.documentElement).getPropertyValue('--element-gap')) / 2;

let data = {
  'a': { 'position': [1, 1] },
  'b': { 'position': [3, 1] },
  'c': { 'position': [2, 3] },
  'd': { 'position': [1, 5] },
  'e': { 'position': [3, 5] },
};

function handleDragStart() {
  this.style.opacity = '0.3';
  
  placeholder.style.display = "block";
}
function handleDragStop(e) {
  this.style.opacity = '1';
  
  placeholder.style.display = "none";
  setElementPositionByEvent(this, e);
}
function handleDrag(e) {
  setElementPositionByEvent(placeholder, e);
}
function setElementPositionByEvent(item, e) {
  let rect = item.getBoundingClientRect();
  
  let snapping = {
    'w': rect.width / 2,
    'h': rect.height / 2,
  };
  
  let closeWidth = (e.pageX + rect.width) >= (document.body.clientWidth - rect.width);
  let closeHeight = (e.pageY + rect.height) >= (document.body.clientHeight - rect.height);
  
  let x = Math.round(
    (e.pageX + ((closeWidth) ? rect.width : snapping.w)) / 
    (rect.width + gap)
  );
  let y = Math.round(
    (e.pageY + ((closeHeight) ? rect.height : snapping.h)) / 
    (rect.height + gap)
  );

  setElementPosition(item, x, y);
}
function setElementPosition(item, x, y) {
  item.style.gridColumnStart = x;
  item.style.gridColumnEnd = x + 1;
  item.style.gridRowStart = y;
  item.style.gridRowEnd = y + 1;
}

window.addEventListener('load', () => {
  let items = document.querySelectorAll('.element[draggable="true"]');
  items.forEach((item) => {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragend', handleDragStop, false);
    item.addEventListener('drag', handleDrag, false);
    
    setElementPosition(item, 
      data[item.id].position[0],
      data[item.id].position[1]
    );
  });
});

window.addEventListener('mousewheel', (e) => {
  if (e.altKey) {
    e.preventDefault();
    
    let computed = getComputedStyle(document.documentElement);
    let width = parseInt(computed.getPropertyValue('--element-width'));
    let height = parseInt(computed.getPropertyValue('--element-height'));
    
    let mouseSign = Math.sign(e.deltaY);
    if (mouseSign == -1 && (width <= 3 || height <= 3)) {
      return false;
    }
    
    width = parseInt(width + mouseSign);
    height = parseInt(height + mouseSign);
    
    document.documentElement.style.setProperty('--element-width', `${width}vw`);
    document.documentElement.style.setProperty('--element-height', `${height}vh`);
    
    return false;
  }
}, { passive: false });