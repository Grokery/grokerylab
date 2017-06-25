# GrokeryLab - App

This project was built with [Create React App](https://github.com/facebookincubator/create-react-app).

### `npm start`

Runs the app in development mode. [http://localhost:3000](http://localhost:3000)

### `npm run build`

Builds the app for production to the `build` folder.


## To build and deploy with docker:

    docker build -t grokery:app .
    
    docker run -d -p 80:80 grokery:app

