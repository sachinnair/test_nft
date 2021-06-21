/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js'
import { ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export type ClaimSuccess = ContractEventLog<{
    id: string
    claimer: string
    timestamp: string
    to_value: string
    token_address: string
    0: string
    1: string
    2: string
    3: string
    4: string
}>
export type DestructSuccess = ContractEventLog<{
    id: string
    token_address: string
    remaining_balance: string
    exchanged_values: string[]
    0: string
    1: string
    2: string
    3: string[]
}>
export type FillSuccess = ContractEventLog<{
    total: string
    id: string
    creator: string
    creation_time: string
    token_address: string
    message: string
    start: string
    end: string
    exchange_addrs: string[]
    ratios: string[]
    qualification: string
    limit: string
    0: string
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
    7: string
    8: string[]
    9: string[]
    10: string
    11: string
}>
export type SwapSuccess = ContractEventLog<{
    id: string
    swapper: string
    from_address: string
    to_address: string
    from_value: string
    to_value: string
    input_total: string
    0: string
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
}>
export type WithdrawSuccess = ContractEventLog<{
    id: string
    token_address: string
    withdraw_balance: string
    0: string
    1: string
    2: string
}>

export interface BscPolygonITO extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): BscPolygonITO
    clone(): BscPolygonITO
    methods: {
        check_availability(id: string | number[]): NonPayableTransactionObject<{
            exchange_addrs: string[]
            remaining: string
            started: boolean
            expired: boolean
            unlocked: boolean
            unlock_time: string
            swapped: string
            exchanged_tokens: string[]
            0: string[]
            1: string
            2: boolean
            3: boolean
            4: boolean
            5: string
            6: string
            7: string[]
        }>

        claim(ito_ids: (string | number[])[]): NonPayableTransactionObject<void>

        destruct(id: string | number[]): NonPayableTransactionObject<void>

        fill_pool(
            _hash: string | number[],
            _start: number | string | BN,
            _end: number | string | BN,
            _message: string,
            _exchange_addrs: string[],
            _ratios: (number | string | BN)[],
            _unlock_time: number | string | BN,
            _token_addr: string,
            _total_tokens: number | string | BN,
            _limit: number | string | BN,
            _qualification: string,
        ): PayableTransactionObject<void>

        setUnlockTime(id: string | number[], _unlock_time: number | string | BN): NonPayableTransactionObject<void>

        swap(
            _id: string | number[],
            verification: string | number[],
            validation: string | number[],
            exchange_addr_i: number | string | BN,
            _input_total: number | string | BN,
        ): PayableTransactionObject<string>

        withdraw(id: string | number[], addr_i: number | string | BN): NonPayableTransactionObject<void>
    }
    events: {
        ClaimSuccess(cb?: Callback<ClaimSuccess>): EventEmitter
        ClaimSuccess(options?: EventOptions, cb?: Callback<ClaimSuccess>): EventEmitter

        DestructSuccess(cb?: Callback<DestructSuccess>): EventEmitter
        DestructSuccess(options?: EventOptions, cb?: Callback<DestructSuccess>): EventEmitter

        FillSuccess(cb?: Callback<FillSuccess>): EventEmitter
        FillSuccess(options?: EventOptions, cb?: Callback<FillSuccess>): EventEmitter

        SwapSuccess(cb?: Callback<SwapSuccess>): EventEmitter
        SwapSuccess(options?: EventOptions, cb?: Callback<SwapSuccess>): EventEmitter

        WithdrawSuccess(cb?: Callback<WithdrawSuccess>): EventEmitter
        WithdrawSuccess(options?: EventOptions, cb?: Callback<WithdrawSuccess>): EventEmitter

        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }

    once(event: 'ClaimSuccess', cb: Callback<ClaimSuccess>): void
    once(event: 'ClaimSuccess', options: EventOptions, cb: Callback<ClaimSuccess>): void

    once(event: 'DestructSuccess', cb: Callback<DestructSuccess>): void
    once(event: 'DestructSuccess', options: EventOptions, cb: Callback<DestructSuccess>): void

    once(event: 'FillSuccess', cb: Callback<FillSuccess>): void
    once(event: 'FillSuccess', options: EventOptions, cb: Callback<FillSuccess>): void

    once(event: 'SwapSuccess', cb: Callback<SwapSuccess>): void
    once(event: 'SwapSuccess', options: EventOptions, cb: Callback<SwapSuccess>): void

    once(event: 'WithdrawSuccess', cb: Callback<WithdrawSuccess>): void
    once(event: 'WithdrawSuccess', options: EventOptions, cb: Callback<WithdrawSuccess>): void
}