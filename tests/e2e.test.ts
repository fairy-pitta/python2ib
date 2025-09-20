import { describe, it, expect } from 'vitest';
import { convertPythonToIB } from '../src/converter.js';

describe('E2E Tests (Browser Version)', () => {

  it('should convert simple Python code through API', () => {
    // テスト用Pythonコードを作成
    const pythonCode = `x = 5
print(x)
if x > 0:
    print("positive")`;
    
    const result = convertPythonToIB(pythonCode);
    
    expect(result).toContain('X = 5');
    expect(result).toContain('output X');
    expect(result).toContain('if X > 0 then');
    expect(result).toContain('output "positive"');
    expect(result).toContain('end if');
  });

  it('should handle function conversion through API', () => {
    // 関数を含むPythonコード
    const pythonCode = `def greet(name):
    print(f"Hello, {name}")

def add(a, b):
    return a + b

greet("World")
result = add(3, 4)`;
    
    const result = convertPythonToIB(pythonCode);
    
    // 関数定義
    expect(result).toContain('procedure greet(NAME)');
    expect(result).toContain('end procedure');
    expect(result).toContain('function add(A, B)');
    expect(result).toContain('end function');
  });

  it('should handle nested structures through API', () => {
    // ネスト構造を含むPythonコード
    const pythonCode = `for i in range(3):
    if i % 2 == 0:
        for j in range(2):
            print(f"{i}, {j}")
    else:
        print("odd")`;
    
    const result = convertPythonToIB(pythonCode);
    
    expect(result).toContain('loop I from 0 to 2');
    expect(result).toContain('if I mod 2 = 0 then');
    expect(result).toContain('loop J from 0 to 1');
    expect(result).toContain('end loop');
    expect(result).toContain('else');
    expect(result).toContain('end if');
  });

  it('should handle conversion options correctly', () => {
    // シンプルなPythonコード
    const pythonCode = `x = 10
print(x)`;
    
    const result = convertPythonToIB(pythonCode);
    
    expect(result).toContain('X = 10');
    expect(result).toContain('output X');
  });

  it('should handle error cases gracefully', () => {
    // 不正なPythonコード
    const invalidPythonCode = `x = 5
print(x
# 括弧が閉じられていない不正なコード`;
    
    expect(() => {
      convertPythonToIB(invalidPythonCode);
    }).toThrow();
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
    
    const result = convertPythonToIB(pythonCode);
    
    // 関数定義
    expect(result).toContain('function factorial(N)');
    expect(result).toContain('end function');
    
    // 制御構造
    expect(result).toContain('if N <= 1 then');
    expect(result).toContain('else');
    expect(result).toContain('end if');
    
    // ループ
    expect(result).toContain('loop while');
    expect(result).toContain('end loop');
    
    // コメント
    expect(result).toContain('// 複数構文のテスト');
  });
});