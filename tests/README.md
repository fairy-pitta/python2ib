# Python to IB Pseudocode Converter - Test Suite

このディレクトリには、Python → IB Pseudocode変換ライブラリのテストケースが含まれています。

## テストファイル構成

### 1. `basic-conversion.test.ts`
基本的な構文変換のテスト
- 代入文 (`x = 5` → `X = 5`)
- 出力文 (`print(x)` → `output X`)
- 条件分岐 (`if/elif/else`)
- ループ (`for`, `while`)
- 演算子 (`!=` → `≠`, `and` → `AND`, `%` → `mod`)
- 複合代入演算子 (`+=` → `X = X + Y`)
- コメント (`#` → `//`)
- 配列操作

### 2. `function-conversion.test.ts`
関数とプロシージャの変換テスト
- PROCEDURE変換（戻り値なし関数）
- FUNCTION変換（戻り値あり関数）
- 関数呼び出し
- input()文の処理

### 3. `nested-structures.test.ts`
ネスト構造の変換テスト
- 2階層ネスト
- 3階層ネスト
- 4階層以上のネスト
- 混合ネスト構造
- 関数内のネスト構造

### 4. `ib-examples.test.ts`
IB Pseudocodeルールに基づく実際のサンプルコードテスト
- 配列平均値計算
- ユニーク要素コピー
- 因数分解アルゴリズム
- コレクション逆順
- スタック・キュー操作
- バイナリサーチ

## テスト実行方法

```bash
# 全テスト実行
npm test

# テスト実行（一回のみ）
npm run test:run

# ウォッチモード
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage
```

## テスト設計方針

### 1. 段階的実装サポート
- 現在は全てプレースホルダー（`expect(true).toBe(true)`）
- 実装が進むにつれて、実際の変換関数を呼び出すように更新
- TODOコメントで実装すべき箇所を明示

### 2. IB Pseudocode仕様準拠
- `IB-pseudocode-rules.md`の仕様に厳密に従う
- 変数名の大文字化
- キーワードの小文字化
- 適切なインデント（4スペース）
- END文の自動挿入

### 3. エッジケース対応
- 空のブロック
- 単一文のブロック
- 深いネスト構造
- 複雑な式

### 4. 実用性重視
- 実際のIB Computer Science授業で使われるパターン
- 教育現場でよく見られるアルゴリズム
- 試験問題レベルの複雑さ

## 実装時の注意点

### 1. テスト更新手順
1. 対応する機能を実装
2. TODOコメントを削除
3. 実際の変換関数を呼び出し
4. プレースホルダーを削除
5. テストが通ることを確認

### 2. 新しいテストケース追加
- 新機能追加時は対応するテストを追加
- エッジケースを必ず含める
- 実際のIB試験問題を参考にする

### 3. テスト命名規則
- `should convert [Python構文] to [IB Pseudocode]`
- 具体的で分かりやすい説明
- 日本語コメントで補足説明

## 期待される出力形式

### インデント
- 4スペース固定
- ネストレベルに応じて自動調整

### 変数名
- Python: `snake_case` → IB: `UPPER_CASE`
- 関数名: `snake_case` → `camelCase`

### キーワード
- 制御構文: 小文字（`if`, `then`, `else`, `end if`）
- 論理演算子: 大文字（`AND`, `OR`, `NOT`）
- 特殊演算子: 小文字（`mod`, `div`）

### END文
- `if` → `end if`
- `loop` → `end loop`
- `PROCEDURE` → `end PROCEDURE`
- `FUNCTION` → `end FUNCTION`

## デバッグ支援

実装中にテストが失敗した場合：
1. `debug/debug.md`に状況を記録
2. 期待値と実際の出力を比較
3. 段階的にテストケースを簡素化
4. 一つずつ機能を確認

## 今後の拡張予定

- エラーハンドリングテスト（try/except）
- 型推論テスト
- 設定オプションテスト（インデント幅、記号選択）
- パフォーマンステスト
- 統合テスト（複数ファイル変換）