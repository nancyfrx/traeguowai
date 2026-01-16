
import re
import sys

def check_html_js_syntax(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract script content
    scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
    for i, script in enumerate(scripts):
        stack = []
        in_string = None # Can be ', ", or `
        escaped = False
        
        for char_idx, char in enumerate(script):
            if escaped:
                escaped = False
                continue
            if char == '\\':
                escaped = True
                continue
            
            if in_string:
                if char == in_string:
                    in_string = None
                continue
            
            if char in "'\"`":
                in_string = char
                continue
            
            if char in '{[(':
                stack.append((char, char_idx))
            elif char in '}])':
                if not stack:
                    print(f"Error: Unmatched closing bracket '{char}' at index {char_idx} in script {i}")
                    # Print context
                    start = max(0, char_idx - 50)
                    end = min(len(script), char_idx + 50)
                    print(f"Context: ...{script[start:end]}...")
                    return False
                last_open, last_idx = stack.pop()
                if (char == '}' and last_open != '{') or \
                   (char == ']' and last_open != '[') or \
                   (char == ')' and last_open != '('):
                    print(f"Error: Mismatched brackets '{last_open}' and '{char}' at index {char_idx} (matching open at {last_idx}) in script {i}")
                    # Print context
                    start = max(0, char_idx - 50)
                    end = min(len(script), char_idx + 50)
                    print(f"Context: ...{script[start:end]}...")
                    return False
        
        if in_string:
            print(f"Error: Unclosed string {in_string} in script {i}")
            return False
            
        if stack:
            last_open, last_idx = stack.pop()
            print(f"Error: Unclosed bracket '{last_open}' at index {last_idx} in script {i}")
            start = max(0, last_idx - 50)
            end = min(len(script), last_idx + 50)
            print(f"Context around open bracket: ...{script[start:end]}...")
            return False
        print(f"Script {i} bracket matching passed.")
    return True

if __name__ == "__main__":
    if check_html_js_syntax(sys.argv[1]):
        print("Syntax check passed (bracket matching with string awareness).")
    else:
        sys.exit(1)
