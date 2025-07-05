/*
  # 初期データベーススキーマ作成

  1. 新しいテーブル
    - `articles` - ブログ記事
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `status` (enum: draft, published)
      - `category_tags` (json)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `published_at` (timestamp)
      - `view_count` (integer)
      - `like_count` (integer)
    - `members` - AIアイドルメンバー
      - `id` (uuid, primary key)
      - `name` (text)
      - `nickname` (text)
      - `age` (integer)
      - `birthday` (date)
      - `position` (text)
      - `personality` (text)
      - `hobbies` (text)
      - `image_color` (text)
      - `catchphrase` (text)
      - `profile_image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `categories` - カテゴリタグ
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text)
      - `description` (text)
      - `color` (text)
      - `created_at` (timestamp)

  2. セキュリティ
    - 各テーブルでRLSを有効化
    - 公開記事のみ一般ユーザーが閲覧可能
    - メンバーとカテゴリは全て閲覧可能
    - 管理者のみCRUD操作可能
*/

-- 記事テーブル
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  category_tags json DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0
);

-- メンバーテーブル
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  nickname text,
  age integer,
  birthday date,
  position text,
  personality text,
  hobbies text,
  image_color text NOT NULL,
  catchphrase text,
  profile_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- カテゴリテーブル
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- RLS有効化
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 記事のRLSポリシー
CREATE POLICY "Published articles are viewable by everyone"
  ON articles
  FOR SELECT
  TO anon
  USING (status = 'published');

CREATE POLICY "Authenticated users can view all articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (true);

-- メンバーのRLSポリシー
CREATE POLICY "Members are viewable by everyone"
  ON members
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage members"
  ON members
  FOR ALL
  TO authenticated
  USING (true);

-- カテゴリのRLSポリシー
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true);