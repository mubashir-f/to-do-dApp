// SPDX-License-Identifier: GPL-3.0 
pragma solidity >=0.8.0 <0.9.0;  

contract ToDoContract{
    
    struct toDoList{
        uint id;
        string toDoItem;
        bool isDone;
        bool isDeleted;
    }

    mapping (address => toDoList[]) private ListToOwners;

    function addItem(string calldata toDoItem) external{
        uint newId = ListToOwners[msg.sender].length;
        ListToOwners[msg.sender].push(toDoList({
            id:newId,
            toDoItem: toDoItem,
            isDone:false,
            isDeleted:false
        }));
    }

    function getToDoList() external view returns (toDoList[] memory){
       return ListToOwners[msg.sender];
    }

    function updateItem(uint256 toDoItemIndex,bool isDone,string memory toDoItem) external{
        ListToOwners[msg.sender][toDoItemIndex].isDone = isDone;
        ListToOwners[msg.sender][toDoItemIndex].toDoItem = toDoItem;
    } 

    function deleteItem(uint256 toDoItemIndex) external{
       ListToOwners[msg.sender][toDoItemIndex].isDeleted = true;
    }

} 