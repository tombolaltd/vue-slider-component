import { vendorPrefix } from './vendor-prefix';

const vendorTransform = vendorPrefix.getProperty('transform');

export interface IViewportConfig {
    width: number;
    height: number;
}

export class Viewport {
    private element: HTMLElement;
    private config: IViewportConfig;

    constructor(element: HTMLElement, config: IViewportConfig) {
        this.element = element;
        this.config = config;
        element.style.width = `${config.width}px`;
        element.style.height = `${config.height}px`;

        this.update();

        window.addEventListener('resize', this.update.bind(this));
    }

    private update(): void {
        const element = this.element;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const viewportWidth = this.config.width;
        const viewportHeight = this.config.height;

        const widthScale = windowWidth / viewportWidth;
        const heightScale = windowHeight / viewportHeight;
        const smallestScale = Math.min(widthScale, heightScale);

        const leftPosition = Math.floor((windowWidth - (viewportWidth * smallestScale)) / 2);
        const topPosition = Math.floor((windowHeight - (viewportHeight * smallestScale)) / 2);

        element.style[vendorTransform as any] = `scale(${smallestScale})`;
        element.style.transform = `scale(${smallestScale})`;
        element.style.left = `${leftPosition}px`;
        element.style.top = `${topPosition}px`;
    }
}
