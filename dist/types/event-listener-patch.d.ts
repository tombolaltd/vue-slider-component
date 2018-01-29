export interface IPatchedEventListenerArgs {
    capture?: boolean;
}
export interface IPatchedAddEventListenerArgs extends IPatchedEventListenerArgs {
    passive?: boolean;
    once?: boolean;
}
export declare type PatchedEventListener = (type: string, listener: (event: Event) => void, options?: IPatchedAddEventListenerArgs) => void;
