# Python to IB Pseudocode Converter - 詳細TODOリスト

## 📋 プロジェクト概要
PythonコードをIB Computer Science形式のPseudocodeに変換するライブラリの開発

---

## ✅ 完了済み Phase 0: 環境構築・基盤修正

### 0.1 TypeScriptビルドエラー修正 ✅
- [x] `tsconfig.json` - 厳密な型チェック設定の緩和
  - [x] `noPropertyAccessFromIndexSignature: false`に変更
- [x] `src/parser/visitor/python-to-ir-visitor.ts` - `override`修飾子追加
- [x] `src/index.ts` - 未使用インポートの削除
- [x] `src/cli.ts` - 未使用インポート・関数の削除
- [x] プロジェクト全体のビルド成功確認（120個のエラー → 0個）

## 🎯 Phase 1: 基盤設計・型定義 (優先度: 最高) 🔄 進行中

### 1.1 IR (Intermediate Representation) 型定義
- [x] `src/types/ir.ts` - IRインターフェースの定義
  - [x] 基本IR構造（kind, text, children, meta）
  - [ ] 各構文用のIRサブタイプ定義
  - [ ] メタデータ型定義（関数名、パラメータ、戻り値判定等）
- [ ] `src/types/python-ast.ts` - Python AST型定義（必要に応じて）
- [x] `src/types/config.ts` - 設定型定義（インデント、出力形式等）

### 1.2 基本ユーティリティ
- [x] `src/utils/indent.ts` - インデント管理ユーティリティ
- [x] `src/utils/operators.ts` - 演算子変換マッピング
- [x] `src/utils/keywords.ts` - キーワード変換マッピング

---

## 🔧 Phase 2: Parser実装 (優先度: 高) 📍 次のステップ

### 2.1 Python AST解析基盤
- [ ] `src/parser/index.ts` - メインパーサーエントリーポイント
- [ ] `src/parser/ast-parser.ts` - Python ASTパーサー
  - [ ] Pythonコード → AST変換
  - [ ] エラーハンドリング
  - [ ] 行番号情報保持

### 2.2 AST → IR変換 (Visitor Pattern)
- [ ] `src/parser/visitor/base-visitor.ts` - ベースVisitorクラス
- [ ] `src/parser/visitor/statement-visitor.ts` - 文レベルのVisitor
  - [ ] 代入文 (`x = 5` → `x ← 5`)
  - [ ] 出力文 (`print(x)` → `OUTPUT x`)
  - [ ] 入力文 (`input()` → `INPUT x`)
  - [ ] コメント (`# comment` → `// comment`)
- [ ] `src/parser/visitor/control-visitor.ts` - 制御構造Visitor
  - [ ] IF文 (`if/elif/else` → `IF/ELSEIF/ELSE/ENDIF`)
  - [ ] WHILE文 (`while` → `WHILE/ENDWHILE`)
  - [ ] FOR文 (`for i in range()` → `FOR i ← start TO end/NEXT i`)
- [ ] `src/parser/visitor/function-visitor.ts` - 関数定義Visitor
  - [ ] 関数定義解析 (`def`)
  - [ ] 戻り値有無判定（return文の存在チェック）
  - [ ] PROCEDURE vs FUNCTION分岐
  - [ ] パラメータ解析
- [ ] `src/parser/visitor/expression-visitor.ts` - 式レベルのVisitor
  - [ ] 算術演算子変換
  - [ ] 比較演算子変換
  - [ ] 論理演算子変換
  - [ ] 複合代入演算子展開 (`+=` → `x ← x + y`)

---

## 📤 Phase 3: Emitter実装 (優先度: 高)

### 3.1 基本Emitter
- [ ] `src/emitter/index.ts` - メインEmitterエントリーポイント
- [ ] `src/emitter/base-emitter.ts` - ベースEmitterクラス
  - [ ] 再帰的IR走査
  - [ ] インデントレベル管理
  - [ ] 出力バッファ管理

### 3.2 出力形式別Emitter
- [ ] `src/emitter/plain-emitter.ts` - プレーンテキスト出力
  - [ ] 固定インデント（4スペース）
  - [ ] END文自動挿入
- [ ] `src/emitter/markdown-emitter.ts` - Markdown出力
  - [ ] コードフェンス付きMarkdown
  - [ ] プレーンと同様の内容をMarkdown形式で

### 3.3 構文別出力ロジック
- [ ] 代入文出力 (`x ← 5`)
- [ ] 制御構造出力（IF/WHILE/FOR + 対応するEND文）
- [ ] 関数定義出力（PROCEDURE/FUNCTION + ENDPROCEDURE/ENDFUNCTION）
- [ ] ネスト構造対応（3階層以上のテスト必須）

---

## 🧪 Phase 4: テスト拡張・検証 (優先度: 中)

