/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

const HistoryEntry = IDL.Record({
  id: IDL.Nat,
  expression: IDL.Text,
  result: IDL.Text,
  timestamp: IDL.Int,
  pinned: IDL.Bool,
});

const UserRole = IDL.Variant({
  admin: IDL.Null,
  user: IDL.Null,
  guest: IDL.Null,
});

export const idlService = IDL.Service({
  saveEntry: IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
  getHistory: IDL.Func([], [IDL.Vec(HistoryEntry)], ['query']),
  pinEntry: IDL.Func([IDL.Nat], [IDL.Bool], []),
  deleteEntry: IDL.Func([IDL.Nat], [IDL.Bool], []),
  clearHistory: IDL.Func([], [], []),
  _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
  getCallerUserRole: IDL.Func([], [UserRole], ['query']),
  assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
  isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const HistoryEntry = IDL.Record({
    id: IDL.Nat,
    expression: IDL.Text,
    result: IDL.Text,
    timestamp: IDL.Int,
    pinned: IDL.Bool,
  });
  const UserRole = IDL.Variant({
    admin: IDL.Null,
    user: IDL.Null,
    guest: IDL.Null,
  });
  return IDL.Service({
    saveEntry: IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    getHistory: IDL.Func([], [IDL.Vec(HistoryEntry)], ['query']),
    pinEntry: IDL.Func([IDL.Nat], [IDL.Bool], []),
    deleteEntry: IDL.Func([IDL.Nat], [IDL.Bool], []),
    clearHistory: IDL.Func([], [], []),
    _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
    getCallerUserRole: IDL.Func([], [UserRole], ['query']),
    assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
    isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
  });
};

export const init = ({ IDL }) => { return []; };
