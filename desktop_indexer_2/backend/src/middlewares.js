import { validationResult } from "express-validator";

export function validate(req, res, next) {
  const result = validationResult(req);
  console.log(result);
  let errors = result
    .array()
    .concat(req.fileErrors || [])
    .concat(req.paginationErrors || []);
  if (errors.length !== 0) {
    return res.status(422).json({ errors });
  }
  next();
}
