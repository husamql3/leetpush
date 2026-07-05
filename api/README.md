# LeetPush API Documentation

## Introduction

Welcome to the LeetPush API documentation! LeetPush API is a RESTful API designed to provide access to data related to LeetCode problem-solving activity. This documentation provides an overview of the available endpoints, their functionalities, and how to use them.

## Installation

To install and run the LeetPush API locally, follow these steps:

1. Clone the repository:
```git clone https://github.com/husamahmud/leetpush-api.git```


### Available Endpoints

- **GET `/`**
  - Description: Provides a welcome message and overview of available endpoints.
  - Response:
    ```json
    {
      "message": "Welcome to LeetPush API",
      "totalSolvedProblems": "/:userId",
      "dailyProblem": "/daily",
      "last20Submissions": "/submissions/:userId",
      "profileCalendar": "/userProfileCalendar/:username/:year"
    }
    ```

- **GET `/daily`**
  - Description: Fetches the daily problem.
  - Response: Returns the daily problem data.

- **GET `/:userId`**
  - Description: Retrieves user profile data based on the provided user ID.
  - Parameters:
    - `userId`: The ID of the user.
  - Response: Returns the user profile data.

- **GET `/submissions/:userId`**
  - Description: Retrieves the last 20 submissions of a user.
  - Parameters:
    - `userId`: The ID of the user.
  - Response: Returns the last 20 submissions data of the user.

- **GET `/userProfileCalendar/:username/:year`**
  - Description: Retrieves the user profile calendar for a specific year.
  - Parameters:
    - `username`: The username of the user.
    - `year`: The year for which the calendar is requested.
  - Response: Returns the user profile calendar data for the specified year.


## Feedback

If you have any feedback, suggestions, or issues regarding the LeetPush API, feel free to open an issue on the GitHub repository or contact the project maintainers.

