import { TodoModel } from '../models/todo.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';

// ---------------------- create Todo api start here ---------------------
export const CreateTodo = AsyncHandler(async (req, res) => {
  const data = req.body;
  const createdBy = req?.user?._id;
  const todo = await TodoModel.create({ ...data, createdBy });
  res.status(201).json({
    message: 'Todo created successfully',
    todo,
  });
});
// ---------------------- create Todo api end here ---------------------

//  ---------------------- get all todos api started here --------------------------------
export const GetAllTodo = AsyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const pages = parseInt(page) || 1;
  const limits = parseInt(limit) || 20;
  const skip = (pages - 1) * limits;
  const data = await TodoModel.find({})
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limits);
  return res.status(200).json({
    message: 'Todos data found',
    data,
  });
});
// ------------------------- get all todos api end here ---------------------------------

// --------------------------- Delete Todos api start -------------------------------
export const DeleteTodo = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await TodoModel.findByIdAndDelete(id);
  if (!data) {
    return res.status(404).json({
      message: 'Data already deleted',
    });
  }

  return res.status(200).json({
    message: 'Data Deleted Successfully',
    data: data,
  });
});
// ----------------------- Delete Todos api end ---------------------------------------

// ---------------------------------- Update Todos api started here -------------------------

export const UpdateTodo = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const todo = await TodoModel.findByIdAndUpdate(id, data, { new: true });
  if (!todo) {
    return res.status(404).json({
      message: 'Data not found',
    });
  }
  return res.status(200).json({
    message: 'Todo data Updated successful',
    data: todo,
  });
});

// ------------------------------------- Update Todo api end here ----------------------------

// -------------------------------------- Change Status api start here --------------------------
export const ChangeStatus = AsyncHandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const todo = await TodoModel.findByIdAndUpdate(
    id,
    { $push: { statusHistory: { ...data, changedBy: req?.user?._id } } },
    { new: true }
  );
  if (!todo) {
    return res.status(404).json({
      message: 'Data not found',
    });
  }
  return res.status(201).json({
    message: 'Status Changes Successful',
    data: todo,
  });
});
// ----------------------------------------- change Status api end here --------------------------

// ----------------------------------------- update Status api Start here -----------------------------------
export const UpdateStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id: historyId, ...updateData } = req.body;

  const todo = await TodoModel.findOneAndUpdate(
    { _id: id, 'statusHistory._id': historyId },
    {
      $set: {
        'statusHistory.$.status': updateData.status,
      },
      $inc: { 'statusHistory.$.updateCount': 1 },
    },
    { new: true }
  );

  if (!todo) {
    return res.status(404).json({
      message: 'Data not found',
    });
  }

  return res.status(200).json({
    message: 'Status Updated Successfully',
    data: todo,
  });
});

// -------------------------------------------- update Status api End here ------------------------------------
