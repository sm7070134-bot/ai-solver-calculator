/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface HistoryEntry {
  id: bigint;
  expression: string;
  result: string;
  timestamp: bigint;
  pinned: boolean;
}

export type UserRole = { admin: null } | { user: null } | { guest: null };

export interface _SERVICE {
  saveEntry: ActorMethod<[string, string], bigint>;
  getHistory: ActorMethod<[], HistoryEntry[]>;
  pinEntry: ActorMethod<[bigint], boolean>;
  deleteEntry: ActorMethod<[bigint], boolean>;
  clearHistory: ActorMethod<[], undefined>;
  _initializeAccessControlWithSecret: ActorMethod<[string], undefined>;
  getCallerUserRole: ActorMethod<[], UserRole>;
  assignCallerUserRole: ActorMethod<[Principal, UserRole], undefined>;
  isCallerAdmin: ActorMethod<[], boolean>;
}

export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
