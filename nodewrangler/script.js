let gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--element-gap')) / 2;

let data = {
  'a': { 'position': [1, 1] },
  'b': { 'position': [3, 1] },
  'c': { 'position': [2, 3] },
  'd': { 'position': [1, 5] },
  'e': { 'position': [3, 5] },
};

function move(item, e) {
  let rect = item.getBoundingClientRect();
  
  let nearEndWidth = (e.pageX + rect.width) >= document.body.clientWidth;
  let nearEndHeight = (e.pageY + rect.height) >= document.body.clientHeight;
  
  let x = Math.round(
    (e.pageX + ((nearEndWidth) ? rect.width : 0 ))/
    (rect.width + gap)
  );
  let y = Math.round(
    (e.pageY + ((nearEndHeight) ? rect.height: 0 ))/
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
  let items = document.querySelectorAll('.draggable');
  items.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      item.classList.add('dragging');
    }, false);

    item.addEventListener('dragend', () => item.classList.remove('dragging'), false);

    setElementPosition(item, 
      data[item.id].position[0],
      data[item.id].position[1]
    );
  });
  let board = document.querySelector('div#board');
  board.addEventListener('dragover', (e) => {
    const draggables = document.querySelectorAll('.dragging');
    draggables.forEach((item) => {
      move(item, e);
    });
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