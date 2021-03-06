//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Todos {
    uint public count = 1;

    constructor() public {
        console.log("hello");
    }

    struct Todo{
        string name;
        bool completed;
    }

    mapping (uint => Todo) tasklist;

    function create_task(string memory _task) public {
        tasklist[count] = Todo(_task,false);
        count++;
    }

    function toggle_state(uint _id) public {
        Todo storage todo = tasklist[_id];
        todo.completed = !todo.completed;
    }

    function update_task(uint _id,string memory _text) public{
        Todo storage todo = tasklist[_id];
        todo.name = _text;
    }

    function get_task(uint _id) public view returns(Todo memory){
        Todo storage todo = tasklist[_id];
        return todo;
    }
}
