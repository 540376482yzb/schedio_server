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


## Events:
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


