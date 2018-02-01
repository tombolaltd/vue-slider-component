function toTitleCase(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = window.getComputedStyle(document.documentElement, '');
const prefix: string | undefined = (Array.prototype.slice
    .call(styles)
    .join('')
    .match(/-(moz|webkit|ms)-/) || ((styles as any).OLink === '' && ['', 'o'])
)[1];

let prefixObject;

if (prefix) {
    prefixObject = {
        get prefix(): string {
            return prefix as string;
        },
        getProperty(property: string): string {
            const prefixed = prefix + toTitleCase(property);
            return styles[prefixed as any] ? prefixed : property;
        }
    };
} else {
    prefixObject = {
        get prefix(): string {
            return '';
        },
        getProperty(property: string): string {
            return property;
        }
    };
}

export const vendorPrefix = prefixObject;
