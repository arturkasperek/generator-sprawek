/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { dark } from 'react-syntax-highlighter/styles/prism';
import Dropzone from 'react-dropzone'
import template from './template';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function getBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileAsBinaryString = reader.result;

      resolve(fileAsBinaryString);
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(file);
    console.log('im here tuu');
  });
}

export const insertToArray = (arr, index, newItems) => [
  ...arr.slice(0, index),
  ...newItems,
  ...arr.slice(index)
];

export default class HomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      tasksList: '',
      items: [],
    };
  }

  getWithoutRemoved = (tasksNames, oldItems) => {
    return oldItems.filter(item=>tasksNames.indexOf(item.name) !==-1);
  };

  getUpdated = (tasksNames, oldItems) => {
    return oldItems.map((item, idx)=>({
      ...item,
      name: tasksNames[idx],
    }));
  };

  getWithAdded = (tasksNames, oldItems) => {
    const newOnes = tasksNames.filter(name => {
      return oldItems.length ? !oldItems.find(item=>item.name === name) : true;
    });
    const firstIndex = tasksNames.indexOf(newOnes[0]);

    return insertToArray(oldItems, firstIndex, newOnes.map(taskName=> ({
      name: taskName,
      image: null,
      code: '',
      id: guid(),
    })));
  };

  updateTasksList = (e) => {
    const tasksList = e.target.value;
    const taskNames = tasksList.split('\n');
    const oldItems = [...this.state.items];
    let newItems;

    if ( taskNames.length === oldItems.length ) {
      newItems = this.getUpdated(taskNames, oldItems);
    } else if ( taskNames.length < oldItems.length ) {
      newItems = this.getWithoutRemoved(taskNames, oldItems);
    } else if ( taskNames.length > oldItems.length || oldItems.length === 0 ) {
      newItems = this.getWithAdded(taskNames, oldItems);
    }

    this.setState({
      tasksList: tasksList,
      items: newItems,
    })
  };

  updateItem = (id, toMerge) => {
    const items = this.state.items;
    const itemToUpdate = items.find(item => item.id === id);
    const indexOfItem = items.indexOf(itemToUpdate);
    const newItems = insertToArray(this.state.items.filter(item => item.id!==id), indexOfItem, [{
      ...itemToUpdate,
      ...toMerge,
    }]);

    console.log('ha ', toMerge);
    this.setState({
      items: newItems,
    })
  };

  addImage = async (id, image) => {
    const base64 = await getBase64(image);

    this.updateItem(id, {
      image: image,
    })
  };

  render() {
    return (
      <div className={'container app-container'}>
        <FormGroup className={'tasks-list'}>
          <ControlLabel>Lista zadań</ControlLabel>
          <FormControl value={this.state.tasksList} onChange={this.updateTasksList} componentClass="textarea" placeholder="" />
        </FormGroup>
        <div>
          {this.state.items.map((item, idx) => (<div className={'task-item'}>
            <div>
              {idx + 1}. {item.name}
            </div>
            <div>
              <FormGroup>
                <ControlLabel>Kod źródłowy</ControlLabel>
                <FormControl value={item.code} onChange={(e)=>this.updateItem(item.id, {code: e.target.value})} componentClass="textarea" placeholder="" />
              </FormGroup>
            </div>
            <div>
              <SyntaxHighlighter value={'asdasd'} language='python' style={dark}>{item.code}</SyntaxHighlighter>
            </div>
            <div>
              <div className="dropzone">
                <Dropzone multiple={false} onDrop={(files)=>this.addImage(item.id, files[0])}>
                  <p>Dodaj zdjęcie</p>
                </Dropzone>
              </div>
              <div className={'preview'}>
                {item.image && (
                  <img src={item.image.preview} />
                )}
              </div>
            </div>
          </div>))}
        </div>
        {this.state.items.length !== 0 && (<div>
          <FormGroup>
            <ControlLabel>LaTex</ControlLabel>
            <FormControl value={template(this.state.items)} componentClass="textarea"/>
          </FormGroup>
        </div>)}
      </div>
    );
  }
}
