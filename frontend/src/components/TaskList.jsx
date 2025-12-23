import React, { useEffect , useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  AllInbox as AllIcon,
} from '@mui/icons-material';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import useTaskStore from '../stores/taskStore';
import AppInfo from './AppInfo';

const TaskList = () => {
  const {
    tasks,
    isLoading,
    error,
    filter,
    isFormOpen,
    fetchTasks,
    setFilter,
    getTaskCounts,
    getFilteredTasks,
    openTaskForm,
    closeTaskForm,
  } = useTaskStore();
const [isInfoOpen, setIsInfoOpen] = useState(false);
  const filteredTasks = getFilteredTasks();
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenForm = () => {
    openTaskForm(); 
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const taskCounts = getTaskCounts();

  const filterButtons = [
    { value: 'all', label: 'All', icon: <AllIcon />, count: taskCounts.total },
    { value: 'active', label: 'Active', icon: <PendingIcon />, count: taskCounts.active },
    { value: 'completed', label: 'Completed', icon: <CheckCircleIcon />, count: taskCounts.completed },
  ];

  if (isLoading && tasks?.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Task Manager
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            New Task
          </Button>
        </Stack>

        {/* Stats */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Chip
            label={`Total: ${taskCounts.total}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Active: ${taskCounts.active}`}
            color="warning"
            variant="outlined"
          />
          <Chip
            label={`Completed: ${taskCounts.completed}`}
            color="success"
            variant="outlined"
          />
        </Stack>

        {/* Filter Buttons */}
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterIcon color="action" />
          <Typography variant="body2" color="text.secondary" mr={1}>
            Filter:
          </Typography>
          {filterButtons.map((btn) => (
            <Chip
              key={btn.value}
              icon={btn.icon}
              label={`${btn.label} (${btn.count})`}
              onClick={() => setFilter(btn.value)}
              color={filter === btn.value ? 'primary' : 'default'}
              variant={filter === btn.value ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Task List */}
      {filteredTasks?.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: 'background.default',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filter === 'all'
              ? 'Get started by creating your first task!'
              : `No ${filter} tasks found`}
          </Typography>
        </Paper>
      ) : (
        <Box>
          {filteredTasks?.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </Box>
      )}

      {/* Task Form Dialog */}
      <TaskForm open={isFormOpen} onClose={closeTaskForm} />
      <AppInfo open={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </Box>
  );
};

export default TaskList;