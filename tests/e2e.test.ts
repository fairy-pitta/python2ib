import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, readFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { tmpdir } from 'os';

describe('E2E Tests', () => {
  let tempDir: string;
  let inputFile: string;
  let outputFile: string;

  beforeEach(() => {
    // テンポラリディレクトリの作成
    tempDir = join(tmpdir(), `python2ib-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
    inputFile = join(tempDir, 'input.py');
    outputFile = join(tempDir, 'output.txt');
  });

  afterEach(() => {
    // テンポラリファイルのクリーンアップ
    try {
      if (existsSync(inputFile)) unlinkSync(inputFile);
      if (existsSync(outputFile)) unlinkSync(outputFile);
    } catch (error) {
      // ファイルが存在しない場合は無視
    }
  });

  it('should convert simple Python file via CLI', () => {
    // テスト用Pythonコードを作成
    const pythonCode = `x = 5
print(x)
if x > 0:
    print("positive")`;
    writeFileSync(inputFile, pythonCode);

    // CLIコマンドを実行
    const command = `npm run dev -- --input "${inputFile}" --output "${outputFile}"`;
    
    try {
      execSync(command, { cwd: '/Users/wao_singapore/python2ib', stdio: 'pipe' });
      
      // 出力ファイルが作成されたことを確認
      expect(existsSync(outputFile)).toBe(true);
      
      // 出力内容を確認
      const result = readFileSync(outputFile, 'utf-8');
      expect(result).toContain('X = 5');
      expect(result).toContain('output X');
      expect(result).toContain('if X > 0 then');
      expect(result).toContain('output "positive"');
      expect(result).toContain('end if');
    } catch (error) {
      console.error('CLI execution failed:', error);
      throw error;
    }
  });

  it('should handle function conversion via CLI', () => {
    // 関数を含むPythonコード
    const pythonCode = `def greet(name):
    print(f"Hello, {name}")

def add(a, b):
    return a + b

greet("World")
result = add(3, 4)`;
    writeFileSync(inputFile, pythonCode);

    // CLIコマンドを実行
    const command = `npm run dev -- --input "${inputFile}" --output "${outputFile}"`;
    
    try {
      execSync(command, { cwd: '/Users/wao_singapore/python2ib', stdio: 'pipe' });
      
      // 出力ファイルが作成されたことを確認
      expect(existsSync(outputFile)).toBe(true);
      
      // 出力内容を確認
      const result = readFileSync(outputFile, 'utf-8');
      
      // 関数定義
      expect(result).toContain('PROCEDURE greet(NAME)');
      expect(result).toContain('end PROCEDURE');
      expect(result).toContain('FUNCTION add(A, B)');
      expect(result).toContain('end FUNCTION');
    } catch (error) {
      console.error('CLI execution failed:', error);
      throw error;
    }
  });

  it('should handle nested structures via CLI', () => {
    // ネスト構造を含むPythonコード
    const pythonCode = `for i in range(3):
    if i % 2 == 0:
        for j in range(2):
            print(f"{i}, {j}")
    else:
        print("odd")`;
    writeFileSync(inputFile, pythonCode);

    // CLIコマンドを実行
    const command = `npm run dev -- --input "${inputFile}" --output "${outputFile}"`;
    
    try {
      execSync(command, { cwd: '/Users/wao_singapore/python2ib', stdio: 'pipe' });
      
      // 出力ファイルが作成されたことを確認
      expect(existsSync(outputFile)).toBe(true);
      
      // 出力内容を確認
      const result = readFileSync(outputFile, 'utf-8');
      expect(result).toContain('loop I from 0 to 2');
      expect(result).toContain('if I mod 2 = 0 then');
      expect(result).toContain('loop J from 0 to 1');
      expect(result).toContain('end loop');
      expect(result).toContain('else');
      expect(result).toContain('end if');
    } catch (error) {
      console.error('CLI execution failed:', error);
      throw error;
    }
  });

  it('should handle CLI options correctly', () => {
    // シンプルなPythonコード
    const pythonCode = `x = 10
print(x)`;
    writeFileSync(inputFile, pythonCode);

    // 異なるオプションでCLIを実行
    const command = `npm run dev -- --input "${inputFile}" --output "${outputFile}" --strict`;
    
    try {
      execSync(command, { cwd: '/Users/wao_singapore/python2ib', stdio: 'pipe' });
      
      // 出力ファイルが作成されたことを確認
      expect(existsSync(outputFile)).toBe(true);
      
      // 基本的な変換が行われていることを確認
      const result = readFileSync(outputFile, 'utf-8');
      expect(result).toContain('X = 10');
      expect(result).toContain('output X');
    } catch (error) {
      console.error('CLI execution failed:', error);
      throw error;
    }
  });

  it('should handle error cases gracefully', () => {
    // 存在しないファイルを指定
    const nonExistentFile = join(tempDir, 'nonexistent.py');
    const command = `npm run dev -- --input "${nonExistentFile}" --output "${outputFile}"`;
    
    try {
      execSync(command, { cwd: '/Users/wao_singapore/python2ib', stdio: 'pipe' });
      // エラーが発生するはずなので、ここに到達したら失敗
      expect(true).toBe(false);
    } catch (error) {
      // エラーが発生することを期待
      expect(error).toBeDefined();
    }
  });

  it('should convert multiple Python constructs in one file', () => {
    // 複数の構文を含む複雑なPythonコード
    const pythonCode = `# 複数構文のテスト
def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

numbers = [1, 2, 3, 4, 5]
for num in numbers:
    result = factorial(num)
    print(f"Factorial of {num} is {result}")

while len(numbers) > 0:
    numbers.pop()
    print(f"Remaining: {len(numbers)}")`;
    
    writeFileSync(inputFile, pythonCode);

    // CLIコマンドを実行
    const command = `npm run dev -- --input "${inputFile}" --output "${outputFile}"`;
    
    try {
      execSync(command, { cwd: '/Users/wao_singapore/python2ib', stdio: 'pipe' });
      
      // 出力ファイルが作成されたことを確認
      expect(existsSync(outputFile)).toBe(true);
      
      // 出力内容を確認
      const result = readFileSync(outputFile, 'utf-8');
      
      // 関数定義
      expect(result).toContain('FUNCTION factorial(N)');
      expect(result).toContain('end FUNCTION');
      
      // 制御構造
      expect(result).toContain('if N ≤ 1 then');
      expect(result).toContain('else');
      expect(result).toContain('end if');
      
      // ループ
      expect(result).toContain('loop while');
      expect(result).toContain('end loop');
      
      // コメント
      expect(result).toContain('// 複数構文のテスト');
      
    } catch (error) {
      console.error('CLI execution failed:', error);
      throw error;
    }
  });
});