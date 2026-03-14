 
export type Book = {
  id?: string | undefined;
  isbn?: string | undefined;
  title?: string | undefined;
  authorIds?: string[] | undefined;
  publisher?: string | undefined;
  year?: number | undefined;
  category?: string | undefined;
  location?: string | undefined;
  status?: '貸出可' | '貸出中' | '除籍' | undefined;
  copies?: number | undefined;
}

export type BookInput = {
  isbn: string;
  title: string;
  authorIds: string[];
  publisher: string;
  year: number;
  category: string;
  location: string;
  copies: number;
}

export type User = {
  id?: string | undefined;
  studentId?: string | undefined;
  name?: string | undefined;
  department?: string | undefined;
  email?: string | undefined;
  role?: '学生' | '教員' | undefined;
  activeLoans?: number | undefined;
  registered?: string | undefined;
}

export type Loan = {
  id?: string | undefined;
  bookId?: string | undefined;
  userId?: string | undefined;
  bookTitle?: string | undefined;
  userName?: string | undefined;
  loanDate?: string | undefined;
  dueDate?: string | undefined;
  status?: '貸出中' | '延滞' | undefined;
}

export type LoanInput = {
  bookId: string;
  userId: string;
}

export type Return = {
  id?: string | undefined;
  bookId?: string | undefined;
  userId?: string | undefined;
  bookTitle?: string | undefined;
  userName?: string | undefined;
  loanDate?: string | undefined;
  dueDate?: string | undefined;
  returnDate?: string | undefined;
  status?: '返却済' | '延滞返却' | undefined;
}

export type ReturnInput = {
  bookId: string;
  userId: string;
}

export type Notice = {
  id?: string | undefined;
  title?: string | undefined;
  content?: string | undefined;
  category?: 'お知らせ' | '重要' | '新着' | undefined;
  publishDate?: string | undefined;
  isPublished?: boolean | undefined;
}

export type NoticeInput = {
  title: string;
  content: string;
  category: 'お知らせ' | '重要' | '新着';
}
