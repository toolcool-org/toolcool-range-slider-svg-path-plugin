import svgPathBbox from 'svg-path-bbox'; // https://github.com/toolcool-org/svg-path-bbox
import svgpath from 'svgpath'; // https://github.com/toolcool-org/svgpath

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export const createPath = (
  d: string,
  strokeColor?: string,
  strokeSize?: number,
  bgColor?: string
) => {
  const $path = document.createElementNS(SVG_NAMESPACE, 'path');
  $path.setAttribute('d', d);

  if(strokeColor){
    $path.setAttribute('stroke', strokeColor);
  }

  if(strokeSize) {
    $path.setAttribute('stroke-width', strokeSize.toString());
  }

  if(bgColor) {
    $path.setAttribute('fill', bgColor);
  }

  return $path;
};

export const createSVG = (
  containerWidth: number,
  containerHeight: number,
  d: string,
  strokeSize: number
) => {

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
      .toString();
  }

  // if stroke width > 0 ---> translate path so all the stroke will be visible
  if(strokeSize > 0){
    d = svgpath(d)
      .translate(strokeSize, strokeSize)
      .rel()
      .toString();
  }

  if(isVerticalPath){
    // vertical path ----------------
    // path should be scaled to match the container height
    // aspect ratio should be kept
    // container width should be equal to the path width
    const temp = strokeSize > 0 ? containerHeight - strokeSize - 1 : containerHeight;
    const scale = temp / pathHeight;

    d = svgpath(d)
      .scale(scale, scale)
      .rel()
      .round(1)
      .toString();
  }
  else{
    // horizontal path ----------------
    // path should be scaled to match the container width
    // aspect ratio should be kept
    // container height should be equal to the path height
    const temp = strokeSize > 0 ? containerWidth - strokeSize - 1 : containerWidth;
    const scale = temp / pathWidth;

    d = svgpath(d)
      .scale(scale, scale)
      .rel()
      .round(1)
      .toString();
  }

  [x0, y0, x1, y1] = svgPathBbox(d);
  pathWidth = Math.abs(x1 - x0);
  pathHeight = Math.abs(y1 - y0);

  svgWidth = pathWidth;
  svgHeight = pathHeight;

  if(strokeSize > 0){
    svgWidth += strokeSize + 1;
    svgHeight += strokeSize + 1;
  }

  // update svg props -----------------
  const $svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  $svg.classList.add('path-svg');
  $svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
  $svg.setAttribute('width', svgWidth.toString());
  $svg.setAttribute('height', svgHeight.toString());
  $svg.setAttribute('viewBox', `0 0 ${ svgWidth } ${ svgHeight }`);

  const $path = createPath(d, '', strokeSize);
  $path.setAttribute('fill', 'none');
  $path.setAttribute('stroke', 'currentColor');
  $path.setAttribute('stroke-linecap', 'round');
  $path.setAttribute('stroke-linejoin', 'round');
  $svg.append($path);

  return [$svg, $path];
};