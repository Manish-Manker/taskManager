import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Checkbox,
  Chip,
  Stack,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import useTaskStore from '../stores/taskStore';

const priorityColors = {
  high: 'error',
  medium: 'warning',
  low: 'success',
};

const TaskItem = ({ task }) => {
  const { toggleTaskCompletion, deleteTask, setSelectedTask , openTaskForm  } = useTaskStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleComplete = () => {
    toggleTaskCompletion(task._id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task._id);
    }
  };

  const handleEdit = () => {
    // setSelectedTask(task);
    openTaskForm(task);
  };

  return (
    <Card
      variant="outlined"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        mb: 2,
        opacity: task.completed ? 0.7 : 1,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            color="primary"
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
            
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {task.description}
              </Typography>
            )}
            
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                label={task.priority}
                size="small"
                color={priorityColors[task.priority]}
                variant="outlined"
              />
              
              {task.dueDate && (
                <Chip
                  icon={<CalendarIcon />}
                  label={format(new Date(task.dueDate), 'MMM d, yyyy')}
                  size="small"
                  variant="outlined"
                />
              )}
              
              <Typography variant="caption" color="text.secondary">
                {format(new Date(task.createdAt), 'MMM d, yyyy')}
              </Typography>
            </Stack>
          </Box>
          
          {(isHovered || task.completed) && (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={handleEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Delete">
                <IconButton size="small" onClick={handleDelete} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskItem;