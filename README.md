# phase 2-BO

## Description
**Phase 2 class assignment - user vacation manager**

Login service that identify the user's role.

**Manage permissions:** can request vacation for an employee which will automatically approved by the system.
  can also add, delete employees and edit employee's details.
   
**Employee permissions:** can edit his own details and ask for a vacation
  the system will approve employee's request if:
  - the employee has enough days-off
  - no other employee is in vacation on any of the requested days
  - it’s not an holiday
  with approval, verification email will be sent to the employee. 

 **The system**
   allows bulk import of users to the DB.
   increases automatically vacation days by 0.3 every day 
   when user has a birthday the system sends a Happy-Birthday email
   
 ## Prequisites
 ```
 Node.js 16v
 ```
## Installing
Install dependancies
```
npm i
```
create .env file with the following variables:
```
-- missing --
```
Run the server:
```
npm run dev
```
Open page login.html with live server

## API Docs
---- missing ---
## Built with
- Node.js
- HTML
- CSS
- JavaScript

## Authors
- ***Adva Apelboim*** (AtomicManic) - **TL**, SE student
- ***Ofir Peleg*** (ofirpeleg) - SE student
