// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/* solhint-disable  no-global-import*/
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

library Bytes32ToAddressMapUpgradeable {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.Bytes32Set;

    struct Bytes32ToBytes32Map {
        // Storage of keys
        EnumerableSetUpgradeable.Bytes32Set _keys;
        mapping(bytes32 => bytes32) _values;
        mapping(bytes32 => uint8) _keyLengths;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(
        Bytes32ToBytes32Map storage map,
        bytes32 key,
        bytes32 value,
        uint8 keyLength
    ) internal returns (bool) {
        map._values[key] = value;
        map._keyLengths[key] = keyLength;
        return map._keys.add(key);
    }

    /**
     * @dev Removes a key-value pair from a map. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(
        Bytes32ToBytes32Map storage map,
        bytes32 key
    ) internal returns (bool) {
        delete map._values[key];
        delete map._keyLengths[key];
        return map._keys.remove(key);
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(
        Bytes32ToBytes32Map storage map,
        bytes32 key
    ) internal view returns (bool) {
        return map._keys.contains(key);
    }

    /**
     * @dev Returns the number of key-value pairs in the map. O(1).
     */
    function length(
        Bytes32ToBytes32Map storage map
    ) internal view returns (uint256) {
        return map._keys.length();
    }

    /**
     * @dev Returns the key-value pair stored at position `index` in the map. O(1).
     *
     * Note that there are no guarantees on the ordering of entries inside the
     * array, and it may change when more entries are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(
        Bytes32ToBytes32Map storage map,
        uint256 index
    ) internal view returns (bytes32, bytes32) {
        bytes32 key = map._keys.at(index);
        return (key, map._values[key]);
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(
        Bytes32ToBytes32Map storage map,
        bytes32 key
    ) internal view returns (bool, bytes32) {
        bytes32 value = map._values[key];
        if (value == bytes32(0)) {
            return (contains(map, key), bytes32(0));
        } else {
            return (true, value);
        }
    }

    /**
     * @dev Tries to return the actual length of the key to parse into string
     *
     * * Requirements:
     *
     * - `key` must be in the map.
     */
    function getKeyLength(
        Bytes32ToBytes32Map storage map,
        bytes32 key
    ) internal view returns (uint8) {
        uint8 value = map._keyLengths[key];
        require(value != 0, "EnumerableMap: nonexistent key");
        return value;
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(
        Bytes32ToBytes32Map storage map,
        bytes32 key
    ) internal view returns (bytes32) {
        bytes32 value = map._values[key];
        require(
            value != 0 || contains(map, key),
            "EnumerableMap: nonexistent key"
        );
        return value;
    }

    /**
     * @dev Same as {get}, with a custom error message when `key` is not in the map.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryGet}.
     */
    function get(
        Bytes32ToBytes32Map storage map,
        bytes32 key,
        string memory errorMessage
    ) internal view returns (bytes32) {
        bytes32 value = map._values[key];
        require(value != 0 || contains(map, key), errorMessage);
        return value;
    }

    //Bytes32ToAddressMap

    struct Bytes32ToAddressMap {
        Bytes32ToBytes32Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(
        Bytes32ToAddressMap storage map,
        bytes32 key,
        address value,
        uint8 keyLength
    ) internal returns (bool) {
        return
            set(map._inner, key, bytes32(uint256(uint160(value))), keyLength);
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(
        Bytes32ToAddressMap storage map,
        bytes32 key
    ) internal returns (bool) {
        return remove(map._inner, key);
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(
        Bytes32ToAddressMap storage map,
        bytes32 key
    ) internal view returns (bool) {
        return contains(map._inner, key);
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(
        Bytes32ToAddressMap storage map
    ) internal view returns (uint256) {
        return length(map._inner);
    }

    /**
     * @dev Returns the element stored at position `index` in the set. O(1).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(
        Bytes32ToAddressMap storage map,
        uint256 index
    ) internal view returns (bytes32, address) {
        (bytes32 key, bytes32 value) = at(map._inner, index);
        return (key, address(uint160(uint256(value))));
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(
        Bytes32ToAddressMap storage map,
        bytes32 key
    ) internal view returns (bool, address) {
        (bool success, bytes32 value) = tryGet(map._inner, key);
        return (success, address(uint160(uint256(value))));
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(
        Bytes32ToAddressMap storage map,
        bytes32 key
    ) internal view returns (address) {
        return address(uint160(uint256(get(map._inner, key))));
    }

    /**
     * @dev Tries to return the actual length of the key to parse into string
     * Does not revert if `key` is not in the map.
     */
    function getKeyLength(
        Bytes32ToAddressMap storage map,
        bytes32 key
    ) internal view returns (uint8) {
        return getKeyLength(map._inner, key);
    }

    /**
     * @dev Returns the array of keys in the map.
     *
     *  WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function keys(
        Bytes32ToAddressMap storage map
    ) internal view returns (bytes32[] memory) {
        return map._inner._keys.values();
    }

    /**
     * @dev Returns the array of keys that packed and return as bytes
     *  WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function keysPacked(
        Bytes32ToAddressMap storage map
    ) internal view returns (bytes[] memory) {
        bytes32[] memory keyList = keys(map);
        bytes[] memory packedKeys = new bytes[](keyList.length);
        for (uint256 i = 0; i < keyList.length; i++) {
            bytes memory bytesKeys = bytes(abi.encodePacked(keyList[i]));
            uint8 keyLength = getKeyLength(map, keyList[i]);
            packedKeys[i] = new bytes(keyLength);
            for (uint8 j = 0; j < keyLength; j++) {
                packedKeys[i][j] = bytesKeys[j];
            }
        }
        return packedKeys;
    }
}
