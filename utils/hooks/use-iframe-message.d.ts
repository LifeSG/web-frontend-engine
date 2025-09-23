type MessageHandler<T = any> = (event: MessageEvent<{
    payload: T;
}>) => void;
export declare const useIframeMessage: <T>(eventType: string, handler: MessageHandler<T>) => void;
export {};
