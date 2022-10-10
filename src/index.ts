import { IPlugin, IPluginUpdateData, IPluginSetters, IPluginGetters } from 'toolcool-range-slider';
import { createSVG } from './domain/svg-provider';
import { getNumber } from './domain/math-provider';

/**
 * SVG Path Plugin.
 * Important: the plugin script should be included BEFORE the core script.
 */

/**
 * Required: init ToolCool Range Slider plugins namespace if not defined yet
 */
window.tcRangeSliderPlugins = window.tcRangeSliderPlugins || [];

const SVGPathPlugin = () : IPlugin => {

  let $component: HTMLElement | undefined = undefined;
  let getters: IPluginGetters | undefined = undefined;

  let svgPath = '';
  let strokeWidth = 1;

  let $slider: HTMLElement | undefined = undefined;
  let $panel: HTMLElement | undefined = undefined;

  let $svg: SVGSVGElement | undefined = undefined;
  let $path: SVGPathElement | undefined = undefined;
  let $maskRect: SVGRect | undefined = undefined;

  let resizeObserver: ResizeObserver | null = null;

  const init = () => {
    if(!$slider || !$panel || !svgPath) return;

    const rect = $slider.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const [_$svg, _$path, _$mask] = createSVG(width, height, svgPath, strokeWidth);
    $svg = _$svg as SVGSVGElement;
    $path = _$path as SVGPathElement;

    const $mask = _$mask as SVGMaskElement;
    $maskRect = $mask.querySelector('rect') as unknown as SVGRect ?? undefined;
    $panel.before(_$svg);

    updatePointers();
    updateFill();
  };

  const initResizeObserver = () => {
    if(!$component) return;
    resizeObserver = new ResizeObserver(entries => {
      // eslint-disable-next-line
      for (const _entry of entries) {
        $svg?.remove();
        init();
      }
    });
    resizeObserver.observe($component);
  };

  const updatePointers = () => {
    if(!$path) return;

    const $pointers = getters?.getPointerElements() ?? [];
    const percents = getters?.getPercents() ?? [];
    const svgLength = $path.getTotalLength();
    const isReversed = getters?.isRightToLeft() || getters?.isBottomToTop();

    for(let i=0; i<percents.length; i++) {
      const $pointer = $pointers[i];
      if (!$pointer) continue;

      const percent = isReversed ? 100 - percents[i] : percents[i];
      const absoluteDistance = svgLength * percent / 100;
      const svgPoint = $path.getPointAtLength(absoluteDistance);

      const pointerRect = $pointer.getBoundingClientRect();

      const x = svgPoint.x - pointerRect.width / 2;
      const y = svgPoint.y - pointerRect.height / 2;

      $pointer.style.left = `${ x }px`;
      $pointer.style.top = `${ y }px`;
    }
  };

  const updateFill = () => {

    if(!$maskRect || !$svg) return;

    const percents = getters?.getPercents() ?? [];
    if(percents.length <= 0) return;

    const oneOnly = percents.length === 1;
    const first = percents[0] as number;
    const last = percents[percents.length - 1] as number;
    const type = getters?.getType();

    if (type === 'vertical') {
      const height = oneOnly ? first : Math.abs(first - last);
      // @ts-ignore
      $maskRect.setAttribute('height', `${ height }%`);

      let top = 0;
      if (getters?.isBottomToTop()) {
        if(oneOnly){
          top = 100 - first;
        }
        else{
          top = Math.min(100 - last, 100 - first);
        }
      }
      else {
        if(oneOnly){
          top = 0;
        }
        else{
          top = Math.min(first, last);
        }
      }

      // @ts-ignore
      $maskRect.setAttribute('y', `${ top }%`);
    }
    else {
      let width = 0;
      if(oneOnly){
        width = first;
      }
      else{
        width = Math.abs(first - last);
      }

      // @ts-ignore
      $maskRect.setAttribute('width', `${ width }%`);

      let left = 0;
      if (getters?.isRightToLeft()) {
        if(oneOnly){
          left = 100 - first;
        }
        else{
          left = Math.min(100 - last, 100 - first);
        }
      }
      else {
        if(oneOnly){
          left = 0;
        }
        else{
          left = Math.min(first, last);
        }
      }

      // @ts-ignore
      $maskRect.setAttribute('x', `${ left }%`);
    }
  };

  const update = (_data: IPluginUpdateData) => {
    updatePointers();
    updateFill();
  };

  const destroy = () => {
    $svg?.remove();

    $svg = undefined;
    $path = undefined;
    $maskRect = undefined;

    resizeObserver?.disconnect();
  };

  return {
    /**
     * Required: unique plugin name
     */
    get name() {
      return 'SVG Path';
    },

    /**
     * Optional: plugin initialization
     */
    init: (
      _$component,
      _requestUpdate,
      _setters: IPluginSetters,
      _getters: IPluginGetters
    ) => {
      $component = _$component;
      getters = _getters;

      $slider = $component.shadowRoot?.getElementById('range-slider') as HTMLElement;
      if(!$slider) return;

      $panel = $component?.shadowRoot?.querySelector('.panel') as HTMLElement;
      if(!$panel) return;

      svgPath = $component.getAttribute('svg-path') ?? '';
      if(!svgPath) return;

      strokeWidth = getNumber($component.getAttribute('svg-path-stroke-width'), 1);

      window.setTimeout(() => {
        initResizeObserver();
        init();
      }, 0);
    },

    /**
     * Optional:
     * this will be called each time
     * range slider updates pointer positions
     */
    update,

    /**
     * Optional:
     * this will be called when
     * the web component will be removed from the DOM.
     */
    destroy,

    css: `
.panel,
.panel-fill{
  display: none;
}

.path-svg{
  color: var(--panel-bg, #2d4373);
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
}

.svg-path-fill{
  color: var(--panel-bg-fill, #000);
}

.pointer,
.pointer-shape{
 transform: none;
 transition: none;
}

.animate-on-click .pointer, 
.animate-on-click .panel-fill {
   transition: none;
}

/*#range-slider{
  border: 1px solid red;
}*/
    `,
  };
};

/**
 * Required: add current plugin to the plugins list.
 */
window.tcRangeSliderPlugins.push(SVGPathPlugin);

export default SVGPathPlugin;