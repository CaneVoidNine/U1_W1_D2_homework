import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a String.",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a String.",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage:
        "Cover is a mandatory field. Please supply a URL to an image.",
    },
  },
  readTime: {
    value: {
      in: ["body.readTime"],
      isInt: {
        errorMessage: "value is a mandatory field and needs to be a number.",
      },
    },
    unit: {
      in: ["body.readTime"],
      isString: {
        errorMessage: "Unit is a mandatory field and needs to be a String.",
      },
    },
  },
  author: {
    name: {
      in: ["body.author"],
      isString: {
        errorMessage:
          "Author name is a mandatory field and needs to be a String.",
      },
    },
  },
  content: {
    in: ["body"],
    isString: { errorMessage: "Please supply valid post content." },
  },
};
export const checksBlogsSchema = checkSchema(blogSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during book validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
