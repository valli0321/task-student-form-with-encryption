import { Request, Response } from "express";
import { Student } from "../models/Student";
import { 
    comparePassword,
    encryptData,       
    hashPassword,
    decryptData
} from "../utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phoneNumber, dateOfBirth, gender, address, courseEnrolled, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'fullName, email and password are required' });
    }

    if(!phoneNumber){
        return res.status(400).json({ message: 'phoneNumber is required' });
    }
    if(!dateOfBirth){
        return res.status(400).json({ message: 'dateOfBirth is required' });
    }
    if(!gender){
        return res.status(400).json({ message: 'gender is required' });
    }
    if(!courseEnrolled){
        return res.status(400).json({ message: 'courseEnrolled is required' });
    }
    if(!address){
        return res.status(400).json({ message: 'address is required' });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const doubleEncryptedData = {
        fullName: encryptData(fullName),
        email,
        phoneNumber: encryptData(phoneNumber),
        dateOfBirth: encryptData(dateOfBirth),
        gender: encryptData(gender),
        address: encryptData(address),
        courseEnrolled: encryptData(courseEnrolled),
        password: await hashPassword(password),
    };

    const student = new Student(doubleEncryptedData);
    await student.save();

    res.status(201).json({ success: true, message: "Student registered successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, student.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    res.status(200).json({ success: true, message: "Login successful", accessToken, refreshToken, data: {
      _id: student._id,
      fullName: student.fullName,
      email: student.email,
    } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await Student.find();

    const decryptedStudents = students.map((s) => ({
      _id: s._id,
      fullName: decryptData(s.fullName),
      email: s.email,
      phoneNumber: decryptData(s.phoneNumber),
      dateOfBirth: decryptData(s.dateOfBirth),
      gender: decryptData(s.gender),
      address: decryptData(s.address),
      courseEnrolled: decryptData(s.courseEnrolled),
    }));

    res.status(200).json({ success: true, data: decryptedStudents });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if(!id){
        return res.status(400).json({ message: 'Student id is required' });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const decryptedStudent = {
      _id: student._id,
      fullName: decryptData(student.fullName),
      email: student.email,
      phoneNumber: decryptData(student.phoneNumber),
      dateOfBirth: decryptData(student.dateOfBirth),
      gender: decryptData(student.gender),
      address: decryptData(student.address),
      courseEnrolled: decryptData(student.courseEnrolled),
      password: student.password, // still encrypted once for frontend
    };

    res.status(200).json({ success: true, data: decryptedStudent });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if(!id){
        return res.status(400).json({ message: 'Student id is required' });
    }

    const { fullName, email, phoneNumber, dateOfBirth, gender, address, courseEnrolled, password } = req.body;

    const updatedFields: any = {};
    if (fullName) updatedFields.fullName = encryptData(fullName);
    if (email) updatedFields.email = email;
    if (phoneNumber) updatedFields.phoneNumber = encryptData(phoneNumber);
    if (dateOfBirth) updatedFields.dateOfBirth = encryptData(dateOfBirth);
    if (gender) updatedFields.gender = encryptData(gender);
    if (address) updatedFields.address = encryptData(address);
    if (courseEnrolled) updatedFields.courseEnrolled = encryptData(courseEnrolled);
    if (password) updatedFields.password = encryptData(password);

    const student = await Student.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if(!id){
        return res.status(400).json({ message: 'Student id is required' });
    }
    
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
