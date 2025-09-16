"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Edit, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decryptData } from "@/utils/crypto";
import StudentFormDialog from "./StudentFormDialog";

interface Student {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);
  const navigate = useNavigate();

  const URL = import.meta.env.VITE_API_URL!;

  const loggedInStudent = JSON.parse(localStorage.getItem("student")!);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${URL}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const decryptedStudents = res.data.data.map((student: Student) => ({
          ...student,
          fullName: decryptData(student.fullName),
          phoneNumber: decryptData(student.phoneNumber),
          dateOfBirth: decryptData(student.dateOfBirth),
          gender: decryptData(student.gender),
          address: decryptData(student.address),
          courseEnrolled: decryptData(student.courseEnrolled),
        }));
        
      setStudents(decryptedStudents);

    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedStudent(undefined);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedStudent(undefined);
    
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${URL}/student/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter((s) => s._id !== id));
    } catch (err: any) {
      console.error(err);
      setError("Failed to delete student");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.fullName} {loggedInStudent?._id === student._id && <span className="bg-blue-600 border rounded-lg p-1 text-xs font-semibold text-amber-50">Logged In</span>}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phoneNumber}</TableCell>
                <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.courseEnrolled}</TableCell>
                <TableCell>{student.address}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" disabled={loggedInStudent?._id === student._id} onClick={() => handleDelete(student._id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <StudentFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        student={selectedStudent}
      />
    </div>
  );
}
