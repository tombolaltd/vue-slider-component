// This patches a known issue in TS, the type definitions are wrong fot certain overloads of addEventListner
// See https://github.com/Microsoft/TypeScript/issues/9548

export interface IPatchedEventListenerArgs {
    capture?: boolean;
}

export interface IPatchedAddEventListenerArgs extends IPatchedEventListenerArgs {
    passive?: boolean;
    once?: boolean;
}

export type PatchedEventListener = (
    type: string,
    listener: (event: Event) => void,
    options?: IPatchedAddEventListenerArgs
) => void;
