
# ai-base beta
   ai-base is a React Electron UI for the llmware API project. Right now you can run generative local llms with context and queries.
   Here is a [link](https://github.com/llmware-ai/llmware) to the llmware project.
   The goal of the project is to be able to run different llms and prompts then save the results in a database for later review.
   I think this would help developers to be able to quickly try different scenarios and fine tune the needs of their project
   without having to change code.


## Table of Contents

1. [About](#About)
2. [Built with](#Built-with)
3. [Installing and running application in dev.](#Installing-and-running-application-in-dev)
4. [Roadmap](#Roadmap)
5. [Contributing](#Contributing)
6. [License](#License)
7. [Contact](#Contact)

## About
I created this project to test different scenarios for the llmware API. I plan on adding a database to save scenarios and prompt information.

Main screen with response, context and query inputs.

![](/github-images/main.png)

Model view - choose a model from the list. Only generative local models are shown

![](/github-images/model.png)

Prompt view choose a prompt type from the list.  

![](/github-images/prompt.png)

Main screen with model chosen, prompt chosen, context text, query text and final response 

![](/github-images/main-2.png)


<p align="right">(<a href="#top">back to top</a>)</p>

## Built with

* [Electron](https://www.electronjs.com)
* [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
* [React.js](https://reactjs.org/)
* [Pouchdb](https://pouchdb.com/)
* [Bootstrap](https://getbootstrap.com)
* [llmware](https://github.com/llmware-ai/llmware)
* [Python](https://www.python.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Installing and running application in dev
Currently, there is no installation package because project is under active development.

This is developed using:
  1. Node version v21.7.1
  2. Python version 3.11.0

The main Electron project is in the root folder, the llmware-wrapper folder is the Python bridge to the llmware API, it has Type Script files and Python files.

If you want to try it in dev, clone the repo and then run npm install in the root directory, this will install the Electron project node libraries.

Run npm install in the llmware-wrapper directory, this will install the node libraries use by the bridge.

Set up a Python virtual environment in the llmware-wrapper directory. There is a requirements text file to help with that.

There is a properties file in the llmware-wrapper directory to set your Python path for python-shell to use.

There is a 20-minute timeout on queries that is set in the code, if you need a longer time out you can change it. I plan on adding this to the UI later. :) 

## Roadmap

Add database support to be able to save model, prompt, context, query and response.
Installation package.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Kevin Brisson - [LinkedIn](https://www.linkedin.com/in/kevin-brisson-918445185/) - kbrisso@gmail.com

Project Link: [https://github.com/kbrisso/ai-base](https://github.com/kbrisso/ai-base)

<p align="right">(<a href="#top">back to top</a>)</p>





