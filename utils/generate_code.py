import argparse
import json
import secrets

ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

def generate_unique_code(used):
    while True:
        code = ''.join(secrets.choice(ALPHABET) for _ in range(5))
        if code not in used:
            used.add(code)
            return code

def add_invite_codes(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    used_codes = set()
    for entry in data:
        entry['invite_code'] = generate_unique_code(used_codes)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, help='Input JSON file')
    parser.add_argument('--output', required=True, help='Output JSON file')
    args = parser.parse_args()
    add_invite_codes(args.input, args.output)

if __name__ == '__main__':
    main()
