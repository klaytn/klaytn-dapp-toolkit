// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.22;

library Error {
// Indicates an invalid number of confirmations was provided.
error invalid_number_of_confirmations();
// Indicates that the provided owner is invalid.
error invalid_Owner();
// Indicates that an operation requires an owner to proceed.
error Owner_required();
// Indicates that the owner must be unique but is not.
error Owner_not_Unique();
// Indicates that a transaction has not been confirmed.
error tx_Not_Confirmed();
// Indicates that a transaction has failed.
error Tx_Failed();
}