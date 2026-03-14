export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  category?: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

export interface ThreadOwner {
  id: string;
  name: string;
  avatar?: string;
}

export interface ThreadWithOwner extends Thread {
  owner: ThreadOwner;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  upVotesBy: string[];
  downVotesBy: string[];
  owner: ThreadOwner;
}

export interface DetailThread {
  id: string;
  title: string;
  body: string;
  category?: string;
  createdAt: string;
  owner: ThreadOwner;
  upVotesBy: string[];
  downVotesBy: string[];
  comments: Comment[];
}

export interface LeaderboardItem {
  user: User;
  score: number;
}

export interface LoginResult {
  token: string;
}
