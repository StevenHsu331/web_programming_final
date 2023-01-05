import logo from '../logo.svg';
import { useState } from 'react';
import axios from '../api';

const Ｈeader = ({title, type}) => {
    return (
        <header className={"header-"+type}>
          {
            type == "outer" ?
            <h3 className='title'>{title}</h3> :
            <h4 className='title'>{title}</h4>
          }
      </header>
    )
}

export default Ｈeader;