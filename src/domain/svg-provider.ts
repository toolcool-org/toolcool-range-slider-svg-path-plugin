import svgPathBbox from 'svg-path-bbox'; // https://github.com/toolcool-org/svg-path-bbox
import svgpath from 'svgpath'; // https://github.com/toolcool-org/svgpath

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export const createPath = (
  d: string,
  strokeColor?: string,
  strokeWidth?: number,
  bgColor?: string
) => {
  const $path = document.createElementNS(SVG_NAMESPACE, 'path');
  $path.setAttribute('d', d);

  if(strokeColor){
    $path.setAttribute('stroke', strokeColor);
  }

  if(strokeWidth) {
    $path.setAttribute('stroke-width', strokeWidth.toString());
  }

  if(bgColor) {
    $path.setAttribute('fill', bgColor);
  }

  return $path;
};

export const createSVG = (containerWidth: number, containerHeight: number, d: string) => {

  let svgWidth = containerWidth;
  let svgHeight = containerHeight;

  // get path dimensions -------------------
  let [x0, y0, x1, y1] = svgPathBbox(d);
  let pathWidth = Math.abs(x1 - x0);
  let pathHeight = Math.abs(y1 - y0);
  const isVerticalPath = pathHeight > pathWidth;

  // if path starts not at 0 point it should be translated to [0, 0]
  if(x0 !== 0 || y0 !== 0){
    d = svgpath(d)
      .translate(-x0, -y0)
      .rel()
      .round(1)
      .toString();
  }

  if(isVerticalPath){
    // vertical path ----------------
    // path should be scaled to match the container height
    // aspect ratio should be kept
    // container width should be equal to the path width
  }
  else{
    // horizontal path ----------------
    // path should be scaled to match the container width
    // aspect ratio should be kept
    // container height should be equal to the path height
    const scale = containerWidth / pathWidth;

    console.log('containerWidth', containerWidth, 'pathWidth', pathWidth, 'scale', scale)
    //const scaleY = containerHeight / pathHeight;
    //const scale = Math.min(scaleX, scaleY);

    d = svgpath(d)
      .scale(scale, scale)
      .rel()
      .round(1)
      .toString();

    [x0, y0, x1, y1] = svgPathBbox(d);
    pathWidth = Math.abs(x1 - x0);
    pathHeight = Math.abs(y1 - y0);

    svgWidth = pathWidth;
    svgHeight = pathHeight;
  }

  // update svg props -----------------
  const $svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  $svg.classList.add('path-svg');
  $svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
  $svg.setAttribute('width', svgWidth.toString());
  $svg.setAttribute('height', svgHeight.toString());
  $svg.setAttribute('viewBox', `0 0 ${ svgWidth } ${ svgHeight }`);

  const $path = createPath(d);
  $path.setAttribute('fill', 'none');
  $path.setAttribute('stroke', 'currentColor');
  $path.setAttribute('stroke-width', '1');
  $path.setAttribute('stroke-linecap', 'round');
  $path.setAttribute('stroke-linejoin', 'round');
  $svg.append($path);

  return $svg;
};