# Kickstart-Project

* App uses react for the front end with web3 to make calls to the contract. 
* This contract is deployed on the Rinkeby test network at the address: 0x8890AE7E649288deD61dc01266E0AB1cD9A3131a.
* This app is designed to test a decentrilized model of kickstarter. :D 

## :books: General info


* Firstly the app allows users to create campaigns using the CampaignFactory contract. This contract deploys an instance of Campaign which users can interact with. 
* To launch a campaign the creator must assign a set amount of ether in wei as the minimum contribution that users can make to the campaign. Then once launched, the campaign can be seen on the home page. 
* Users can enter a campaign by clicking selecting their desired campaign and entering an amount to contribute. This amount must be greater than the minimum contribution amount otherwise, the transaction will fail. Once a user contributes, they become an approver to the campaign and get voting rights in the requests. 
* Requests are created only by the creator of the campaign. These requests allow the creator to pick how the campaign money is spent. The creator adds a description of the request, the amount and the address to send the money. All requests can be viewed at the view requests page of the campaign. 
* Users who contributed the correct amount to the campaign have voting rights for these requests. Requests can only be finalized by the creator once more than 50% of the contributors approve of the request. 
* This method is designed to give contributors some control over their money. They can manage the campaign and decide if they want their money to be spent on a certain decision. Likewise,  this adds an extra layer of protection to prevent creators from stealing campaign money from contributors.   

* **Note:** Only the owner is able to finalize requests, however, this can only happen when enough contributors approve of the request.



## :camera: Demo



https://user-images.githubusercontent.com/66892566/147841826-997f0209-1dd4-4198-925e-5d6dd7fadeeb.mp4




## :computer: Smart Contract

* Lottery contract that is used in the website.

```solidity

pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, address
      ) {
        return (
          minimumContribution,
          this.balance,
          requests.length,
          approversCount,
          manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}

```


## :file_folder: License

* This project is licensed under the terms of the MIT license.

## :envelope: Contact

* Repo created by [Stanley Moukhametzianov](https://github.com/Stanley-Moukhametzianov?tab=repositories), email: stanleymoukh@gmail.com
