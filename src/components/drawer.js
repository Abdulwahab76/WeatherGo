import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
export default function SwipeableTemporaryDrawer({  geocoding }) {
  const [state, setState] = React.useState({ left: false });
  console.log('geo',geocoding);
  const { display_name,address :{postcode,city,state:stateName,suburb
  }} = geocoding
  console.log('draw',stateName);

  
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{ color: 'absolute' }}
    >
      <h2 style={{ padding: '15px 10px' }}><p>Weather<span style={{fontWeight:'lighter'}}>Go</span></p> </h2>
      <List >
        <ListItem sx={{ fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px' }}>
          <h3>Current Location</h3>
          { display_name}
        

          <br />
          <br />
          <h3>PostCode</h3>
          {postcode}
          <br />
          <br />

          <h3>City</h3>
          {city}
          <br />
          <br />
          <h3>State</h3>
          {stateName}
          <br />
          <br />
          <h3>Area</h3>
          {suburb}
          <br />
        </ListItem>


      </List>
      <Divider />

    </Box >
  );

  return (
    <div >
      {['left'].map((anchor) => (
        <React.Fragment key={anchor} >
          <Button onClick={toggleDrawer(anchor, true)} style={{ color: 'white', fontSize: '23px', width: '30px', marginTop: '30px', marginLeft: '20px' }}> <MenuIcon /></Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}