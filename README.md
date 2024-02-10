###### This project is a simple RESTful API built using Node.js and Express.js for secure file storage with encryption. It allows users to register, create encrypted text files, add users to files, and retrieve files while ensuring data security through encryption techniques.



##### Clone this repository to your local machine. 
##### Ensure you have Node.js and npm installed.
##### Run npm install to install project dependencies.
#### Usage:
###### This project provides an API for securely storing and retrieving files with encryption. It's suitable for scenarios where data privacy is a concern, such as storing sensitive information like personal documents or private messages.

# Endpoints:

## Register User : 

##### URL : /register
##### Method :  POST
##### Request Body:
###### json

```
{
    "username": "example_user"
}
```
### Response:
###### 200 OK on successful registration.
###### 400 Bad Request if the username is invalid or already taken.

## Create Text Files
 ##### URL: /files
##### Method: POST
##### Query Parameters:
###### key:  username 
###### value: {username}  (Username of the file owner)
##### Request Body:
###### json

```
{
    "content": "Lorem ipsum dolor sit amet...",
}
```
##### Response:
###### 200 OK on successful file creation.
###### 400 Bad Request if the username is missing or invalid.

## Add User to File
##### URL: /files/:file_Id/add-user
##### Method: POST
##### URL Parameters: file_Id ( You can get file id when you create text file, replace `:file_id` with actual file_id of the file.)
##### Request Body:
###### json
```
{
    "username": "new_user"
}
```
##### Response:
###### 200 OK on successful addition of user.


## Retrieve Files
##### URL : /files
##### Method: GET
##### Query Parameters:
###### key:  username 
###### value: {username}  (Username )
##### Response: 
###### Returns an array of files with their decrypted content.

## Dependencies:

#### express: Web framework for Node.js.
#### crypto: Module providing cryptographic functionality.

## Running the Application:

##### Run npm run dev to start the server.
##### The server will be running on http://localhost:3000 by default.
Testing:

## Use tools like Postman to test the API endpoints.
