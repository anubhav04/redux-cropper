import React, { Component } from 'react';
import create from '../redux/create';
import ConnectedAll from './ConnectedAll';
import { reduxHolder } from 'redux-as-component';

export default reduxHolder(create, ConnectedAll)
