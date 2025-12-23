import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Box,
} from '@mui/material';
import {
  Info as InfoIcon,
  Computer as ComputerIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { electronApi } from '../services/api';

const AppInfo = ({ open, onClose }) => {
  const [appInfo, setAppInfo] = useState(null);

  useEffect(() => {
    if (open && electronApi) {
      electronApi.getAppInfo().then(setAppInfo);
    }
  }, [open]);

  const appDetails = [
    { icon: <ComputerIcon />, label: 'Platform', value: appInfo?.platform || 'Web' },
    { icon: <CodeIcon />, label: 'Environment', value: appInfo?.isDev ? 'Development' : 'Production' },
    { icon: <StorageIcon />, label: 'Version', value: appInfo?.version || '1.0.0' },
    { icon: <PersonIcon />, label: 'Author', value: 'Your Name' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <InfoIcon color="primary" />
          <Typography variant="h6">About Task Manager</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          A desktop task management application built with Electron, React, and MongoDB.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <List>
          {appDetails.map((detail, index) => (
            <ListItem key={index}>
              <ListItemIcon>{detail.icon}</ListItemIcon>
              <ListItemText 
                primary={detail.label} 
                secondary={
                  <Chip 
                    label={detail.value} 
                    size="small" 
                    variant="outlined"
                  />
                }
              />
            </ListItem>
          ))}
        </List>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
          Made with ❤️ for learning Electron development
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppInfo;