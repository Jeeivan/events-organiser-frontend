# Events Organiser ReadMe

![Game Screenshot](example.png)

## Project Description

## Table of Contents

- [Deployment Link](#deployment-link)
- [Technologies Used](#technologies-used)
- [Planning](#planning)
- [Build Process](#build-process)
- [Challenges](#challenges)
- [Wins](#wins)
- [Key Learnings/Takeaways](#key-learningstakeaways)
- [Bugs](#bugs)
- [Future Improvements](#future-improvements)

## Deployment Link

Currently in the process of being deployed

## Technologies Used

Tailwind CSS HTML Vanilla Javascript ES6 MongoDB Mongoose Node.js Vue.js Express React

## Planning

Allows users to create their own groups with unique codes and within groups allows users to create events and users can select if they are going or not going. Have a discussion section for each specific event. Have an events page for each group to show all events- past, upcoming.

**Sign up/Login Pages**

Using email and password for login

If user does not have a login, there will be a reigister hyperlink to take user to the sign up page

**Create Group**

Ask user to input Name of group

Then user can create group which will automatically generate a 4 digit unique code

Once created it will redirect the user to the home page of that group

**Join Group**

Enter unique code of already existing group

Entering this will add this user to the groups users attribute

**Group Home Page**

Show all events - Each of these are clickable

Show all users of the group

Display unique code

Create Event button

**Individual Event Page**

This will display a description of event

Who’s going and not going

Show discussion chat at the bottom of the page

**Create Event Page**

Input title for event
Input description for event

![Plan](plan.png)

## Build Process

## Challenges

## Wins

Being able to setup the authentication myself despite the amount of difficulty I have had with authentication in previous projects

![Authentication](authentication.png)

## Key Learnings/Takeaways

I have found what works for me is getting the backend server side of the project functioning initially and checking with my endpoints are working with postman help me to have an easier time with working on the front end after

![Server Side Image](server.png)

## Bugs

## Future Improvements

To get experience using useContext in React so that I do not have to rely on the local storage to pass information between different pages
