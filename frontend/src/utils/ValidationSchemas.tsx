import * as Yup from 'yup';


export const emailValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});


export const passwordValidationSchema = () =>
  Yup.object({
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must contain one uppercase letter, one number, and one special character'
      )
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), ''], 'Passwords must match')
      .required('Confirm password is required'),
  });

  export const signupValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must contain one uppercase letter, one number, and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Confirm password is required'),
  });

  export const loginValidationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Please fill in your email"),
    password: Yup.string().required("Please fill in your password"),
  });

  export const teacherValidationSchema = (teachers: { email: string }[]) =>
    Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .test("unique-email", "A teacher with this email already exists", (value) =>
          teachers.every((teacher) => teacher.email !== value)
        )
        .required("Email is required"),
      course: Yup.string().required("Please select a course"),
      charges: Yup.number()
        .typeError("Charges must be a valid number")
        .positive("Charges must be greater than zero")
        .required("Charges are required"),
    });

export   const studentValidationSchema = Yup.object({
    Name: Yup.string().required('Name is required'),
    grade: Yup.string()
      .required('Grade is required')
      .matches(
        /^[A-F]([+-])?$/i,
        'Grade must be one of the following: A, A+, A-, B, B+, B-, C, C+, C-, D, D+, D-, E, E+, E-, F, F+.'
      ),
    Department: Yup.string().required('Department is required'),
    status: Yup.string().oneOf(['Active', 'Inactive'], 'Invalid status').required('Status is required'),
    courses: Yup.array()
      .of(Yup.string())
      .min(1, 'Select at least one course')
      .max(3, 'You can select up to 3 courses'),
  });
  export   const courseValidationSchema = Yup.object({
    name: Yup.string().required('Course name is required'),
    price: Yup.number()
      .typeError('Price must be a number')
      .positive('Price must be positive')
      .required('Price is required'),
    institute: Yup.string().required('Institute is required'),
  });