### 4.1 既存テスト実装対応
- [ ] `tests/basic-conversion.test.ts` の実装関数接続
- [ ] `tests/function-conversion.test.ts` の実装関数接続
- [ ] `tests/nested-structures.test.ts` の実装関数接続
- [ ] `tests/ib-examples.test.ts` の実装関数接続

### 4.2 追加テストケース
- [ ] エラーケーステスト
  - [ ] 不正なPython構文
  - [ ] サポート外構文
  - [ ] 空ファイル・空関数
- [ ] エッジケーステスト
  - [ ] 深いネスト構造（5階層以上）
  - [ ] 複雑な式
  - [ ] 長い変数名・関数名
- [ ] 統合テスト
  - [ ] 実際のIBサンプルコード変換
  - [ ] 複数ファイル処理

---

## 🚀 Phase 5: API・CLI実装 (優先度: 中)

### 5.1 メインAPI
- [ ] `src/index.ts` - メインエクスポート
- [ ] `src/converter.ts` - 変換メインクラス
  - [ ] `convertPythonToIB(code: string, options?: ConvertOptions): string`
  - [ ] 設定オプション対応（インデント、出力形式等）
  - [ ] エラーハンドリング

### 5.2 CLI実装
- [ ] `src/cli/index.ts` - CLIエントリーポイント
- [ ] ファイル入出力対応
- [ ] コマンドラインオプション
  - [ ] `--format` (plain/markdown)
  - [ ] `--indent` (インデントサイズ)
  - [ ] `--output` (出力ファイル)
- [ ] バッチ処理対応

---

## 📚 Phase 6: ドキュメント・配布準備 (優先度: 低)

### 6.1 ドキュメント整備
- [ ] `README.md` 更新
  - [ ] インストール方法
  - [ ] 使用方法・サンプル
  - [ ] サポート構文一覧
  - [ ] 制限事項
- [ ] `docs/api.md` - API仕様書
- [ ] `docs/examples.md` - 変換例集
- [ ] `docs/limitations.md` - 制限事項・既知の問題

### 6.2 配布準備
- [ ] `package.json` 最終調整
- [ ] TypeScript設定最適化
- [ ] ビルド設定
- [ ] npm publish準備

---

## 🔄 Phase 7: 拡張機能 (優先度: 最低)

### 7.1 高度な構文サポート
- [ ] List Comprehension対応
- [ ] Lambda関数対応
- [ ] Class定義対応（基本的なもの）
- [ ] match/case対応

### 7.2 ツール統合
- [ ] VS Code拡張
- [ ] Web UI
- [ ] GitHub Actions統合

---

## 🚨 重要な実装ポイント

### ネスト構造対応
- **必須**: 3階層以上のネスト構造テスト
- IR.childrenを使った再帰構造で実装
- Emitterでインデントレベル+1しながら出力

### 関数 vs プロシージャ判定
- AST解析時にreturn文の有無をチェック
- meta.hasReturnフラグで判定
- FUNCTION（戻り値あり）とPROCEDURE（戻り値なし）を適切に分岐

### エラーハンドリング
- サポート外構文は明確なエラーメッセージ
- 部分的な変換も可能にする（可能な部分のみ変換）
- デバッグ情報（行番号等）の保持

### テスト駆動開発
- 既存の52テストケースを活用
- 実装前にテストが通ることを確認
- 段階的実装（基本構文 → 制御構造 → 関数 → ネスト）

---

## 📅 推奨実装順序

1. **Phase 1**: 型定義・基盤（1-2日） ✅ 完了
2. **Phase 2.1-2.2**: 基本構文Parser（2-3日） 📍 次のステップ
3. **Phase 3.1-3.2**: 基本Emitter（1-2日）
4. **Phase 4.1**: 既存テスト接続・検証（1日）
5. **Phase 2.2**: 制御構造・関数Parser（2-3日）
6. **Phase 3.3**: 高度な出力ロジック（1-2日）
7. **Phase 4**: テスト拡張・検証（1-2日）
8. **Phase 5**: API・CLI（1-2日）
9. **Phase 6-7**: ドキュメント・拡張（必要に応じて）

**総推定期間**: 2-3週間（基本機能完成まで）

---

## 🎯 次のアクション

### 即座に取り組むべき項目（Phase 2開始）

1. **テストファイルのコメントアウト解除**
   - `tests/basic-conversion.test.ts`から開始
   - 実装されていない関数を特定

2. **Parser基盤の実装**
   - `src/parser/ast-parser.ts`の実装
   - Python AST解析ロジック

3. **基本Visitor実装**
   - `src/parser/visitor/base-visitor.ts`
   - 代入文・出力文の基本変換

4. **段階的テスト実行**
   - 一つずつ機能を実装してテスト
   - ビルドエラーなしの状態を維持
