let gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--element-gap')) / 2;
const pathCurve = 10;

let data = {
  'a': { 'position': [1, 1] },
  'b': { 'position': [3, 1] },
  'c': { 'position': [2, 3] },
  'd': { 'position': [1, 5] },
  'e': { 'position': [3, 5] },
};

function move(item, e) {
  let rect = item.getBoundingClientRect();
  
  let xOrNearBoundary = e.pageX + ((e.pageX + rect.width) >= document.body.clientWidth ? rect.width / 4 : 0);
  let yOrNearBoundary = e.pageY + ((e.pageY + rect.height) >= document.body.clientHeight ? rect.height / 4 : 0);
  
  let x = parseInt(xOrNearBoundary / (rect.width + gap)) + 1;
  let y = parseInt(yOrNearBoundary / (rect.height + gap)) + 1;

  setElementPosition(item, x, y);
}

function setElementPosition(item, x, y) {
  item.style.gridColumnStart = x;
  item.style.gridColumnEnd = x + 1;
  item.style.gridRowStart = y;
  item.style.gridRowEnd = y + 1;
}
function resizeSvg(svg, board) {
  let rect = board.getBoundingClientRect();
  svg.setAttribute('width', rect.width);
  svg.setAttribute('height', rect.height);
}

// needs to add multi-touch interaction
// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Multi-touch_interaction
window.addEventListener('load', () => {
  const svg = document.querySelector('svg');
  let board = document.querySelector('div#board');
  resizeSvg(svg, board);

  let items = document.querySelectorAll('.draggable');
  items.forEach((item) => {
    item.addEventListener('dragstart', () => {
      item.classList.add('dragging');
    }, false);

    item.addEventListener('dragend', () => {
      resizeSvg(svg, board);
      item.classList.remove('dragging');
    }, false);

    setElementPosition(item, 
      data[item.id].position[0],
      data[item.id].position[1]
    );
  });
  board.addEventListener('dragover', (e) => {
    const draggables = document.querySelectorAll('.dragging');
    draggables.forEach((item) => {
      move(item, e);
    });
  });
  let inputOutput = document.querySelectorAll('div.draggable > section > button');
  inputOutput.forEach((element) => {
    element.addEventListener('dragstart', (e) => {
      e.stopPropagation();

      var path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      
      path.setAttribute('stroke', 'black');
      path.setAttribute('state', 'new');
      path.setAttribute('fill', 'transparent');

      var rect = element.getBoundingClientRect();
      var fromType = e.currentTarget.parentElement.getAttribute('name');
      var middle = rect.top + (rect.height/2);
      if (fromType == "input") {
        path.setAttribute('d', `M${rect.left} ${middle}`);
      } else {
        path.setAttribute('d', `M${rect.right} ${middle}`);
      }

      path.setAttribute('fromId', e.currentTarget.parentElement.parentElement.id);
      path.setAttribute('fromType', fromType);
      path.setAttribute('fromElement', e.currentTarget.textContent);

      svg.appendChild(path);
    }, false);
    element.addEventListener('dragover', (e) => e.preventDefault(), false);
    element.addEventListener('drop', (e) => {
      var path = document.querySelector(`path[state="new"]`);
      var toType = e.currentTarget.parentElement.getAttribute('name');
      if (path.getAttribute('fromType') == toType) {
        path.remove();
      }

      path.setAttribute('toId', e.currentTarget.parentElement.parentElement.id);
      path.setAttribute('toType', e.currentTarget.parentElement.getAttribute('name'));
      path.setAttribute('toElement', e.currentTarget.textContent);

      path.removeAttribute('state');

      var match = path.getAttribute('d').match(/M ?([0-9\.]+) ?([0-9\.]+)/);
      var rect = element.getBoundingClientRect();

      var currentMiddleY = rect.top + (rect.height/2);

      var pathMiddle = {
        x: (parseFloat(match[1]) + rect.left)/2,
        y: (parseFloat(match[2]) + currentMiddleY)/2,
      };
      var d = path.getAttribute('d');
      d += ` C${pathMiddle.x} ${match[2]}, ${match[1]} ${currentMiddleY}, `
      if (toType == "input") {
        d += `${rect.left} ${currentMiddleY}`;
      } else {
        d += `${rect.right} ${currentMiddleY}`;
      }
      path.setAttribute('d', d);
    }, false);
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