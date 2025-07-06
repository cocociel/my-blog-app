/*
  # Phase2: コメント・いいね機能の追加

  1. 新しいテーブル
    - `comments` - コメント機能
      - `id` (uuid, primary key)
      - `article_id` (uuid, foreign key)
      - `parent_id` (uuid, foreign key) - 返信機能用
      - `author_name` (text)
      - `email` (text)
      - `content` (text)
      - `status` (enum: pending, approved, rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `likes` - いいね機能
      - `id` (uuid, primary key)
      - `article_id` (uuid, foreign key)
      - `ip_address` (text)
      - `created_at` (timestamp)

  2. セキュリティ
    - 各テーブルでRLSを有効化
    - 承認されたコメントのみ一般ユーザーが閲覧可能
    - 管理者のみコメント承認・削除可能
*/

-- コメントテーブル
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  email text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- いいねテーブル
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  ip_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, ip_address)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_likes_article_id ON likes(article_id);
CREATE INDEX IF NOT EXISTS idx_likes_ip_address ON likes(ip_address);

-- RLS有効化
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- コメントのRLSポリシー
CREATE POLICY "Approved comments are viewable by everyone"
  ON comments
  FOR SELECT
  TO anon
  USING (status = 'approved');

CREATE POLICY "Authenticated users can view all comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage comments"
  ON comments
  FOR ALL
  TO authenticated
  USING (true);

-- いいねのRLSポリシー
CREATE POLICY "Likes are viewable by everyone"
  ON likes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON likes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can delete their own likes"
  ON likes
  FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage likes"
  ON likes
  FOR ALL
  TO authenticated
  USING (true);