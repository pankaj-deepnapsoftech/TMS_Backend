import * as yup from "yup";

const statusEnum = ['Pending', 'In Progress', 'Completed', 'Re Open'];
const priorityEnum = ['Low', 'Medium', 'High'];

export const TodoValidationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required"),

  assinedTo: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid User ID") // MongoDB ObjectId check
    .nullable(),

  due_date: yup
    .date()
    .required("Due date is required")
    .typeError("Invalid date format"),

  priority: yup
    .string()
    .oneOf(priorityEnum, "Invalid priority value")
    .default("Medium"),

  createdBy: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid User ID")
    .nullable()
});


export const StatusHistory = yup.object({
  status: yup.string().oneOf(statusEnum, "Invalid status value").required("Status is required"),
});
