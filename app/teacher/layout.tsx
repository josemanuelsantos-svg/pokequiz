import React from 'react';
import { TeacherAuthGate } from '@/components/TeacherAuthGate';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherAuthGate>{children}</TeacherAuthGate>;
}
