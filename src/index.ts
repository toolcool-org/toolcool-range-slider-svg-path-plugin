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

  let resizeObserver: ResizeObserver | null = null;

  const init = () => {
    if(!$slider || !$panel || !svgPath) return;

    const rect = $slider.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const [_$svg, _$path] = createSVG(width, height, svgPath, strokeWidth);
    $svg = _$svg as SVGSVGElement;
    $path = _$path as SVGPathElement;
    $panel.before(_$svg);

    updatePointers();
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

    for(let i=0; i<percents.length; i++) {
      const $pointer = $pointers[i];
      if (!$pointer) continue;

      const percent = percents[i];
      const absoluteDistance = svgLength * percent / 100;
      const svgPoint = $path.getPointAtLength(absoluteDistance);

      const pointerRect = $pointer.getBoundingClientRect();

      const x = svgPoint.x - pointerRect.width / 2;
      const y = svgPoint.y - pointerRect.height / 2;

      $pointer.style.left = `${ x }px`;
      $pointer.style.top = `${ y }px`;
    }
  };

  const update = (_data: IPluginUpdateData) => {
    updatePointers();
  };

  const destroy = () => {
    $svg?.remove();
    $svg = undefined;
    $path = undefined;
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

.pointer,
.pointer-shape{
 transform: none !important;
 transition: none !important;
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