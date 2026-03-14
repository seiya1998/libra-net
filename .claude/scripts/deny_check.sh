#!/bin/bash

# JSON 入力を読み取り、コマンドとツール名を抽出
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command' 2>/dev/null || echo "")
tool_name=$(echo "$input" | jq -r '.tool_name' 2>/dev/null || echo "")

# Bash コマンドのみをチェック
if [ "$tool_name" != "Bash" ]; then
  exit 0
fi

# settings.json から拒否パターンを読み取り
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
settings_file="$(dirname "$script_dir")/settings.json"

# Bash コマンドの全拒否パターンを取得
deny_patterns=$(jq -r '.permissions.deny[] | select(startswith("Bash(")) | gsub("^Bash\\("; "") | gsub("\\)$"; "")' "$settings_file" 2>/dev/null)

# コマンドが拒否パターンにマッチするかチェックする関数
matches_deny_pattern() {
  local cmd="$1"
  local pattern="$2"

  # 先頭・末尾の空白を削除
  cmd="${cmd#"${cmd%%[![:space:]]*}"}"
  cmd="${cmd%"${cmd##*[![:space:]]}"}"

  # コロンで終わるパターンの場合、コマンドの最初の単語とサブコマンドをチェック
  if [[ "$pattern" == *:* ]]; then
    local prefix="${pattern%:*}"

    if [[ "$cmd" == "$prefix" ]] || [[ "$cmd" == "$prefix "* ]]; then
      if [[ "$cmd" == "$prefix" ]]; then
        return 0
      fi

      local rest="${cmd#$prefix }"
      if [[ "$rest" != "$cmd" ]]; then
        local suffix="${pattern#*:}"

        if [[ "$suffix" == "*" ]]; then
          return 0
        fi

        local subcommand="${rest%% *}"
        [[ "$subcommand" == $suffix ]]
        return $?
      fi
    fi
    return 1
  fi

  # glob パターンマッチング
  [[ "$cmd" == $pattern ]]
}

# コマンド全体をチェック
while IFS= read -r pattern; do
  [ -z "$pattern" ] && continue

  if matches_deny_pattern "$command" "$pattern"; then
    echo "Error: コマンドが拒否されました: '$command' (パターン: '$pattern')" >&2
    exit 2
  fi
done <<<"$deny_patterns"

# コマンドを論理演算子で分割し、各部分もチェック
temp_command="${command//;/$'\n'}"
temp_command="${temp_command//&&/$'\n'}"
temp_command="${temp_command//\|\|/$'\n'}"

IFS=$'\n'
for cmd_part in $temp_command; do
  [ -z "$(echo "$cmd_part" | tr -d '[:space:]')" ] && continue

  while IFS= read -r pattern; do
    [ -z "$pattern" ] && continue

    if matches_deny_pattern "$cmd_part" "$pattern"; then
      echo "Error: コマンドが拒否されました: '$cmd_part' (パターン: '$pattern')" >&2
      exit 2
    fi
  done <<<"$deny_patterns"
done

exit 0
