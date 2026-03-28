import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface HistoryEntry {
    id: bigint;
    expression: string;
    result: string;
    timestamp: bigint;
    pinned: boolean;
}

export interface backendInterface {
    saveEntry: (expression: string, result: string) => Promise<bigint>;
    getHistory: () => Promise<HistoryEntry[]>;
    pinEntry: (id: bigint) => Promise<boolean>;
    deleteEntry: (id: bigint) => Promise<boolean>;
    clearHistory: () => Promise<void>;
    _initializeAccessControlWithSecret: (secret: string) => Promise<void>;
}
