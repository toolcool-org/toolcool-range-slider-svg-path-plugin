import { IPlugin, IPluginUpdateData, IPluginSetters, IPluginGetters } from 'toolcool-range-slider';
import { createSVG } from './domain/svg-provider';

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
  let requestUpdate: () => void;

  let svgPath = '';
  let $slider: HTMLElement | undefined = undefined;
  let $panel: HTMLElement | undefined = undefined;
  let $svg: SVGSVGElement | undefined = undefined;


  const init = () => {
    if(!$slider || !$panel || !svgPath) return;

    const rect = $slider.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    $svg = createSVG(width, height, svgPath);
    console.log($svg);

    $panel.before($svg);
  };
  const update = (_data: IPluginUpdateData) => {

  };

  const destroy = () => {
    $slider = undefined;
    $panel = undefined;
    $svg = undefined;
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
      requestUpdate = _requestUpdate;

      $slider = $component.shadowRoot?.getElementById('range-slider') as HTMLElement;
      if(!$slider) return;

      $panel = $component?.shadowRoot?.querySelector('.panel') as HTMLElement;
      if(!$panel) return;

      svgPath = $component.getAttribute('svg-path') ?? '';
      if(!svgPath) return;

      window.setTimeout(() => {
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
}

#range-slider{
  border: 1px solid red;
}
    `,
  };
};

/**
 * Required: add current plugin to the plugins list.
 */
window.tcRangeSliderPlugins.push(SVGPathPlugin);

export default SVGPathPlugin;