import React, {Component} from "react";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from 'react-tsparticles';
import Clarifai from "clarifai";
import './App.css';

const particlesOptions = {
  particles: {
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 3,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 80,
    }
  }
}

const app = new Clarifai.App({
  apiKey: 'faef8e85f693452fa55e0461c842e51b'
}); 


class App extends Component {
  constructor(){
    super()
    this.state = {
      input:"",
      imageUrl:"",
      boxes:[]
    }
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    return clarifaiFaces.map(face => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }
    })
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then (response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(error => console.log(error))
  }

  render(){
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions}/>   
        <Logo/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageUrl={this.state.imageUrl} boxes={this.state.boxes}/>
      </div>
    );
  }
}

export default App;
