# Schedio API


## Authentication:
### Google OAuth Login (POST)

```
POST request on "/login/google"
```

```
   example input: {
      "access_token": "<your access token given by google>"
   }
   example output:{
      "authToken":"<your jwt token hash>"
   }
```

### Local authentication(POST)

    ```
    POST request on "/signup"
    ```
    ```
        example input:{
            "username":"<your username>",
            "firstname":"<your firstname>"(optional),
            "password":"<your password>"
        }

        example output:{
            "username":"<your username>"
        }
    ```

    ```
    POST request on "/login/local"
    ```

    ```
        example input:{
            "username":"<your username>",
            "password":"<your password>"
        }

        example output:{
            "authToken":"<your jwt token>"
        }
    ```


## Events Endpoints:
### Events are the core resource of Schedio. Events contain information about an event a user has decided to attend which widgets access.

### Events contain information about the different widgets in the app, including whether or not the widget is expressed in the app, based on the user's preference.


___

### `GET /api/events/`

This endpoint will return all events associated with a specific user.

Required Data for Endpoint:
* Authentication: User must be logged in because it is a protected route
    1. The user's `req.body` information will be used (after authentication middleware has handed off to the route) to perform a database call for events associated with the user. 
    2. This endpoint will *not* return ALL events. Only those associated with a user.

___

### `GET /api/events/:id`

Returns an endpoint associated with a provided ID.

Required Data for endpoint:
* Authentication: Route is protected
* `id` parameter:   `GET /api/events/2c930039403a0450`

___

### `POST /api/events'`

Required Data for Endpoint:
* Authentication. User must be logged in because 
    1) It is a protected endpoint, and
    2) The endpoint will make use of the `req.user` user information to assign a user ID to the event, ensuring that it is properly linked with the user that created it. 

Optional Data for Endpoint:
* title: A string expressing the title of the app. There are currently no limits on string length
* location: Must be an Object with a `lat` and `long` coordinate. For example: 
``` 
location: {lat:12312311312323, long: 13123213123123}
```
If the `location` object is not an object with these keys, the endpoint will reject the update. 
* starttime: A datetime string expressing the milliseconds since 1/1/1970. Specifies the start time of the event.
* See the code below for an example of a proper POST request with all optional fields present:
```
GET /api/events

req.body: {
    location: {
        "lat":"some-latitude",
        "long":"some-longitude",
    },
    title: "Frisbee Fun",
    starttime: "1525385432867"
}
```

___

### `PUT /api/events/:id`

Allows us to change the title, location, or starttime of our Event.

Required by this Endpoint:
* Authentication: Protected Endpoint
* `id` parameter, in order to specify which event you will be editing
* At least one of the optional fields below:

Optionally Accepted by this Endpoint:

* `req.body.title`
* `req.body.location`
* `req.body.starttime`


___

### `DELETE /api/events/:id`

Allows us to delete an event.

Required by this Endpoint:
* Authentication. It is a protected endpoint
* `id` parameter in order to specify which event you will be deleting


___

## Widgets:
### Since Widget information is event specific, we will be extending the `/events` endpoint to allow for changes to widgets.


___
## Weather Widget Endpoint:
The weather widget is the most simple widget to manage, as it's only configuration is `displayed:false` or `displayed:true`.

### `PUT /api/events/:id/weather`
Switches the Weather widget for a specified event to `displayed:true` or `displayed:false.`

Required by this Endpoint:
* Authentication (Protected Endpoint)
* `/:id` parameter specifying the event the weather widget of which we will be modifying.
* `requestType` command in request body. This request type is used to inform the server whether you are setting the weather widget to active or inactive.
* The accepted commands for `requestType` are `"setActive"` or `"setInactive"`. This is a required command in the request body. The endpoint will return an error if it is not in the request body. 
* See an example PUT request to this endpoint below:

```
PUT /api/events/5aeb7b60f74ab4040113e7db/weather
req.body: {
    requestType:'setActive'
}

// Sets weather widget for event with ID 5aeb7b60f74ab4040113e7db to `displayed`.
```
___

## Todo list Widget Endpoint:
`/api/events/5aeb7b60f74ab4040113e7db/todo`

 Sets complete, incomplete, or edits the title of items in the todo list for each event.

### `POST /api/events/:id/todo`:

Required by this Endpoint:
* Authentication (protected endpoint)
* `/:id` parameter to specify which event the server will be altering
* `title` parameter in `request body`. 

```
POST /api/events/5aeb7b60f74ab4040113e7db/todo
req.body: {
    title: 'Pack proper clothes'
}
```

___
### `PUT /api/events/:id/todo`
Required by this Endpoint:
* Authentication (protected endpoint)
* `/:id` parameter to specify which event's todo list is being altered.
* `requestType` parameter in Request body. This command is used to inform the server what kind of action you are taking. The server accepts 3 commands: `requestType: 'setComplete', requestType: 'setIncomplete', or requestType:'editTitle'`

Depending on the kind of request you specify there may be another parameter or bit of information you need to specify:


For `requestType:'setComplete'`:
* Nothing further is required.

For `requestType:'setIncomplete'`:
* Nothing further is required

For `requestType:'editTitle'`:
* `newTitle` field is required in request body.

```
PUT /api/events/5aeb7b60f74ab4040113e7db/todo
req.body: {
    requestType:'editTitle',
    newTitle:'Go to the grocery store'
}
```
___ 

### `DELETE /api/events/:id/todo?todoId=ID`

Deletes a todo list item from an event with the specified ID

Required by this endpoint:
* Authentication (Protected Endpoint)
* `/:id` parameter to specify event being altered
* `todoId` in request QUERY. This tells the server which todo list item you're deleting.

```
DELETE /api/events/5aeb7b60f74ab4040113e7db/todo?todoId=5aeb7b60f74ab4040113e7db
```

___