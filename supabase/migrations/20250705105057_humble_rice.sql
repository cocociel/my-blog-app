/*
  # 初期データ挿入

  1. メンバーデータ
    - Shiki∞Linkの4人のメンバー情報を挿入
    - 各メンバーのイメージカラーとプロフィール

  2. カテゴリデータ
    - 技術系カテゴリタグを挿入
    - 各カテゴリにメンバーカラーを適用

  3. サンプル記事データ
    - 初期記事を数件挿入
    - 各カテゴリの記事を作成
*/

-- メンバーデータ挿入
INSERT INTO members (name, nickname, age, birthday, position, personality, hobbies, image_color, catchphrase, profile_image_url) VALUES
('Haru', 'ハル', 18, '2006-03-15', 'リーダー', '明るく面倒見がいい性格で、チームをまとめる力に長けています。常に前向きで、メンバーや ファンを笑顔にする天性の魅力を持っています。', 'お花見、料理、読書', '#F6C6D2', '一緒に素敵な春を迎えましょう！🌸', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'),
('Natsu', 'ナツ', 17, '2007-07-20', 'サブリーダー', '元気で積極的、エネルギッシュな性格です。夏の太陽のように周りを明るく照らし、新しいことに挑戦する勇気を持っています。', 'プール、BBQ、フェス参加', '#AEE58E', '夏の思い出、一緒に作ろうね！☀️', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'),
('Aki', 'アキ', 19, '2005-10-10', 'メインボーカル', '落ち着いていて知的な性格。深い思考力と美しい歌声で、心に響くパフォーマンスを披露します。秋の紅葉のように、じっくりと美しさを表現します。', '読書、美術鑑賞、紅葉狩り', '#F8D774', '心に響く歌声をお届けします🍂', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'),
('Fuyu', 'フユ', 16, '2008-12-25', 'ダンサー', 'クールで完璧主義な性格。冬の雪のように美しく、キレのあるダンスで観客を魅了します。ストイックに練習に取り組む姿勢は、メンバーの見本となっています。', 'ダンス、スケート、雪遊び', '#A2C4E0', '完璧なパフォーマンスをお見せします❄️', 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg');

-- カテゴリデータ挿入
INSERT INTO categories (name, slug, description, color) VALUES
('TypeScript', 'typescript', 'TypeScriptの型安全性とモダンな開発手法について', '#F6C6D2'),
('React', 'react', 'Reactの基礎からフック、状態管理まで', '#AEE58E'),
('TailwindCSS', 'tailwindcss', 'TailwindCSSを使った効率的なスタイリング', '#F8D774'),
('データベース', 'database', 'データベース設計とORM、SQL最適化', '#A2C4E0'),
('Web API', 'web-api', 'RESTful API設計とGraphQL', '#F6C6D2'),
('パフォーマンス', 'performance', 'Webアプリケーションの最適化手法', '#AEE58E');

-- サンプル記事データ挿入
INSERT INTO articles (title, content, excerpt, status, category_tags, published_at, view_count, like_count) VALUES
('TypeScript入門 - 型安全性の魅力', '# TypeScript入門 - 型安全性の魅力

こんにちは、Haruです！🌸

今日はTypeScriptの基礎について学んでいきましょう。TypeScriptは JavaScript に型の概念を追加したスーパーセットです。

## なぜTypeScriptを使うの？

1. **型安全性**: コンパイル時にエラーを検出
2. **IDE支援**: 自動補完やリファクタリング
3. **保守性**: 大規模アプリケーションの開発に適している

```typescript
// 基本的な型定義
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Haru",
  email: "haru@shiki-link.com"
};
```

TypeScriptを使うことで、より安全で保守性の高いコードが書けるようになります！

一緒に型安全なアプリケーションを作っていきましょう！', 'TypeScriptの基礎から型安全性の重要性について、Haruが分かりやすく解説します。', 'published', '["typescript", "基礎"]', now(), 150, 25),

('React Hooksを使った状態管理', '# React Hooksを使った状態管理

みなさん、こんにちは！Natsuです！☀️

今回はReact Hooksを使った状態管理について説明します。

## useStateの基本

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## useEffectでの副作用処理

```jsx
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

Hooksを使うことで、関数コンポーネントでも状態管理が簡単になります！

元気よく React 開発を楽しみましょう！', 'React Hooksの基本的な使い方から、実践的な状態管理のテクニックまで、Natsuが元気に解説します！', 'published', '["react", "hooks"]', now(), 200, 35),

('TailwindCSSで美しいデザインを作る', '# TailwindCSSで美しいデザインを作る

こんにちは、Akiです🍂

今日はTailwindCSSを使って美しいデザインを作る方法について説明します。

## TailwindCSSの特徴

1. **Utility-First**: 小さなクラスを組み合わせる
2. **レスポンシブ**: モバイルファーストなデザイン
3. **カスタマイズ性**: 設定ファイルで柔軟にカスタマイズ

## 基本的なレイアウト

```html
<div class="max-w-4xl mx-auto p-6">
  <div class="bg-white rounded-lg shadow-md p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">
      美しいカード
    </h1>
    <p class="text-gray-600 leading-relaxed">
      TailwindCSSを使うことで、効率的で美しいデザインが作れます。
    </p>
  </div>
</div>
```

## カラーパレットの活用

```html
<div class="bg-gradient-to-r from-pink-200 to-yellow-200 p-8">
  <h2 class="text-2xl font-semibold text-gray-800">
    グラデーション背景
  </h2>
</div>
```

美しいデザインで、ユーザーに心地よい体験を提供しましょう。', 'TailwindCSSの基本的な使い方から、美しいデザインの作り方まで、Akiが詳しく解説します。', 'published', '["tailwindcss", "css"]', now(), 180, 28),

('データベース設計の基本原則', '# データベース設計の基本原則

こんにちは、Fuyuです❄️

今回は、効率的なデータベース設計の基本原則について解説します。

## 正規化の重要性

データベースの正規化は、データの整合性を保つために重要です。

### 第1正規形（1NF）
- 各属性が原子的な値を持つ
- 繰り返しグループを排除

### 第2正規形（2NF）
- 1NFを満たす
- 部分関数従属を排除

### 第3正規形（3NF）
- 2NFを満たす
- 推移関数従属を排除

## 実践的な設計例

```sql
-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 記事テーブル
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMP
);
```

## インデックスの最適化

```sql
-- よく検索される列にインデックスを作成
CREATE INDEX idx_articles_user_id ON articles(user_id);
CREATE INDEX idx_articles_published_at ON articles(published_at);
```

完璧なデータベース設計で、高性能なアプリケーションを構築しましょう。', 'データベース設計の基本原則から実践的な最適化まで、Fuyuが完璧に解説します。', 'published', '["database", "sql"]', now(), 120, 20);