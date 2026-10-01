export interface Schedule {
  id: string;
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  status: 'pending' | 'completed';
  note?: string;
}

export type FormulaGroup = 'natural-science' | 'language' | 'social-science';

export interface Formula {
  id: string;
  group: FormulaGroup;
  subject: string;
  title: string;
  content: string;
  note?: string;
  example?: string;
  createdAt: number;
  updatedAt: number;
}

export const defaultFormulas: Formula[] = [
  {
    id: 'f1',
    group: 'natural-science',
    subject: 'Toán',
    title: 'Phương trình bậc 2',
    content: 'ax² + bx + c = 0 (a ≠ 0)',
    note: 'Δ = b² - 4ac. Nếu Δ > 0 phương trình có 2 nghiệm phân biệt.',
    example: 'x² - 4x + 4 = 0',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'f2',
    group: 'natural-science',
    subject: 'Vật lý',
    title: 'Định luật II Newton',
    content: 'F = m.a',
    note: 'Gia tốc của một vật cùng hướng với lực tác dụng lên vật.',
    example: 'F = 5kg * 2m/s² = 10N',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'f3',
    group: 'natural-science',
    subject: 'Hóa học',
    title: 'Nồng độ Mol',
    content: 'CM = n / V',
    note: 'Số mol chất tan có trong 1 lít dung dịch.',
    example: 'Pha 0.5 mol NaCl vào 1 lít nước -> CM = 0.5M',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'f4',
    group: 'language',
    subject: 'Tiếng Anh',
    title: 'Thì Hiện tại hoàn thành (Present Perfect)',
    content: 'S + have/has + V3/ed',
    note: 'Diễn tả một hành động bắt đầu trong quá khứ và vẫn tiếp tục ở hiện tại.',
    example: 'I have studied English for 3 years.',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'f5',
    group: 'social-science',
    subject: 'Lịch sử',
    title: 'Cách mạng tháng Tám',
    content: 'Tổng khởi nghĩa giành chính quyền',
    note: 'Năm 1945',
    example: 'Ngày 2/9/1945 đọc Tuyên ngôn độc lập',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export const defaultSchedules: Schedule[] = [
  { id: '1', subject: 'Toán Cao Cấp', dayOfWeek: 'Thứ 2', startTime: '07:00', endTime: '09:30', room: 'P.301 - A2' },
  { id: '2', subject: 'Lập Trình Web', dayOfWeek: 'Thứ 3', startTime: '09:45', endTime: '12:00', room: 'Lab 1 - B1' }
];

export const defaultTasks: Task[] = [
  { id: '1', title: 'Làm bài tập chương 3', subject: 'Toán Cao Cấp', deadline: '2026-10-02T23:59', status: 'pending' },
  { id: '2', title: 'Đọc trước bài mới', subject: 'Cấu Trúc Dữ Liệu', deadline: '2026-10-01T08:00', status: 'completed' },
];

export interface Note {
  id: string;
  title: string;
  preview: string;
  date: string;
}

export const notes: Note[] = [
  { id: '1', title: 'Ý tưởng đồ án Web', preview: 'Sử dụng React và Vite, phong cách pastel...', date: 'Hôm nay' },
];

