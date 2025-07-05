# データベース設定手順

## 1. Supabase設定

### 1.1 Supabaseプロジェクト作成
1. Bolt右上の「Connect to Supabase」ボタンをクリック
2. Supabaseアカウントでログイン
3. 新しいプロジェクトを作成

### 1.2 環境変数設定
プロジェクトの `.env` ファイルに以下の環境変数が自動設定されます：
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 2. データベース構造

### 2.1 テーブル構成

#### articles (ブログ記事)
- id: UUID (PRIMARY KEY)
- title: VARCHAR(255) NOT NULL
- content: TEXT NOT NULL
- excerpt: TEXT
- status: ENUM('draft', 'published') DEFAULT 'draft'
- category_tags: JSON
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
- published_at: TIMESTAMP
- view_count: INTEGER DEFAULT 0
- like_count: INTEGER DEFAULT 0

#### members (AIアイドル)
- id: UUID (PRIMARY KEY)
- name: VARCHAR(100) NOT NULL
- nickname: VARCHAR(100)
- age: INTEGER
- birthday: DATE
- position: VARCHAR(100)
- personality: TEXT
- hobbies: TEXT
- image_color: VARCHAR(7) NOT NULL
- catchphrase: TEXT
- profile_image_url: VARCHAR(500)
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

#### categories (カテゴリタグ)
- id: UUID (PRIMARY KEY)
- name: VARCHAR(100) NOT NULL
- slug: VARCHAR(100) UNIQUE NOT NULL
- description: TEXT
- color: VARCHAR(7)
- created_at: TIMESTAMP DEFAULT NOW()

## 3. 初期データ

### 3.1 Shiki∞Linkメンバー
1. **Haru（ハル）**
   - イメージカラー: #F6C6D2（桜色）
   - ポジション: リーダー
   - 性格: 明るく面倒見がいい

2. **Natsu（ナツ）**
   - イメージカラー: #AEE58E（若葉色）
   - ポジション: サブリーダー
   - 性格: 元気で積極的

3. **Aki（アキ）**
   - イメージカラー: #F8D774（黄金色）
   - ポジション: メインボーカル
   - 性格: 落ち着いていて知的

4. **Fuyu（フユ）**
   - イメージカラー: #A2C4E0（氷色）
   - ポジション: ダンサー
   - 性格: クールで完璧主義

### 3.2 カテゴリタグ
- TypeScript
- React
- Next.js
- TailwindCSS
- データベース

## 4. 認証設定

### 4.1 管理者認証
- Email + Password認証を使用
- 管理者アカウント: admin@example.com
- Row Level Security (RLS) を有効化

## 5. セキュリティ設定

### 5.1 Row Level Security
- 記事: 公開記事のみ一般ユーザーが閲覧可能
- メンバー: 全て閲覧可能
- カテゴリ: 全て閲覧可能

### 5.2 API制限
- 管理者のみCRUD操作可能
- 一般ユーザーは閲覧のみ